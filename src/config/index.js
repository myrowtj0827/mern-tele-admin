export default {
	// SIM_API_URL: "/api/",
	// FRONT_URL: 'http://teletherapist.ml',
	// CLIENT_URL: 'https://client.teletherapist.ml',
	// PROVIDER_URL: 'https://provider.teletherapist.ml',

	SIM_API_URL: "http://127.0.0.1:7000/",
	FRONT_URL: 'http://localhost:3000',
	CLIENT_URL: 'http://localhost:3001',
	PROVIDER_URL: 'http://localhost:3002',

	WEBRTC_HOST: "https://meet.jit.si",

	STRIPE_PK: 'pk_test_51HYzu8Il7iWn5tibT3fvisliv3AHPy5m6XVdSJehDJ1KpmZ9kJCUbq2F1Oaoi0FyetIGyBt1ij1QZMu0JBn04L4a00fHROHiQL',
	STRIPE_PLANS_ID_TO_NAME: {
		price_1HbRxAIl7iWn5tibgRgsGc6E: 'month_individual_basic',
		price_1HbS8QIl7iWn5tibcYiOymEW: 'month_individual_plus',
		price_1HbS9kIl7iWn5tibC1jZxvnw: 'month_individual_ultimate',
		price_1HbSGSIl7iWn5tib4ODvtjfE: 'year_individual_basic',
		price_1HbSBtIl7iWn5tib7XZj91hU: 'year_individual_plus',
		price_1HbSAIIl7iWn5tibmgqq1hIa: 'year_individual_ultimate',
	},
	STRIPE_PLANS_NAME_TO_ID: {
		month_individual_basic: 'price_1HbRxAIl7iWn5tibgRgsGc6E',
		month_individual_plus: 'price_1HbS8QIl7iWn5tibcYiOymEW',
		month_individual_ultimate: 'price_1HbS9kIl7iWn5tibC1jZxvnw',
		year_individual_basic: 'price_1HbSGSIl7iWn5tib4ODvtjfE',
		year_individual_plus: 'price_1HbSBtIl7iWn5tib7XZj91hU',
		year_individual_ultimate: 'price_1HbSAIIl7iWn5tibmgqq1hIa',
	},
};
