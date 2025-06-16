package com.example.cosmorummobile.ui.personal

import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.navigation.NavType
import java.net.URLDecoder
import java.net.URLEncoder

@Composable
fun UploadObservationNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = "photo_picker") {

        composable("photo_picker") {
            PhotoPickerScreen { selectedUri ->
                val encodedUri = URLEncoder.encode(selectedUri?.toString() ?: "", "UTF-8")
                navController.navigate("form_screen?imageUri=$encodedUri")
            }
        }

        composable(
            route = "form_screen?imageUri={imageUri}",
            arguments = listOf(navArgument("imageUri") { type = NavType.StringType })
        ) { backStackEntry ->
            val uriString = backStackEntry.arguments?.getString("imageUri") ?: ""
            val decodedUri = Uri.parse(URLDecoder.decode(uriString, "UTF-8"))

            ObservationForm(
                selectedImageUri = decodedUri,
                onUploadSuccess = {
                    navController.popBackStack("photo_picker", inclusive = false)
                }
            )
        }
    }
}
