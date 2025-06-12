import "./scss/style.scss";
import { UIHandler } from "./js/ui";

import { store } from "./js/store/store";

window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
document.addEventListener("DOMContentLoaded", () => {
	new UIHandler();
	console.log("Изначальный запрос");

	store.fetchCards().then(() => {
		setTimeout(() => {
			document.body.classList.add("init-app");
		}, 300);
	});
});
