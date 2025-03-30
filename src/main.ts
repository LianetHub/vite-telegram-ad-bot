import "./scss/style.scss";
import { UIHandler } from "./js/ui";

import { store } from "./js/store/store";

document.addEventListener("DOMContentLoaded", () => {
	new UIHandler();
	store.fetchCards().then(() => {
		document.body.classList.add("init-app");
	});
});
