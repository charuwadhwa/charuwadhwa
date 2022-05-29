import { notification } from "antd";

export const _notification = (type, title, description) => {
	return notification[type]({
		message: title,
		description
	});
};

export const GET_BRANCHES = () => {
	return [
		"CSE",
		"IT",
		"ME",
		"CO",
		"CSI",
		"ECE",
		"CI",
		"EN",
		"EI",
		"MCA",
		"B.PHARMA",
		"M.PHARMA",
		"MBA"
	];
};

export const GET_YEARS = () => {
	return [1, 2, 3, 4];
};
