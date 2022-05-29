import React, { useState, useEffect } from "react";
import { Form, Button, Input, Row, Col, Skeleton, Select } from "antd";
import "./style.css";
import { updateParticipantService } from "../../utils/services";
import { _notification, GET_BRANCHES, GET_YEARS } from "./../../utils/_helpers";

const { Option } = Select;

const UpdateProfile = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [showSkeleton, setShowSkeleton] = useState(false);
	const { getFieldDecorator } = props.form;

	useEffect(() => {
		setShowSkeleton(true);
		if (props.user) {
			let { name, email, phone, year, branch } = props.user;

			props.form.setFieldsValue({
				name,
				email,
				phone,
				year,
				branch
			});
			setShowSkeleton(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					const res = await updateParticipantService(values);
					if (res.message === "success") {
						_notification("success", "Success", "Profile Updated");
						props.onUpdateUser();
					} else {
						_notification("error", "Error", res.message);
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
	return (
		<Skeleton loading={showSkeleton} active>
			<Form onSubmit={handleSubmit} layout="vertical">
				<Row gutter={16}>
					<Col>
						<Form.Item label="Name" required>
							{getFieldDecorator("name", {
								rules: [
									{
										required: true,
										message: "Please enter your name!"
									}
								]
							})(<Input type="text" placeholder="Name" />)}
						</Form.Item>
					</Col>
					{/* <Col span={12}>
						<Form.Item label="Email" required>
							{getFieldDecorator("email", {
								rules: [
									{
										required: true,
										message: "Please input email!"
									}
								]
							})(<Input type="text" placeholder="Email" />)}
						</Form.Item>
					</Col> */}
				</Row>

				<Form.Item label="Password">
					{getFieldDecorator(
						"password",
						{}
					)(<Input.Password placeholder="Password" />)}
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label="Branch" required>
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
						<Form.Item label="Year" required>
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

				<Form.Item label="Contact No.">
					{getFieldDecorator("phone", {
						rules: [
							{
								required: true,
								message: "Please input Contact No."
							}
						]
					})(<Input type="text" placeholder="Contact" />)}
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						loading={isLoading}
					>
						Update Details
					</Button>
				</Form.Item>
			</Form>
		</Skeleton>
	);
};

const UpdateProfileForm = Form.create({ name: "profile_form" })(UpdateProfile);

export default UpdateProfileForm;
