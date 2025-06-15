package com.example.cosmorummobile.ui.personal

import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter

@Composable
fun ObservationForm(
    selectedImageUri: Uri?,
    onUploadSuccess: () -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var latitude by remember { mutableStateOf("") }
    var longitude by remember { mutableStateOf("") }
    var placeName by remember { mutableStateOf("") }
    var ra by remember { mutableStateOf("") }
    var dec by remember { mutableStateOf("") }
    var objectName by remember { mutableStateOf("") }
    var objectType by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            selectedImageUri?.let {
                Image(
                    painter = rememberAsyncImagePainter(it),
                    contentDescription = null,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(220.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            @Composable
            fun styledTextField(value: String, onChange: (String) -> Unit, label: String) {
                OutlinedTextField(
                    value = value,
                    onValueChange = onChange,
                    label = { Text(label, color = Color.White) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedContainerColor = Color.DarkGray,
                        focusedContainerColor = Color.DarkGray,
                        cursorColor = Color.White,
                        focusedBorderColor = Color.White,
                        unfocusedBorderColor = Color.Gray
                    ),
                    textStyle = LocalTextStyle.current.copy(color = Color.White)
                )
            }

            styledTextField(title, { title = it }, "Title")
            styledTextField(description, { description = it }, "Description")
            styledTextField(latitude, { latitude = it }, "Latitude")
            styledTextField(longitude, { longitude = it }, "Longitude")
            styledTextField(placeName, { placeName = it }, "Place Name")
            styledTextField(ra, { ra = it }, "RA")
            styledTextField(dec, { dec = it }, "DEC")
            styledTextField(objectName, { objectName = it }, "Object Name")
            styledTextField(objectType, { objectType = it }, "Object Type")

            Spacer(modifier = Modifier.height(16.dp))
        }

        // Кнопка фіксована внизу
        Button(
            onClick = { onUploadSuccess() },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
            Text("Submit Observation")
        }
    }
}
