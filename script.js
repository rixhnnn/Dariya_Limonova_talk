const videoSrc = "img/489439949.webm";
const grid = document.querySelector(".background-grid");
const dog = document.querySelector(".dog");
const speechBubble = document.querySelector(".speech-bubble");
const phrases = [
    "СЫН УБОРЩИЦЫ",
];

let speechTimer;

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

dog.addEventListener("click", () => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    speechBubble.textContent = phrase;
    speechBubble.classList.add("is-visible");
    dog.classList.add("is-talking");

    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
        speechBubble.classList.remove("is-visible");
        dog.classList.remove("is-talking");
    }, 2200);
});
