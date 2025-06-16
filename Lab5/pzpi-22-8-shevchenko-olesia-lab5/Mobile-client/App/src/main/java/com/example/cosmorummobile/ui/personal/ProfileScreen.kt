package com.example.cosmorummobile.ui.personal

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.rememberAsyncImagePainter
import com.example.cosmorummobile.model.Observation
import com.example.cosmorummobile.viewmodel.ProfileViewModel
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.example.cosmorummobile.api.AuthApi

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    token: String,
    onEditProfile: () -> Unit,
    onUploadNew: () -> Unit,
    onEditObservation: (String) -> Unit,
    viewModel: ProfileViewModel = viewModel()
) {
    val user by viewModel.user.collectAsState()
    val observations by viewModel.observations.collectAsState()
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:8000")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    LaunchedEffect(token) {
        viewModel.loadProfile(token)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "Profile",
                        style = MaterialTheme.typography.titleLarge.copy(color = Color.White),
                        modifier = Modifier.padding(end = 16.dp, top = 30.dp)
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Black
                ),
                actions = {
                    IconButton(onClick = onEditProfile) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", tint = Color.White)
                    }
                }
            )
        },
        containerColor = Color.Black
    ) { innerPadding ->
        if (user == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding),
                contentAlignment = Alignment.Center
            ) {
                Text("Nothing here yet", color = Color.White.copy(0.7f))
            }
            return@Scaffold
        }

        LazyColumn(
            contentPadding = innerPadding,
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Image(
                        painter = rememberAsyncImagePainter(
                            user!!.avatar_url?.replace("localhost", "10.0.2.2") ?: "https://via.placeholder.com/100"),
                        contentDescription = "Avatar",
                        modifier = Modifier
                            .size(72.dp)
                            .clip(CircleShape)
                            .border(2.dp, Color.White, CircleShape)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    Column {
                        Text(
                            user!!.username,
                            style = MaterialTheme.typography.titleMedium.copy(color = Color.White)
                        )
                        Text(
                            user!!.bio ?: "No bio",
                            style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(0.7f))
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            "${user!!.observation_count ?: 0} observations",
                            style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(0.5f))
                        )
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(onClick = onUploadNew) {
                        Text("Add Observation")
                    }
                    Button(onClick = {
                        coroutineScope.launch {
                            val userApi = retrofit.create(AuthApi::class.java)
                            val response = userApi.exportObservations("Bearer $token")
                            if (response.isSuccessful) {
                                response.body()?.file_path?.let { path ->
                                    val fullUrl = "http://10.0.2.2:8000$path"
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(fullUrl))
                                    context.startActivity(intent)
                                }
                            }
                        }
                    }) {
                        Text("Export")
                    }
                }
            }

            if (observations.isEmpty()) {
                item {
                    Text(
                        "No observations yet",
                        color = Color.White.copy(alpha = 0.7f),
                        style = MaterialTheme.typography.bodyLarge,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                }
            } else {
                items(observations) { obs ->
                    ObservationCardWithActions(
                        observation = obs,
                        onEditClick = { onEditObservation(obs.id) },
                        onDeleteClick = {
                            viewModel.deleteObservation(token, obs.id) {
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun ObservationCardWithActions(
    observation: Observation,
    onEditClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    val cardShape = RoundedCornerShape(16.dp)

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = cardShape,
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF18181B))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                observation.title,
                style = MaterialTheme.typography.titleMedium.copy(
                    color = Color.White,
                    fontFamily = FontFamily.Serif
                )
            )
            Text(
                "Date: ${observation.date}",
                style = MaterialTheme.typography.bodySmall.copy(color = Color.White.copy(0.6f))
            )
            Spacer(modifier = Modifier.height(12.dp))
            Image(
                painter = rememberAsyncImagePainter(observation.image_url.replace("localhost", "10.0.2.2")),
                contentDescription = observation.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(cardShape),
                contentScale = ContentScale.Crop
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Button(onClick = onEditClick) {
                    Text("Edit")
                }
                Button(
                    onClick = onDeleteClick,
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
                ) {
                    Text("Delete")
                }
            }
        }
    }
}
