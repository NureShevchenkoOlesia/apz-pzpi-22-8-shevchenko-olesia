package com.example.cosmorummobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cosmorummobile.api.AuthApi
import com.example.cosmorummobile.model.RegisterRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RegisterViewModel : ViewModel() {

    private val _isSuccess = MutableStateFlow(false)
    val isSuccess = _isSuccess.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error = _error.asStateFlow()

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:8000")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val authApi = retrofit.create(AuthApi::class.java)

    fun register(username: String, email: String, password: String) {
        viewModelScope.launch {
            try {
                val request = RegisterRequest(username, email, password)
                val response = authApi.register(request)
                _isSuccess.value = true
            } catch (e: Exception) {
                _error.value = "Register failed: ${e.message}"
            }
        }
    }
}
