import { API_BASE_URL } from "../api/config";
import { ApiError } from "../api/types";

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | ApiError> {
	try {
		const url = `${API_BASE_URL}${endpoint}`;
		// console.log(`Запрос: ${url}`, options);

		const response = await fetch(url, options);

		const responseBody = await response.text();
		let parsedBody;
		try {
			parsedBody = JSON.parse(responseBody);
		} catch {
			parsedBody = responseBody;
		}

		if (!response.ok) {
			console.error(`Ошибка запроса (${response.status}):`, parsedBody);
			return { status: "error", error: parsedBody || `Ошибка запроса: ${response.statusText}` };
		}

		return parsedBody;
	} catch (error) {
		console.error("Ошибка сети или сервера:", error);
		return { status: "error", error: "Ошибка сети или сервера" };
	}
}
