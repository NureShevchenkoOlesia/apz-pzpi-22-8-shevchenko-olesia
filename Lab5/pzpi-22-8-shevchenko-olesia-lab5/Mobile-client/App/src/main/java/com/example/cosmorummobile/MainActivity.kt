package com.example.cosmorummobile

import android.app.Activity
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.cosmorummobile.ui.login.LoginActivity
import com.example.cosmorummobile.ui.login.RegisterActivity
import com.example.cosmorummobile.ui.personal.DashboardActivity
import com.example.cosmorummobile.viewmodel.DashboardViewModel
import com.example.cosmorummobile.ui.personal.ProfileScreen
import com.example.cosmorummobile.ui.personal.ProfileMenu
import com.example.cosmorummobile.ui.personal.PhotoPickerScreen
import com.example.cosmorummobile.ui.personal.ObservationForm
import com.example.cosmorummobile.ui.personal.EditProfileScreen
import com.example.cosmorummobile.ui.personal.EventsScreen
import com.example.cosmorummobile.ui.search.SearchScreen
import com.example.cosmorummobile.ui.theme.CosmorumMobileTheme
import com.jakewharton.threetenabp.AndroidThreeTen
import java.util.Locale

enum class Screen {
    LOGIN,
    REGISTER,
    DASHBOARD,
    PROFILE,
    EDIT_PROFILE,
    UPLOAD,
    EDIT,
    SEARCH,
    EVENTS
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AndroidThreeTen.init(this)
        enableEdgeToEdge()
        setContent {
            AppContent()
        }
    }
}

fun switchLanguage(context: Context, languageCode: String) {
    val locale = Locale(languageCode)
    Locale.setDefault(locale)
    val resources = context.resources
    val config = resources.configuration
    config.setLocale(locale)
    resources.updateConfiguration(config, resources.displayMetrics)

    val prefs = context.getSharedPreferences("settings", Context.MODE_PRIVATE)
    prefs.edit().putString("lang", languageCode).apply()

    if (context is Activity) {
        val intent = context.intent
        context.finish()
        context.startActivity(intent)
    }
}

@Composable
fun AppContent() {
    var currentScreen by remember { mutableStateOf(Screen.LOGIN) }
    var token by remember { mutableStateOf<String?>(null) }
    val dashboardViewModel: DashboardViewModel = viewModel()
    var selectedImageUri by remember { mutableStateOf<Uri?>(null) }
    val context = LocalContext.current

    CosmorumMobileTheme {
        val showGlobalScaffold = when (currentScreen) {
            Screen.UPLOAD,
            Screen.EDIT,
            Screen.PROFILE,
            Screen.EDIT_PROFILE,
            Screen.EVENTS,
            Screen.SEARCH -> true
            else -> false
        }

        if (showGlobalScaffold) {
            Scaffold(
                modifier = Modifier.fillMaxSize(),
                topBar = {
                    ProfileMenu(
                        onLanguageToggle = {
                            val prefs = context.getSharedPreferences("settings", Context.MODE_PRIVATE)
                            val lang = prefs.getString("lang", "en")
                            val newLang = if (lang == "en") "uk" else "en"
                            switchLanguage(context, newLang)
                        },
                        onSearchClick = { currentScreen = Screen.SEARCH },
                        onProfileClick = {
                            Log.d("NAVIGATION", "Navigating to PROFILE screen with token = $token")
                            currentScreen = Screen.PROFILE
                        },
                        onDashboardClick = { currentScreen = Screen.DASHBOARD },
                        onNewObservationClick = { currentScreen = Screen.UPLOAD },
                        onSettingsClick = { /* TODO */ },
                        onEventsClick = { currentScreen = Screen.EVENTS },
                        onLogoutClick = {
                            token = null
                            currentScreen = Screen.LOGIN
                        },
                        onDeleteAccountClick = {
                            token?.let {
                                dashboardViewModel.deleteUser(it) {
                                    token = null
                                    currentScreen = Screen.LOGIN
                                }
                            }
                        }
                    )
                }
            ) { innerPadding ->
                RenderScreenContent(
                    currentScreen = currentScreen,
                    token = token,
                    onTokenChange = { token = it },
                    innerPadding = Modifier.padding(innerPadding),
                    selectedImageUri = selectedImageUri,
                    onSelectedImageUriChange = { selectedImageUri = it },
                    dashboardViewModel = dashboardViewModel,
                    onScreenChange = { currentScreen = it }
                )
            }
        } else {
            RenderScreenContent(
                currentScreen = currentScreen,
                token = token,
                onTokenChange = { token = it },
                innerPadding = Modifier.padding(0.dp),
                selectedImageUri = selectedImageUri,
                onSelectedImageUriChange = { selectedImageUri = it },
                dashboardViewModel = dashboardViewModel,
                onScreenChange = { currentScreen = it }
            )
        }
    }
}

@Composable
fun RenderScreenContent(
    currentScreen: Screen,
    token: String?,
    onTokenChange: (String?) -> Unit,
    innerPadding: Modifier,
    selectedImageUri: Uri?,
    onSelectedImageUriChange: (Uri?) -> Unit,
    dashboardViewModel: DashboardViewModel,
    onScreenChange: (Screen) -> Unit
) {
    when (currentScreen) {
        Screen.LOGIN -> LoginActivity(
            modifier = Modifier.then(innerPadding),
            onNavigateToRegister = { onScreenChange(Screen.REGISTER) },
            onNavigateToDashboard = { onScreenChange(Screen.DASHBOARD) },
            onLoginSuccess = { receivedToken ->
                onTokenChange(receivedToken)
                onScreenChange(Screen.DASHBOARD)
            }
        )
        Screen.REGISTER -> RegisterActivity(
            modifier = Modifier.then(innerPadding),
            onRegisterSuccess = { onScreenChange(Screen.LOGIN) }
        )
        Screen.DASHBOARD -> {
            token?.let { safeToken ->
                val context = LocalContext.current
                DashboardActivity(
                    modifier = Modifier.then(innerPadding),
                    token = safeToken,
                    onLanguageToddle = {
                        val prefs = context.getSharedPreferences("settings", Context.MODE_PRIVATE)
                        val lang = prefs.getString("lang", "en")
                        val newLang = if (lang == "en") "uk" else "en"
                        switchLanguage(context, newLang)
                    },
                    onLogout = { onScreenChange(Screen.LOGIN) },
                    onProfileClick = { onScreenChange(Screen.PROFILE) },
                    onSearchClick = { onScreenChange(Screen.SEARCH) },
                    onEventsClick = { onScreenChange(Screen.EVENTS) },
                    onDeleteAccount = {
                        dashboardViewModel.deleteUser(safeToken) {
                            onScreenChange(Screen.LOGIN)
                        }
                    },
                    dashboardViewModel = dashboardViewModel
                )
            } ?: onScreenChange(Screen.LOGIN)
        }
        Screen.PROFILE -> {
            token?.let { safeToken ->
                ProfileScreen(
                    token = safeToken,
                    onEditProfile = { onScreenChange(Screen.EDIT_PROFILE) },
                    onUploadNew = { onScreenChange(Screen.UPLOAD) },
                    onEditObservation = { onScreenChange(Screen.EDIT) }
                )
            } ?: onScreenChange(Screen.LOGIN)
        }
        Screen.EDIT_PROFILE -> EditProfileScreen(
            onSave = { nickname, bio, avatarUri ->
                println("Saved nickname: $nickname, bio: $bio, avatar: $avatarUri")
            },
            onCancel = { onScreenChange(Screen.PROFILE) }
        )
        Screen.EDIT -> ObservationForm(
            selectedImageUri = selectedImageUri,
            onUploadSuccess = { onScreenChange(Screen.DASHBOARD) }
        )
        Screen.UPLOAD -> PhotoPickerScreen(
            onPhotoSelected = { uri ->
                onSelectedImageUriChange(uri)
                onScreenChange(Screen.EDIT)
            }
        )
        Screen.SEARCH -> SearchScreen(apiBaseUrl = "http://10.0.2.2:8000")
        Screen.EVENTS -> {
            token?.let { safeToken ->
                EventsScreen(
                    apiBaseUrl = "http://10.0.2.2:8000",
                    token = safeToken
                )
            } ?: onScreenChange(Screen.LOGIN)
        }
    }
}


