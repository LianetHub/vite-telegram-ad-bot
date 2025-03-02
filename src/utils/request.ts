import { API_BASE_URL } from "../js/config";
import { ApiError } from "../js/types";

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | ApiError> {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

		if (!response.ok) {
			return { status: "error", error: `Ошибка запроса: ${response.statusText}` };
		}

		return response.json();
	} catch (error) {
		return { status: "error", error: "Ошибка сети или сервера" };
	}
}
