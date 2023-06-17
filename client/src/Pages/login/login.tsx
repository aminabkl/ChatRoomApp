import { FunctionComponent, useState } from "react";

import "./login.css";

import LoginForm from "./loginForm";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
	return (
		<>
			<div id="login">
				<h4 id="login-h4" style={{ marginLeft: "2rem" }}>
					Sign In
				</h4>
				<LoginForm />
			</div>
		</>
	);
};

export default Login;
