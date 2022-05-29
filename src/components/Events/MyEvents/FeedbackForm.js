import React, { useState } from "react";
import { Form, Button, Radio, Rate } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { _notification } from "../../../utils/_helpers";
import { submitFeedbackService } from "../../../utils/services";

const radioStyle = {
	display: "block",
	height: "30px",
	lineHeight: "30px"
};

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const Feedback = props => {
	const [isLoading, setIsLoading] = useState(false);
	const { getFieldDecorator } = props.form;

	const handleSubmit = e => {
		e.preventDefault();
		setIsLoading(true);

		props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					let data = {
						eid: props.eid,
						feedback: [
							{
								question: "How much did you like the event?",
								answer: desc[values.answer1 - 1]
							},
							{
								question: "Did you find this event helpful?",
								answer: desc[values.answer2 - 1]
							},
							{
								question: "How likely will you visit us again?",
								answer: values.answer3
							},
							{
								question: "Any comments?",
								answer: values.answer4
							}
						]
					};
					const res = await submitFeedbackService(data);
					if (res.message === "success") {
						_notification("success", "Success", "Submitted");
						props.onFeedbackSubmit();
					} else {
						_notification("error", "Error", res.message);
					}
					setIsLoading(false);
				} catch (err) {
					_notification("error", "Error", err.message);
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		});
	};

	return (
		<Form onSubmit={handleSubmit} layout="vertical">
			<Form.Item
				label="How much did you like the event?
"
			>
				{getFieldDecorator("answer1", {
					rules: [
						{
							required: true,
							message: "Please select your choice!"
						}
					]
				})(<Rate tooltips={desc} />)}
			</Form.Item>
			<Form.Item label="Did you find this event helpful?">
				{getFieldDecorator("answer2", {
					rules: [
						{
							required: true,
							message: "Please select your choice!"
						}
					]
				})(<Rate tooltips={desc} />)}
			</Form.Item>
			<Form.Item label="How likely will you visit us again?">
				{getFieldDecorator("answer3", {
					rules: [
						{
							required: true,
							message: "Please select your choice!"
						}
					]
				})(
					<Radio.Group>
						<Radio style={radioStyle} value="Very much">
							Very much
						</Radio>
						<Radio style={radioStyle} value="Somewhat yes">
							Somewhat yes
						</Radio>
						<Radio style={radioStyle} value="Somewhat not">
							Somewhat not
						</Radio>
						<Radio style={radioStyle} value="Totally not">
							Totally not
						</Radio>
					</Radio.Group>
				)}
			</Form.Item>

			<Form.Item label="Any comments?">
				{getFieldDecorator(
					"answer4",
					{}
				)(<TextArea type="text" rows={5} placeholder="Comment here" />)}
			</Form.Item>

			<Form.Item>
				<Button
					type="primary"
					htmlType="submit"
					className="login-form-button"
					loading={isLoading}
				>
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

const FeedbackForm = Form.create({ name: "feedback_form" })(Feedback);

export default FeedbackForm;
