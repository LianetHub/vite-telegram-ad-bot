import Picker from "pickerjs";
import "pickerjs/dist/picker.css";

export class Timepicker {
	private element: HTMLElement;
	private picker: Picker | undefined;
	public hours: number[];
	public minutes: number[];

	constructor(element: HTMLElement) {
		this.element = element;
		this.hours = Array.from({ length: 24 }, (_, i) => i);
		this.minutes = Array.from({ length: 60 }, (_, i) => i);
		this.initPicker();
	}

	private initPicker() {
		if (!this.picker) {
			this.picker = new Picker(this.element, {
				format: "HH:mm",
				text: {
					title: "Выберите время",
					cancel: "Отмена",
					confirm: "ОК",
				},
				inline: true,
				controls: false,
				headers: false,
				rows: 3,
			});
		}
	}
}
