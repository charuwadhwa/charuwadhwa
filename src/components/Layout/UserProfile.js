import React, { useState, useEffect } from "react";
import { Avatar, Popover, Icon, Tag, Skeleton, Row, Col, Drawer } from "antd";
import "./style.css";
import styled from "styled-components";
import { getRole, getParticipantService } from "./../../utils/services";
import { _notification } from "./../../utils/_helpers";
import UpdateProfile from "./UpdateProfile";

const Heading = styled.h4`
	font-weight: bold;
	font-size: 18px;
`;

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	font-size: 16px;
`;

const IconEdit = styled.div`
	margin-top: 2px;
	float: right;
`;

const UserProfile = () => {
	const userData = useState(getRole());
	const [user, setUser] = useState(null);
	const [profileDrawer, setProfileDrawer] = useState(false);
	const [showSkeleton, setShowSkeleton] = useState(false);
	const [showPop, setShowPop] = useState(false);
	const [refresh, toggleRefresh] = useState(false);

	useEffect(() => {
		(async () => {
			setShowSkeleton(true);
			try {
				const params = { pid: userData[0].id };
				const res = await getParticipantService(params);
				if (res.message === "success") {
					setUser(res.data["profileData"]);
					setShowSkeleton(false);
				} else {
					_notification("warning", "Error", res.message);
				}
			} catch (err) {
				_notification("error", "Error", err.message);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [refresh]);

	const handleUpdateUser = () => {
		setProfileDrawer(false);
		toggleRefresh(!refresh);
	};

	const handlePopover = () => {
		setProfileDrawer(true);
		setShowPop(false);
	};

	const content = (
		<Skeleton loading={showSkeleton} active>
			{user ? (
				<div style={{ width: "100%" }}>
					<Row justify="space-between">
						<Col span={20}>
							<Heading>{user.name}</Heading>
						</Col>
						<Col span={4}>
							<IconEdit>
								<Icon type="edit" onClick={handlePopover} />
							</IconEdit>
						</Col>
					</Row>
					<Tag color="green">{user.year}nd year</Tag>
					<br />
					<br />
					<Wrapper>
						<div style={{ marginRight: "4px" }}>
							<Icon type="branches" />
						</div>
						<h4>{user.branch}</h4>
					</Wrapper>
					<Wrapper>
						<div style={{ marginRight: "4px" }}>
							<Icon type="phone" />
						</div>
						<h4>{user.phone}</h4>
					</Wrapper>
					<Wrapper>
						<div style={{ marginTop: "2px", marginRight: "4px" }}>
							<Icon type="mail" />
						</div>
						<h4>{user.email}</h4>
					</Wrapper>
				</div>
			) : null}
		</Skeleton>
	);

	return (
		<>
			<div>
				<Popover
					visible={showPop}
					key="1"
					content={content}
					placement="bottomRight"
					aria-hidden={!showPop}
				>
					<Avatar
						onClick={() => setShowPop(!showPop)}
						style={{ cursor: "pointer" }}
					>
						{user ? user.name[0] : null}
					</Avatar>
				</Popover>
			</div>

			<Drawer
				title="Update Profile"
				placement="right"
				closable={true}
				destroyOnClose={true}
				onClose={() => setProfileDrawer(false)}
				visible={profileDrawer}
			>
				<UpdateProfile user={user} onUpdateUser={handleUpdateUser} />
			</Drawer>
		</>
	);
};

export default UserProfile;
