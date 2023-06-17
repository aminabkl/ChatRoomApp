import { FunctionComponent, useState, Fragment, useEffect } from "react";
import "./emailVerification.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Error404 from "../../assets/error404.jpg";
import EmailVerified from "../../assets/email-verified.svg";
//import Footer from "../../components/footerComponent/footer";

interface EmailVerifyProps {}

const EmailVerify: FunctionComponent<EmailVerifyProps> = () => {
	const [validUrl, setValidUrl] = useState(false);

	const params = useParams();
	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:8000/api/${params.id}/verify/${params.emailToken}`;
				const { data } = await axios.get(url);
				console.log(data);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [params]);

	return (
		<Fragment>
			{validUrl ? (
				<div>
					<div className="emailVerify-success">
						<img src={EmailVerified} className="email-success-img" />
						<h1 className="email-header-success">Email activated</h1>
						<p className="email-text">
							Thank you! Your email has been verified.
							<br />
							Your account is active.
							<br />
							You can now login to your account
						</p>
						<button className="email-btn">
							<Link to="/" className="email-home-link">
								login
							</Link>
						</button>
					</div>
					{/* <Footer /> */}
				</div>
			) : (
				<div className="emailVerify-error">
					<img src={Error404} className="email-error404" />
					<h1 className="email-header-error">Page not found</h1>
					<p className="email-text">
						We looked everywhere for this page.
						<br />
						Are you sure the verification link is correct ?
						<br />
						Please check your email.
						<br />
					</p>
					<button className="email-btn">
						<Link to="/" className="email-home-link">
							home page
						</Link>{" "}
					</button>
				</div>
			)}
		</Fragment>
	);
};
export default EmailVerify;
