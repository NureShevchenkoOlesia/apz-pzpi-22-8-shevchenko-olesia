package com.example.cosmorummobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cosmorummobile.api.AuthApi
import com.example.cosmorummobile.model.User
import com.example.cosmorummobile.model.Observation
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class DashboardViewModel : ViewModel() {
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val _observations = MutableStateFlow<List<Observation>>(emptyList())
    val observations = _observations.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error = _error.asStateFlow()

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:8000")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val userApi = retrofit.create(AuthApi::class.java)

    fun loadObservations(token: String) {
        viewModelScope.launch {
            try {
                val userResponse = userApi.getUser("Bearer $token")
                if (userResponse.isSuccessful) {
                    _user.value = userResponse.body()
                } else {
                    _error.value = "Failed to fetch user: ${userResponse.code()}"
                    return@launch
                }

                val obsResponse = userApi.getUserObservations("Bearer $token")
                if (obsResponse.isSuccessful) {
                    val sorted = obsResponse.body()?.sortedByDescending { it.date } ?: emptyList()
                    _observations.value = sorted.take(3)
                } else {
                    _error.value = "Failed to fetch observations: ${obsResponse.code()}"
                }
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
    fun deleteUser(token: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            try {
                val response = userApi.deleteUser("Bearer $token")
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    _error.value = "Failed to delete account"
                }
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}

