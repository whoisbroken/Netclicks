const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'b12175e1d846bdbec1fa175242c1f9a3'
// Menu 

const leftMenu = document.querySelector(".left-menu");
const hamburger = document.querySelector(".hamburger");
const tvShows = document.querySelector('.tv-shows');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

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
};

// Render movie card

const renderCard = response => {

    tvShowsList.textContent = '';

    response.results.forEach( item => {

        const {
            backdrop_path: backdrop,
            poster_path: poster,
            vote_average: vote,
            name
        } = item;
        
        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote > 0 ? `<span class="tv-card__vote">${vote}</span>` : `<span></span>`;
        
        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        
        card.innerHTML = `
                <a href="#" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        data-backdrop="${backdropIMG}"
                        alt="${name}">
                    <h4 class="tv-card__head">${name}</h4>
                </a>
        `

        tvShowsList.append(card);

    });
};

new DBService().getTestData().then(renderCard);

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

    if (card);
    document.body.style.overflow = 'hidden';
    modal.classList.remove('hide');
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