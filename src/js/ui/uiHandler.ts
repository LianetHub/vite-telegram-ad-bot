import { ClickHandler } from "./clickHandler";
import { ChangeHandler } from "./changeHandler";
import { EventEmitter } from "../store/EventEmitter";
import { RangeSlider } from "../components/RangeSlider";

export class UIHandler extends EventEmitter {
	private clickHandler: ClickHandler;
	private changeHandler: ChangeHandler;

	constructor() {
		super();
		this.clickHandler = new ClickHandler(this);
		this.changeHandler = new ChangeHandler(this);

		this.on("subMenuToggled", this.handleSubMenuToggled);
		this.on("categoriesToggled", this.handleCategoriesToggled);
		this.on("modalOpened", this.handleModalOpened);
		this.initApp();
	}

	private initApp() {
		document.querySelectorAll?.(".range")?.forEach((rangeSlider) => {
			new RangeSlider(rangeSlider as HTMLElement);
		});
	}

	private handleSubMenuToggled(addButton: HTMLElement) {
		console.log("Подменю переключено", addButton);
	}

	private handleCategoriesToggled(categoriesBtn: HTMLElement) {
		console.log("Категории переключены", categoriesBtn);
	}

	private handleModalOpened(modalLink: HTMLElement) {
		console.log("Модальное окно открыто", modalLink);
	}
}
