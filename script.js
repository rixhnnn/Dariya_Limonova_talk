const videoSrc = "img/489439949.webm";
const grid = document.querySelector(".background-grid");
const dog = document.querySelector(".dog");
const speechBubble = document.querySelector(".speech-bubble");
const phrases = [
    "Пошли на хуй, бабки ебаные",
    "Продавец КФС",
    "Дырявый",
    "Кирилл Дырявый",
    "Овервотч хуйня ебаная",
    "Го на забив",
    "Не дай Бох такое",
    "Сын унитаза",
    "ЕБЕМ ДЕТЕЙ",
    "Раздеть уебка",
    "Большой хуй, большие яица",
];

let speechTimer;
let phraseIndex = 0;
let lastPhrase = "";

function buildGrid() {
    const total = 4;
    grid.innerHTML = "";

    for (let i = 0; i < total; i += 1) {
        const video = document.createElement("video");
        video.src = videoSrc;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";
        grid.appendChild(video);
    }
}

buildGrid();

function getNextPhrase() {
    if (phraseIndex < phrases.length) {
        const phrase = phrases[phraseIndex];
        phraseIndex += 1;
        lastPhrase = phrase;
        return phrase;
    }

    if (phrases.length <= 1) {
        return phrases[0] || "";
    }

    let phrase = "";

    do {
        phrase = phrases[Math.floor(Math.random() * phrases.length)];
    } while (phrase === lastPhrase);

    lastPhrase = phrase;
    return phrase;
}

function showNextPhrase(event) {
    if (event) {
        event.preventDefault();
    }

    const phrase = getNextPhrase();

    speechBubble.textContent = phrase;
    speechBubble.classList.remove("is-visible");
    dog.classList.remove("is-talking");

    speechBubble.offsetWidth;

    speechBubble.classList.add("is-visible");
    dog.classList.add("is-talking");

    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
        speechBubble.classList.remove("is-visible");
        dog.classList.remove("is-talking");
    }, 2200);
}

if (window.PointerEvent) {
    dog.addEventListener("pointerup", showNextPhrase);
    dog.addEventListener("click", (event) => {
        if (event.detail === 0) {
            showNextPhrase(event);
        }
    });
} else {
    dog.addEventListener("click", showNextPhrase);
}
