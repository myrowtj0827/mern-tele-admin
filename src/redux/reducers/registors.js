import {
	APPOINTMENT_CREATE,
	APPOINTMENT_CLIENT_ALL,
	PROVIDER_INFO,
	PROVIDER_PHOTO,
	PROVIDER_FULL,

	PROVIDERS_ID,
	CLIENTS_ID,
	USER_DELETE,

	PROVIDER_MUSIC_BACKGROUND,
	REQUEST_ALL,
	REQUEST_PROVIDER,

	RECIPIENT_ALL,
	SENDER_ALL,

	REGISTER_PROVIDER,
	SHOW_SPINNING,

	SHOW_FORGOT_PASSWORD,
	LOGIN_PROVIDER,
	SHOW_RESET_PASSWORD,

	POST_ARTICLE,
	PUBLISHED_ALL,
	ARTICLES_ALL,
	ARTICLE_DETAILS,
	ARTICLE_DELETE,
	CATEGORY_LIST,
	UPDATE_ARTICLE,
	ARTICLE_DETAILS_DISPLAY,
	CATEGORY_ADD,
	FILE_UPLOAD_ERROR,
	FILE_UPLOAD,
	GET_COMMENT_BYID,
	APPOINTMENT_PAID_ALL,
	APPOINTMENT_REQUESTED_ALL,
	APPOINTMENT_EDIT,
	APPOINTMENT_DELETE, SET_PRICING_PLANS, SET_CURRENT_SUBSCRIPTION, SET_STRIPE_ACCOUNT_LINK,
	APPOINTMENT_GET,
	APPOINTMENT_JOIN,
	APPOINTMENT_GROUPING,
	APPOINTMENT_ACCEPT,

	APPOINTMENT_ONE_ONE,
	EMPTY_APPOINTMENT,

	MESSAGES_LIST,
	MESSAGES_LIST_ERROR,
	MESSAGES,
	CLIENT_CONNECTED,
	MESSAGES_ONE_ERROR,
	MESSAGES_EDIT,
	USERS,
	LAST_MESSAGES,

	UPDATE_INFO,
	INVITE_USER,

	DRAG_UPDATE,
	GET_DRAG,
	INVOICE_UPDATE,

	POST_NOTE,
	GET_NOTE,
	UPDATE_NOTE,
	DELETE_NOTE,
	GET_ONE_NOTE,

	SHARE_DOCUMENT,
	UPDATE_REMINDERS,
	PRACTICE_LIST,
	INVITE,
	GET_REMINDERS_ALLOW,

	CHATBOT_PAGE,
	CHATBOT_ADD,
	CHATBOT_ADD_MESSAGE,
	CHATBOT_DELETE_MESSAGE,
	CHATBOT_ERROR,
	GET_CHATBOT,
	GET_REPLY,
	GET_FAIL,
	APPOINTMENT_MONTH,
	APPOINTMENT_CANCEL,

	RECENT_DOCUMENT,
	APPOINTMENT_TYPE_CREATE,
	GET_APPOINTMENT_TYPE,
	APPOINTMENT_ALLOW,
	APPOINTMENT_ALLOW_MSG,
	APPOINTMENT_OUT,
} from "../actions/types/types";

const initialState = {
	msg_invoice: '',
	msg_dragUpdate: '',
	getDragLists: '',
	accountSimpleInfo: {},
	providerPhoto: '',
	providerFullInfo: '',

	msg_appointment: '',
	appointmentClientList: {},
	clientList: {},
	providerList: {},
	backgroundImgMusic: '',

	msg_deleteUser: '',

	providersIdList: {},
	clientsIdList: {},

	requestClientList: {},
	requestProviderList: {},

	recipientList: {},
	senderList: {},

	registerProvider: '',
	spinning: false,
	msg_forgot_password: '',
	msg_login: '',
	msg_article: '',
	publishedList: '',
	articlesList: '',
	articleDetails: '',
	msg_deleteArticle: '',
	categoryList: '',
	msg_updateArticle: '',
	articleDetailById: '',
	msg_addCategory: '',

	msg_fileUpload: '',
	fileUpload: '',
	articleCommentById: '',
	paidAppointmentList: '',
	requestedAppointmentList: '',
	msg_editAppointment: '',
	msg_deleteAppointment: '',
	msg_join: '',
	appointmentGrouping: '',

	pricing_plans: null,
	current_subscription: null,
	account_link: null,

	messageList: '',
	msg_messageList: '',
	massage: '',
	connected_clients: '',
	getEditError: '',
	getEdit: '',
	userList: '',
	getAppointment: '',
	msg_profile_update: '',
	msg_invitation: '',

	appointmentOneToOne: '',
	empty_appointment: '',
	get_month: '',

	msg_postNote: '',
	getNote: '',
	oneNote: '',
	msg_updateNote: '',
	msg_deleteNote: '',
	msg_share: '',
	msg_setting: '',
	practiceList: '',

	msg_invite: '',
	get_reminder_allow: '',

	description_page: '',

	get_one_chatbot: '',
	msg_add_chatbot: '',
	msg_delete_chatbot: '',
	msg_error_chatbot: '',
	chatbot_list: '',
	get_msg_result: '',
	msg_fail: '',

	get_recent_document: '',
	get_appointment_type: '',
	msg_allow_state: '',
	get_appointment_allow: '',
	msg_appointment_accept: '',
	msg_cancel: '',
};

export default function(state = initialState, action){
	switch(action.type){
		case APPOINTMENT_CANCEL:
			return {
				...state,
				msg_cancel: action.payload,
			};
		case APPOINTMENT_ACCEPT:
			return {
				...state,
				msg_appointment_accept: action.payload,
			};
		case APPOINTMENT_OUT:
			return {
				...state,
				msg_appointment_out: action.payload,
			};
		case APPOINTMENT_ALLOW_MSG:
			return {
				...state,
				msg_allow_state: action.payload,
			};
		case APPOINTMENT_ALLOW:
			return {
				...state,
				get_appointment_allow: action.payload,
			};

		case GET_APPOINTMENT_TYPE:
			return {
				...state,
				get_appointment_type: action.payload,
			};

		case APPOINTMENT_TYPE_CREATE:
			return {
				...state,
				msg_appointment_type: action.payload,
			};
		case RECENT_DOCUMENT:
			return {
				...state,
				get_recent_document: action.payload,
			};
		case APPOINTMENT_MONTH:
			return {
				...state,
				get_month: action.payload,
			};

		case GET_REPLY:
			return {
				...state,
				get_msg_result: action.payload,
			};

		case GET_FAIL:
			return {
				...state,
				msg_fail: action.payload,
			};

		case GET_CHATBOT:
			return {
				...state,
				chatbot_list: action.payload,
			};

		case CHATBOT_ADD:
			return {
				...state,
				get_one_chatbot: action.payload,
			};

		case CHATBOT_ADD_MESSAGE:
			return {
				...state,
				msg_add_chatbot: action.payload,
			};

		case CHATBOT_DELETE_MESSAGE:
			return {
				...state,
				msg_delete_chatbot: action.payload,
			};

		case CHATBOT_ERROR:
			return {
				...state,
				msg_error_chatbot: action.payload,
			};


		case CHATBOT_PAGE:
			return {
				...state,
				description_page: action.payload,
			};

		case APPOINTMENT_CLIENT_ALL:
			return {
				...state,
				appointmentClientList: action.payload,
			};

		case PROVIDERS_ID:
			return {
				...state,
				providersIdList: action.payload
			};

		case CLIENTS_ID:
			return {
				...state,
				clientsIdList: action.payload
			};

		case PROVIDER_INFO:
			return {
				...state,
				accountSimpleInfo: action.payload,
			};

		case PROVIDER_PHOTO:
			return {
				...state,
				providerPhotoInfo: action.payload,
			};

		case PROVIDER_FULL:
			return {
				...state,
				providerFullInfo: action.payload,
			};

		case USER_DELETE:
			return {
				...state,
				msg_deleteUser: action.payload
			};

		case SHOW_FORGOT_PASSWORD:
			return {
				...state,
				msg_forgot_password: action.payload
			};

		case LOGIN_PROVIDER:
			return {
				...state,
				msg_login: action.payload,
			};

		case SHOW_RESET_PASSWORD:
			return {
				...state,
				msg_reset_password: action.payload,
			};

		case PROVIDER_MUSIC_BACKGROUND:
			return {
				...state,
				backgroundImgMusic: action.payload
			};

		case REQUEST_ALL:
			return {
				...state,
				requestClientList: action.payload
			};

		case REQUEST_PROVIDER:
			return {
				...state,
				requestProvider: action.payload
			};

		case RECIPIENT_ALL:
			return {
				...state,
				recipientList: action.payload
			};

		case SENDER_ALL:
			return {
				...state,
				senderList: action.payload,
			};

		case REGISTER_PROVIDER:
			return {
				...state,
				registerProvider: action.payload,
			};

		case SHOW_SPINNING:
			return {
				...state,
				spinning: action.payload,
			};

		case POST_ARTICLE:
			return {
				...state,
				msg_article: action.payload,
			};

		case PUBLISHED_ALL:
			return {
				...state,
				publishedList: action.payload,
			};

		case ARTICLES_ALL:
			return {
				...state,
				articlesList: action.payload,
			};

		case ARTICLE_DETAILS:
			return {
				...state,
				articleDetails: action.payload,
			};
		case ARTICLE_DELETE:
			return {
				...state,
				msg_deleteArticle: action.payload,
			};
		case CATEGORY_LIST:
			return {
				...state,
				categoryList: action.payload,
			};

		case UPDATE_ARTICLE:
			return {
				...state,
				msg_updateArticle: action.payload,
			};
		case ARTICLE_DETAILS_DISPLAY:
			return {
				...state,
				articleDetailById: action.payload,
			};

		case CATEGORY_ADD:
			return {
				...state,
				msg_addCategory: action.payload,
			};
		case FILE_UPLOAD_ERROR:
			return {
				...state,
				msg_fileUpload: action.payload,
			};
		case FILE_UPLOAD:
			return {
				...state,
				fileUpload: action.payload,
			};
		case GET_COMMENT_BYID:
			return {
				...state,
				articleCommentById: action.payload,
			};
		case APPOINTMENT_PAID_ALL:
			return {
				...state,
				paidAppointmentList: action.payload,
			};
		case APPOINTMENT_REQUESTED_ALL:
			return {
				...state,
				requestedAppointmentList: action.payload,
			};
		case APPOINTMENT_EDIT:
			return {
				...state,
				msg_editAppointment: action.payload,
			};

		case APPOINTMENT_DELETE:
			return {
				...state,
				msg_deleteAppointment: action.payload,
			};

		case GET_REMINDERS_ALLOW:
			return {
				...state,
				get_reminder_allow: action.payload,
			};

		case SET_PRICING_PLANS:
			return {
				...state,
				pricing_plans: action.payload,
			};
		case SET_CURRENT_SUBSCRIPTION:
			return {
				...state,
				current_subscription: action.payload,
			};
		case SET_STRIPE_ACCOUNT_LINK:
			return {
				...state,
				account_link: action.payload,
			};

		case MESSAGES_LIST:
			return {
				...state,
				messageList: action.payload,
			};

		case MESSAGES_LIST_ERROR:
			return {
				...state,
				msg_messageList: action.payload,
			};

		case MESSAGES:
			return {
				...state,
				message: action.payload,
			};

		case CLIENT_CONNECTED:
			return {
				...state,
				connected_clients: action.payload,
			};

		case MESSAGES_EDIT:
			return {
				...state,
				getEdit: action.payload,
			};

		case MESSAGES_ONE_ERROR:
			return {
				...state,
				getEditError: action.payload,
			};

		case LAST_MESSAGES:
			return {
				...state,
				lastMessagesList: action.payload,
			};

		case USERS:
			return {
				...state,
				userList: action.payload,
			};

		case APPOINTMENT_GET:
			return {
				...state,
				getAppointment: action.payload,
			};

		case APPOINTMENT_CREATE:
			return {
				...state,
				msg_appointment: action.payload,
			};

		case APPOINTMENT_JOIN:
			return {
				...state,
				msg_join: action.payload,
			};

		case UPDATE_INFO:
			return {
				...state,
				msg_profile_update: action.payload,
			};

		case INVITE_USER:
			return {
				...state,
				msg_invitation: action.payload,
			};

		case APPOINTMENT_GROUPING:
			return {
				...state,
				appointmentGroupingList: action.payload,
			};

		case DRAG_UPDATE:
			return {
				...state,
				msg_dragUpdate: action.payload,
			};

		case GET_DRAG:
			return {
				...state,
				getDragLists: action.payload,
			};

		case INVOICE_UPDATE:
			return {
				...state,
				msg_invoice: action.payload,
			};

		case APPOINTMENT_ONE_ONE:
			return {
				...state,
				appointmentOneToOne: action.payload,
			};

		case INVITE:
			return {
				...state,
				msg_invite: action.payload,
			};

		case PRACTICE_LIST:
			return {
				...state,
				practiceList: action.payload,
			};

		case EMPTY_APPOINTMENT:
			return {
				...state,
				empty_appointment: action.payload,
			};

		case UPDATE_REMINDERS:
			return {
				...state,
				msg_setting: action.payload,
			};

		/**
		 * NOTE
		 */
		case GET_ONE_NOTE:
			return {
				...state,
				oneNote: action.payload,
			};

		case GET_NOTE:
			return {
				...state,
				getNote: action.payload,
			};

		case POST_NOTE:
			return {
				...state,
				msg_postNote: action.payload,
			};

		case UPDATE_NOTE:
			return {
				...state,
				msg_updateNote: action.payload,
			};

		case DELETE_NOTE:
			return {
				...state,
				msg_deleteNote: action.payload,
			};

		case SHARE_DOCUMENT:
			return {
				...state,
				msg_share: action.payload,
			};

		default:
			return state;
	}
}
