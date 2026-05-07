const videoSrc = "img/489439949.webm";
const imageFallbackSrc = "img/23b58c78-f46c-4e20-b72d-7c0462338ee8.png";
const grid = document.querySelector(".background-grid");
const dog = document.querySelector(".dog");
const speechBubble = document.querySelector(".speech-bubble");
const rocketLayer = document.querySelector(".rocket-layer");
const littlePerson = document.querySelector(".little-person");
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
let rocketTimer;
let rocketCleanupTimer;
let finalEffectTimer;
let phraseIndex = 0;
let isRocketSequence = false;
let lastInteractionTime = 0;

function canPlayWebm() {
    const testVideo = document.createElement("video");
    return Boolean(
        testVideo.canPlayType("video/webm")
        || testVideo.canPlayType('video/webm; codecs="vp8, vorbis"')
        || testVideo.canPlayType('video/webm; codecs="vp9"')
    );
}

function buildGrid() {
    const total = 4;
    const useVideo = canPlayWebm();
    grid.innerHTML = "";

    for (let i = 0; i < total; i += 1) {
        if (!useVideo) {
            const img = document.createElement("img");
            img.src = imageFallbackSrc;
            img.alt = "";
            grid.appendChild(img);
            continue;
        }

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
    const phrase = phrases[phraseIndex] || "";
    const isLastPhrase = phraseIndex === phrases.length - 1;

    phraseIndex = (phraseIndex + 1) % phrases.length;
    return { phrase, isLastPhrase };
}

function launchRocket() {
    clearTimeout(rocketTimer);
    clearTimeout(rocketCleanupTimer);
    rocketLayer.innerHTML = "";
    rocketLayer.offsetWidth;
    rocketLayer.classList.add("is-active");
    littlePerson.classList.add("is-surprised");
    rocketLayer.innerHTML = `
        <div class="rocket">
            <span class="rocket-symbol"></span>
        </div>
    `;

    rocketTimer = setTimeout(() => {
        rocketLayer.innerHTML = '<div class="explosion"></div>';
        littlePerson.classList.remove("is-surprised");
        littlePerson.classList.add("is-fallen");
    }, 1120);

    rocketCleanupTimer = setTimeout(() => {
        rocketLayer.innerHTML = "";
        rocketLayer.classList.remove("is-active");
        littlePerson.classList.remove("is-surprised");
        littlePerson.classList.remove("is-fallen");
        isRocketSequence = false;
        dog.disabled = false;
    }, 2100);
}

function showNextPhrase(event) {
    if (event) {
        event.preventDefault();
    }

    const now = Date.now();

    if (now - lastInteractionTime < 180) {
        return;
    }

    lastInteractionTime = now;

    if (isRocketSequence) {
        return;
    }

    const { phrase, isLastPhrase } = getNextPhrase();

    speechBubble.textContent = phrase;
    speechBubble.classList.remove("is-visible");
    dog.classList.remove("is-talking");

    speechBubble.offsetWidth;

    speechBubble.classList.add("is-visible");
    dog.classList.add("is-talking");

    if (isLastPhrase) {
        isRocketSequence = true;
        dog.disabled = true;
        clearTimeout(finalEffectTimer);
        finalEffectTimer = setTimeout(() => {
            speechBubble.classList.remove("is-visible");
            dog.classList.remove("is-talking");
            launchRocket();
        }, 900);
    }

    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
        speechBubble.classList.remove("is-visible");
        dog.classList.remove("is-talking");
    }, 2200);
}

dog.addEventListener("pointerup", showNextPhrase);
dog.addEventListener("touchend", showNextPhrase, { passive: false });
dog.addEventListener("click", showNextPhrase);
