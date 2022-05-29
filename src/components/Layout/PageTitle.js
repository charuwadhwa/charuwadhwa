import React, { useState } from "react";
import { PageHeader, Row, Col } from "antd";
import "./style.css";
import UserProfile from "./UserProfile";
import NavContainer from "./NavContainer";
import styled from "styled-components";
import {
	IoIosArrowDropdownCircle,
	IoIosArrowDropupCircle
} from "react-icons/io";

const MobMenu = styled.div`
	display: none;
	@media (max-width: 992px) {
		display: block;
	}
`;

const PageTitle = props => {
	const [isOpen, setIsOpen] = useState(false);

	// const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<>
			<Row>
				<Col span={12}>
					<MobMenu>
						{isOpen ? (
							<IoIosArrowDropdownCircle
								style={{ fontSize: "22px" }}
								onClick={() => setIsOpen(!isOpen)}
							/>
						) : (
							<IoIosArrowDropupCircle
								style={{ fontSize: "22px" }}
								onClick={() => setIsOpen(!isOpen)}
							/>
						)}
					</MobMenu>
				</Col>
				<Col span={12}>
					<div
						style={{
							float: "right",
							marginBottom: "8px"
						}}
					>
						<UserProfile />
					</div>
				</Col>
			</Row>
			<PageHeader
				style={{
					padding: "8px 16px",
					background: "#0F9D58",
					// color: "#fff!important",
					marginBottom: 16,

					borderRadius: 4,
					borderBottom: "1px solid rgb(235, 237, 240)"
				}}
				title={props.title}
				// extra={[<UserProfile key="1" />]}
			/>
			<NavContainer isOpen={isOpen} />
		</>
	);
};

export default PageTitle;
