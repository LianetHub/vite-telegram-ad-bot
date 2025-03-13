import "./scss/style.scss";
// import { Home } from "./views/Home";
import { UIHandler } from "./js/ui";

// import { store } from "./js/store";

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
	// Логика работы с состоянием
	// const currentState = store.getState();

	// const homePage = new Home("app");
	// homePage.fetchData();

	// init UI
	new UIHandler();
});
