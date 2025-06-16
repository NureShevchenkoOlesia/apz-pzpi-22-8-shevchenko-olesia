package com.example.cosmorummobile.viewmodel

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cosmorummobile.api.AuthApi
import com.example.cosmorummobile.model.LoginRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LoginViewModel : ViewModel() {
    private val _error = MutableStateFlow<String?>(null)
    val error = _error.asStateFlow()
    private val _loginSuccess = MutableStateFlow(false)
    val loginSuccess = _loginSuccess.asStateFlow()

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:8000")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val authApi = retrofit.create(AuthApi::class.java)
    private val _token = MutableStateFlow<String?>(null)
    val token = _token.asStateFlow()

    fun login(username: String, password: String, onLoginSuccess: (String) -> Unit) {
        viewModelScope.launch {
            try {
                val response = authApi.login(username, password)
                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    if (loginResponse != null && loginResponse.access_token.isNotEmpty()) {
                        _error.value = null
                        onLoginSuccess(loginResponse.access_token)
                        Log.i("LoginViewModel", "Login response body: $loginResponse")
                    } else {
                        _error.value = "Token is empty"
                    }
                } else {
                    _error.value = "Login failed: ${response.code()}"
                }
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}