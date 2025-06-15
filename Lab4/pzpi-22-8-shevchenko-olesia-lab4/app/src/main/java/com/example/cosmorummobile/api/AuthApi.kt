package com.example.cosmorummobile.api

import com.example.cosmorummobile.model.LoginRequest
import com.example.cosmorummobile.model.LoginResponse
import com.example.cosmorummobile.model.RegisterRequest
import com.example.cosmorummobile.model.RegisterResponse
import com.example.cosmorummobile.model.ExportResponse
import com.example.cosmorummobile.model.User
import com.example.cosmorummobile.model.Observation
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.FormUrlEncoded
import retrofit2.http.Field
import retrofit2.http.*

interface AuthApi {
    @FormUrlEncoded
    @POST("users/login")
    suspend fun login(
        @Field("username") username: String,
        @Field("password") password: String
    ): Response<LoginResponse>

    @POST("users/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): RegisterResponse

    @GET("users/me")
    suspend fun getUser(@Header("Authorization") token: String):
            Response<User>

    @DELETE("users/me")
    suspend fun deleteUser(@Header("Authorization") token: String):
            Response<User>

    @DELETE("observations/{observation_id}")
    suspend fun deleteObservation(
        @Header("Authorization") token: String,
        @Path("observation_id") observationId: String
    ): Response<Observation>

    @GET("users/me/observations")
    suspend fun getUserObservations(@Header("Authorization") token: String):
            Response<List<Observation>>

    @GET("users/me/observations/export")
    suspend fun exportObservations(
        @Header("Authorization") token: String
    ): Response<ExportResponse>
}