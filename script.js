const moneyEl = document.getElementById("money");
const levelEl = document.getElementById("level");
const xpBar = document.getElementById("xpBar");
const eventsListEl = document.getElementById("eventsList");
const upgradePanelEl = document.getElementById("upgradePanel");
const langSwitcherEl = document.getElementById("langSwitcher");

let money = Number(localStorage.getItem("money")) || 100;
let level = Number(localStorage.getItem("level")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let needXP = Number(localStorage.getItem("needXP")) || 100;
let passiveRate = Number(localStorage.getItem("passiveRate")) || 1;
let passiveLevel = Number(localStorage.getItem("passiveLevel")) || 0;
let lastSeen = Number(localStorage.getItem("lastSeen")) || Date.now();
let currentLang = localStorage.getItem("lang") || "uk";

let currentButton = null;
let currentCoef = 0;
let currentBet = 0;
let waiting = false;
let eventId = 0;
let nextEventTimer = null;
let activeEvents = new Map();

const translations = {
    uk: {
        heading: "Ставки на спорт",
        levelLabel: "Рівень",
        upgradeTitle: "Покращення доходу",
        baseIncome: "Базовий дохід",
        currentLevel: "Поточний рівень",
        upgradeIncome: "Покращити дохід",
        upgradeCost: "Коштує {cost} $",
        buy: "Купити",
        buySuccess: "⬆️ Покращення куплено! Тепер ви заробляєте {rate} $/с",
        upgradeError: "❌ Недостатньо грошей для покращення!",
        newLevel: "🏆 Новий рівень {level}",
        offlineGain: "💰 Ви заробили {gain} $ офлайн за {seconds} с",
        newEvent: "🆕 Новий захід доступний!",
        enterBetAmount: "Введіть суму ставки",
        notEnoughMoney: "❌ Недостатньо грошей!",
        pending: "⏳ Очікуйте 10 секунд...",
        win: "🎉 Ви виграли {prize} ₴!\nВаш баланс тепер: {money} ₴",
        lose: "❌ Ви програли {bet} ₴.\nЗалишилось: {money} ₴",
        bankrupt: "💀 Ви збанкрутували!",
        yourPick: "Твій вибір",
        pickLabel: "{pick}",
        liveAnimation: "⚡ Жива анімація",
        previewHint: "{icon} {name} • hover-ефект активний",
        today: "Сьогодні",
        tomorrow: "Завтра",
        football: "Футбол",
        basketball: "Баскетбол",
        formula: "Формула 1",
        tennis: "Теніс",
        hockey: "Хокей",
        boxing: "Бокс",
        volleyball: "Волейбол",
        outcomeFootballWin: "⚽ Влучили у ворота! Удар вийшов точним",
        outcomeFootballDraw: "🤝 Нічия — м'яч відбився від штанги",
        outcomeFootballLose: "🥅 Промах — суперник забив у відповідь",
        outcomeBasketballWin: "🏀 Кидок влучив! Сітка дрогнула",
        outcomeBasketballLose: "🧺 Промах — м'яч зрикошетив від обода",
        outcomeFormulaWin: "🏎️ Супер-петля! Машина вийшла на лідерство",
        outcomeFormulaLose: "🚦 Зупинка в боксах — шанс було втрачено",
        outcomeTennisWin: "🎾 Подача вийшла в мережу — але влучили в темп",
        outcomeTennisLose: "🧲 Розіграш пішов не в той бік",
        outcomeHockeyWin: "🏒 Шайба влетіла у ворота!",
        outcomeHockeyLose: "🧊 Промах — шайба пройшла повз",
        outcomeBoxingWin: "🥊 Нокаут! Удар був точним",
        outcomeBoxingLose: "🧤 Промах — суперник відбив атаку",
        outcomeVolleyballWin: "🏐 Влучний удар — очко за вами",
        outcomeVolleyballLose: "🛑 Подача вийшла в аут",
        defaultOutcome: "⚡ Подія завершилась"
    },
    en: {
        heading: "Sports betting",
        levelLabel: "Level",
        upgradeTitle: "Income upgrades",
        baseIncome: "Base income",
        currentLevel: "Current level",
        upgradeIncome: "Upgrade income",
        upgradeCost: "Costs {cost} $",
        buy: "Buy",
        buySuccess: "⬆️ Upgrade purchased! You now earn {rate} $/s",
        upgradeError: "❌ Not enough money for the upgrade!",
        newLevel: "🏆 New level {level}",
        offlineGain: "💰 You earned {gain} $ offline for {seconds} s",
        newEvent: "🆕 A new event is available!",
        enterBetAmount: "Enter the bet amount",
        notEnoughMoney: "❌ Not enough money!",
        pending: "⏳ Please wait 10 seconds...",
        win: "🎉 You won {prize} ₴!\nYour balance is now {money} ₴",
        lose: "❌ You lost {bet} ₴.\nRemaining: {money} ₴",
        bankrupt: "💀 You went bankrupt!",
        yourPick: "Your pick",
        pickLabel: "{pick}",
        liveAnimation: "⚡ Live animation",
        previewHint: "{icon} {name} • hover effect active",
        today: "Today",
        tomorrow: "Tomorrow",
        football: "Football",
        basketball: "Basketball",
        formula: "Formula 1",
        tennis: "Tennis",
        hockey: "Hockey",
        boxing: "Boxing",
        volleyball: "Volleyball",
        outcomeFootballWin: "⚽ Goal! The shot was precise",
        outcomeFootballDraw: "🤝 Draw — the ball hit the post",
        outcomeFootballLose: "🥅 Miss — the opponent scored back",
        outcomeBasketballWin: "🏀 Shot went in! The rim shook",
        outcomeBasketballLose: "🧺 Miss — the ball bounced off the rim",
        outcomeFormulaWin: "🏎️ Super lap! The car took the lead",
        outcomeFormulaLose: "🚦 Stopped in the pits — the chance was lost",
        outcomeTennisWin: "🎾 The serve went into the net — but the tempo was right",
        outcomeTennisLose: "🧲 The rally went the wrong way",
        outcomeHockeyWin: "🏒 The puck hit the net!",
        outcomeHockeyLose: "🧊 Miss — the puck passed by",
        outcomeBoxingWin: "🥊 Knockout! The punch was sharp",
        outcomeBoxingLose: "🧤 Miss — the opponent blocked the attack",
        outcomeVolleyballWin: "🏐 Great hit — point for you",
        outcomeVolleyballLose: "🛑 The serve went out",
        defaultOutcome: "⚡ The event is over"
    }
};

function t(key, params = {}){
    const value = translations[currentLang][key] || translations.uk[key] || key;
    return String(value).replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

function saveGame(){

    localStorage.setItem("money", money);
    localStorage.setItem("level", level);
    localStorage.setItem("xp", xp);
    localStorage.setItem("needXP", needXP);
    localStorage.setItem("passiveRate", passiveRate);
    localStorage.setItem("passiveLevel", passiveLevel);
    localStorage.setItem("lastSeen", Date.now());
    localStorage.setItem("lang", currentLang);

}

function update(){

    moneyEl.innerHTML = "💰 " + money + " ₴";
    levelEl.innerHTML = "⭐ " + t("levelLabel") + " " + level;

    let percent = (xp / needXP) * 100;

    if(percent > 100)
        percent = 100;

    xpBar.style.width = percent + "%";
    document.querySelector("h1").textContent = t("heading");
    document.getElementById("pageTitle").textContent = "Football Bet";
    saveGame();

}

function showMessage(text, lose = false, variant = "neutral"){

    let popup = document.querySelector(".popup");

    if(!popup){

        popup = document.createElement("div");
        popup.className = "popup";
        document.body.appendChild(popup);

    }

    popup.innerHTML = text;
    popup.classList.remove("lose", "win", "draw");

    if(lose)
        popup.classList.add("lose");
    else if(variant === "win")
        popup.classList.add("win");
    else if(variant === "draw")
        popup.classList.add("draw");

    popup.style.display = "block";

    clearTimeout(popup.timer);

    popup.timer = setTimeout(() => {
        popup.style.display = "none";
    }, 3000);

}

function addXP(value){

    xp += value;

    while(xp >= needXP){

        xp -= needXP;
        level++;
        needXP += 50;
        showMessage(t("newLevel", { level }), false, "neutral");

    }

}

function resetPlayer(){

    money = 100;
    level = 0;
    xp = 0;
    needXP = 100;
    passiveRate = 1;
    passiveLevel = 0;
    lastSeen = Date.now();

    update();
    renderUpgrades();

}

function disableButtons(){

    document.querySelectorAll(".bet").forEach(btn => {
        btn.disabled = true;
    });

}

function enableButtons(){

    document.querySelectorAll(".bet").forEach(btn => {
        const card = btn.closest(".match");

        if(card && card.selectedIndex !== undefined && Number(btn.dataset.optionIndex) === card.selectedIndex){
            btn.disabled = true;
        }else{
            btn.disabled = false;
        }

    });

}

function getCoef(button){

    return Number(
        button.innerText
            .replace(",", ".")
            .split("—")[1]
            .replace("x", "")
            .trim()
    );

}

function getChance(coef){

    let chance = 1 / coef;

    if(chance > 0.8)
        chance = 0.8;

    if(chance < 0.15)
        chance = 0.15;

    return chance;

}

function parseBetAmount(value){

    const cleaned = String(value).replace(/[^\d,.-]/g, "").replace(/,/g, ".");
    const number = Number(cleaned);

    return Number.isFinite(number) ? number : NaN;

}

function getRandomTime(){

    const hours = [6, 9, 12, 13, 15, 16, 18, 19, 20, 21, 22, 23, 1, 3];
    const minutes = [0, 15, 30, 45];
    const dayLabel = Math.random() < 0.6 ? t("today") : t("tomorrow");

    const hour = hours[Math.floor(Math.random() * hours.length)];
    const minute = minutes[Math.floor(Math.random() * minutes.length)];

    return `${dayLabel} • ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

}

function getSportTheme(eventData){

    const themes = {
        football: { icon: "⚽", names: { uk: t("football"), en: t("football") } },
        basketball: { icon: "🏀", names: { uk: t("basketball"), en: t("basketball") } },
        formula: { icon: "🏎️", names: { uk: t("formula"), en: t("formula") } },
        tennis: { icon: "🎾", names: { uk: t("tennis"), en: t("tennis") } },
        hockey: { icon: "🏒", names: { uk: t("hockey"), en: t("hockey") } },
        boxing: { icon: "🥊", names: { uk: t("boxing"), en: t("boxing") } },
        volleyball: { icon: "🏐", names: { uk: t("volleyball"), en: t("volleyball") } }
    };

    const theme = themes[eventData.sport] || themes.football;
    return { icon: theme.icon, name: theme.names[currentLang] };

}

function renderPreview(eventData){

    const theme = getSportTheme(eventData);

    let visual = "";

    if(eventData.sport === "football"){
        visual = `<div class="visual-stage football"><div class="goal-post left"></div><div class="goal-post right"></div><div class="ball"></div></div>`;
    }else if(eventData.sport === "basketball"){
        visual = `<div class="visual-stage basketball"><div class="backboard"></div><div class="ring"></div><div class="basket-ball"></div></div>`;
    }else if(eventData.sport === "formula"){
        visual = `<div class="visual-stage formula"><div class="track"></div><div class="car"></div></div>`;
    }else if(eventData.sport === "tennis"){
        visual = `<div class="visual-stage tennis"><div class="court"></div><div class="ball"></div></div>`;
    }else if(eventData.sport === "hockey"){
        visual = `<div class="visual-stage hockey"><div class="rink"></div><div class="puck"></div></div>`;
    }else{
        visual = `<div class="visual-stage football"><div class="goal-post left"></div><div class="goal-post right"></div><div class="ball"></div></div>`;
    }

    return `
        <div class="match-preview">
            ${visual}
        </div>
        <div class="match-footer">
            <span class="match-hint">${t("previewHint", { icon: theme.icon, name: theme.name })}</span>
            <span class="result-pill">⚡ ${t("liveAnimation")}</span>
        </div>
    `;

}

function getRandomEvent(){

    const events = [
        {
            sport: "football",
            titleUk: "🇪🇸 Реал Мадрид vs Барселона",
            titleEn: "🇪🇸 Real Madrid vs Barcelona",
            time: getRandomTime(),
            options: [
                { labelUk: "1", labelEn: "1", odds: 2.10 },
                { labelUk: "Нічия", labelEn: "Draw", odds: 3.40 },
                { labelUk: "2", labelEn: "2", odds: 2.80 }
            ]
        },
        {
            sport: "basketball",
            titleUk: "🏀 Лос-Анджелес Лейкерс vs Бостон Селтікс",
            titleEn: "🏀 Los Angeles Lakers vs Boston Celtics",
            time: getRandomTime(),
            options: [
                { labelUk: "Лейкерс", labelEn: "Lakers", odds: 1.85 },
                { labelUk: "Селтікс", labelEn: "Celtics", odds: 1.95 }
            ]
        },
        {
            sport: "formula",
            titleUk: "🏎️ Формула 1 — Гран-Прі Монако",
            titleEn: "🏎️ Formula 1 — Monaco GP",
            time: getRandomTime(),
            options: [
                { labelUk: "Водій: Верстаппен", labelEn: "Driver: Verstappen", odds: 4.60 },
                { labelUk: "Команда: Red Bull", labelEn: "Team: Red Bull", odds: 2.20 },
                { labelUk: "Водій: Норріс", labelEn: "Driver: Norris", odds: 4.10 }
            ]
        },
        {
            sport: "tennis",
            titleUk: "🎾 Новак Джоковіч vs Карлос Алькарас",
            titleEn: "🎾 Novak Djokovic vs Carlos Alcaraz",
            time: getRandomTime(),
            options: [
                { labelUk: "Джоковіч", labelEn: "Djokovic", odds: 2.15 },
                { labelUk: "Алькарас", labelEn: "Alcaraz", odds: 1.95 }
            ]
        },
        {
            sport: "hockey",
            titleUk: "🏒 Едмонтон Ойлерс vs Торонто Мейпл Ліфс",
            titleEn: "🏒 Edmonton Oilers vs Toronto Maple Leafs",
            time: getRandomTime(),
            options: [
                { labelUk: "Ойлерс", labelEn: "Oilers", odds: 2.10 },
                { labelUk: "Мейпл Ліфс", labelEn: "Maple Leafs", odds: 2.30 }
            ]
        },
        {
            sport: "boxing",
            titleUk: "🥊 Олександр Усик vs Тайсон Ф'юрі",
            titleEn: "🥊 Oleksandr Usyk vs Tyson Fury",
            time: getRandomTime(),
            options: [
                { labelUk: "Усик", labelEn: "Usyk", odds: 2.35 },
                { labelUk: "Ф'юрі", labelEn: "Fury", odds: 2.10 }
            ]
        },
        {
            sport: "volleyball",
            titleUk: "🏐 Зеніт vs Перуджа",
            titleEn: "🏐 Zenit vs Perugia",
            time: getRandomTime(),
            options: [
                { labelUk: "Зеніт", labelEn: "Zenit", odds: 1.90 },
                { labelUk: "Перуджа", labelEn: "Perugia", odds: 2.05 }
            ]
        }
    ];

    const baseEvent = events[Math.floor(Math.random() * events.length)];
    const title = currentLang === "uk" ? baseEvent.titleUk : baseEvent.titleEn;
    const options = baseEvent.options.map(option => ({
        label: currentLang === "uk" ? option.labelUk : option.labelEn,
        odds: option.odds
    }));

    return { ...baseEvent, title, options, time: baseEvent.time };

}

function resolveEventResult(eventData, selectedIndex, userWon){

    const sport = eventData.sport;

    if(sport === "football"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeFootballWin") : t("outcomeFootballWin") };
        if(selectedIndex === 1)
            return { variant: "draw", text: currentLang === "uk" ? t("outcomeFootballDraw") : t("outcomeFootballDraw") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeFootballLose") : t("outcomeFootballLose") };
    }

    if(sport === "basketball"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeBasketballWin") : t("outcomeBasketballWin") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeBasketballLose") : t("outcomeBasketballLose") };
    }

    if(sport === "formula"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeFormulaWin") : t("outcomeFormulaWin") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeFormulaLose") : t("outcomeFormulaLose") };
    }

    if(sport === "tennis"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeTennisWin") : t("outcomeTennisWin") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeTennisLose") : t("outcomeTennisLose") };
    }

    if(sport === "hockey"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeHockeyWin") : t("outcomeHockeyWin") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeHockeyLose") : t("outcomeHockeyLose") };
    }

    if(sport === "boxing"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeBoxingWin") : t("outcomeBoxingWin") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeBoxingLose") : t("outcomeBoxingLose") };
    }

    if(sport === "volleyball"){
        if(userWon)
            return { variant: "win", text: currentLang === "uk" ? t("outcomeVolleyballWin") : t("outcomeVolleyballWin") };
        return { variant: "lose", text: currentLang === "uk" ? t("outcomeVolleyballLose") : t("outcomeVolleyballLose") };
    }

    return { variant: userWon ? "win" : "lose", text: t("defaultOutcome") };

}

function renderCard(card, eventData){

    card.eventData = eventData;
    card.className = `match new${card.resultVariant ? ` result-${card.resultVariant}` : ""}`;
    card.dataset.eventId = card.dataset.eventId || eventId;

    const selectedIndex = card.selectedIndex;
    const selectedLabel = card.selectedLabel || "";
    const resultVariant = card.resultVariant || "";
    const resultText = card.resultText || "";

    card.innerHTML = `
        <div class="match-main">
            <div class="match-info">
                <div class="match-top">
                    <div class="sport-badge">${getSportTheme(eventData).icon} ${getSportTheme(eventData).name}</div>
                    <div class="time-pill">${eventData.time}</div>
                </div>
                <div class="teams">${eventData.title}</div>
                ${renderPreview(eventData)}
            </div>
            <div class="odds">
                ${eventData.options.map((option, index) => {
                    const isSelected = selectedIndex === index;
                    const selectedClass = isSelected ? " selected" : "";
                    const disabledAttr = isSelected || selectedIndex !== undefined ? " disabled" : "";
                    return `<button class="bet${selectedClass}" data-option-index="${index}"${disabledAttr}>${option.label} — ${option.odds.toFixed(2).replace(".", ",")}x</button>`;
                }).join("")}
            </div>
        </div>
        <div class="bet-status">
            <span class="pick-chip">${selectedLabel ? `${t("yourPick")}: ${selectedLabel}` : `${t("yourPick")}: —`}</span>
            <span class="result-pill ${resultVariant ? resultVariant : ""}">${resultText || `⚡ ${t("liveAnimation")}`}</span>
        </div>
    `;

    attachBetHandlers(card, eventData);

}

function updateCardResult(card, result){

    card.resultVariant = result.variant;
    card.resultText = result.text;
    renderCard(card, card.eventData);

}

function flashButton(button, variant){

    button.classList.remove("betWin", "betLose");
    button.offsetWidth;
    button.classList.add(variant === "win" ? "betWin" : "betLose");
    setTimeout(() => button.classList.remove("betWin", "betLose"), 700);

}

function attachBetHandlers(card, eventData){

    card.querySelectorAll(".bet").forEach(button => {

        button.onclick = function(){

            if(waiting)
                return;

            const betAmount = parseBetAmount(prompt(t("enterBetAmount")));

            if(isNaN(betAmount) || betAmount <= 0)
                return;

            if(betAmount > money){
                showMessage(t("notEnoughMoney"), true, "lose");
                return;
            }

            const clickedButton = this;
            const selectedIndex = Number(clickedButton.dataset.optionIndex);

            card.selectedIndex = selectedIndex;
            card.selectedLabel = eventData.options[selectedIndex].label;
            currentButton = clickedButton;
            currentBet = betAmount;
            currentCoef = getCoef(clickedButton);

            waiting = true;
            disableButtons();
            renderCard(card, eventData);
            showMessage(t("pending"));

            setTimeout(() => {

                const chance = getChance(currentCoef);
                const win = Math.random() < chance;
                const result = resolveEventResult(eventData, selectedIndex, win);

                if(win){

                    const prize = Math.round(currentBet * currentCoef);
                    money += prize;
                    addXP(25);
                    showMessage(t("win", { prize, money }), false, "win");

                }else{

                    money -= currentBet;
                    addXP(10);
                    showMessage(t("lose", { bet: currentBet, money }), true, "lose");

                }

                if(money <= 0){
                    showMessage(t("bankrupt"), true, "lose");
                    resetPlayer();
                }

                update();
                updateCardResult(card, result);
                flashButton(currentButton, win ? "win" : "lose");
                enableButtons();
                waiting = false;

                if(activeEvents.size < 3)
                    scheduleNextEvent();

            }, 10000);

        };

    });

}

function createEventCard(eventData){

    eventId++;
    const card = document.createElement("div");
    card.className = "match new";
    card.dataset.eventId = eventId;
    card.selectedIndex = undefined;
    card.selectedLabel = "";
    card.resultVariant = "";
    card.resultText = "";

    renderCard(card, eventData);
    return card;

}

function addEvent(eventData, notify = false){

    const card = createEventCard(eventData);
    eventsListEl.appendChild(card);
    activeEvents.set(card.dataset.eventId, card);

    const timer = setTimeout(() => {
        removeEvent(card);
        if(activeEvents.size < 3)
            scheduleNextEvent();
    }, 90000 + Math.random() * 30000);

    card.expireTimer = timer;

    if(notify)
        showMessage(t("newEvent"));

}

function removeEvent(card){

    if(!card)
        return;

    if(card.expireTimer)
        clearTimeout(card.expireTimer);

    activeEvents.delete(card.dataset.eventId);
    card.remove();

}

function scheduleNextEvent(){

    if(nextEventTimer)
        clearTimeout(nextEventTimer);

    nextEventTimer = setTimeout(() => {

        if(activeEvents.size < 3){
            addEvent(getRandomEvent(), true);
        }

        scheduleNextEvent();

    }, 30000);

}

function renderUpgrades(){

    upgradePanelEl.innerHTML = `
        <h2>${t("upgradeTitle")}</h2>
        <div class="upgrade-card">
            <div>
                <strong>${t("baseIncome")}</strong><br>
                <span>+${passiveRate} $/с</span>
            </div>
            <div>${t("currentLevel")}: ${passiveLevel}</div>
        </div>
        <div class="upgrade-card">
            <div>
                <strong>${t("upgradeIncome")}</strong><br>
                <span>${t("upgradeCost", { cost: 50 + passiveLevel * 20 })}</span>
            </div>
            <button class="upgrade-btn" onclick="buyUpgrade()">${t("buy")}</button>
        </div>
    `;

}

function buyUpgrade(){

    const cost = 50 + passiveLevel * 20;

    if(money < cost){
        showMessage(t("upgradeError"), true);
        return;
    }

    money -= cost;
    passiveLevel++;
    passiveRate++;

    update();
    renderUpgrades();
    showMessage(t("buySuccess", { rate: passiveRate }));

}

function setLanguage(lang){

    currentLang = lang;
    localStorage.setItem("lang", lang);
    langSwitcherEl.value = lang;

    document.querySelectorAll(".match").forEach(card => {
        if(card.eventData)
            renderCard(card, card.eventData);
    });

    update();
    renderUpgrades();

}

function init(){

    langSwitcherEl.value = currentLang;
    langSwitcherEl.addEventListener("change", (event) => setLanguage(event.target.value));

    const now = Date.now();
    const offlineSeconds = Math.floor((now - lastSeen) / 1000);

    if(offlineSeconds > 0){
        const offlineGain = offlineSeconds;
        money += offlineGain;
        showMessage(t("offlineGain", { gain: offlineGain, seconds: offlineSeconds }));
    }

    update();
    renderUpgrades();

    for(let i = 0; i < 3; i++)
        addEvent(getRandomEvent());

    scheduleNextEvent();

    setInterval(() => {
        money += passiveRate;
        update();
    }, 1000);

}

window.addEventListener("beforeunload", saveGame);

init();