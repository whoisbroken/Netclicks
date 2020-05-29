const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = 'b12175e1d846bdbec1fa175242c1f9a3'

// Menu 

const leftMenu = document.querySelector(".left-menu"),
    hamburger = document.querySelector(".hamburger"),
    tvShows = document.querySelector('.tv-shows'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modal = document.querySelector('.modal'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';

// take data from db
class DBService {
    getData = async (url) => {
        const res = await fetch(url);

        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`)
        }
    }

    getTestData = async () => {
        return await this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = (query) => {
        return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`)
    }

    getTvShow = id => {
        return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }
};

// Render movie card

const renderCard = response => {
    tvShowsList.textContent = '';

    response.results.forEach(item => {

        const {
            backdrop_path: backdrop,
            poster_path: poster,
            vote_average: vote,
            name,
            id
        } = item;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');

        card.innerHTML = `
                <a href="#" id="${id}" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${name}">
                    <h4 class="tv-card__head">${name}</h4>
                </a>
        `

        loading.remove();
        tvShowsList.append(card);

    });
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
})

{
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
}

// Open/Close menu

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    const target = event.target;

    if (!target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
})

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
})

// Open Modal 

tvShowsList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card); {

        new DBService().getTvShow(card.id)
            .then(({ poster_path: posterPath, name, vote_average: voteAverage,
                     overview, homepage, genres }) => {

                tvCardImg.src = IMG_URL + posterPath;
                tvCardImg.alt = name;
                modalTitle.textContent = name;
                genresList.textContent = '';
                genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                })
                rating.textContent = voteAverage;
                description.textContent = overview;
                modalLink.href = homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })

    }
})

// Close Modal

modal.addEventListener('click', event => {
    const target = event.target;

    if (target.closest('.cross') ||
        target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
})


// Change Img

const changeImg = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        const changeImg = img.dataset.backdrop;
        if (changeImg) {
            img.dataset.backdrop = img.src;
            img.src = changeImg;
        }
    }

}

tvShowsList.addEventListener('mouseover', changeImg);
tvShowsList.addEventListener('mouseout', changeImg);