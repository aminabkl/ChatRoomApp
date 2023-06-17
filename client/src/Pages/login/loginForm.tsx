import { FunctionComponent, useState } from "react";
import "./login.css";
import google from "../../assets/socialicons/google.svg";
import axios from "axios";
import Cookies from "js-cookie";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFacebook, faApple } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/action/authSlice";

interface LoginFormProps {}

const LoginForm: FunctionComponent<LoginFormProps> = () => {
	const navigate = useNavigate();
	const [data, setData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState(false);
	const dispatch = useDispatch();

	const handleChange = (e: any) => {
		setError(false);
		const value = e.target.value;
		setData({
			...data,
			[e.target.name]: value,
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();

		const userData = {
			email: data.email,
			password: data.password,
		};
		axios
			.post("http://localhost:8000/api/signin", userData)
			.then((response) => {
				if (response.status === 200) {
					Cookies.set("userId", response.data.userId);
					Cookies.set("token", response.data.token);
					dispatch(
						login({
							userId: response.data.userId,
							token: response.data.token,
							isLogged: true,
						})
					);
					navigate("/chat");
				}
			})
			.catch((error) => {
				if (error.response.status === 401) {
					setError(true);
				} else {
					console.log("An error occurred:", error.message);
				}
			});
	};
	return (
		<>
			<div className="signin-form-div">
				<form onSubmit={handleSubmit} className="signin-form">
					{/* Input Signin */}
					<div className="input-signin">
						<input
							type="text"
							name="email"
							value={data.email}
							onChange={handleChange}
							className="input-field"
							placeholder="Email"
							style={{
								border: error ? "1px solid red" : "1px solid #c5c6c9",
							}}
							required
						/>
						<input
							type="password"
							name="password"
							value={data.password}
							onChange={handleChange}
							className="input-field"
							placeholder="Password"
							style={{
								border: error ? "1px solid red" : "1px solid #c5c6c9",
							}}
							required
						/>
						{error && (
							<p className="error-message">
								Wrong email or password, please try again!
							</p>
						)}
						<button type="submit" className="signin-btn">
							Continue
						</button>
					</div>
				</form>
			</div>
			<div id="join-signin">
				<span id="not-member-span">Not a member yet?</span>
				<Link to="/join" id="join-now">
					<span>Join now</span>
				</Link>
			</div>
		</>
	);
};
export default LoginForm;
