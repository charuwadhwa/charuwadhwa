import React, { useState, useEffect } from "react";
import { Modal, Col, Row, Button, Tag, Popconfirm } from "antd";
import styled from "styled-components";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import {
	registerEventService,
	getParticipantService,
	getRole
} from "./../../utils/services";
import { _notification } from "./../../utils/_helpers";
import ReactMarkdown from "react-markdown";

const Heading = styled.h4`
	font-weight: bold;
	font-size: 28px;
`;

const ButtonContainer = styled.div`
	float: right;
	margin-top: 6px;
`;

const EditButton = styled(Button)`
	border: 0;
	border-radius: 2px;
`;

const DescriptionContainer = styled.div`
	margin-top: 0px;
`;

const DescHeading = styled.h4`
	font-size: 18px;
	font-weight: 600;
`;

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	font-size: 16px;
`;

const RegisterInfo = styled.p`
	color: #db4437;
	text-align: center;
	margin-top: 12px;
	font-size: 16px;
`;

const EventDetails = ({ visible, handleModal, event, eventType }) => {
	const [loading, setLoading] = useState(false);
	const [userData] = useState(getRole());
	const [eventData, setEventData] = useState(null);
	const [refresh, toggleRefresh] = useState(false);
	const {
		_id,
		title,
		description,
		time,
		image,
		startDate,
		endDate,
		venue,
		isRegistrationOpened,
		isRegistrationRequired
	} = event;

	useEffect(() => {
		(async () => {
			try {
				const params = { pid: userData.id };
				const res = await getParticipantService(params);
				let a = [];
				res.data.events.map(value => a.push(value.eid));
				setEventData(a);
			} catch (err) {
				_notification("warning", "Error", err.message);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	const handleRegister = async () => {
		setLoading(true);
		try {
			const body = { eid: _id };
			const res = await registerEventService(body);

			if (res.message === "success") {
				_notification("success", "Success", "Registration Successful!");
				toggleRefresh(!refresh);
			} else {
				_notification("error", "Error", res.message);
			}
			setLoading(false);
		} catch (err) {
			_notification("warning", "Error", err.message);
			setLoading(false);
		}
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

	return (
		<>
			<Modal
				style={{ top: 20 }}
				visible={visible}
				onCancel={() => handleModal(false)}
				footer={null}
				width={700}
			>
				<Row>
					<Col span={2}></Col>
					<Col span={20}>
						<img src={image} alt="pic" width="100%" />
					</Col>
					<Col span={2}></Col>
				</Row>
				<Row style={{ marginTop: "15px" }}>
					<Col xl={12} lg={12} md={12} sm={12} xs={24}>
						<Heading>{title}</Heading>
						<Tag color="blue">{eventType}</Tag>
					</Col>
					<Col xl={12} lg={12} md={12} sm={12} xs={24}>
						{eventType === "past" ||
						eventType ===
							"running" ? null : isRegistrationRequired ? (
							isRegistrationOpened ? (
								eventData ? (
									eventData.includes(_id) ? (
										<ButtonContainer>
											<EditButton
												size="large"
												loading={loading}
												disabled
											>
												Already Registered
											</EditButton>
										</ButtonContainer>
									) : (
										<ButtonContainer>
											<Popconfirm
												title="Do you want to register in the event?"
												onConfirm={handleRegister}
												// onCancel={cancel}
												okText="Yes"
												cancelText="No"
											>
												<EditButton
													size="large"
													loading={loading}
													// onClick={handleRegister}
													type="primary"
												>
													Register here
												</EditButton>
											</Popconfirm>
										</ButtonContainer>
									)
								) : null
							) : (
								<RegisterInfo>
									Registration will start soon
								</RegisterInfo>
							)
						) : (
							<RegisterInfo>
								Registration not required
							</RegisterInfo>
						)}
					</Col>
				</Row>
				<br />
				<Wrapper>
					<div
						style={{
							marginRight: "4px",
							fontSize: "24px"
						}}
					>
						<MdLocationOn />
					</div>
					<p>{venue}</p>
				</Wrapper>
				<Wrapper>
					<div
						style={{
							marginRight: "4px",
							fontSize: "22px",
							marginTop: "-1px"
						}}
					>
						<IoIosTime />
					</div>
					<p>{time}</p>
				</Wrapper>
				<Wrapper>
					<div
						style={{
							marginRight: "4px",
							fontSize: "22px",
							marginTop: "-1px"
						}}
					>
						<MdDateRange />
					</div>
					<p>
						{new Date(startDate).toDateString()} to{" "}
						{new Date(endDate).toDateString()}
					</p>
				</Wrapper>
				<DescriptionContainer>
					<DescHeading>Description</DescHeading>
					<ReactMarkdown components={renderers}>
						{description}
					</ReactMarkdown>
				</DescriptionContainer>
			</Modal>
		</>
	);
};

export default EventDetails;
