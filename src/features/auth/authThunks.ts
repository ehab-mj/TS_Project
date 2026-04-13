import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AppUser, LoginFormData, RegisterFormData } from '../../types/auth'
import {
    loginUserService,
    logoutUserService,
    registerUserService,
} from '../../firebase/authService'

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message
    }

    return 'Something went wrong'
}

export const registerUser = createAsyncThunk<
    AppUser,
    RegisterFormData,
    { rejectValue: string }
>('auth/registerUser', async (formData, thunkAPI) => {
    try {
        return await registerUserService(formData)
    } catch (error: unknown) {
        return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
})

export const loginUser = createAsyncThunk<
    AppUser,
    LoginFormData,
    { rejectValue: string }
>('auth/loginUser', async (formData, thunkAPI) => {
    try {
        return await loginUserService(formData)
    } catch (error: unknown) {
        return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
})

export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>('auth/logoutUser', async (_, thunkAPI) => {
    try {
        await logoutUserService()
        return
    } catch (error: unknown) {
        return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
})