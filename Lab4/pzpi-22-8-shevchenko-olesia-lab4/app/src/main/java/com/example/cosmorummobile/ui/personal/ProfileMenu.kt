package com.example.cosmorummobile.ui.personal

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.ui.window.DialogProperties

@Composable
fun ProfileMenu(
    onProfileClick: () -> Unit,
    onDashboardClick: () -> Unit,
    onNewObservationClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onDeleteAccountClick: () -> Unit,
    modifier: Modifier = Modifier,
    onSearchClick: () -> Unit,
    onEventsClick: () -> Unit,
    onLanguageToggle: () -> Unit,
) {
    var expanded by remember { mutableStateOf(false) }
    var showDeleteConfirm by remember { mutableStateOf(false) }

    Box(
        modifier = modifier.wrapContentSize(Alignment.TopEnd)
    ) {
        IconButton(
            onClick = { expanded = !expanded },
            modifier = Modifier
                .padding(10.dp)
                .background(Color(0xFFFFD700), CircleShape)
                .size(40.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Star,
                contentDescription = "Profile Menu",
                tint = Color.Black,
                modifier = Modifier.size(24.dp)
            )
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.background(Color.Black)
        ) {
            DropdownMenuItem(
                text = { Text("Change Language", color = Color.White) },
                onClick = {
                    expanded = false
                    onLanguageToggle()
                }
            )
            DropdownMenuItem(
                text = { Text("My Profile", color = Color.White) },
                onClick = {
                    expanded = false
                    onProfileClick()
                }
            )
            DropdownMenuItem(
                text = { Text("Dashboard", color = Color.White) },
                onClick = {
                    expanded = false
                    onDashboardClick()
                }
            )
            DropdownMenuItem(
                text = { Text("New Observation", color = Color.White) },
                onClick = {
                    expanded = false
                    onNewObservationClick()
                }
            )
            DropdownMenuItem(
                text = { Text("Settings", color = Color.White) },
                onClick = {
                    expanded = false
                    onSettingsClick()
                }
            )
            DropdownMenuItem(
                text = { Text("Search", color = Color.White) },
                onClick = {
                    expanded = false
                    onSearchClick()
                }
            )
            DropdownMenuItem(
                text = { Text("Events", color = Color.White) },
                onClick = {
                    expanded = false
                    onEventsClick()
                }
            )
            HorizontalDivider(color = Color.White.copy(alpha = 0.3f), thickness = 1.dp)
            DropdownMenuItem(
                text = { Text("Logout", color = Color.Red) },
                onClick = {
                    expanded = false
                    onLogoutClick()
                }
            )
            DropdownMenuItem(
                text = { Text("Delete Account", color = Color.Red) },
                onClick = {
                    expanded = false
                    showDeleteConfirm = true
                }
            )
        }
    }

    if (showDeleteConfirm) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        showDeleteConfirm = false
                        onDeleteAccountClick()
                    }
                ) {
                    Text("Delete", color = Color.Red)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) {
                    Text("Cancel")
                }
            },
            title = { Text("Delete Account") },
            text = { Text("Are you sure you want to delete your account?") },
            properties = DialogProperties(dismissOnClickOutside = false)
        )
    }
}
