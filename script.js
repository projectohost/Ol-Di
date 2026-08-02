"use strict";

const CONFIG = Object.freeze({
    baseRealMsPerGameMinute: 100,
    baseTimeMultiplier: 600,
    eventSpawnMs: 15_000,
    liveAnimationMs: 2_600,
    settledEventLifetimeMs: 18_000,
    maxActiveEvents: 8,
    initialBalance: 100,
    wheelCost: 25
});

document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("consent-overlay");
    const acceptBtn = document.getElementById("accept-btn");

    if (overlay && acceptBtn) {
        overlay.style.display = "flex";
        acceptBtn.addEventListener("click", function() {
            overlay.style.display = "none";
            startGame();
        });
    } else {
        startGame();
    }

    function startGame() {
        console.log("Логіка гри активована!");
    }
});


const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
    money: $("#money"),
    level: $("#level"),
    xpBar: $("#xpBar"),
    eventsList: $("#eventsList"),
    upgradePanel: $("#upgradePanel"),
    langSwitcher: $("#langSwitcher"),
    spinWheel: $("#spinWheel"),
    miniWheel: $("#miniWheel"),
    wheelResult: $("#wheelResult"),
    wheelFreeSpins: $("#wheelFreeSpins"),
    gameClock: $("#gameClock"),
    gameDay: $("#gameDay"),
    nextEventCountdown: $("#nextEventCountdown"),
    openEventsCount: $("#openEventsCount"),
    speedChip: $("#speedChip"),
    speedMultiplier: $("#timeMultiplier"),
    setClockBtn: $("#setClockBtn"),
    addDemoEventBtn: $("#addDemoEventBtn"),
    betModal: $("#betModal"),
    betModalTitle: $("#betModalTitle"),
    betModalPick: $("#betModalPick"),
    betAmount: $("#betAmount"),
    potentialPayout: $("#potentialPayout"),
    confirmBetBtn: $("#confirmBetBtn"),
    clockModal: $("#clockModal"),
    clockInput: $("#clockInput"),
    confirmClockBtn: $("#confirmClockBtn"),
    toast: $("#toast")
};

const translations = {
    uk: {
        gameTime: "Ігровий час", simulatorLabel: "Ігровий симулятор", heading: "Спортивні події",
        heroText: "Події стартують за ігровим годинником. Одна ігрова хвилина дорівнює 0,1 секунди реального часу.",
        openEvents: "відкритих подій", spawnRate: "до нового заходу", minuteRate: "за ігрову хвилину",
        wheelTitle: "🎡 Колесо фортуни", spin: "Крутити колесо", probabilityTitle: "Як працює шанс",
        probabilityText: "Результат обирається випадково. Вага кожного варіанта розраховується як 1 ÷ коефіцієнт і нормалізується між усіма результатами події.",
        schedule: "Розклад", eventsTitle: "Актуальні заходи", addEvent: "+ Додати зараз", virtualCredits: "лише віртуальні кредити",
        placeBet: "Зробити ставку", betAmount: "Сума ставки", allIn: "Усе", potentialPayout: "Можлива виплата",
        confirmBet: "Підтвердити", clockSettings: "Налаштування годинника", setGameTime: "Встановити ігровий час",
        timeFormat: "Час у форматі ГГ:ХХ", saveTime: "Зберегти час", day: "День", nextEventIn: "Новий захід через {seconds} с",
        level: "Рівень", incomeUpgrades: "Пасивний дохід", income: "Дохід", perSecond: "₴/с", upgrade: "Покращити",
        upgradeCost: "Вартість: {cost} ₴", notEnough: "Недостатньо коштів", betAccepted: "Ставку {amount} ₴ прийнято",
        eventStarted: "Подія розпочалася", won: "Виграш: +{amount} ₴", lost: "Ставка програла", drawOutcome: "Нічия",
        startsIn: "Старт через {seconds} с", live: "НАЖИВО", finished: "Завершено", yourBet: "Ваша ставка",
        payout: "Виплата", noBet: "Ставку не зроблено", eventClosed: "Прийом ставок завершено", alreadyBet: "На цю подію вже є ставка",
        invalidAmount: "Введіть коректну суму", newEvent: "Додано новий спортивний захід", clockSaved: "Ігровий час змінено",
        wheelSpinning: "Колесо обертається…", wheelMoney: "+{amount} ₴", wheelXp: "+{amount} XP", wheelLose: "−{amount} ₴",
        wheelResult: "Випало: {result}", freeWheelSpins: "Безкоштовних круток: {count}",
        football: "Футбол", basketball: "Баскетбол", formula: "Формула 1", tennis: "Теніс", hockey: "Хокей", boxing: "Бокс", volleyball: "Волейбол",
        resultTeam: "Перемога: {team}", resultDraw: "Нічия — м'яч пройшов повз ворота",
        winMessage: "Ви вгадали результат", loseMessage: "Результат не збігся з вашою ставкою",
        fairChance: "Орієнтовний шанс: {chance}%", balance: "Баланс", reset: "Скинути прогрес"
    },
    en: {
        gameTime: "Game time", simulatorLabel: "Game simulator", heading: "Sports events",
        heroText: "Events start according to the game clock. One game minute equals 0.1 seconds of real time.",
        openEvents: "open events", spawnRate: "until a new event", minuteRate: "per game minute",
        wheelTitle: "🎡 Fortune wheel", spin: "Spin the wheel", probabilityTitle: "How probability works",
        probabilityText: "The result is random. Each option weight is calculated as 1 ÷ odds and normalized across all outcomes.",
        schedule: "Schedule", eventsTitle: "Current events", addEvent: "+ Add now", virtualCredits: "virtual credits only",
        placeBet: "Place a bet", betAmount: "Bet amount", allIn: "All", potentialPayout: "Potential payout",
        confirmBet: "Confirm", clockSettings: "Clock settings", setGameTime: "Set game time",
        timeFormat: "Time in HH:MM format", saveTime: "Save time", day: "Day", nextEventIn: "New event in {seconds}s",
        level: "Level", incomeUpgrades: "Passive income", income: "Income", perSecond: "₴/s", upgrade: "Upgrade",
        upgradeCost: "Cost: {cost} ₴", notEnough: "Not enough funds", betAccepted: "Bet of {amount} ₴ accepted",
        eventStarted: "Event started", won: "Win: +{amount} ₴", lost: "The bet lost", drawOutcome: "Draw",
        startsIn: "Starts in {seconds}s", live: "LIVE", finished: "Finished", yourBet: "Your bet",
        payout: "Payout", noBet: "No bet placed", eventClosed: "Betting is closed", alreadyBet: "A bet already exists for this event",
        invalidAmount: "Enter a valid amount", newEvent: "A new sports event was added", clockSaved: "Game time changed",
        wheelSpinning: "Wheel is spinning…", wheelMoney: "+{amount} ₴", wheelXp: "+{amount} XP", wheelLose: "−{amount} ₴",
        wheelResult: "Result: {result}", freeWheelSpins: "Free spins: {count}",
        football: "Football", basketball: "Basketball", formula: "Formula 1", tennis: "Tennis", hockey: "Hockey", boxing: "Boxing", volleyball: "Volleyball",
        resultTeam: "Winner: {team}", resultDraw: "Draw — the ball missed both goals",
        winMessage: "You predicted the result", loseMessage: "The result did not match your bet",
        fairChance: "Estimated chance: {chance}%", balance: "Balance", reset: "Reset progress"
    }
};

const state = {
    money: readNumber("money", CONFIG.initialBalance),
    level: readNumber("level", 0),
    xp: readNumber("xp", 0),
    needXP: readNumber("needXP", 100),
    passiveRate: readNumber("passiveRate", 1),
    passiveLevel: readNumber("passiveLevel", 0),
    freeWheelSpins: readNumber("freeWheelSpins", 0),
    lang: localStorage.getItem("lang") || "uk",
    timeMultiplier: clampTimeMultiplier(readNumber("timeMultiplier", CONFIG.baseTimeMultiplier)),
    virtualAnchorMinutes: readNumber("virtualMinutes", 18 * 60),
    realAnchorMs: performance.now(),
    nextSpawnAtMs: performance.now() + CONFIG.eventSpawnMs,
    events: new Map(),
    eventCounter: 0,
    pendingBet: null,
    lastPassiveTick: performance.now()
};

if (state.freeWheelSpins === 0 && state.level > 0) {
    state.freeWheelSpins = state.level * 10;
}

const eventPools = {
    football: [
        { teamsUk: ["Реал Мадрид", "Барселона"], teamsEn: ["Real Madrid", "Barcelona"], odds: [2.10, 3.40, 2.80], draw: true },
        { teamsUk: ["Баварія", "Боруссія Дортмунд"], teamsEn: ["Bayern Munich", "Borussia Dortmund"], odds: [1.95, 3.55, 3.20], draw: true },
        { teamsUk: ["Манчестер Сіті", "Арсенал"], teamsEn: ["Manchester City", "Arsenal"], odds: [2.05, 3.25, 3.40], draw: true },
        { teamsUk: ["ПСЖ", "Ліверпуль"], teamsEn: ["PSG", "Liverpool"], odds: [2.35, 3.15, 2.75], draw: true },
        { teamsUk: ["Інтер", "Мілан"], teamsEn: ["Inter", "AC Milan"], odds: [2.20, 3.35, 2.95], draw: true },
        { teamsUk: ["Байер", "Реал Сосьєдад"], teamsEn: ["Bayer Leverkusen", "Real Sociedad"], odds: [2.45, 3.10, 2.90], draw: true }
    ],
    basketball: [
        { teamsUk: ["Лейкерс", "Селтікс"], teamsEn: ["Lakers", "Celtics"], odds: [1.85, 1.95] },
        { teamsUk: ["Буллз", "Г'юстон Рокетс"], teamsEn: ["Bulls", "Houston Rockets"], odds: [1.78, 2.08] },
        { teamsUk: ["Маверікс", "Нейкс"], teamsEn: ["Mavericks", "Knicks"], odds: [1.92, 1.98] },
        { teamsUk: ["Клівленд Кавальєрс", "Мілвокі Бакс"], teamsEn: ["Cleveland Cavaliers", "Milwaukee Bucks"], odds: [1.82, 2.04] },
        { teamsUk: ["Фінікс Санз", "Лейкерс"], teamsEn: ["Phoenix Suns", "Lakers"], odds: [1.88, 2.01] }
    ],
    formula: [
        { teamsUk: ["Верстаппен", "Норріс", "Леклер"], teamsEn: ["Verstappen", "Norris", "Leclerc"], odds: [2.20, 3.25, 4.10] },
        { teamsUk: ["Рассел", "П'ярт", "Окон"], teamsEn: ["Russell", "Piastri", "Ocon"], odds: [3.10, 3.55, 4.35] },
        { teamsUk: ["Алонсо", "Гаслі", "Сайнс"], teamsEn: ["Alonso", "Gasly", "Sainz"], odds: [4.20, 3.80, 2.95] },
        { teamsUk: ["Гунтар", "Чжоу", "Боттас"], teamsEn: ["Hulkenberg", "Zhou", "Bottas"], odds: [3.45, 4.10, 3.70] },
        { teamsUk: ["Ферстаппен", "Макларен", "Ред Булл"], teamsEn: ["F1 Field", "McLaren", "Red Bull"], odds: [2.80, 3.20, 3.60] }
    ],
    tennis: [
        { teamsUk: ["Джоковіч", "Алькарас"], teamsEn: ["Djokovic", "Alcaraz"], odds: [2.15, 1.78] },
        { teamsUk: ["Сіннер", "Зверєв"], teamsEn: ["Sinner", "Zverev"], odds: [1.95, 2.12] },
        { teamsUk: ["Медведєв", "Рубльов"], teamsEn: ["Medvedev", "Rublev"], odds: [2.05, 1.95] },
        { teamsUk: ["Шварцман", "Дімітров"], teamsEn: ["Schwartzman", "Dimitrov"], odds: [2.18, 1.88] },
        { teamsUk: ["Фріц", "Тіяфо"], teamsEn: ["Fritz", "Tiafoe"], odds: [2.02, 1.99] }
    ],
    hockey: [
        { teamsUk: ["Ойлерс", "Мейпл Ліфс"], teamsEn: ["Oilers", "Maple Leafs"], odds: [2.05, 2.20] },
        { teamsUk: ["Блюз", "Канадієнс"], teamsEn: ["Bruins", "Canadiens"], odds: [2.15, 1.95] },
        { teamsUk: ["Рейнджерс", "Пінгвінс"], teamsEn: ["Rangers", "Penguins"], odds: [2.08, 2.00] },
        { teamsUk: ["Капіталс", "Лайтнінг"], teamsEn: ["Capitals", "Lightning"], odds: [2.10, 1.98] },
        { teamsUk: ["Девілс", "Блекгокс"], teamsEn: ["Devils", "Blackhawks"], odds: [2.12, 1.92] }
    ],
    boxing: [
        { teamsUk: ["Усик", "Ф'юрі"], teamsEn: ["Usyk", "Fury"], odds: [1.72, 2.35] },
        { teamsUk: ["Джошуа", "Міллер"], teamsEn: ["Joshua", "Miller"], odds: [1.84, 2.10] },
        { teamsUk: ["Валлі", "Пак'яо"], teamsEn: ["Valdez", "Pacquiao"], odds: [1.90, 2.02] },
        { teamsUk: ["Дюбуа", "Ганн"], teamsEn: ["Dubois", "Hane"], odds: [1.88, 2.06] },
        { teamsUk: ["Сото", "Шишкін"], teamsEn: ["Soto", "Shishkin"], odds: [1.81, 2.15] }
    ],
    volleyball: [
        { teamsUk: ["Перуджа", "Трентіно"], teamsEn: ["Perugia", "Trentino"], odds: [1.90, 2.05] },
        { teamsUk: ["Зеніт", "Локомотив"], teamsEn: ["Zenit", "Lokomotiv"], odds: [1.95, 2.00] },
        { teamsUk: ["Турку", "Штутгарт"], teamsEn: ["Turku", "Stuttgart"], odds: [1.88, 2.06] },
        { teamsUk: ["Полі", "Флоренція"], teamsEn: ["Poli", "Florence"], odds: [2.03, 1.97] },
        { teamsUk: ["Казань", "Скандербег"], teamsEn: ["Kazan", "Skanderbeg"], odds: [1.92, 2.01] }
    ]
};

function readNumber(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === "") return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
}

function clampTimeMultiplier(value) {
    const normalized = Number(value);
    if (!Number.isFinite(normalized)) return CONFIG.baseTimeMultiplier;
    return Math.min(700, Math.max(1, Math.round(normalized)));
}

function t(key, params = {}) {
    const value = translations[state.lang]?.[key] ?? translations.uk[key] ?? key;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

function roundMoney(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value) {
    return new Intl.NumberFormat(state.lang === "uk" ? "uk-UA" : "en-US", { maximumFractionDigits: 2 }).format(value);
}

function saveGame() {
    localStorage.setItem("money", String(state.money));
    localStorage.setItem("level", String(state.level));
    localStorage.setItem("xp", String(state.xp));
    localStorage.setItem("needXP", String(state.needXP));
    localStorage.setItem("passiveRate", String(state.passiveRate));
    localStorage.setItem("passiveLevel", String(state.passiveLevel));
    localStorage.setItem("freeWheelSpins", String(state.freeWheelSpins));
    localStorage.setItem("lang", state.lang);
    localStorage.setItem("timeMultiplier", String(state.timeMultiplier));
    localStorage.setItem("virtualMinutes", String(getVirtualMinutes()));
}

function getRealMsPerGameMinute() {
    return CONFIG.baseRealMsPerGameMinute * (CONFIG.baseTimeMultiplier / state.timeMultiplier);
}

function getVirtualMinutes() {
    const elapsedRealMs = performance.now() - state.realAnchorMs;
    return state.virtualAnchorMinutes + elapsedRealMs / getRealMsPerGameMinute();
}

function setVirtualMinutes(minutes) {
    state.virtualAnchorMinutes = minutes;
    state.realAnchorMs = performance.now();
    saveGame();
}

function formatVirtualTime(totalMinutes, includeDay = false) {
    const absolute = Math.floor(totalMinutes);
    const day = Math.floor(absolute / 1440) + 1;
    const withinDay = ((absolute % 1440) + 1440) % 1440;
    const hours = Math.floor(withinDay / 60);
    const minutes = withinDay % 60;
    const clock = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    return includeDay ? `${t("day")} ${day} · ${clock}` : clock;
}

function setTimeMultiplier(multiplier) {
    state.timeMultiplier = clampTimeMultiplier(multiplier);
    if (elements.speedChip) elements.speedChip.textContent = `×${state.timeMultiplier}`;
    if (elements.speedMultiplier) elements.speedMultiplier.value = String(state.timeMultiplier);
    saveGame();
}

function updateClock() {
    const nowVirtual = getVirtualMinutes();
    elements.gameClock.textContent = formatVirtualTime(nowVirtual);
    elements.gameDay.textContent = `${t("day")} ${Math.floor(nowVirtual / 1440) + 1}`;

    const remaining = Math.max(0, (state.nextSpawnAtMs - performance.now()) / 1000);
    elements.nextEventCountdown.textContent = t("nextEventIn", { seconds: remaining.toFixed(1).replace(".", ",") });

    processEvents(nowVirtual);
}

function updateWheelUI() {
    if (elements.wheelFreeSpins) {
        elements.wheelFreeSpins.textContent = t("freeWheelSpins", { count: state.freeWheelSpins });
    }
}

function updatePlayerUI() {
    elements.money.textContent = `💰 ${formatMoney(state.money)} ₴`;
    elements.level.textContent = `⭐ ${t("level")} ${state.level}`;
    elements.xpBar.style.width = `${Math.min(100, (state.xp / state.needXP) * 100)}%`;
    elements.openEventsCount.textContent = String([...state.events.values()].filter(event => event.status !== "settled").length);
    updateWheelUI();
    saveGame();
}

function addXP(amount) {
    state.xp += amount;
    while (state.xp >= state.needXP) {
        state.xp -= state.needXP;
        state.level += 1;
        state.needXP += 50;
        state.freeWheelSpins += 10;
    }
}

function toast(message, variant = "neutral") {
    elements.toast.textContent = message;
    elements.toast.className = `toast show ${variant}`;
    clearTimeout(elements.toast.hideTimer);
    elements.toast.hideTimer = setTimeout(() => {
        elements.toast.className = "toast";
    }, 2600);
}

function translateStaticUI() {
    $$('[data-i18n]').forEach(node => {
        const key = node.dataset.i18n;
        if (translations[state.lang]?.[key]) node.textContent = t(key);
    });
    document.documentElement.lang = state.lang;
    elements.langSwitcher.value = state.lang;
    document.title = state.lang === "uk" ? "Sport Arena — симулятор" : "Sport Arena — simulator";
}

function renderUpgrades() {
    const cost = 50 + state.passiveLevel * 25;
    elements.upgradePanel.innerHTML = `
        <div class="panel-title-row"><h2>${t("incomeUpgrades")}</h2><span class="income-chip">+${state.passiveRate} ${t("perSecond")}</span></div>
        <div class="upgrade-row">
            <div><strong>${t("income")}</strong><span>${t("level")} ${state.passiveLevel}</span></div>
            <button id="buyUpgradeBtn" class="secondary-btn" type="button">${t("upgrade")}<small>${t("upgradeCost", { cost })}</small></button>
        </div>
    `;
    $("#buyUpgradeBtn").addEventListener("click", () => buyUpgrade(cost));
}

function buyUpgrade(cost) {
    if (state.money < cost) {
        toast(t("notEnough"), "lose");
        return;
    }
    state.money = roundMoney(state.money - cost);
    state.passiveLevel += 1;
    state.passiveRate += 1;
    updatePlayerUI();
    renderUpgrades();
}

function buildRandomOdds(baseOdds) {
    return baseOdds.map(odd => Number(Math.max(1.05, odd + (Math.random() - 0.5) * 0.24).toFixed(2)));
}

function createEvent() {
    const sportKeys = Object.keys(eventPools);
    const sport = sportKeys[Math.floor(Math.random() * sportKeys.length)];
    const pool = eventPools[sport];
    const template = pool[Math.floor(Math.random() * pool.length)];
    const teams = state.lang === "uk" ? template.teamsUk : template.teamsEn;
    const odds = buildRandomOdds(template.odds);
    const options = template.draw
        ? [
            { key: "a", label: teams[0], odds: odds[0] },
            { key: "draw", label: t("drawOutcome"), odds: odds[1] },
            { key: "b", label: teams[1], odds: odds[2] }
        ]
        : teams.map((team, index) => ({ key: String.fromCharCode(97 + index), label: team, odds: odds[index] }));

    state.eventCounter += 1;
    const nowVirtual = getVirtualMinutes();
    const startDelayMinutes = 45 + Math.floor(Math.random() * 76);

    return {
        id: `event-${Date.now()}-${state.eventCounter}`,
        sport,
        teamsUk: template.teamsUk,
        teamsEn: template.teamsEn,
        options,
        startAt: nowVirtual + startDelayMinutes,
        status: "open",
        bet: null,
        actualIndex: null,
        createdAt: performance.now()
    };
}

function localizeEvent(event) {
    const templateTeams = state.lang === "uk" ? event.teamsUk : event.teamsEn;
    event.options.forEach((option, index) => {
        if (option.key === "draw") option.label = t("drawOutcome");
        else option.label = templateTeams[index > 1 && event.options.some(item => item.key === "draw") ? index - 1 : index] ?? option.label;
    });
    if (event.bet) event.bet.label = event.options[event.bet.optionIndex].label;
}

function sportName(sport) {
    return t(sport);
}

function sportIcon(sport) {
    return ({ football: "⚽", basketball: "🏀", formula: "🏎️", tennis: "🎾", hockey: "🏒", boxing: "🥊", volleyball: "🏐" })[sport] || "🏟️";
}

function eventTitle(event) {
    const teams = state.lang === "uk" ? event.teamsUk : event.teamsEn;
    if (event.sport === "formula") return `${sportIcon(event.sport)} ${teams.join(" · ")}`;
    return `${sportIcon(event.sport)} ${teams.join(" vs ")}`;
}

function getNormalizedProbabilities(options) {
    const raw = options.map(option => 1 / option.odds);
    const sum = raw.reduce((total, value) => total + value, 0);
    return raw.map(value => value / sum);
}

function chooseOutcome(event) {
    const probabilities = getNormalizedProbabilities(event.options);
    let roll = Math.random();
    for (let index = 0; index < probabilities.length; index += 1) {
        roll -= probabilities[index];
        if (roll <= 0) return index;
    }
    return probabilities.length - 1;
}

function renderSportVisual(event) {
    const outcomeKey = event.actualIndex === null ? "" : event.options[event.actualIndex].key;
    const liveClass = event.status === "live" ? ` is-live outcome-${outcomeKey}` : "";
    const settledClass = event.status === "settled" ? ` is-settled outcome-${outcomeKey}` : "";

    if (event.sport === "football") {
        return `<div class="visual-stage football${liveClass}${settledClass}">
            <div class="field-line"></div><div class="goal goal-a"><span>A</span></div><div class="goal goal-b"><span>B</span></div>
            <div class="sport-ball">⚽</div><div class="impact"></div>
        </div>`;
    }
    if (event.sport === "basketball") {
        return `<div class="visual-stage basketball${liveClass}${settledClass}">
            <div class="hoop hoop-a"><span>A</span></div><div class="hoop hoop-b"><span>B</span></div><div class="sport-ball">🏀</div>
        </div>`;
    }
    if (event.sport === "formula") {
        return `<div class="visual-stage formula${liveClass}${settledClass}">
            ${event.options.map((option, index) => `<div class="race-lane"><span>${option.label}</span><div class="race-car ${event.actualIndex === index ? "winner" : ""}">🏎️</div></div>`).join("")}
        </div>`;
    }
    if (event.sport === "tennis") {
        return `<div class="visual-stage tennis${liveClass}${settledClass}"><div class="court-side side-a">A</div><div class="net"></div><div class="court-side side-b">B</div><div class="sport-ball">🎾</div></div>`;
    }
    if (event.sport === "hockey") {
        return `<div class="visual-stage hockey${liveClass}${settledClass}"><div class="ice-line"></div><div class="goal goal-a"><span>A</span></div><div class="goal goal-b"><span>B</span></div><div class="puck"></div></div>`;
    }
    if (event.sport === "boxing") {
        return `<div class="visual-stage boxing${liveClass}${settledClass}"><div class="fighter fighter-a">🥊<span>A</span></div><div class="ring-center">VS</div><div class="fighter fighter-b">🥊<span>B</span></div><div class="punch-flash">💥</div></div>`;
    }
    return `<div class="visual-stage volleyball${liveClass}${settledClass}"><div class="court-side side-a">A</div><div class="net"></div><div class="court-side side-b">B</div><div class="sport-ball">🏐</div></div>`;
}

function statusMarkup(event) {
    const now = getVirtualMinutes();
    if (event.status === "open") {
    const realSeconds = Math.max(0, (event.startAt - now) * getRealMsPerGameMinute() / 1000);
        return `<span class="status-pill open">⏳ ${t("startsIn", { seconds: realSeconds.toFixed(1).replace(".", ",") })}</span>`;
    }
    if (event.status === "live") return `<span class="status-pill live"><i></i>${t("live")}</span>`;
    return `<span class="status-pill settled">✓ ${t("finished")}</span>`;
}

function resultMarkup(event) {
    if (event.status !== "settled") {
        if (!event.bet) return `<span class="bet-summary muted">${t("noBet")}</span>`;
        return `<span class="bet-summary">${t("yourBet")}: <b>${event.bet.label}</b> · ${formatMoney(event.bet.amount)} ₴</span>`;
    }

    const actual = event.options[event.actualIndex];
    const won = event.bet && event.bet.optionIndex === event.actualIndex;
    const outcomeText = actual.key === "draw" ? t("resultDraw") : t("resultTeam", { team: actual.label });
    const betText = !event.bet
        ? t("noBet")
        : won
            ? `${t("winMessage")} · ${t("won", { amount: formatMoney(event.bet.payout) })}`
            : `${t("loseMessage")} · ${t("lost")}`;

    return `<div class="result-box ${event.bet ? (won ? "win" : "lose") : "neutral"}"><strong>${outcomeText}</strong><span>${betText}</span></div>`;
}

function renderEvent(event) {
    localizeEvent(event);
    let card = document.getElementById(event.id);
    if (!card) {
        card = document.createElement("article");
        card.id = event.id;
        card.className = "match-card entering";
        elements.eventsList.prepend(card);
        setTimeout(() => card.classList.remove("entering"), 500);
    }

    const probabilities = getNormalizedProbabilities(event.options);
    card.className = `match-card status-${event.status}${event.bet ? " has-bet" : ""}`;
    card.innerHTML = `
        <div class="card-head">
            <div><span class="sport-badge">${sportIcon(event.sport)} ${sportName(event.sport)}</span><h3>${eventTitle(event)}</h3></div>
            <div class="event-time"><span>${formatVirtualTime(event.startAt, true)}</span>${statusMarkup(event)}</div>
        </div>
        ${renderSportVisual(event)}
        <div class="odds-grid">
            ${event.options.map((option, index) => {
                const selected = event.bet?.optionIndex === index;
                const disabled = event.status !== "open" || Boolean(event.bet);
                return `<button class="odd-button${selected ? " selected" : ""}" type="button" data-event-id="${event.id}" data-option-index="${index}" ${disabled ? "disabled" : ""}>
                    <span>${option.label}</span><strong>${option.odds.toFixed(2)}×</strong><small>${t("fairChance", { chance: Math.round(probabilities[index] * 100) })}</small>
                </button>`;
            }).join("")}
        </div>
        <div class="card-footer">${resultMarkup(event)}</div>
    `;

    $$(".odd-button", card).forEach(button => button.addEventListener("click", () => openBetModal(event, Number(button.dataset.optionIndex))));
}

function renderAllEvents() {
    [...state.events.values()]
        .sort((a, b) => b.createdAt - a.createdAt)
        .forEach(renderEvent);
    updatePlayerUI();
}

function addEvent(notify = false) {
    if (state.events.size >= CONFIG.maxActiveEvents) {
        const removable = [...state.events.values()].find(event => event.status === "settled");
        if (removable) removeEvent(removable.id);
        else return;
    }
    const event = createEvent();
    state.events.set(event.id, event);
    renderEvent(event);
    updatePlayerUI();
    if (notify) toast(t("newEvent"), "win");
}

function removeEvent(eventId) {
    state.events.delete(eventId);
    document.getElementById(eventId)?.remove();
    updatePlayerUI();
}

function processEvents(nowVirtual) {
    state.events.forEach(event => {
        if (event.status === "open" && nowVirtual >= event.startAt) startEvent(event);
        else if (event.status === "open") updateEventStatusOnly(event);
    });
}

function updateEventStatusOnly(event) {
    const card = document.getElementById(event.id);
    const status = card?.querySelector(".event-time .status-pill");
    if (!status) return;
    const realSeconds = Math.max(0, (event.startAt - getVirtualMinutes()) * getRealMsPerGameMinute() / 1000);
    status.innerHTML = `⏳ ${t("startsIn", { seconds: realSeconds.toFixed(1).replace(".", ",") })}`;
}

function startEvent(event) {
    if (event.status !== "open") return;
    event.status = "live";
    event.actualIndex = chooseOutcome(event);
    renderEvent(event);
    toast(t("eventStarted"));

    setTimeout(() => settleEvent(event), CONFIG.liveAnimationMs);
}

function settleEvent(event) {
    if (event.status !== "live") return;
    event.status = "settled";

    if (event.bet) {
        const won = event.bet.optionIndex === event.actualIndex;
        if (won) {
            event.bet.payout = roundMoney(event.bet.amount * event.bet.odds);
            state.money = roundMoney(state.money + event.bet.payout);
            addXP(25);
            toast(t("won", { amount: formatMoney(event.bet.payout) }), "win");
            launchConfetti();
        } else {
            event.bet.payout = 0;
            addXP(8);
            toast(t("lost"), "lose");
        }
    }

    renderEvent(event);
    updatePlayerUI();
    setTimeout(() => removeEvent(event.id), CONFIG.settledEventLifetimeMs);
}

function openBetModal(event, optionIndex) {
    if (event.status !== "open") {
        toast(t("eventClosed"), "lose");
        return;
    }
    if (event.bet) {
        toast(t("alreadyBet"), "lose");
        return;
    }

    const option = event.options[optionIndex];
    state.pendingBet = { eventId: event.id, optionIndex };
    elements.betModalTitle.textContent = eventTitle(event);
    elements.betModalPick.textContent = `${option.label} · ${option.odds.toFixed(2)}×`;
    elements.betAmount.value = String(Math.min(10, Math.floor(state.money)) || 1);
    updatePotentialPayout();
    openModal(elements.betModal);
    setTimeout(() => elements.betAmount.focus(), 50);
}

function updatePotentialPayout() {
    if (!state.pendingBet) return;
    const event = state.events.get(state.pendingBet.eventId);
    if (!event) return;
    const amount = Number(elements.betAmount.value);
    const odds = event.options[state.pendingBet.optionIndex].odds;
    const payout = Number.isFinite(amount) && amount > 0 ? amount * odds : 0;
    elements.potentialPayout.textContent = `${formatMoney(payout)} ₴`;
}

function confirmBet() {
    if (!state.pendingBet) return;
    const event = state.events.get(state.pendingBet.eventId);
    if (!event || event.status !== "open") {
        closeModal(elements.betModal);
        toast(t("eventClosed"), "lose");
        return;
    }

    const amount = roundMoney(Number(elements.betAmount.value));
    if (!Number.isFinite(amount) || amount <= 0) {
        toast(t("invalidAmount"), "lose");
        return;
    }
    if (amount > state.money) {
        toast(t("notEnough"), "lose");
        return;
    }

    const option = event.options[state.pendingBet.optionIndex];
    state.money = roundMoney(state.money - amount);
    event.bet = {
        optionIndex: state.pendingBet.optionIndex,
        label: option.label,
        odds: option.odds,
        amount,
        payout: 0
    };
    state.pendingBet = null;
    closeModal(elements.betModal);
    renderEvent(event);
    updatePlayerUI();
    toast(t("betAccepted", { amount: formatMoney(amount) }), "win");
}

function openModal(modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal(modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!$(".modal.open")) document.body.classList.remove("modal-open");
}

function setLanguage(lang) {
    state.lang = lang;
    translateStaticUI();
    renderUpgrades();
    renderAllEvents();
    updateClock();
}

function spinWheel() {
    const hasFreeSpin = state.freeWheelSpins > 0;
    if (!hasFreeSpin && state.money < CONFIG.wheelCost) {
        toast(t("notEnough"), "lose");
        return;
    }

    if (hasFreeSpin) {
        state.freeWheelSpins -= 1;
    } else {
        state.money = roundMoney(state.money - CONFIG.wheelCost);
    }

    updatePlayerUI();
    elements.spinWheel.disabled = true;

    const sectors = 6;
    const sectorAngle = 360 / sectors;
    const landingIndex = Math.floor(Math.random() * sectors);
    const reward = [
        { type: "money", value: 100 },
        { type: "lose", value: 20 },
        { type: "money", value: 250 },
        { type: "lose", value: 20 },
        { type: "money", value: 500 },
        { type: "xp", value: 60 }
    ][landingIndex];
    const randomTurns = 8 + Math.floor(Math.random() * 6);
    const finalRotation = 360 * randomTurns + (360 - landingIndex * sectorAngle) % 360;
    const duration = 3.2 + Math.random() * 2.0;
    const speedMultiplier = 0.15 + Math.random() * 0.1;
    const normalizedDuration = Math.max(2.8, duration + speedMultiplier);

    elements.miniWheel.style.transition = `transform ${normalizedDuration}s cubic-bezier(.12,.8,.27,1)`;
    elements.miniWheel.style.transform = `rotate(${finalRotation}deg)`;
    elements.miniWheel.classList.add("spinning");
    toast(t("wheelSpinning"));

    setTimeout(() => {
        if (reward.type === "money") {
            state.money = roundMoney(state.money + reward.value);
            toast(t("wheelMoney", { amount: reward.value }), "win");
        } else if (reward.type === "xp") {
            addXP(reward.value);
            toast(t("wheelXp", { amount: reward.value }), "win");
        } else {
            const loss = Math.min(reward.value, state.money);
            state.money = roundMoney(state.money - loss);
            toast(t("wheelLose", { amount: loss }), "lose");
        }

        const resultText = reward.type === "money"
            ? t("wheelMoney", { amount: reward.value })
            : reward.type === "xp"
                ? t("wheelXp", { amount: reward.value })
                : t("wheelLose", { amount: reward.value });
        if (elements.wheelResult) {
            elements.wheelResult.textContent = t("wheelResult", { result: resultText });
        }

        elements.miniWheel.classList.remove("spinning");
        elements.spinWheel.disabled = false;
        updatePlayerUI();
    }, normalizedDuration * 1000);
}

function launchConfetti() {
    const layer = document.createElement("div");
    layer.className = "confetti-layer";
    for (let index = 0; index < 34; index += 1) {
        const piece = document.createElement("i");
        piece.style.setProperty("--x", `${Math.random() * 100}vw`);
        piece.style.setProperty("--delay", `${Math.random() * 0.5}s`);
        piece.style.setProperty("--spin", `${360 + Math.random() * 720}deg`);
        layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 2600);
}

function updatePassiveIncome(now) {
    const elapsedSeconds = Math.floor((now - state.lastPassiveTick) / 1000);
    if (elapsedSeconds <= 0) return;
    state.lastPassiveTick += elapsedSeconds * 1000;
    state.money = roundMoney(state.money + elapsedSeconds * state.passiveRate);
    updatePlayerUI();
}

function handleSpawning(now) {
    if (now < state.nextSpawnAtMs) return;
    addEvent(true);
    state.nextSpawnAtMs += CONFIG.eventSpawnMs;
    if (state.nextSpawnAtMs < now) state.nextSpawnAtMs = now + CONFIG.eventSpawnMs;
}

function bindEvents() {
    if (elements.langSwitcher) elements.langSwitcher.addEventListener("change", event => setLanguage(event.target.value));
    if (elements.spinWheel) elements.spinWheel.addEventListener("click", spinWheel);
    if (elements.addDemoEventBtn) elements.addDemoEventBtn.addEventListener("click", () => addEvent(true));
    if (elements.speedMultiplier) {
        elements.speedMultiplier.addEventListener("change", event => {
            setTimeMultiplier(event.target.value);
            updateClock();
        });
    }
    if (elements.setClockBtn && elements.clockInput && elements.clockModal) {
        elements.setClockBtn.addEventListener("click", () => {
            elements.clockInput.value = formatVirtualTime(getVirtualMinutes());
            openModal(elements.clockModal);
        });
    }
    if (elements.confirmClockBtn && elements.clockInput && elements.clockModal) {
        elements.confirmClockBtn.addEventListener("click", () => {
            const [hours, minutes] = elements.clockInput.value.split(":").map(Number);
            if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
            const currentDay = Math.floor(getVirtualMinutes() / 1440);
            setVirtualMinutes(currentDay * 1440 + hours * 60 + minutes);
            state.events.forEach(event => {
                if (event.status === "open") event.startAt = getVirtualMinutes() + 45 + Math.floor(Math.random() * 76);
            });
            renderAllEvents();
            closeModal(elements.clockModal);
            toast(t("clockSaved"), "win");
        });
    }
    if (elements.betAmount) elements.betAmount.addEventListener("input", updatePotentialPayout);
    if (elements.confirmBetBtn) elements.confirmBetBtn.addEventListener("click", confirmBet);

    $$("[data-close-modal]").forEach(node => node.addEventListener("click", () => {
        state.pendingBet = null;
        if (elements.betModal) closeModal(elements.betModal);
    }));
    $$("[data-close-clock]").forEach(node => node.addEventListener("click", () => {
        if (elements.clockModal) closeModal(elements.clockModal);
    }));
    $$(".quick-amounts button").forEach(button => button.addEventListener("click", () => {
        if (elements.betAmount) {
            elements.betAmount.value = button.dataset.amount === "max" ? String(Math.max(1, Math.floor(state.money))) : button.dataset.amount;
            updatePotentialPayout();
        }
    }));

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            state.pendingBet = null;
            if (elements.betModal) closeModal(elements.betModal);
            if (elements.clockModal) closeModal(elements.clockModal);
        }
        if (event.key === "Enter" && elements.betModal && elements.betModal.classList.contains("open")) confirmBet();
    });
    window.addEventListener("beforeunload", saveGame);
}

function init() {
    translateStaticUI();
    setTimeMultiplier(state.timeMultiplier);
    renderUpgrades();
    bindEvents();

    addEvent();
    addEvent();
    addEvent();
    addEvent();

    // Розносить перші старти, щоб анімації не запускались одночасно.
    [...state.events.values()].forEach((event, index) => {
        event.startAt = getVirtualMinutes() + 35 + index * 28;
        renderEvent(event);
    });

    updatePlayerUI();
    updateClock();

    const loop = now => {
        updateClock();
        updatePassiveIncome(now);
        handleSpawning(now);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

init();
