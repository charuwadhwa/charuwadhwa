import React from "react";
import { Row, Col, Card, Icon } from "antd";
import { Link } from "react-router-dom";
import _routes from "../../utils/_routes";

export const DashCards = () => {
	const iconStyle = color => {
		return {
			fontSize: "40px",
			paddingRight: 8,
			color: color
		};
	};
	return (
		<Row gutter={[16, 16]}>
			{_routes.map(route => {
				if (route.key === "dashboard") {
					return null;
				}
				return (
					<Col lg={8} md={8} sm={12} key={route.key}>
						<Link to={route.path}>
							<Card
								hoverable
								className="content-clickable"
								bordered={false}
								style={{
									width: "100%",
									height: "100% !important",
									borderBottom: `16px solid ${route.color}`
								}}
							>
								<Row gutter={16}>
									<Col
										xl={18}
										lg={18}
										sm={18}
										md={18}
										xs={18}
									>
										<h2
											style={{
												fontWeight: 700,
												marginBottom: 0
											}}
										>
											{route.name}
										</h2>
										{route.description}
									</Col>
									<Col xl={6} lg={6} sm={6} md={6} xs={6}>
										<Icon
											style={iconStyle(route.color)}
											type={route.icon}
										/>
									</Col>
								</Row>
							</Card>
						</Link>
					</Col>
				);
			})}
		</Row>
	);
};
