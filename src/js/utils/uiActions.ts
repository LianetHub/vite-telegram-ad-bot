export function toggleSubMenu(addButton: HTMLElement) {
	addButton.classList.toggle("active");
	const sortElement = document.querySelector(".header__sort") as HTMLElement | null;
	sortElement?.classList.toggle("active");
}

export function toggleCategories() {
	const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
	wrapper?.classList.toggle("open-categories");
	document.body.classList.toggle("lock");
}

export function hideCategories() {
	const wrapper = document.querySelector(".header__bottom") as HTMLElement | null;
	wrapper?.classList.remove("open-categories");
	document.body.classList.remove("lock");
}

export function createRippleEffect(button: HTMLElement, event: MouseEvent) {
	const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

	const ripple = document.createElement("span");
	ripple.classList.add("ripple");

	const rect = button.getBoundingClientRect();
	const size = Math.max(rect.width, rect.height);
	ripple.style.width = ripple.style.height = `${size}px`;

	const x = (event.clientX - rect.left - size / 2) / rootFontSize;
	const y = (event.clientY - rect.top - size / 2) / rootFontSize;
	ripple.style.left = `${x}rem`;
	ripple.style.top = `${y}rem`;

	button.appendChild(ripple);

	setTimeout(() => {
		ripple.remove();
	}, 600);
}

export function openModal(link: HTMLElement) {
	const modalId = link.getAttribute("href")?.replace("#", "");
	if (!modalId) return;

	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.add("active");
		document.body.classList.add("lock");
	}
}

export function closeModal() {
	const modal = document.querySelector(".modal.active") as HTMLElement | null;
	if (modal) {
		modal.classList.remove("active");
		document.body.classList.remove("lock");
	}
}

export function updateCheckboxQuantity(element: HTMLElement, callback?: (count: number) => void) {
	const checkboxes = document.querySelectorAll<HTMLInputElement>('input[name="' + element.getAttribute("data-name") + '"]');
	const checkedCount = Array.from(checkboxes).filter((checkbox) => checkbox.checked).length;

	element.innerText = checkedCount.toString();

	if (callback) {
		callback(checkedCount);
	}
}

export function categoriesUIUpdate(count: number) {
	if (count > 0) {
		document.querySelector(".header__categories-btn")?.classList.add("has-quantity");
		document.querySelector(".header__categories-reset")?.classList.add("visible");
	} else {
		document.querySelector(".header__categories-btn")?.classList.remove("has-quantity");
		document.querySelector(".header__categories-reset")?.classList.remove("visible");
	}
}

export function languageUIUpdate(count: number) {
	console.log(`Количество выбранных языков: ${count}`);
	const languageWrapper = document.querySelector(".language") as HTMLElement;
	if (count > 0) {
		document.querySelector("[data-language-submit]")?.classList.remove("hide");
		languageWrapper?.classList.add("language-selected");
	} else {
		document.querySelector("[data-language-submit]")?.classList.add("hide");
		languageWrapper?.classList.remove("language-selected");
	}
}

export function toggleResetSearchBtn(query: string) {
	const resetSearchBtn = document.querySelector(".header__search-reset") as HTMLElement;
	if (query.length > 0) {
		resetSearchBtn?.classList.add("visible");
	} else {
		resetSearchBtn?.classList.remove("visible");
	}
}

export function handleSegmentedChange(controls: HTMLElement, value: string) {
	const buttons = controls?.querySelectorAll(".segmented-controls__item") as NodeListOf<HTMLElement>;
	const runner = controls?.querySelector(".segmented-controls__runner") as HTMLElement;

	let activeIndex = 0;

	buttons.forEach((button, index) => {
		const input = button.querySelector("input") as HTMLInputElement;
		if (input && input.value === value) {
			activeIndex = index;
		}
	});

	if (buttons.length > 0 && runner) {
		const activeButton = buttons[activeIndex];

		buttons.forEach((button) => {
			button.classList.remove("active");
		});

		activeButton.classList.add("active");
		runner.style.left = `${activeIndex * 50}%`;
	}
}
