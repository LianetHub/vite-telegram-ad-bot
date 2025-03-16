export class SkeletonCardList {
	private count: number;

	constructor(count: number) {
		this.count = count;
	}

	render(): HTMLElement {
		const skeletonWrapper = document.createElement("div");
		skeletonWrapper.classList.add("cards");

		const skeletonContainer = document.createElement("div");
		skeletonContainer.classList.add("cards__container");

		for (let i = 0; i < this.count; i++) {
			skeletonContainer.appendChild(this.createSkeleton());
		}

		skeletonWrapper.appendChild(skeletonContainer);
		return skeletonWrapper;
	}

	private createSkeleton(): HTMLElement {
		const skeleton = document.createElement("div");
		skeleton.classList.add("card", "card-skeleton");
		skeleton.innerHTML = `
            <svg role="img" width="343" height="196" aria-labelledby="loading-aria" viewBox="0 0 343 196" preserveAspectRatio="none">
                <title id="loading-aria">Loading...</title>
                <rect x="0" y="0" width="100%" height="100%" clip-path="url(#clip-path)" style='fill: url("#fill");'></rect>
                <defs>
                    <clipPath id="clip-path">
                        <circle cx="42" cy="42" r="26" />
                        <rect x="78" y="21" rx="8" ry="8" width="200" height="21" />
                        <rect x="78" y="44" rx="8" ry="8" width="110" height="20" />
                        <rect x="16" y="88" rx="8" ry="8" width="200" height="20" />
                        <rect x="16" y="128" rx="12" ry="12" width="311" height="48" />
                    </clipPath>
                    <linearGradient id="fill">
                        <stop offset="0.599964" stop-color="#f3f3f3" stop-opacity="1">
                            <animate attributeName="offset" values="-2; -2; 1" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>
                        </stop>
                        <stop offset="1.59996" stop-color="#ecebeb" stop-opacity="1">
                            <animate attributeName="offset" values="-1; -1; 2" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>
                        </stop>
                        <stop offset="2.59996" stop-color="#f3f3f3" stop-opacity="1">
                            <animate attributeName="offset" values="0; 0; 3" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite"></animate>
                        </stop>
                    </linearGradient>
                </defs>
            </svg>
        `;
		return skeleton;
	}
}
