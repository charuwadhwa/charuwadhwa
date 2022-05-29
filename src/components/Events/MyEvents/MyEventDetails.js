import React, { useEffect, useState } from "react";
import PageTitle from "./../../Layout/PageTitle";
import {
	Card,
	Row,
	Col,
	// Button,
	Tag,
	Drawer,
	Table,
	Button,
	Popover
	//  Popover
} from "antd";
import { getParticipantService, getRole } from "../../../utils/services";
import { _notification } from "./../../../utils/_helpers";
import styled from "styled-components";
import { MdLocationOn, MdDateRange } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import {
	generateCertificateService,
	attendanceReportService
} from "./../../../utils/services";
import FeedbackForm from "./FeedbackForm";
import moment from "moment";

const Heading = styled.h4`
	font-weight: bold;
	font-size: 28px;
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

const MyEventDetails = props => {
	//eslint-disable-next-line
	const [loading, setLoading] = useState(false);
	const [viewDrawer, setViewDrawer] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState([]);
	const [report, setReport] = useState(null);
	//eslint-disable-next-line
	const [participantEvent, setParticipantEvent] = useState(null);
	const [userData] = useState(getRole());

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const eid = props.match.params.id;
				const participantProfileRes = await getParticipantService({
					pid: userData.id
				});
				const _participantEvent =
					participantProfileRes.data.events.filter(
						event => event.eid === eid
					)[0];
				setParticipantEvent(_participantEvent);
				let params = { eid };
				const response = await attendanceReportService(params);
				setReport(response.data);
				let date = [];
				date = response.data.attendance.map(d => {
					return d.split("T")[0];
				});
				setData(dataCalc(response.data.event, date));
				setIsLoading(false);
			} catch (err) {
				_notification("warning", "Error", err.message);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//eslint-disable-next-line
	const generateCerti = async () => {
		setLoading(true);
		try {
			let id = props.match.params.id;
			await generateCertificateService(id);
			// if (res.message === "success") {
			// 	_notification("success", "Success", "Download success");
			// } else {
			// 	_notification("error", "Error", res.message);
			// }
			setLoading(false);
		} catch (err) {
			_notification("warning", "Error", err.message);
			setLoading(false);
		}
	};

	const feedbackSubmit = () => {
		setViewDrawer(false);
	};

	const columns = [
		{
			title: "#",
			dataIndex: "index",
			key: "index"
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date"
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: text => (
				<>
					{text === "Present" ? (
						<Tag color="green">Present</Tag>
					) : null}
					{text === "Absent" ? <Tag color="red">Absent</Tag> : null}
					{text === "Pending" ? (
						<Tag color="orange">Pending</Tag>
					) : null}
				</>
			)
		}
	];

	const dataCalc = (event, attendance) => {
		let data = [];
		if (event) {
			let start = new Date(event.startDate);
			let end = new Date(event.endDate);
			let status;

			for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
				if (
					attendance.includes(
						moment(new Date(d)).format("YYYY-MM-DD")
					)
				) {
					status = "Present";
				} else if (
					!attendance.includes(
						moment(new Date(d)).format("YYYY-MM-DD")
					) &&
					moment(new Date(d)).format("YYYY-MM-DD") <
						moment(Date.now()).format("YYYY-MM-DD")
				) {
					status = "Absent";
				} else if (
					!attendance.includes(
						moment(new Date(d)).format("YYYY-MM-DD")
					)
				) {
					status = "Pending";
				}
				data.push({
					status,
					date: moment(new Date(d)).format("YYYY-MM-DD")
				});
			}
		}
		return data;
	};

	const tableData = data.map((d, id) => {
		const { status, date } = d;
		return { index: ++id, key: ++id, status, date };
	});

	return (
		<div className="all-Containers">
			<PageTitle title="My Events" />
			{report && report.event ? (
				<Card bordered={false}>
					<Row gutter={[16, 16]}>
						<Col xl={4} lg={8} md={8} sm={24} xs={24}>
							<img
								src={report.event.image}
								alt="pic"
								width="100%"
							/>
						</Col>
						<Col xl={10} lg={8} md={8} sm={24} xs={24}>
							<Heading>{report.event.title}</Heading>
							<Wrapper>
								<div
									style={{
										marginRight: "4px",
										fontSize: "24px"
									}}
								>
									<MdLocationOn />
								</div>
								<p>{report.event.venue}</p>
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
								<p>{report.event.time}</p>
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
									{new Date(
										report.event.startDate
									).toDateString()}{" "}
									to{" "}
									{new Date(
										report.event.endDate
									).toDateString()}
								</p>
							</Wrapper>
						</Col>
						<Col xl={10} lg={8} md={8} sm={24} xs={24}>
							<DescriptionContainer>
								{/* <DescHeading>Description</DescHeading>
								<p>{report.event.description}</p> */}
								<div>
									{report && report.attendance.length ? (
										<Button
											type="dashed"
											onClick={() => setViewDrawer(true)}
										>
											Feedback
										</Button>
									) : null}
									<br />
									<Popover
										placement="bottom"
										content={
											!(
												participantEvent &&
												participantEvent.status ===
													"attended"
											)
												? "Please attend all days of the event to get the certificate."
												: "YaY! Got the certificate"
										}
									>
										<Button
											type="primary"
											style={{ marginTop: "8px" }}
											onClick={generateCerti}
											loading={loading}
											disabled={
												!(
													participantEvent &&
													participantEvent.status ===
														"attended"
												)
											}
										>
											Generate Certificate
										</Button>
									</Popover>
								</div>
							</DescriptionContainer>
						</Col>
					</Row>
				</Card>
			) : null}

			<div className="table-wrapper-card">
				<Card style={{ padding: 0, overflowX: "auto" }}>
					<DescHeading>Attendance log</DescHeading>
					<Table
						loading={isLoading}
						columns={columns}
						dataSource={tableData}
					/>
				</Card>
			</div>

			<Drawer
				title="Feedback Form"
				placement="right"
				closable={true}
				destroyOnClose={true}
				onClose={() => setViewDrawer(false)}
				visible={viewDrawer}
			>
				<FeedbackForm
					eid={props.match.params.id}
					onFeedbackSubmit={feedbackSubmit}
				/>
			</Drawer>
		</div>
	);
};

export default MyEventDetails;
