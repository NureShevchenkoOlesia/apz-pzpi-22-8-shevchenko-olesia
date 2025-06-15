package com.example.cosmorummobile.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.cosmorummobile.api.AuthApi
import com.example.cosmorummobile.model.Observation
import com.example.cosmorummobile.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ProfileViewModel : ViewModel() {
    private val _user = MutableStateFlow<User?>(null)
    val user = _user.asStateFlow()

    private val _observations = MutableStateFlow<List<Observation>>(emptyList())
    val observations = _observations.asStateFlow()

    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:8000/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val userApi = retrofit.create(AuthApi::class.java)

    fun loadProfile(token: String) {
        viewModelScope.launch {
            try {
                val profileResponse = userApi.getUser("Bearer $token")
                val obsResponse = userApi.getUserObservations("Bearer $token")
                if (profileResponse.isSuccessful) _user.value = profileResponse.body()
                if (obsResponse.isSuccessful) _observations.value = obsResponse.body() ?: emptyList()
            } catch (e: Exception) {
                // handle error
            }
        }
    }

    fun deleteObservation(token: String, id: String, onSuccess: () -> Unit) {
        viewModelScope.launch {
            try {
                val response = userApi.deleteObservation("Bearer $token", id)
                if (response.isSuccessful) {
                    _observations.value = _observations.value.filterNot { it.id == id }
                    onSuccess()
                }
            } catch (e: Exception) {
                // handle error
            }
        }
    }
}
