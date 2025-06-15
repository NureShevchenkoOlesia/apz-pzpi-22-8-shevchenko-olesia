package com.example.cosmorummobile.ui.personal

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL
import com.example.cosmorummobile.model.EventResult
import com.example.cosmorummobile.model.KpIndexEntry

@Composable
fun EventsScreen(apiBaseUrl: String, token: String?) {
    val darkColorScheme = darkColorScheme(
        primary = Color(0xFFFFC107),
        onPrimary = Color.Black,
        secondary = Color(0xFFFFC107),
        onSecondary = Color.Black,
        background = Color(0xFF121212),
        onBackground = Color.White,
        surface = Color(0xFF1E1E1E),
        onSurface = Color.White,
        surfaceVariant = Color(0xFF2C2C2C),
        onSurfaceVariant = Color(0xFFB3B3B3),
        error = Color(0xFFCF6679),
        onError = Color.White
    )

    MaterialTheme(colorScheme = darkColorScheme) {
        EventsScreenContent(apiBaseUrl, token)
    }
}

@Composable
private fun EventsScreenContent(apiBaseUrl: String, token: String?) {
    var events by remember { mutableStateOf(listOf<EventResult>()) }
    var subscribedEvents by remember { mutableStateOf(setOf<String>()) }
    var filterType by remember { mutableStateOf("All") }
    var startDate by remember { mutableStateOf("") }
    var endDate by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    suspend fun fetchEvents(apiBaseUrl: String): List<EventResult> = withContext(Dispatchers.IO) {
        try {
            val url = URL("$apiBaseUrl/events/events")
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "GET"
            val response = conn.inputStream.bufferedReader().readText()
            val jsonArray = JSONArray(response)
            List(jsonArray.length()) { i ->
                val obj = jsonArray.getJSONObject(i)
                val kpRaw = obj.optJSONArray("kp_index")
                val kpList = mutableListOf<KpIndexEntry>()
                if (kpRaw != null) {
                    for (j in 0 until kpRaw.length()) {
                        val entry = kpRaw.getJSONObject(j)
                        if (entry.has("kp_index") && entry.has("observedTime")) {
                            kpList.add(
                                KpIndexEntry(
                                    observedTime = entry.getString("observedTime"),
                                    kp_index = entry.getDouble("kp_index")
                                )
                            )
                        }
                    }
                }
                EventResult(
                    _id = obj.getString("_id"),
                    title = obj.getString("title"),
                    start_time = obj.optString("start_time", null),
                    event_date = obj.optString("event_date", null),
                    type = obj.getString("type"),
                    class_type = obj.optString("class_type", null),
                    kp_index = kpList,
                    link = obj.optString("link", null)
                )
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun subscribeToEvent(apiBaseUrl: String, eventId: String, token: String?): Boolean =
        withContext(Dispatchers.IO) {
            try {
                val url = URL("$apiBaseUrl/events/events/$eventId/subscribe")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.doOutput = true
                conn.connect()
                conn.responseCode == 200
            } catch (e: Exception) {
                false
            }
        }

    LaunchedEffect(Unit) {
        isLoading = true
        val fetchedEvents = fetchEvents(apiBaseUrl)
        events = fetchedEvents
        isLoading = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 40.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            DropdownMenuBox(
                filterType,
                onSelect = { filterType = it },
                modifier = Modifier.width(IntrinsicSize.Min)
            )
            Spacer(modifier = Modifier.weight(1f))
            Button(
                onClick = {
                    filterType = "All"
                    startDate = ""
                    endDate = ""
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary
                ),
                modifier = Modifier
                    .height(48.dp)
            ) {
                Text("Clear")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val filtered = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    filteredEvents(events, filterType)
                } else events

                items(filtered) { event ->
                    EventItem(
                        event = event,
                        isSubscribed = subscribedEvents.contains(event._id),
                        onSubscribe = {
                            coroutineScope.launch {
                                val success = subscribeToEvent(apiBaseUrl, event._id, token)
                                if (success) {
                                    subscribedEvents = subscribedEvents + event._id
                                }
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun EventItem(
    event: EventResult,
    isSubscribed: Boolean,
    onSubscribe: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = event.title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = event.start_time ?: event.event_date ?: "No date",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(8.dp))
            if (event.type == "FLR") {
                Text(
                    text = "Class: ${event.class_type ?: "N/A"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            } else if (event.type == "GST") {
                event.kp_index?.forEach { kpEntry ->
                    Text(
                        text = "${kpEntry.observedTime} - Kp Index: ${kpEntry.kp_index}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onSubscribe,
                enabled = !isSubscribed,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isSubscribed) Color.Gray else MaterialTheme.colorScheme.primary,
                    contentColor = if (isSubscribed) Color.White else MaterialTheme.colorScheme.onPrimary
                ),
                modifier = Modifier.align(Alignment.End)
            ) {
                Text(if (isSubscribed) "Following" else "Follow")
            }
        }
    }
}

@Composable
fun DropdownMenuBox(selected: String, onSelect: (String) -> Unit, modifier: Modifier = Modifier) {
    var expanded by remember { mutableStateOf(false) }
    Box(modifier = modifier) {
        Button(
            onClick = { expanded = true },
            colors = ButtonDefaults.buttonColors(
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary
            ),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(selected)
        }
        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier
                .background(MaterialTheme.colorScheme.surface)
        ) {
            listOf("All", "FLR", "GST").forEach {
                DropdownMenuItem(
                    onClick = {
                        onSelect(it)
                        expanded = false
                    },
                    text = { Text(it) }
                )
            }
        }
    }
}

@RequiresApi(Build.VERSION_CODES.O)
fun filteredEvents(
    events: List<EventResult>,
    type: String
): List<EventResult> {
    return events.filter { event ->
        val typeOk = type == "All" || event.type == type
        typeOk
    }
}
