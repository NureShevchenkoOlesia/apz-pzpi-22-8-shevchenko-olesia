package com.example.cosmorummobile.model

data class LoginRequest(
    val nickname: String,
    val password: String
)

data class LoginResponse(
    val access_token: String,
    val token_type: String,
    val user: User
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String
)

data class RegisterResponse(
    val message: String,
    val id: String
)

data class DashboardData(
    val id: Int,
    val title: String,
    val description: String
)

data class User(
    val username: String,
    val bio: String?,
    val avatar_url: String?,
    val observation_count: Int?
)

data class Observation(
    val id: String,
    val title: String,
    val date: String,
    val image_url: String
)

data class ExportResponse(
    val message: String,
    val file_path: String
)

data class ObservationRequest(
    val title: String,
    val description: String,
    val image_url: String,
    val calibration: Map<String, Any> = emptyMap(),
    val objects_in_field: List<Map<String, Any>> = emptyList(),
    val location: Location
)

data class Location(
    val latitude: Double,
    val longitude: Double,
    val place_name: String
)

data class KpIndexEntry(
    val observedTime: String,
    val kp_index: Double
)

data class EventResult(
    val _id: String,
    val title: String,
    val start_time: String?,
    val event_date: String?,
    val type: String,
    val class_type: String?,
    val kp_index: List<KpIndexEntry>?,
    val link: String?
)
