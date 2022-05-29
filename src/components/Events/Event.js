import React, { useState, useEffect } from "react";
import { Tag, Card, Col, Row } from "antd";
import "./style.css";
import EventDetails from "./EventDetails";
import styled from "styled-components";

const Time = styled.p`
	float: right;
	@media (max-width: 400px) {
		margin-top: -10px;
	}
`;

const Events = props => {
	const [event] = useState(props.event);
	const [showModal, setShowModal] = useState(false);

	const { title, time, image, startDate, endDate, venue } = event;

	const handleModal = value => {
		setShowModal(value);
	};

	useEffect(() => {
		if (props.eve === props.event._id) {
			setShowModal(!showModal);
			props.setEve("");
		}
		//eslint-disable-next-line
	}, [props.eve]);

	return (
		<>
			<Col xl={8} lg={12} md={12} sm={24} xs={24}>
				<Card className="event-card" onClick={() => handleModal(true)}>
					<h2>{title}</h2>
					<Row>
						<Col xl={12} lg={12} md={12} sm={12} xs={24}>
							<p>{venue}</p>
						</Col>
						<Col xl={12} lg={12} md={12} sm={12} xs={24}>
							<Time>{time}</Time>
						</Col>
					</Row>

					<Row>
						<Col xl={10} lg={12} md={12} sm={12} xs={24}>
							<p>
								{new Date(startDate).toDateString()} to{" "}
								{new Date(endDate).toDateString()}
							</p>
						</Col>
						<Col xl={14} lg={12} md={12} sm={12} xs={24}>
							{props.eventType ? (
								<Tag
									style={{
										float: "right",
										marginBottom: 8
									}}
									color="#0f9d58"
								>
									{props.eventType &&
										props.eventType.toUpperCase()}
								</Tag>
							) : null}
						</Col>
					</Row>
					<div
						style={{
							borderRadius: 4,
							height: 80,
							backgroundImage: `url(${image})`,
							backgroundSize: "cover",
							marginBottom: 8
						}}
					></div>
				</Card>
			</Col>
			<EventDetails
				visible={showModal}
				handleModal={handleModal}
				event={event}
				eventType={props.eventType}
			/>
		</>
	);
};

export default Events;
