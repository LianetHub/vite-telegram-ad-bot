import { EventEmitter } from "../store/EventEmitter";

export class Modal {
	private openModals: HTMLElement[] = [];

	constructor(private eventEmitter: EventEmitter) {
		this.initEventListeners();
	}

	private initEventListeners() {
		document.addEventListener("click", (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (!target) return;

			const modalLink = target.closest("[data-modal]") as HTMLElement | null;
			if (modalLink) {
				this.openModal(modalLink);
				this.eventEmitter.emit("modal:opened", modalLink);
			}

			const closeModalButton = target.closest("[data-modal-close]") as HTMLElement | null;
			if (closeModalButton) {
				this.closeModal();
				this.eventEmitter.emit("modal:closed", closeModalButton);
			}

			const modal = target.closest(".modal") as HTMLElement | null;
			if (modal && !target.closest(".modal__wrapper")) {
				this.closeModal();
				this.eventEmitter.emit("modal:closed", modal);
			}
		});
	}

	public openModal(link: HTMLElement | string) {
		let modalId: string | undefined;

		if (typeof link === "string") {
			modalId = link.replace("#", "");
		} else {
			modalId = link.getAttribute("href")?.replace("#", "");
		}

		if (!modalId) return;

		const modal = document.getElementById(modalId);
		if (modal && !this.openModals.includes(modal)) {
			this.openModals.push(modal);
			modal.classList.add("active");
			modal.style.zIndex = `${1000 + this.openModals.length}`;
			document.body.classList.add("lock");
		}
	}

	public closeModal() {
		if (this.openModals.length === 0) return;

		const lastModal = this.openModals.pop();
		if (lastModal) {
			lastModal.classList.remove("active");
			lastModal.style.zIndex = "";
		}

		if (this.openModals.length === 0) {
			document.body.classList.remove("lock");
		}
	}
}
