import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import { getEventService, updateRsvpService } from "../utils/services";
// import Axios from "axios";

const Rsvp = props => {
	const history = useHistory();
	const [message, setMessage] = useState("checking rsvp...");
	const [data, setData] = useState(null);

	useEffect(() => {
		(async () => {
			const { oid, eid, pid } = props.match.params;
			try {
				if (eid) {
					const res = await getEventService(eid);
					if (res.message === "success") {
						setData(res.data);
					}
				}
			} catch (e) {
				console.log(e);
			}
			const search = props.location.search;
			let isRsvpAccepted = new URLSearchParams(search).get(
				"isRsvpAccepted"
			);
			isRsvpAccepted = Boolean(Number(isRsvpAccepted));
			try {
				const params = {
					oid,
					eid,
					pid,
					isRsvpAccepted
				};
				await updateRsvpService(params);

				if (isRsvpAccepted) {
					setMessage("Congrats! RSVP confirmed. See you in event:)");
				} else {
					setMessage("RSVP declined!");
				}
			} catch (err) {
				setMessage(err.message);
			}
		})();
	}, [props.location.search, props.match.params]);

	return (
		<>
			<section className="cntnr">
				<div style={{ padding: "15px 20px 20px 15px" }}>
					{data && (
						<img
							src={data?.image}
							alt=""
							width="100%"
							style={{
								borderRadius: "6px",
								boxShadow: "rgb(0 0 0 / 10%) 0px 0px 10px"
							}}
						/>
					)}
				</div>
				<div
					style={{
						margin: "0px 20px 20px 15px",
						padding: "15px 20px 20px 15px",
						boxShadow: "rgb(0 0 0 / 10%) 0px 0px 10px",
						textAlign: "center",
						fontWeight: 700,
						fontSize: "18px"
					}}
				>
					{message}
					<br />
					<Button
						style={{
							marginTop: "5px",
							width: "30%",
							fontSize: "16px",
							fontWeight: 400
						}}
						size="large"
						type="primary"
						onClick={() => {
							history.push("/login");
						}}
					>
						Okay
					</Button>
				</div>
			</section>
		</>
	);
};

export default Rsvp;
