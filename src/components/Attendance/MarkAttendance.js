import React, { useState } from "react";
import PageTitle from "./../Layout/PageTitle";
import styled from "styled-components";
import QrReader from "react-qr-reader";
import { Card, Form, Button, Input } from "antd";
import { markAttendanceService } from "../../utils/services";
import { _notification } from "./../../utils/_helpers";

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Heading = styled.p`
	text-align: center;
	font-weight: 700;
	font-size: 18px;
`;

const QrrReader = styled(QrReader)`
	width: 300px;
	@media (max-width: 480px) {
		width: 220px;
	}
`;

const MarkAttendance = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [attendanceCode, setAttendanceCode] = useState("");
	const { getFieldDecorator } = props.form;

	const handleScan = async data => {
		// console.log(data);
		if (data && data !== attendanceCode) {
			setAttendanceCode(data);
			try {
				await markAttendanceService({ code: data });
				_notification("success", "Success", "Attendance Marked");
			} catch (error) {
				if (error.message)
					_notification("error", "Error", error.message);
			}
		}
	};

	const handleError = err => {
		_notification("error", "Error", "Camera Permission Denied !");
		console.log(err);
	};

	const handleSubmit = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					await handleScan(values.code);
					props.form.setFieldsValue({
						code: ""
					});
					setIsLoading(false);
				} catch (err) {
					props.form.setFieldsValue({
						code: ""
					});
					_notification("error", "Error", err.message);
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		});
	};

	return (
		<div className="all-Containers">
			<PageTitle title="Attendance" />

			<Card
				bordered={false}
				style={{
					backgroundColor: "#4285f4",
					borderRadius: "4px"
				}}
			>
				<Container>
					<div>
						<Card
							bordered={false}
							style={{ borderRadius: "4px", padding: "-2px" }}
						>
							<Heading>Scan QR code</Heading>
							<QrrReader
								delay={300}
								onError={handleError}
								onScan={handleScan}
								onLoad={object => console.log(object)}
							/>
						</Card>
						<br />
						<Card bordered={false} style={{ borderRadius: "4px" }}>
							<Form
								onSubmit={handleSubmit}
								className="login-form"
							>
								<Form.Item>
									{getFieldDecorator("code", {
										rules: [
											{
												required: true,
												message: "Please enter code!"
											}
										]
									})(
										<Input
											type="text"
											placeholder="Event Code"
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
										Mark Attendance
									</Button>
								</Form.Item>
							</Form>
						</Card>
					</div>
				</Container>
			</Card>
		</div>
	);
};

const MarkAttendanceForm = Form.create({ name: "attendance_form" })(
	MarkAttendance
);

export default MarkAttendanceForm;
