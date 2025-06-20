export type LanguageCode =
	| "en"
	| "ru"
	| "ar"
	| "be"
	| "ca"
	| "hr"
	| "cs"
	| "nl"
	| "fi"
	| "fr"
	| "de"
	| "he"
	| "hu"
	| "id"
	| "it"
	| "kk"
	| "ko"
	| "ms"
	| "nb"
	| "fa"
	| "pl"
	| "pt-BR"
	| "sr"
	| "sk"
	| "es"
	| "sv"
	| "tr"
	| "uk"
	| "uz";

export type SortBy = "cheapest_first" | "most_expensive_first" | "most_users_first" | "fewest_users_first";
export type WeeklySends = "none" | "one" | "two" | "three" | "four" | "five" | "six" | "seven_or_more";
export type MonthlyGrowth = "positive" | "negative";
export type PriceType = "total" | "per_100k";

export type Category =
	| "Downloads"
	| "Dating"
	| "Neural Networks"
	| "Voices"
	| "Movies"
	| "Music"
	| "Books"
	| "Games"
	| "Finance"
	| "Business"
	| "Cryptocurrency"
	| "Surveys"
	| "Food and Drinks"
	| "Horoscopes"
	| "Fonts"
	| "Entertainment"
	| "Medicine"
	| "Education"
	| "Applications"
	| "APK and Files"
	| "Sports"
	| "Administration";

export type CardProps = {
	id: number;
	name: string;
	username: string;
	photo_url: string;
	users_per_lang: Record<LanguageCode, { count: number }>;
	total_users: number;
	total_price: number;
	currency: string;
	next_available_date: number;
};

export interface FiltersData {
	static: {
		categories: string[];
		languages: Record<string, { premium: boolean }>;
		price_total: MinMaxPrice;
		users_count: MinMaxPrice;
		price_per_100k: MinMaxPrice;
	};
	dynamic: {};
}

interface MinMaxPrice {
	min: PriceDetails;
	max: PriceDetails;
}

export interface PriceDetails {
	premium: number;
	non_premium: number;
}

export interface ApiError {
	status: "error";
	error: string;
}

export interface SearchRequest {
	languages?: string;
	premium?: boolean;
	price_type?: PriceType;
	price_min?: number;
	price_max?: number;
	dates?: string[];
	users_min?: number;
	users_max?: number;
	sort_by?: SortBy;
	weekly_sends?: WeeklySends;
	monthly_growth?: MonthlyGrowth;
	categories?: string;
	search?: string;
	limit?: number;
	offset?: number;
}

export interface ApiResponse {
	status: "success";
	data: CardProps[];
	total: number;
	filters_data: FiltersData;
}

export interface AvailableDatesRequest {
	bot_id: number;
	languages: string;
	premium: boolean;
}

export interface AvailableDatesResponse {
	status: "success";
	data: { available_dates: number[] };
}

export interface StartDatesRequest {
	bot_id: number;
	languages: string[];
	dates: string[];
	premium: boolean;
}

export interface StartDatesResponse {
	status: "success";
	data: { start_dates: number[] };
}

export interface CheckAvailabilityRequest {
	bot_id: number;
	languages: string[];
	dates: string[];
	premium: boolean;
}

export interface CheckAvailabilityResponse {
	status: "success";
	data: { availability: Record<string, boolean> };
}
