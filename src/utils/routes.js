/** PARTICIPANTS MODULE **/
export const REGISTER_PARTICIPANT = "/events/participants"; // POST NEW
export const REGISTER_BOTH = "/events/registerboth"; // POST NEW
export const LOGIN_PARTICIPANT = "/events/participants/login"; // POST NEW
export const FORGOTPASS = "/events/participants/forgot-pwd"; // POST NEW
export const RESETPASS = "/events/participants/reset-pwd"; // POST NEW
// @queryParams pid
export const VIEW_PROFILE = "/events/participants/profile"; // GET NEW
export const UPDATE_PROFILE = "/events/participants"; // POST NEW

/** EVENTS MODULE : PARTICIPANTS **/
export const GET_EVENTS = "/events"; // GET
export const GET_EVENT = "/events"; // GET NEW
export const GET_CERTI = "/events/certificate"; //GET NEW
export const ADD_FEEDBACK = "/events/feedback"; //POST NEW
export const REGISTER_FOR_EVENT = "/events/register"; // POST NEW
export const UPDATE_RSVP = "/events/rsvp"; // POST

/** ATTENDANCE MODULE **/
export const MARK_ATTENDANCE = "/events/attendance/mark"; //POST NEW
export const GET_ATTENDANCE_REPORT = "/events/attendance/user"; // GET NEW
