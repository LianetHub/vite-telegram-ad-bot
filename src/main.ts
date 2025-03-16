import "./scss/style.scss";
import { UIHandler } from "./js/ui/uiHandler";
import { store } from "./js/store/store";

document.addEventListener("DOMContentLoaded", () => {
	new UIHandler();
	store.fetchCards();
});
