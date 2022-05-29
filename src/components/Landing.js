import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
	Button,
	Form,
	Input,
	Icon,
	Row,
	Col,
	InputNumber,
	Spin,
	Select,
	Tooltip
} from "antd";
import { Link } from "react-router-dom";
import { GET_BRANCHES, GET_YEARS, _notification } from "../utils/_helpers";
import {
	getEventsService,
	getParticipantService,
	loginService,
	registerBothService,
	registerEventService,
	getRole
} from "../utils/services";
import { DispatchContext } from "../contexts/userContext";
import ReactMarkdown from "react-markdown";
import moment from "moment";
const { Option } = Select;

const Landing = props => {
	const history = useHistory();
	const [active, setActive] = useState(0);
	const { getFieldDecorator } = props.form;
	const Dispatch = useContext(DispatchContext);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [eventData, setEventData] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [pageLoading, setPageLoading] = useState(false);
	const [event, setEvent] = useState("");
	const { slug } = props.match.params;

	useEffect(() => {
		(async () => {
			const token = JSON.parse(localStorage.getItem("token"));
			if (token) {
				if (token.token !== "") {
					const userData = getRole();

					setIsLoggedIn(true);
					const params = { pid: userData?.id };
					const res = await getParticipantService(params);
					if (res.message === "success" && !res.error) {
						let a = [];
						res.data.events.map(value => a.push(value.eid));
						setEvent(a);
					}
					// setEvent([]);
				}
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	useEffect(() => {
		(async () => {
			setPageLoading(true);
			try {
				const res = await getEventsService();

				if (res.message === "success" && !res.error) {
					const event = res.data.allEvents.filter(
						obj => obj?.slug === slug
					);
					if (event.length === 0) {
						_notification(
							"warning",
							"Error",
							"No such event exixts, Please check the link "
						);
						history.push("/");
					} else {
						setEventData(event[0]);
						setPageLoading(false);
					}
				}
			} catch (err) {
				_notification("warning", "Error", err.message);
			}
		})();
		//eslint-disable-next-line
	}, []);

	const handleLogin = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					const res = await loginService(values);

					if (res.error) {
						_notification("error", "Error", res.message);
						props.form.setFieldsValue({
							password: ""
						});
					} else if (res.res.message === "success") {
						Dispatch({
							type: "IN",
							token: res.token
						});
						_notification("success", "Success", "Logged In");
						props.form.setFieldsValue({
							email: "",
							password: ""
						});
						setTimeout(() => {
							props.history.push({
								pathname: "/events",
								state: {
									eid: eventData._id
								}
							});
						}, 200);
					}
					setIsLoading(false);
				} catch (err) {
					props.form.setFieldsValue({
						password: ""
					});
					_notification("error", "Error", err.message);
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		});
	};

	const handleRegisterEvent = async () => {
		setIsLoading(true);
		try {
			const body = { eid: eventData._id };
			const res = await registerEventService(body);

			if (res.message === "success") {
				setRefresh(!refresh);
				_notification("success", "Success", "Registration Successful!");
			} else {
				_notification("error", "Error", res.message);
			}
			setIsLoading(false);
		} catch (err) {
			_notification("warning", "Error", err.message);
			setIsLoading(false);
		}
	};

	const handleRegisterBoth = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				values["eid"] = eventData._id;
				try {
					const res = await registerBothService(values);

					if (res.error) {
						_notification("error", "Error", res.message);
					} else if (res.res.message === "success") {
						_notification(
							"success",
							"Success",
							"Check your email for further information, also check your spam and promotions section."
						);
						setTimeout(() => {
							props.history.push("/login");
						}, 200);
					}
					setIsLoading(false);
				} catch (err) {
					_notification("error", "Error", err.message);
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		});
	};

	const renderers = {
		img: ({ alt, src, title }) => (
			<img
				alt={alt}
				src={src}
				title={title}
				style={{
					maxWidth: "100%",
					borderRadius: "4px",
					marginTop: "12px"
				}}
			/>
		),
		h2: ({ node }) => (
			<h2
				style={{
					fontSize: "28px",
					fontWeight: "600",
					textTransform: "capitalize",
					marginTop: "24px",
					color: "rgba(0, 0, 0, 0.65)"
				}}
			>
				{node.children[0].value}
			</h2>
		),
		h3: ({ node }) => (
			<h3
				style={{
					color: "rgba(0, 0, 0, 0.65)",
					fontWeight: 600
				}}
			>
				{node.children[0].value}
			</h3>
		)
	};

	return pageLoading ? (
		<div
			style={{
				height: "100vh",
				width: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<Spin />
		</div>
	) : (
		<>
			<section className="cntnr">
				<div style={{ padding: "40px 20px 20px 20px" }}>
					<img
						src={eventData && eventData.image}
						alt=""
						width="100%"
						style={{
							borderRadius: "6px",
							boxShadow: "rgb(0 0 0 / 10%) 0px 0px 10px"
						}}
					/>
				</div>
			</section>

			<section className="cntnr det-ctr">
				<div className="detail-section">
					<div
						style={{
							boxShadow: "rgb(0 0 0 / 10%) 0px 0px 10px",
							borderRadius: "6px",
							padding: "40px"
						}}
					>
						<div style={{ fontSize: "28px", fontWeight: "600" }}>
							Event Details
						</div>
						<div style={{ fontSize: "18px", paddingTop: "16px" }}>
							<ReactMarkdown components={renderers}>
								{eventData && eventData.description}
							</ReactMarkdown>
						</div>
					</div>
				</div>
				<div className="left" style={{ padding: "20px" }}>
					<div
						style={{
							padding: "40px",
							boxShadow: "rgb(0 0 0 / 10%) 0px 0px 10px"
						}}
					>
						<div
							style={{
								fontSize: "28px",
								fontWeight: "600",
								textTransform: "capitalize"
							}}
						>
							{eventData && eventData.title}
						</div>
						<div
							style={{
								fontSize: "20px",
								padding: "16px 0px 24px 0px"
							}}
						>
							{eventData &&
								`${moment(
									eventData.startDate.split("T")[0]
								).format("DD MMMM YY")} - ${moment(
									eventData.endDate.split("T")[0]
								).format("DD MMMM YY")}`}
						</div>
						{eventData && eventData.isRegistrationRequired ? (
							eventData.isRegistrationOpened &&
							!event.includes(eventData._id) ? (
								isLoggedIn ? (
									<Button
										style={{
											width: "100%",
											fontSize: "16px",
											marginBottom: "16px"
										}}
										size="large"
										type="primary"
										onClick={handleRegisterEvent}
									>
										Register
									</Button>
								) : (
									<>
										<div
											style={{
												fontSize: "16px",
												padding: "4px 0px",
												border: "2px solid #E8E8E8",
												borderRadius: "4px"
											}}
										>
											<div
												style={{
													display: "flex",
													width: "100%",
													position: "relative"
												}}
											>
												<div
													onClick={() => setActive(0)}
													className={`tab ${
														active === 0 &&
														"active-tab"
													}`}
												>
													Register
												</div>
												<div
													onClick={() => setActive(1)}
													className={`tab ${
														active === 1 &&
														"active-tab"
													}`}
												>
													Log in
												</div>
												<div
													className={`glider ${
														active === 1 &&
														"glider-active"
													}`}
												/>
											</div>
										</div>
										<div style={{ marginTop: "16px" }}>
											{active === 0 ? (
												<Form
													onSubmit={
														handleRegisterBoth
													}
													style={{
														marginTop: "28px"
													}}
												>
													<Form.Item>
														{getFieldDecorator(
															"name",
															{
																rules: [
																	{
																		required: true,
																		message:
																			"Please input your name!"
																	}
																]
															}
														)(
															<Input
																type="text"
																placeholder="Name"
															/>
														)}
													</Form.Item>
													<Form.Item>
														{getFieldDecorator(
															"email",
															{
																rules: [
																	{
																		type: "email",
																		required: true,
																		message:
																			"Please input your email!"
																	}
																]
															}
														)(
															<Input
																type="email"
																placeholder="Email"
															/>
														)}
													</Form.Item>
													<Form.Item>
														{getFieldDecorator(
															"phone",
															{
																rules: [
																	{
																		required: true,
																		message:
																			"Please input your phone number!"
																	}
																]
															}
														)(
															<InputNumber
																minLength={10}
																maxLength={10}
																style={{
																	width: "100%"
																}}
																placeholder="Phone no."
															/>
														)}
													</Form.Item>

													<Row gutter={16}>
														<Col span={12}>
															<Form.Item required>
																{getFieldDecorator(
																	"branch",
																	{
																		rules: [
																			{
																				required: true,
																				message:
																					"Please select the branch"
																			}
																		]
																	}
																)(
																	<Select placeholder="Branch">
																		<Option
																			value=""
																			disabled
																		>
																			Select
																			Branch
																		</Option>
																		{GET_BRANCHES().map(
																			branch => (
																				<Option
																					key={
																						branch
																					}
																					value={
																						branch
																					}
																				>
																					{
																						branch
																					}
																				</Option>
																			)
																		)}
																	</Select>
																)}
															</Form.Item>
														</Col>
														<Col span={12}>
															<Form.Item required>
																{getFieldDecorator(
																	"year",
																	{
																		rules: [
																			{
																				required: true,
																				message:
																					"Please select the year"
																			}
																		]
																	}
																)(
																	<Select placeholder="Year">
																		<Option
																			value=""
																			disabled
																		>
																			Select
																			Year
																		</Option>
																		{GET_YEARS().map(
																			year => (
																				<Option
																					key={
																						year
																					}
																					value={
																						year
																					}
																				>
																					{
																						year
																					}
																				</Option>
																			)
																		)}
																	</Select>
																)}
															</Form.Item>
														</Col>
													</Row>

													<Form.Item>
														<Button
															type="primary"
															htmlType="submit"
															className="login-form-button"
															// loading={isLoading}
														>
															Register
														</Button>
													</Form.Item>
												</Form>
											) : (
												<Form
													style={{
														marginTop: "28px"
													}}
													onSubmit={handleLogin}
												>
													<Form.Item>
														{getFieldDecorator(
															"email",
															{
																rules: [
																	{
																		type: "email",
																		required: true,
																		message:
																			"Please input your email!"
																	}
																]
															}
														)(
															<Input
																prefix={
																	<Icon
																		type="user"
																		style={{
																			color: "rgba(0,0,0,.25)"
																		}}
																	/>
																}
																type="email"
																placeholder="Email"
															/>
														)}
													</Form.Item>
													<Form.Item>
														{getFieldDecorator(
															"password",
															{
																rules: [
																	{
																		required: true,
																		message:
																			"Please input your Password!"
																	}
																]
															}
														)(
															<Input.Password
																prefix={
																	<Icon
																		type="lock"
																		style={{
																			color: "rgba(0,0,0,.25)"
																		}}
																	/>
																}
																type="password"
																placeholder="Password"
															/>
														)}
													</Form.Item>
													<Form.Item>
														<Button
															type="primary"
															htmlType="submit"
															className="login-form-button"
															loading={isLoading}
														>
															Log in
														</Button>
													</Form.Item>
													<div
														style={{
															float: "right",
															fontWeight: 300
														}}
													>
														<Link to="/forgot">
															Forgot Password ?
														</Link>
													</div>
												</Form>
											)}
										</div>
									</>
								)
							) : (
								<Tooltip
									placement="top"
									title={
										event.includes(
											eventData && eventData._id
										)
											? "Already registered"
											: "Registrations are closed"
									}
									style={{ display: "flex" }}
								>
									<Button
										style={{
											width: "100%",
											fontSize: "16px",
											marginBottom: "16px"
										}}
										size="large"
										type="primary"
										onClick={handleRegisterEvent}
										disabled
									>
										Register
									</Button>
								</Tooltip>
							)
						) : null}
					</div>
				</div>
			</section>
		</>
	);
};

const LoginForm = Form.create({ name: "login_form" })(Landing);

export default LoginForm;
