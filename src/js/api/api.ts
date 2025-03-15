import { request } from "../utils/request";
import { API_ENDPOINTS } from "./config";
import {
	SearchRequest,
	ApiResponse,
	ApiError,
	AvailableDatesRequest,
	AvailableDatesResponse,
	StartDatesRequest,
	StartDatesResponse,
	CheckAvailabilityRequest,
	CheckAvailabilityResponse,
} from "./types";

export const Api = {
	searchCatalog,
	getAvailableDates,
	getStartDates,
	checkAvailability,
};

async function searchCatalog(params: SearchRequest): Promise<ApiResponse | ApiError> {
	return request<ApiResponse>(API_ENDPOINTS.SEARCH_CATALOG, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
}

async function getAvailableDates(params: AvailableDatesRequest): Promise<AvailableDatesResponse | ApiError> {
	const queryString = new URLSearchParams({
		bot_id: params.bot_id.toString(),
		languages: params.languages,
		premium: params.premium.toString(),
	}).toString();

	return request<AvailableDatesResponse>(`${API_ENDPOINTS.AVAILABLE_DATES}?${queryString}`);
}

async function getStartDates(params: StartDatesRequest): Promise<StartDatesResponse | ApiError> {
	return request<StartDatesResponse>(API_ENDPOINTS.START_DATES, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
}

async function checkAvailability(params: CheckAvailabilityRequest): Promise<CheckAvailabilityResponse | ApiError> {
	return request<CheckAvailabilityResponse>(API_ENDPOINTS.CHECK_AVAILABILITY, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
}
