const videoSrc = "img/489439949.webm";
const grid = document.querySelector(".background-grid");
const dog = document.querySelector(".dog");
const speechBubble = document.querySelector(".speech-bubble");
const domainPopupPrimary = document.querySelector(".domain-popup-primary");
const domainPopupSecondary = document.querySelector(".domain-popup-secondary");
const dogScene = document.querySelector(".dog-scene");
const domainBackdrop = document.querySelector(".domain-backdrop");
const domainRiver = document.querySelector(".domain-river");
const domainSlashes = document.querySelector(".domain-slashes");
const domainDryPeople = document.querySelectorAll(".domain-dry-person");
const domainTomb = document.querySelector(".domain-tomb");
const demonSkillIcon = document.querySelector(".demon-skill-icon");
const rocketLayer = document.querySelector(".rocket-layer");
const littlePeople = document.querySelectorAll(".little-person");
const domainPhrases = [
    "ГРОБНИЦА ДЫРЯВЫХ ДЕТЕЙ",
];
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
    "СЫКСССЕВЕН",
];

let speechTimer;
let rocketTimer;
let rocketCleanupTimer;
let finalEffectTimer;
let domainPopupTimer;
let domainSecondPopupTimer;
let domainPopupCleanupTimer;
let domainTextCleanupTimer;
let domainBackdropTimer;
let domainSlashTimer;
let domainSlashCleanupTimer;
let domainResetTimer;
let phraseIndex = 0;
let isRocketSequence = false;
let lastInteractionTime = 0;

function setViewportHeight() {
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${viewportHeight * 0.01}px`);
}

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
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.preload = "metadata";
        grid.appendChild(video);
        video.play().catch(() => {
            video.controls = false;
        });
    }
}

setViewportHeight();
buildGrid();

window.addEventListener("resize", setViewportHeight);
window.addEventListener("orientationchange", () => {
    setTimeout(setViewportHeight, 250);
});

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setViewportHeight);
}

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
    littlePeople.forEach((person) => {
        person.classList.remove("is-fallen", "is-sick");
        person.classList.add("is-visible", "is-surprised");
    });
    rocketLayer.innerHTML = `
        <div class="rocket rocket-left">
            <span class="rocket-symbol"></span>
        </div>
        <div class="rocket rocket-right">
            <span class="rocket-symbol"></span>
        </div>
    `;

    rocketTimer = setTimeout(() => {
        rocketLayer.innerHTML = `
            <div class="explosion explosion-left"><span class="smoke-cloud"></span></div>
            <div class="explosion explosion-right"><span class="smoke-cloud"></span></div>
        `;
        littlePeople.forEach((person) => {
            person.classList.remove("is-surprised");
            person.classList.add("is-fallen");
        });
        setTimeout(() => {
            littlePeople.forEach((person) => {
                person.classList.add("is-sick");
            });
        }, 420);
    }, 1250);

    rocketCleanupTimer = setTimeout(() => {
        rocketLayer.innerHTML = "";
        rocketLayer.classList.remove("is-active");
        littlePeople.forEach((person) => {
            person.classList.remove("is-visible", "is-surprised", "is-fallen", "is-sick");
        });
        isRocketSequence = false;
        dog.disabled = false;
    }, 2400);
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

    if (dogScene.classList.contains("is-sukuna")) {
        speechBubble.classList.remove("is-visible");
        dog.classList.remove("is-talking");
        return;
    }

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

function showDomainPopupSequence() {
    clearTimeout(domainPopupTimer);
    clearTimeout(domainSecondPopupTimer);
    clearTimeout(domainPopupCleanupTimer);
    clearTimeout(domainTextCleanupTimer);
    clearTimeout(domainBackdropTimer);
    clearTimeout(domainSlashTimer);
    clearTimeout(domainSlashCleanupTimer);
    clearTimeout(domainResetTimer);
    clearTimeout(speechTimer);

    speechBubble.classList.remove("is-visible");
    dog.classList.remove("is-talking");
    demonSkillIcon.classList.add("is-hidden");
    domainRiver.classList.remove("is-visible");
    domainSlashes.classList.remove("is-active");
    domainDryPeople.forEach((person) => person.classList.remove("is-visible"));
    domainDryPeople.forEach((person) => person.classList.remove("is-shaking", "is-cut"));
    domainTomb.classList.remove("is-visible");
    dogScene.classList.remove("is-on-tomb");

    const randomPhrase = domainPhrases[Math.floor(Math.random() * domainPhrases.length)];

    domainPopupPrimary.classList.remove("is-visible");
    domainPopupSecondary.classList.remove("is-visible");
    domainPopupPrimary.textContent = "";
    domainPopupSecondary.textContent = "";

    domainPopupPrimary.offsetWidth;

    domainPopupPrimary.textContent = "Ryoiki Tenkai";
    domainPopupPrimary.classList.add("is-visible");

    domainPopupTimer = setTimeout(() => {
        domainPopupPrimary.classList.remove("is-visible");
        showDomainBackdrop(randomPhrase);
    }, 1400);

    domainTextCleanupTimer = setTimeout(() => {
        domainPopupPrimary.textContent = "";
    }, 1800);
}

function showDomainBackdrop(randomPhrase) {
    const rect = dogScene.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    domainBackdrop.style.setProperty("--domain-x", `${centerX}px`);
    domainBackdrop.style.setProperty("--domain-y", `${centerY}px`);
    domainBackdrop.classList.remove("is-active");
    domainBackdrop.offsetWidth;
    domainBackdrop.classList.add("is-active");

    domainBackdropTimer = setTimeout(() => {
        dogScene.classList.remove("is-on-tomb");
        domainTomb.classList.remove("is-visible");
        domainRiver.classList.remove("is-visible");
        domainSlashes.classList.remove("is-active");
        domainDryPeople.forEach((person) => person.classList.remove("is-visible", "is-shaking", "is-cut"));
        dogScene.offsetWidth;
        domainTomb.offsetWidth;
        domainRiver.offsetWidth;
        domainDryPeople.forEach((person) => {
            person.offsetWidth;
        });
        dogScene.classList.add("is-on-tomb");
        domainRiver.classList.add("is-visible");
        domainDryPeople.forEach((person) => person.classList.add("is-visible"));
        domainTomb.classList.add("is-visible");

        domainSecondPopupTimer = setTimeout(() => {
            domainPopupPrimary.textContent = randomPhrase;
            domainPopupPrimary.offsetWidth;
            domainPopupPrimary.classList.add("is-visible");
        }, 2600);

        domainSlashTimer = setTimeout(() => {
            domainSlashes.classList.remove("is-active");
            domainSlashes.offsetWidth;
            domainSlashes.classList.add("is-active");
            domainDryPeople.forEach((person) => person.classList.add("is-shaking"));
            domainSlashCleanupTimer = setTimeout(() => {
                domainSlashes.classList.remove("is-active");
                domainDryPeople.forEach((person) => person.classList.remove("is-shaking"));
                domainDryPeople.forEach((person) => person.classList.add("is-cut"));
                domainResetTimer = setTimeout(startDomainExit, 1800);
            }, 9000);
        }, 3900);

        domainPopupCleanupTimer = setTimeout(() => {
            domainPopupPrimary.classList.remove("is-visible");
        }, 4300);

        domainTextCleanupTimer = setTimeout(() => {
            domainPopupPrimary.textContent = "";
        }, 4620);
    }, 3200);
}

function hideDomainPopups() {
    clearTimeout(domainPopupTimer);
    clearTimeout(domainSecondPopupTimer);
    clearTimeout(domainPopupCleanupTimer);
    clearTimeout(domainTextCleanupTimer);
    clearTimeout(domainBackdropTimer);
    clearTimeout(domainSlashTimer);
    clearTimeout(domainSlashCleanupTimer);
    clearTimeout(domainResetTimer);
    domainPopupPrimary.classList.remove("is-visible");
    domainPopupSecondary.classList.remove("is-visible");
    domainPopupPrimary.textContent = "";
    domainPopupSecondary.textContent = "";
    domainBackdrop.classList.remove("is-active");
    domainRiver.classList.remove("is-visible");
    domainSlashes.classList.remove("is-active");
    domainDryPeople.forEach((person) => person.classList.remove("is-shaking", "is-cut", "is-visible"));
    domainTomb.classList.remove("is-visible");
    dogScene.classList.remove("is-on-tomb", "is-domain-exiting");
    demonSkillIcon.classList.remove("is-hidden");
    speechBubble.classList.remove("is-visible");
    dog.classList.remove("is-talking");
}

function resetDomainScene() {
    hideDomainPopups();
    dogScene.classList.remove("is-sukuna");
    demonSkillIcon.classList.remove("is-active");
    demonSkillIcon.setAttribute("aria-pressed", "false");
}

function startDomainExit() {
    dogScene.classList.add("is-domain-exiting");
    domainTomb.classList.add("is-exiting");
    domainRiver.classList.add("is-exiting");
    domainDryPeople.forEach((person) => person.classList.add("is-exiting"));
    domainResetTimer = setTimeout(() => {
        domainTomb.classList.remove("is-exiting");
        domainRiver.classList.remove("is-exiting");
        domainDryPeople.forEach((person) => person.classList.remove("is-exiting"));
        resetDomainScene();
    }, 1900);
}

dog.addEventListener("pointerup", showNextPhrase);
dog.addEventListener("touchend", showNextPhrase, { passive: false });
dog.addEventListener("click", showNextPhrase);

demonSkillIcon.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isActive = dogScene.classList.toggle("is-sukuna");
    demonSkillIcon.classList.toggle("is-active", isActive);
    demonSkillIcon.setAttribute("aria-pressed", String(isActive));

    if (isActive) {
        showDomainPopupSequence();
    } else {
        hideDomainPopups();
    }
});
