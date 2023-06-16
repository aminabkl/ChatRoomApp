import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface AuthState {
	userId: string | null;
	token: string | null;
	isLogged: boolean | false;
}

const initialState: AuthState = {
	userId: null,
	token: null,
	isLogged: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(
			state,
			action: PayloadAction<{
				userId: string;
				token: string;
				isLogged: boolean;
			}>
		) {
			state.userId = action.payload.userId;
			state.token = action.payload.token;
			state.isLogged = action.payload.isLogged;
		},
		logout(state) {
			state.userId = null;
			state.token = null;
			state.isLogged = false;
		},
	},
});

export const { login, logout } = authSlice.actions;

export const selectUserId = (state: RootState) => state.auth.userId;
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
