const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";

// Menu

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvShows = document.querySelector(".tv-shows"),
  tvShowsList = document.querySelector(".tv-shows__list"),
  tvCardImg = document.querySelector(".tv-card__img"),
  modal = document.querySelector(".modal"),
  modalTitle = document.querySelector(".modal__title"),
  genresList = document.querySelector(".genres-list"),
  rating = document.querySelector(".rating"),
  description = document.querySelector(".description"),
  modalLink = document.querySelector(".modal__link"),
  searchForm = document.querySelector(".search__form"),
  searchFormInput = document.querySelector(".search__form-input"),
  preloader = document.querySelector(".preloader"),
  dropdown = document.querySelectorAll(".dropdown"),
  tvShowsHead = document.querySelector(".tv-shows__head"),
  modalContent = document.querySelector(".modal__content"),
  pagination = document.querySelector(".pagination"),
  posterWrapper = document.querySelector(".poster__wrapper"),
  trailerTitle = document.querySelector(".trailer-title"),
  trailer = document.querySelector(".trailer");

const loading = document.createElement("div");
loading.className = "loading";

// take data from db
class DBService {
  constructor() {
    this.SERVER = "https://api.themoviedb.org/3";
    this.API_KEY = "b12175e1d846bdbec1fa175242c1f9a3";
  }

  getData = async (url) => {
    const res = await fetch(url);

    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`);
    }
  };

  getTestData = async () => {
    return await this.getData("test.json");
  };

  getTestCard = () => {
    return this.getData("card.json");
  };

  getSearchResult = (query) => {
    this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru-RU`;
    return this.getData(this.temp);
  };

  getPage = (page) => {
    return this.getData(`${this.temp}&page=${page}`);
  };

  getTvShow = (id) => {
    return this.getData(
      `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`
    );
  };

  getTopRated = () =>
    this.getData(
      `${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`
    );

  getPopular = () =>
    this.getData(
      `${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`
    );

  getToday = () =>
    this.getData(
      `${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`
    );

  getWeek = () =>
    this.getData(
      `${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`
    );

  getVideo = (id) => {
    return this.getData(
      `${this.SERVER}/tv/${id}/videos?api_key=${this.API_KEY}&language=ru-RU`
    );
  };
}

const dbService = new DBService();

// Render movie card

const renderCard = (response, target) => {
  tvShowsList.textContent = "";

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent =
      "К сожалению по вашему запросу ничего не найдено...";
    tvShowsHead.style.color = "red";
    return;
  }

  tvShowsHead.textContent = target ? target.textContent : "Результат поиска:";
  tvShowsHead.style.color = "#000000";

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      poster_path: poster,
      vote_average: vote,
      name,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "img/no-poster.jpg";
    const backdropIMG = backdrop ? IMG_URL + backdrop : "";
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

    const card = document.createElement("li");
    card.classList.add("tv-shows__item");

    card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${name}">
                    <h4 class="tv-card__head">${name}</h4>
                </a>
        `;

    loading.remove();
    tvShowsList.append(card);
  });

  pagination.textContent = "";

  if (!target && response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    }
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();

  if (value) {
    tvShows.append(loading);
    dbService.getSearchResult(value).then(renderCard);
  }
  searchFormInput.value = "";
});

// Open/Close menu

const closeDropdown = () => {
  dropdown.forEach((item) => {
    item.classList.remove("active");
  });
};

hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
  closeDropdown();
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
    closeDropdown();
  }
});

leftMenu.addEventListener("click", (event) => {
  const target = event.target;
  const dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }

  if (target.closest("#top-rated")) {
    tvShows.append(loading);
    dbService.getTopRated().then((response) => renderCard(response, target));
  }

  if (target.closest("#popular")) {
    tvShows.append(loading);
    dbService.getPopular().then((response) => renderCard(response, target));
  }

  if (target.closest("#today")) {
    tvShows.append(loading);
    dbService.getToday().then((response) => renderCard(response, target));
  }

  if (target.closest("#week")) {
    tvShows.append(loading);
    dbService.getWeek().then((response) => renderCard(response, target));
  }

  if (target.closest("#search")) {
    tvShowsList.textContent = "";
    tvShowsHead.textContent = "";
    pagination.textContent = "";
  }
});

// Open Modal

tvShowsList.addEventListener("click", (event) => {
  event.preventDefault();

  const target = event.target;
  const card = target.closest(".tv-card");

  if (card) {
    preloader.style.display = "flex";

    dbService
      .getTvShow(card.id)
      .then(
        ({
          poster_path: posterPath,
          name,
          vote_average: voteAverage,
          overview,
          homepage,
          genres,
          id
        }) => {
          if (posterPath) {
            tvCardImg.src = IMG_URL + posterPath;
            tvCardImg.alt = name;
            posterWrapper.style.display = "";
            modalContent.style.paddingLeft = "";
          } else {
            posterWrapper.style.display = "none";
            modalContent.style.paddingLeft = "25px";
          }

          modalTitle.textContent = name;
          genresList.textContent = "";
          genres.forEach((item) => {
            genresList.innerHTML += `<li>${item.name}</li>`;
          });
          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
          return id;
        }
      )
      .then(dbService.getVideo)
      .then((response) => {
          console.log(response)
        trailerTitle.classList.add('hide');
        trailer.textContent = "";
        if (response.results.length) {
          trailerTitle.classList.remove('hide');
          response.results.forEach(item => {
            const trailerItem = document.createElement('li');

            trailerItem.innerHTML = `
                <iframe 
                    width="400" 
                    height="300" 
                    src="https://www.youtube.com/embed/${item.key}" 
                    frameborder="0"
                    allowfullscreen>
                </iframe>
                <h4>${item.name}</h4>
            `;

            trailer.append(trailerItem);
          });
        }
      })
      .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      })
      .finally(() => {
        preloader.style.display = "";
      });
  }
});

// Close Modal

modal.addEventListener("click", (event) => {
  const target = event.target;

  if (target.closest(".cross") || target.classList.contains("modal")) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
});

// Change Img

const changeImg = (event) => {
  const card = event.target.closest(".tv-shows__item");

  if (card) {
    const img = card.querySelector(".tv-card__img");
    const changeImg = img.dataset.backdrop;
    if (changeImg) {
      img.dataset.backdrop = img.src;
      img.src = changeImg;
    }
  }
};

tvShowsList.addEventListener("mouseover", changeImg);
tvShowsList.addEventListener("mouseout", changeImg);

pagination.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target;

  if (target.classList.contains("pages")) {
    tvShows.append(loading);
    dbService.getPage(target.textContent).then(renderCard);
  }
});
