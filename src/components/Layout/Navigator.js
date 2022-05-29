import React, { useState } from "react";
import { Layout, Menu, Icon } from "antd";
import routes from "../../utils/_routes";
import { Route, Switch, Link } from "react-router-dom";
import logo from "../../utils/assets/images/logo-white.svg";
import MyEventDetails from "./../Events/MyEvents/MyEventDetails";

import styled from "styled-components";

const { Content, Sider } = Layout;

const MenuLogo = styled.div`
	padding: 20px 24px;
`;

const EditSider = styled(Sider)`
	@media (max-width: 992px) {
		display: none;
	}
`;

const Navigator = props => {
	const [isCollapsed] = useState(false);

	return (
		<>
			<Layout>
				{/* {show ? ( */}
				<EditSider
					theme="dark"
					trigger={null}
					collapsible
					collapsed={isCollapsed}
				>
					<MenuLogo>
						<img
							src={logo}
							hidden={isCollapsed}
							width="150"
							alt="logo"
						/>
					</MenuLogo>
					<Menu
						theme="dark"
						height="100%"
						mode="inline"
						defaultSelectedKeys={"dashboard"}
					>
						{routes.map((route, idx) => (
							<Menu.Item
								key={route.key}
								onClick={() => {
									localStorage.setItem("routeKey", route.key);
								}}
							>
								<Icon type={route.icon} />
								<span>{route.name}</span>
								<Link to={route.path} />
							</Menu.Item>
						))}
						<Menu.Item
							key={"signout"}
							onClick={() => {
								localStorage.clear();
								props.history.push("/login");
							}}
						>
							<Icon type="lock" />
							<span>Sign Out</span>
						</Menu.Item>
					</Menu>
				</EditSider>
				{/* ) : null} */}

				<Layout>
					<Content
						style={{
							margin: 12,
							padding: 20,
							background: "#f9f9f9",
							minHeight: "280"
						}}
					>
						<Switch>
							{routes.map((route, idx) => {
								return route.component ? (
									<Route
										key={idx}
										path={route.path}
										exact={route.exact}
										render={props => (
											<route.component {...props} />
										)}
									/>
								) : null;
							})}
							<Route
								exact
								path="/myEvents/:id"
								component={MyEventDetails}
							/>
						</Switch>
					</Content>
				</Layout>
			</Layout>
		</>
	);
};

export default Navigator;
