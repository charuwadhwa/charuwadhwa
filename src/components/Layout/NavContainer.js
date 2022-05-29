import React from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledContainer = styled.div`
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100vh;
	z-index: 10;
	outline: 0;
	transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
	transform: translateY(${props => (props.isOpen ? 0 : 100)}vw);
	visibility: ${props => (props.isOpen ? "visible" : "hidden")};
	display: none;
	@media (max-width: 992px) {
		display: block;
	}
`;
const Sidebar = styled.aside`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: #f6f7f8;
	padding: 20px;
	width: 50vw;
	height: 100%;
	position: relative;
	right: 0;
	margin-left: auto;
	box-shadow: -10px 0px 30px -15px rgba(0, 0, 0, 0.5);
	@media (max-width: 480px) {
		width: 64vw;
		border-top-left-radius: 16px;
		border-bottom-left-radius: 16px;
	}
`;

const StyledNavLinks = styled.nav`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	flex-direction: column;
	text-align: center;
	color: inherit;
`;

const StyledList = styled.ul`
	padding: 0;
	margin: 0;
	list-style: none;
	width: 100%;
`;
const StyledListItem = styled.li`
	padding: 1em 0.5em;
	position: relative;
	font-size: 1em;
`;

const NavContainer = props => {
	return (
		<>
			<StyledContainer
				isOpen={props.isOpen}
				// onClick={props.openMenu()}
				aria-hidden={!props.isOpen}
				tabIndex={props.isOpen ? 1 : -1}
			>
				<Sidebar>
					<StyledNavLinks>
						<StyledList
							className="navbar-nav mr-auto nav justify-content-end"
							style={{ width: "100%" }}
						>
							<StyledListItem
								className="nav-item m-1 "
								style={{ fontWeight: "600" }}
							>
								<Link to="/">Dashboard</Link>
							</StyledListItem>

							<StyledListItem
								className="nav-item m-1"
								style={{ fontWeight: "600" }}
							>
								<Link to="/events">Events</Link>
							</StyledListItem>

							<StyledListItem
								className="nav-item m-1"
								style={{ fontWeight: "600" }}
							>
								<Link to="/myEvents">My Events</Link>
							</StyledListItem>

							<StyledListItem
								className="nav-item m-1"
								style={{ fontWeight: "600" }}
							>
								<Link to="/attendance">Attendance</Link>
							</StyledListItem>

							<StyledListItem
								className="nav-item m-1"
								style={{ fontWeight: "600" }}
							>
								<Link
									to="#"
									onClick={() => {
										localStorage.clear();
										props.history.push("/");
									}}
								>
									Sign Out
								</Link>
							</StyledListItem>
						</StyledList>
					</StyledNavLinks>
				</Sidebar>
			</StyledContainer>
		</>
	);
};

export default NavContainer;
