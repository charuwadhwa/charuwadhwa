import React, { useEffect, useState } from "react";
import PageTitle from "../Layout/PageTitle";
import { Row, Select, Result } from "antd";
import "./style.css";
import { getEventsService } from "../../utils/services";
import { _notification } from "../../utils/_helpers";
import Event from "./Event";
const { Option } = Select;

const EventsList = props => {
	const [events, setEvents] = useState([]);
	// const [editDrawer, setEditDrawer] = useState(false);
	const [eventType, setEventType] = useState(null);
	// const [refresh, toggleRefresh] = useState(false);
	// const [isLoading, setIsLoading] = useState(false);
	const [allEvents, setAllEvents] = useState([]);
	const [eve, setEve] = useState("");

	const handleChange = val => {
		setEventType(val);
		if (val === "past") {
			setEvents(allEvents.previousEvents);
		}
		if (val === "upcoming") {
			setEvents(allEvents.upcomingEvents);
		}
		if (val === "running") {
			setEvents(allEvents.runningEvents);
		}
	};
	useEffect(() => {
		(async () => {
			// setIsLoading(true);
			try {
				const { data } = await getEventsService();

				if (props.history.location.state) {
					const { eid } = props.history.location.state;
					// const event = data.allEvents.filter(e => e._id === eid)[0];
					setEve(eid);
				}
				setEvents(data.upcomingEvents);
				setEventType("upcoming");
				setAllEvents(data);
				// setIsLoading(false);
			} catch (err) {
				_notification("warning", "Error", err.message);
			}
		})();
		//eslint-disable-next-line
	}, []);

	return (
		<div className="all-Containers">
			<PageTitle title="Events" />
			<Select
				style={{ minWidth: 180 }}
				defaultValue="Upcoming Events"
				onChange={handleChange}
			>
				<Option value="upcoming">Upcoming Events</Option>
				<Option value="past">Past Events</Option>
				<Option value="running">Running Events</Option>
			</Select>
			<br />
			<div className="events-wrapper">
				<Row gutter={[16, 16]}>
					{events.length !== 0 ? (
						events.map((event) => (
							<Event
								key={event._id}
								event={event}
								eventType={eventType}
								eve={eve}
								setEve={setEve}
								setEventType={setEventType}
							/>
						))
					) : (
						<Result status="warning" title="No events" />
					)}
				</Row>
			</div>
		</div>
	);
};

export default EventsList;
