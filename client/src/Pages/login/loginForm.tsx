import { FunctionComponent, useState } from "react";
import "./login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/action/authSlice";

interface LoginFormProps {
	onSubmit: () => void;
	onError: (value: boolean) => void;
}

interface LoginData {
	email: string;
	password: string;
}

interface Observable {
	attach: (observer: Observer) => void;
	detach: (observer: Observer) => void;
	notify: () => void;
}

interface Observer {
	update: () => void;
}

class LoginFormObservable implements Observable {
	private observers: Observer[] = [];

	public attach(observer: Observer) {
		this.observers.push(observer);
	}

	public detach(observer: Observer) {
		const index = this.observers.indexOf(observer);
		if (index !== -1) {
			this.observers.splice(index, 1);
		}
	}

	public notify() {
		for (const observer of this.observers) {
			observer.update();
		}
	}
}

const LoginForm: FunctionComponent<LoginFormProps> = ({ onSubmit, onError }) => {
	const navigate = useNavigate();
	const [data, setData] = useState<LoginData>({
		email: "",
		password: "",
	});
	const [error, setError] = useState(false);
	const dispatch = useDispatch();
	const loginFormObservable = new LoginFormObservable();

	const handleChange = (e: any) => {
		setError(false);
		onError(false);
		const value = e.target.value;
		setData({
			...data,
			[e.target.name]: value,
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		loginFormObservable.notify();

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
					onSubmit(); // Notify the parent component about the successful login
					navigate("/");
				}
			})
			.catch((error) => {
				if (error.response.status === 401) {
					setError(true);
					onError(true);
				} else {
					console.log("An error occurred:", error.message);
				}
			});
	};

	loginFormObservable.attach({
		update: () => {
			setError(false);
			onError(false);
		},
	});

	return (
		<>
			<div className="signin-form-div">
				<form onSubmit={handleSubmit} className="signin-form">
					{/* Form Separator */}
					<div className="form-separator">
						<span className="form-separator-span">or</span>
					</div>
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
						<div id="remember-forgot">
							<div id="remember">
								<input type="checkbox" name="remember" id="remember-checkbox" />
								<label id="remember-span">Remember Me</label>
							</div>
							<div id="forgot">
									<Link to="/" id="forgot-link">
										<span>Forgot Password?</span>
									</Link>
								</div>
						</div>
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



// import { FunctionComponent, useState } from "react";
// import "./login.css";
// import google from "../../assets/socialicons/google.svg";
// import axios from "axios";
// import Cookies from "js-cookie";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faFacebook, faApple } from "@fortawesome/free-brands-svg-icons";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login } from "../../features/action/authSlice";

// interface LoginFormProps {
// 	onError: (value: boolean) => void;
// }

// const LoginForm: FunctionComponent<LoginFormProps> = ({ onError }) => {
// 	const navigate = useNavigate();
// 	const [data, setData] = useState({
// 		email: "",
// 		password: "",
// 	});
// 	const [error, setError] = useState(false);
// 	const dispatch = useDispatch();

// 	const handleChange = (e: any) => {
// 		setError(false);
// 		onError(false);
// 		const value = e.target.value;
// 		setData({
// 			...data,
// 			[e.target.name]: value,
// 		});
// 	};

// 	const handleSubmit = (e: any) => {
// 		e.preventDefault();

// 		const userData = {
// 			email: data.email,
// 			password: data.password,
// 		};
// 		axios
// 			.post("http://localhost:8000/api/signin", userData)
// 			.then((response) => {
// 				if (response.status === 200) {
// 					Cookies.set("userId", response.data.userId);
// 					Cookies.set("token", response.data.token);
// 					dispatch(
// 						login({
// 							userId: response.data.userId,
// 							token: response.data.token,
// 							isLogged: true,
// 						})
// 					);
// 					navigate("/");
// 				}
// 			})
// 			.catch((error) => {
// 				if (error.response.status === 401) {
// 					setError(true);
// 					onError(true);
// 				} else {
// 					console.log("An error occurred:", error.message);
// 				}
// 			});
// 	};
// 	return (
// 		<>
// 			<div className="signin-form-div">
// 				<form onSubmit={handleSubmit} className="signin-form">
// 					{/* Social Signin */}
// 					{/* <div className="social-signing">
// 						<button className="facebook-signin signin-social-btn">
// 							<span className="social-signin-icon">
// 								<FontAwesomeIcon icon={faFacebook} />
// 							</span>
// 							<span className="signin-span">Continue with Facebook</span>
// 						</button>
// 						<button className="google-signin signin-social-btn">
// 							<span className="social-signin-icon">
// 								<img src={google} />
// 							</span>
// 							<span className="signin-span">Continue with Google</span>
// 						</button>
// 						<button className="apple-signin signin-social-btn">
// 							<span className="social-signin-icon">
// 								<FontAwesomeIcon icon={faApple} />
// 							</span>
// 							<span className="signin-span">Continue with Apple</span>
// 						</button>
// 					</div> */}
// 					{/* Form Separator */}
// 					<div className="form-separator">
// 						<span className="form-separator-span">or</span>
// 					</div>
// 					{/* Input Signin */}
// 					<div className="input-signin">
// 						<input
// 							type="text"
// 							name="email"
// 							value={data.email}
// 							onChange={handleChange}
// 							className="input-field"
// 							placeholder="Email"
// 							style={{
// 								border: error ? "1px solid red" : "1px solid #c5c6c9",
// 							}}
// 							required
// 						/>
// 						<input
// 							type="password"
// 							name="password"
// 							value={data.password}
// 							onChange={handleChange}
// 							className="input-field"
// 							placeholder="Password"
// 							style={{
// 								border: error ? "1px solid red" : "1px solid #c5c6c9",
// 							}}
// 							required
// 						/>
// 						{error && (
// 							<p className="error-message">
// 								Wrong email or password, please try again!
// 							</p>
// 						)}
// 						<button type="submit" className="signin-btn">
// 							Continue
// 						</button>
// 						<div id="remember-forgot">
// 							<div id="remember">
// 								<input type="checkbox" name="remember" id="remember-checkbox" />
// 								<label id="remember-span">Remember Me</label>
// 							</div>
// 							<div id="forgot">
// 								<Link to="/" id="forgot-link">
// 									<span>Forgot Password?</span>
// 								</Link>
// 							</div>
// 						</div>
// 					</div>
// 				</form>
// 			</div>
// 			<div id="join-signin">
// 				<span id="not-member-span">Not a member yet?</span>
// 				<Link to="/join" id="join-now">
// 					<span>Join now</span>
// 				</Link>
// 			</div>
// 		</>
// 	);
// };
// export default LoginForm;
