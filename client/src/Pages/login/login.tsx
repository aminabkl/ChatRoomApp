import { FunctionComponent, useState } from "react";

import "./login.css";

import LoginForm from "./loginForm";

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
	const [error, setError] = useState(false);

	const handleError = (value: boolean) => {
		setError(value);
	};

	return (
		<>
			<div
				id="login"
				style={{
					height: error ? "620px " : "575px ",
				}}
			>
				<h4 id="login-h4" style={{ marginLeft: "2rem" }}>
					Sign In
				</h4>
				<LoginForm onError={handleError} />
			</div>
		</>
	);
};

export default Login;
