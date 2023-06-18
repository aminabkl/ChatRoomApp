import { FunctionComponent, useState } from "react";
import "./login.css";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/action/authSlice";

interface LoginFormProps {
	onSubmit: () => void;
}

interface LoginData {
	username: string;
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

const LoginForm: FunctionComponent<LoginFormProps> = ({ onSubmit }) => {
	const navigate = useNavigate();
	const [data, setData] = useState<LoginData>({
		username: "",
		password: "",
	});
	const [error, setError] = useState(false);
	const dispatch = useDispatch();
	const loginFormObservable = new LoginFormObservable();

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
		loginFormObservable.notify();

		const userData = {
			username: data.username,
			password: data.password,
		};
		axios
			.post("http://localhost:8000/api/signin", userData)
			.then((response) => {
				if (response.status === 200) {
					Cookies.set("userId", response.data.userId);
					Cookies.set("token", response.data.token);
					console.log(response.data);

					dispatch(
						login({
							userId: response.data.userId,
							token: response.data.token,
							isLogged: true,
						})
					);
					onSubmit(); // Notify the parent component about the successful login
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

	loginFormObservable.attach({
		update: () => {
			setError(false);
		},
	});

	return (
		<>
			<div className="signin-form-div">
				<form onSubmit={handleSubmit} className="signin-form">
					{/* Input Signin */}
					<div className="input-signin">
						<input
							type="text"
							name="username"
							value={data.username}
							onChange={handleChange}
							className="input-field"
							placeholder="Username"
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
								Wrong username or password, please try again!
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
