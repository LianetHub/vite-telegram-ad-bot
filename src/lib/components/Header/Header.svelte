<header class="header">
	<div class="header__container">
		<div class="header__top">
			<a href="#select-language" data-modal class="header__users btn btn-primary btn-sm">
				<span class="btn__text">
					<span class="btn__icon">
						<span class="btn__icon-globe">
							<svg>
								<use xlink:href="/img/sprite.svg#icon-language"></use>
							</svg>
						</span>
						<span class="btn__icon-crown">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
							>
								<g clip-path="url(#clip0_17009_760)">
									<path
										opacity="0.2"
										d="M14.6765 17.8564H5.32349C3.46733 17.8564 1.90401 16.4692 1.68322 14.6262L0.841296 7.59841C0.735174 6.71259 1.71426 6.10805 2.4587 6.59975L4.03309 7.63964C5.10487 8.34756 6.5555 7.93314 7.09158 6.76588L8.8865 2.85759C9.08632 2.4225 9.52125 2.14365 10 2.14365C10.4788 2.14365 10.9137 2.4225 11.1135 2.85759L12.9085 6.76588C13.4446 7.93313 14.8952 8.34756 15.967 7.63964L17.5413 6.59976C18.2858 6.10806 19.2649 6.7126 19.1587 7.59843L18.3168 14.6262C18.096 16.4692 16.5326 17.8564 14.6765 17.8564Z"
										fill="url(#paint0_linear_17009_760)"
									/>
									<path
										d="M14.6765 17.8564H5.32349C3.46733 17.8564 1.90401 16.4692 1.68322 14.6262L0.841296 7.59841C0.735174 6.71259 1.71426 6.10805 2.4587 6.59975L4.03309 7.63964C5.10487 8.34756 6.5555 7.93314 7.09158 6.76588L8.8865 2.85759C9.08632 2.4225 9.52125 2.14365 10 2.14365C10.4788 2.14365 10.9137 2.4225 11.1135 2.85759L12.9085 6.76588C13.4446 7.93313 14.8952 8.34756 15.967 7.63964L17.5413 6.59976C18.2858 6.10806 19.2649 6.7126 19.1587 7.59843L18.3168 14.6262C18.096 16.4692 16.5326 17.8564 14.6765 17.8564Z"
										stroke="white"
										stroke-width="1.8"
									/>
									<path
										d="M10 11.5713V14.19"
										stroke="white"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
								</g>
								<defs>
									<linearGradient
										id="paint0_linear_17009_760"
										x1="10"
										y1="2.14365"
										x2="10"
										y2="17.8564"
										gradientUnits="userSpaceOnUse"
									>
										<stop stop-color="white" stop-opacity="0.1" />
										<stop offset="0.2" stop-color="white" stop-opacity="0.5" />
										<stop offset="0.5" stop-color="white" stop-opacity="0.9" />
									</linearGradient>
									<clipPath id="clip0_17009_760">
										<rect width="20" height="20" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</span>
					</span>
					<span class="btn__flag hidden"></span>
					<span class="btn__text-body"> Все пользователи </span>
				</span>
				<span class="btn__side">
					<span class="btn__quantity hidden"></span>
					<svg class="btn__icon-down">
						<use xlink:href="/img/sprite.svg#icon-chevron-down"></use>
					</svg>
				</span>
			</a>
			<button type="button" class="header__add btn-secondary btn-icon"></button>
		</div>
		<div class="header__sort">
			<a
				href="#select-price"
				data-modal
				data-prices-toggler
				class="header__sort-btn btn-secondary btn-sm"
			>
				<span class="btn__hint caption-lg color-secondary hidden">100k</span>
				<span class="btn__value">Цена</span>
				<span class="btn__icon-down">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-chevron-down"></use>
					</svg>
				</span>
				<span class="btn__reset">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-cross"></use>
					</svg>
				</span>
			</a>
			<a
				href="#select-date"
				data-modal
				data-date-toggler
				class="header__sort-btn btn-secondary btn-sm"
			>
				<span class="btn__value">Дата</span>
				<span class="btn__icon-down">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-chevron-down"></use>
					</svg>
				</span>
				<span class="btn__reset">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-cross"></use>
					</svg>
				</span>
			</a>
			<a
				href="#select-users"
				data-modal
				data-users-toggler
				class="header__sort-btn btn-secondary btn-sm"
			>
				<span class="btn__value">Количество пользователей</span>
				<span class="btn__icon-down">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-chevron-down"></use>
					</svg>
				</span>
				<span class="btn__reset">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-cross"></use>
					</svg>
				</span>
			</a>
		</div>
		<div class="header__bottom">
			<div class="header__filter">
				<a href="#filter" data-modal class="header__filter-btn btn btn-white btn-icon btn-xs">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-filter"></use>
					</svg>
				</a>
			</div>
			<div class="header__categories">
				<button type="button" class="header__categories-btn btn btn-white btn-xs">
					Категории
					<span class="header__categories-btn-actions">
						<span class="header__categories-down">
							<svg>
								<use xlink:href="/img/sprite.svg#icon-chevron-down"></use>
							</svg>
						</span>
						<span
							class="header__categories-quantity"
							data-categories-quantity
							data-name="categories">0</span
						>
					</span>
				</button>
				<div class="header__categories-body">
					<div class="header__categories-list">
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Downloads"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Скачивания</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Dating"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Знакомства</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Neural Networks"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Нейросети</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Voices"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Войсы</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Movies"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Фильмы</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Music"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Музыка</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Books"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Книги</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Games"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Игры</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Finance"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Финансы</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Business"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Бизнес</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Cryptocurrency"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Криптовалюта</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Surveys"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Опросы</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Food and Drinks"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Еда и напитки</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Horoscopes"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Гороскопы</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Fonts"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Шрифты</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Entertainment"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Развлечения</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Medicine"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Медицина</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Education"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Образование</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Applications"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Приложения</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="APK and Files"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">APK и файлы</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Sports"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Спорт</span>
						</label>
						<label class="header__categories-item input-label">
							<input
								type="checkbox"
								name="categories"
								value="Administration"
								class="input-label__control hidden"
								hidden
							/>
							<span class="input-label__field">Администрирование</span>
						</label>
					</div>
					<button
						type="button"
						data-categories-reset
						class="header__categories-reset btn btn-primary btn-icon btn-rounded btn-sm"
					>
						<svg>
							<use xlink:href="img/sprite.svg#icon-clear"></use>
						</svg>
					</button>
				</div>
			</div>
			<div class="header__search">
				<button type="button" class="header__search-back btn btn-white btn-icon btn-xs">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-arrow-left"></use>
					</svg>
				</button>
				<input
					type="text"
					name="search"
					class="form__control"
					inputmode="text"
					enterkeyhint="search"
					placeholder="Поиск"
				/>
				<button type="button" class="header__search-btn btn btn-white btn-icon btn-xs">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-search"></use>
					</svg>
				</button>
				<button type="button" class="header__search-reset btn">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-cross"></use>
					</svg>
				</button>
				<button type="button" class="header__categories-close btn btn-icon btn-white btn-xs">
					<svg>
						<use xlink:href="/img/sprite.svg#icon-cross"></use>
					</svg>
				</button>
				<div class="header__search-body">
					<div class="picture">
						<img src="/img/duck/lupe.gif" alt="Duck" />
					</div>
					<span class="headline fw-semibold color-secondary">Нет результатов</span>
				</div>
			</div>
		</div>
	</div>
</header>
