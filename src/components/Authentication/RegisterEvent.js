import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, Row, Col, InputNumber } from "antd";
import logo from "../../utils/assets/images/logo-black.svg";
import "./style.css";
import { _notification, GET_BRANCHES, GET_YEARS } from "../../utils/_helpers";
import { registerBothService } from "../../utils/services";
const { Option } = Select;

const Register = props => {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const token = JSON.parse(localStorage.getItem("token"));
		if (token) {
			if (token.token !== "") {
				props.history.push("/");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				values["eid"] = "616c14d2ebde4f81f8ee8b9a";
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
	const { getFieldDecorator } = props.form;
	return (
		<div style={{ height: "100vh", overflow: "hidden" }}>
			<img src={logo} width={160} className="vidgyor-logo" alt="" />
			<Card title="Create your account" className="login-form-wrapper">
				<Form onSubmit={handleSubmit} className="login-form">
					<Form.Item>
						{getFieldDecorator("name", {
							rules: [
								{
									required: true,
									message: "Please input your name!"
								}
							]
						})(<Input type="text" placeholder="Name" />)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator("email", {
							rules: [
								{
									type: "email",
									required: true,
									message: "Please input your email!"
								}
							]
						})(<Input type="email" placeholder="Email" />)}
					</Form.Item>
					<Form.Item>
						{getFieldDecorator("phone", {
							rules: [
								{
									required: true,
									message: "Please input your phone number!"
								}
							]
						})(
							<InputNumber
								minLength={10}
								maxLength={10}
								style={{ width: "100%" }}
								placeholder="Phone no."
							/>
						)}
					</Form.Item>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item required>
								{getFieldDecorator("branch", {
									rules: [
										{
											required: true,
											message: "Please select the branch"
										}
									]
								})(
									<Select placeholder="Branch">
										<Option value="" disabled>
											Select Branch
										</Option>
										{GET_BRANCHES().map(branch => (
											<Option key={branch} value={branch}>
												{branch}
											</Option>
										))}
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item required>
								{getFieldDecorator("year", {
									rules: [
										{
											required: true,
											message: "Please select the year"
										}
									]
								})(
									<Select placeholder="Year">
										<Option value="" disabled>
											Select Year
										</Option>
										{GET_YEARS().map(year => (
											<Option key={year} value={year}>
												{year}
											</Option>
										))}
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
							loading={isLoading}
						>
							Register
						</Button>
					</Form.Item>
				</Form>
			</Card>
			{/* <p style={{ textAlign: "center", marginTop: 12 }}>
				Have an account? <Link to="/login">Login here</Link>
			</p> */}
		</div>
	);
};

const RegisterForm = Form.create({ name: "register_form" })(Register);

export default RegisterForm;
