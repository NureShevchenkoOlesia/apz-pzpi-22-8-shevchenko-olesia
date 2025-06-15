package com.example.cosmorummobile.ui.search

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

data class UserResult(
    val id: String,
    val username: String,
    val avatarUrl: String,
    val bio: String
)

data class ObservationResult(
    val id: String,
    val title: String,
    val description: String,
    val imageUrl: String,
    val userId: String
)

@Composable
fun SearchScreen(apiBaseUrl: String) {
    var searchQuery by remember { mutableStateOf(TextFieldValue("")) }
    var users by remember { mutableStateOf(listOf<UserResult>()) }
    var observations by remember { mutableStateOf(listOf<ObservationResult>()) }
    var isLoading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    suspend fun performSearch(
        apiBaseUrl: String,
        query: String
    ): Pair<List<UserResult>, List<ObservationResult>> = withContext(Dispatchers.IO) {
        val url = URL("$apiBaseUrl/search?q=${query}&filter=all")
        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        try {
            val response = connection.inputStream.bufferedReader().readText()
            val json = JSONObject(response)

            val usersJson = json.getJSONArray("users")
            val observationsJson = json.getJSONArray("observations")

            val users = List(usersJson.length()) { i ->
                val u = usersJson.getJSONObject(i)
                UserResult(
                    id = u.getString("id"),
                    username = u.getString("username"),
                    avatarUrl = u.optString("avatar_url?.replace(\"localhost\", \"10.0.2.2\")", ""),
                    bio = u.optString("bio", "")
                )
            }

            val observations = List(observationsJson.length()) { i ->
                val o = observationsJson.getJSONObject(i)
                ObservationResult(
                    id = o.getString("id"),
                    title = o.getString("title"),
                    description = o.optString("description", ""),
                    imageUrl = o.optString("image_url?.replace(\"localhost\", \"10.0.2.2\")", ""),
                    userId = o.getString("user_id")
                )
            }

            users to observations
        } finally {
            connection.disconnect()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .background(Color.Black),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            label = { Text("Search", color = Color.LightGray) },
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Color.White,
                unfocusedBorderColor = Color.Gray,
                cursorColor = Color.White,
                focusedLabelColor = Color.White,
                unfocusedLabelColor = Color.Gray,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            )
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = {
                isLoading = true
                error = null
                scope.launch {
                    try {
                        val (u, o) = performSearch(apiBaseUrl, searchQuery.text)
                        users = u
                        observations = o
                    } catch (e: Exception) {
                        error = "Search failed: ${e.message}"
                    } finally {
                        isLoading = false
                    }
                }
            },
            enabled = searchQuery.text.isNotBlank(),
            modifier = Modifier.align(Alignment.End),
            colors = ButtonDefaults.buttonColors(containerColor = Color.DarkGray)
        ) {
            Text("Search", color = Color.White)
        }

        Spacer(modifier = Modifier.height(32.dp))

        when {
            isLoading -> CircularProgressIndicator(
                modifier = Modifier.align(Alignment.CenterHorizontally),
                color = Color.White
            )

            error != null -> Text(error!!, color = Color.Red)

            users.isEmpty() && observations.isEmpty() -> Text(
                "No results found.",
                color = Color.Gray
            )

            else -> LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                if (users.isNotEmpty()) {
                    item {
                        Text(
                            "Users",
                            style = MaterialTheme.typography.titleLarge,
                            color = Color.White,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                    }
                    items(users) { user -> UserItem(user) }
                }

                if (observations.isNotEmpty()) {
                    item {
                        Text(
                            "Observations",
                            style = MaterialTheme.typography.titleLarge,
                            color = Color.White,
                            modifier = Modifier.padding(top = 16.dp, bottom = 8.dp)
                        )
                    }
                    items(observations) { obs -> ObservationItem(obs) }
                }
            }
        }
    }
}

@Composable
fun UserItem(user: UserResult) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E)),
        elevation = CardDefaults.cardElevation(8.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = user.username,
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White
                )
                Text(
                    text = user.bio,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.LightGray
                )
            }
        }
    }
}

@Composable
fun ObservationItem(obs: ObservationResult) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E)),
        elevation = CardDefaults.cardElevation(8.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(16.dp)
        ) {
            Text(
                text = obs.title,
                style = MaterialTheme.typography.titleMedium,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = obs.description,
                style = MaterialTheme.typography.bodyMedium,
                color = Color.LightGray
            )
            Spacer(modifier = Modifier.height(12.dp))

        }
    }
}
