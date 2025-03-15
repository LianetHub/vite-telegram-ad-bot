export function toggleSubMenu(addButton: HTMLElement) {
	addButton.classList.toggle("active");
	const sortElement = document.querySelector(".header__sort") as HTMLElement | null;
	sortElement?.classList.toggle("active");
}

export function toggleCategories(categoriesBtn: HTMLElement, body: HTMLElement) {
	categoriesBtn.classList.toggle("active");
	const categoriesBody = document.querySelector(".header__categories-body") as HTMLElement | null;
	categoriesBody?.classList.toggle("active");
	body.classList.toggle("lock");
}

export function resetCategories() {
	document.querySelectorAll<HTMLInputElement>(".header__categories-checkbox").forEach((checkbox) => {
		checkbox.checked = false;
	});
	updateCheckboxQuantity(document.querySelector(".header__categories-quantity") as HTMLElement);
	categoriesUIUpdate(0);
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
	console.log(`Количество выбранных категорий: ${count}`);
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
	if (count > 0) {
		document.querySelector("[data-language-submit]")?.classList.remove("hide");
	} else {
		document.querySelector("[data-language-submit]")?.classList.add("hide");
	}
}
