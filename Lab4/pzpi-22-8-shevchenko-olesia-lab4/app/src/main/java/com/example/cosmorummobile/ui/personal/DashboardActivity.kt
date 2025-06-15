package com.example.cosmorummobile.ui.personal

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.example.cosmorummobile.model.Observation
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import androidx.compose.foundation.Image
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.cosmorummobile.viewmodel.DashboardViewModel
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import com.example.cosmorummobile.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardActivity(
    modifier: Modifier = Modifier,
    token: String,
    onLogout: () -> Unit,
    onProfileClick: () -> Unit,
    onSearchClick: () -> Unit,
    onEventsClick: () -> Unit,
    onDeleteAccount: () -> Unit,
    onLanguageToddle: () -> Unit,
    dashboardViewModel: DashboardViewModel = viewModel()
) {
    LaunchedEffect(token) {
        dashboardViewModel.loadObservations(token)
    }
    val observations by dashboardViewModel.observations.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        stringResource(id = R.string.dashboard),
                        style = MaterialTheme.typography.titleLarge.copy(
                            color = Color.White
                        )
                    )
                },
                actions = {
                    ProfileMenu(
                        onProfileClick = onProfileClick,
                        onDashboardClick = {},
                        onNewObservationClick = {},
                        onSettingsClick = {},
                        onLogoutClick = onLogout,
                        onDeleteAccountClick = onDeleteAccount,
                        onSearchClick = onSearchClick,
                        onEventsClick = onEventsClick,
                        onLanguageToggle = {}
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.Black,
                    titleContentColor = Color.White
                )
            )
        },
        containerColor = Color.Black
    ) { innerPadding ->
        LazyColumn(
            contentPadding = innerPadding,
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 24.dp)
        ) {
            if (observations.isEmpty()) {
                item {
                    Text(
                        stringResource(id = R.string.no_observations_yet),
                        color = Color.White.copy(alpha = 0.7f),
                        style = MaterialTheme.typography.bodyLarge,
                        modifier = Modifier.fillMaxWidth(),
                        textAlign = TextAlign.Center
                    )
                }
            } else {
                items(observations) { obs ->
                    ObservationCard(observation = obs)
                }
            }
        }
    }
}

@Composable
fun ObservationCard(observation: Observation) {
    val cardShape = RoundedCornerShape(16.dp)

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFF18181B)
        ),
        shape = cardShape,
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = observation.title,
                style = MaterialTheme.typography.titleMedium.copy(
                    color = Color.White,
                    fontFamily = FontFamily.Serif
                )
            )
            Text(
                text = "Date: ${observation.date}",
                style = MaterialTheme.typography.bodySmall.copy(
                    color = Color.White.copy(alpha = 0.6f)
                )
            )
            Spacer(modifier = Modifier.height(12.dp))
            val painter = rememberAsyncImagePainter(
                model = observation.image_url.replace("localhost", "10.0.2.2")
            )
            Image(
                painter = painter,
                contentDescription = observation.title,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .padding(top = 4.dp)
                    .clip(cardShape),
                contentScale = ContentScale.Crop
            )
        }
    }
}
