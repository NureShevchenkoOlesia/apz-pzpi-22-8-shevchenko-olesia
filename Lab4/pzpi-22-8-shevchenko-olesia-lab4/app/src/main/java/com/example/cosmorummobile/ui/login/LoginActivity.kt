package com.example.cosmorummobile.ui.login

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.cosmorummobile.viewmodel.LoginViewModel
import androidx.compose.material3.*
import androidx.compose.ui.res.stringResource
import com.example.cosmorummobile.R

@Composable
fun LoginActivity(
    modifier: Modifier = Modifier,
    onNavigateToRegister: () -> Unit,
    onNavigateToDashboard: () -> Unit,
    onLoginSuccess: (String) -> Unit,
    loginViewModel: LoginViewModel = viewModel()
) {
    var nickname by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val error by loginViewModel.error.collectAsState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color.Black
    ) {
        Column(
            modifier = modifier
                .padding(horizontal = 24.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = stringResource(R.string.login_title),
                style = MaterialTheme.typography.headlineMedium.copy(
                    color = Color.White,
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.SemiBold
                )
            )

            Spacer(modifier = Modifier.height(24.dp))

            OutlinedTextField(
                value = nickname,
                onValueChange = { nickname = it },
                label = { Text(stringResource(R.string.login_username_label), color = Color.White) },
                modifier = Modifier
                    .fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFF27272A),
                    unfocusedContainerColor = Color(0xFF27272A),
                    unfocusedBorderColor = Color(0xFF3F3F46),
                    focusedBorderColor = Color(0xFFE4E4E7),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text(stringResource(R.string.login_password_label), color = Color.White) },
                modifier = Modifier
                    .fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFF27272A),
                    unfocusedContainerColor = Color(0xFF27272A),
                    unfocusedBorderColor = Color(0xFF3F3F46),
                    focusedBorderColor = Color(0xFFE4E4E7),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = {
                    loginViewModel.login(nickname, password) { token ->
                        onLoginSuccess(token)
                        onNavigateToDashboard()
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White,
                    contentColor = Color.Black
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(stringResource(R.string.login_button), fontWeight = FontWeight.Medium)
            }

            Spacer(modifier = Modifier.height(12.dp))

            TextButton(onClick = { /* TODO: Reset Password */ }) {
                Text(
                    text = stringResource(R.string.forgot_password),
                    color = Color(0xFFFACC15),
                    fontSize = 14.sp
                )
            }

            TextButton(onClick = onNavigateToRegister) {
                Text(
                    text = stringResource(R.string.signup_prompt),
                    color = Color(0xFFFACC15),
                    fontSize = 14.sp
                )
            }

            if (error != null) {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = error ?: "",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}
