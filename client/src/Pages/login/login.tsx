import { FunctionComponent, useState } from "react";

import "./login.css";

import LoginForm from "./loginForm";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
	const [error, setError] = useState(false);

	const handleError = (value: boolean) => {
		setError(value);
	};
	const onSubmit = () => {};
	return (
		<>
			<div id="login">
				<h4 id="login-h4">Sign In</h4>
				<LoginForm onSubmit={onSubmit} />
			</div>
		</>
	);
};

export default Login;
