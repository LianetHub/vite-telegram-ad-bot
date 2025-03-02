import "./scss/style.scss";
import { Home } from "./views/Home";

// import { store } from "./js/store";

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
	// Логика работы с состоянием
	// const currentState = store.getState();

	const homePage = new Home("app");
	homePage.fetchData();

	// click handler
	document.addEventListener("click", (e: MouseEvent) => {
		const { target } = e as any;

		if (!(target instanceof HTMLElement)) return;

		if (target.closest(".header__add")) {
			target.closest(".header__add").classList.toggle("active");
			document.querySelector(".header__sort")?.classList.toggle("active");
		}
	});
});
