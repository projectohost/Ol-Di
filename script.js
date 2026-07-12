const moneyEl = document.getElementById("money");
const levelEl = document.getElementById("level");
const xpBar = document.getElementById("xpBar");
const eventsListEl = document.getElementById("eventsList");
const upgradePanelEl = document.getElementById("upgradePanel");

let money = Number(localStorage.getItem("money")) || 100;
let level = Number(localStorage.getItem("level")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let needXP = Number(localStorage.getItem("needXP")) || 100;
let passiveRate = Number(localStorage.getItem("passiveRate")) || 1;
let passiveLevel = Number(localStorage.getItem("passiveLevel")) || 0;
let lastSeen = Number(localStorage.getItem("lastSeen")) || Date.now();

let currentButton = null;
let currentCoef = 0;
let currentBet = 0;
let waiting = false;
let eventId = 0;
let nextEventTimer = null;
let activeEvents = new Map();

function saveGame(){

    localStorage.setItem("money",money);
    localStorage.setItem("level",level);
    localStorage.setItem("xp",xp);
    localStorage.setItem("needXP",needXP);
    localStorage.setItem("passiveRate",passiveRate);
    localStorage.setItem("passiveLevel",passiveLevel);
    localStorage.setItem("lastSeen",Date.now());

}

function update(){

    moneyEl.innerHTML="💰 "+money+" ₴";

    levelEl.innerHTML="⭐ Рівень "+level;

    let percent=(xp/needXP)*100;

    if(percent>100)
        percent=100;

    xpBar.style.width=percent+"%";

    saveGame();

}

function showMessage(text,lose=false){

    let popup=document.querySelector(".popup");

    if(!popup){

        popup=document.createElement("div");

        popup.className="popup";

        document.body.appendChild(popup);

    }

    popup.innerHTML=text;

    popup.classList.remove("lose");

    if(lose)
        popup.classList.add("lose");

    popup.style.display="block";

    clearTimeout(popup.timer);

    popup.timer=setTimeout(()=>{

        popup.style.display="none";

    },3000);

}

function addXP(value){

    xp+=value;

    while(xp>=needXP){

        xp-=needXP;

        level++;

        needXP+=50;

        showMessage("🏆 Новий рівень "+level);

    }

}

function resetPlayer(){

    money=100;
    level=0;
    xp=0;
    needXP=100;
    passiveRate=1;
    passiveLevel=0;
    lastSeen=Date.now();

    update();
    renderUpgrades();

}

function disableButtons(){

    document.querySelectorAll(".bet").forEach(btn=>{

        btn.disabled=true;

    });

}

function enableButtons(){

    document.querySelectorAll(".bet").forEach(btn=>{

        btn.disabled=false;

    });

}

function getCoef(button){

    return Number(

        button.innerText
            .replace(",",".")
            .split("—")[1]
            .replace("x","")
            .trim()

    );

}

function getChance(coef){

    let chance=1/coef;

    if(chance>0.8)
        chance=0.8;

    if(chance<0.15)
        chance=0.15;

    return chance;

}

function parseBetAmount(value){

    const cleaned=String(value).replace(/[^\d,.-]/g,"").replace(/,/g,".");
    const number=Number(cleaned);

    return Number.isFinite(number) ? number : NaN;

}

function getRandomEvent(){

    const events=[
        {
            title:"🇪🇸 Real Madrid vs Barcelona",
            time:"20:45",
            options:[
                {label:"1",odds:2.10},
                {label:"Нічия",odds:3.40},
                {label:"2",odds:2.80}
            ]
        },
        {
            title:"🏀 Los Angeles Lakers vs Boston Celtics",
            time:"03:30",
            options:[
                {label:"Lakers",odds:1.85},
                {label:"Celtics",odds:1.95}
            ]
        },
        {
            title:"🏎️ Formula 1 — Monaco GP",
            time:"16:00",
            options:[
                {label:"Driver: Verstappen",odds:4.60},
                {label:"Team: Red Bull",odds:2.20},
                {label:"Driver: Norris",odds:4.10}
            ]
        },
        {
            title:"🎾 Novak Djokovic vs Carlos Alcaraz",
            time:"18:30",
            options:[
                {label:"Djokovic",odds:2.15},
                {label:"Alcaraz",odds:1.95}
            ]
        },
        {
            title:"🏒 Edmonton Oilers vs Toronto Maple Leafs",
            time:"22:00",
            options:[
                {label:"Oilers",odds:2.10},
                {label:"Maple Leafs",odds:2.30}
            ]
        },
        {
            title:"⚽ PSG vs Marseille",
            time:"19:30",
            options:[
                {label:"1",odds:1.95},
                {label:"Нічия",odds:3.50},
                {label:"2",odds:4.20}
            ]
        }
    ];

    return events[Math.floor(Math.random()*events.length)];

}

function createEventCard(eventData){

    eventId++;

    const card=document.createElement("div");
    card.className="match new";
    card.dataset.eventId=eventId;

    card.innerHTML=`
        <div>
            <div class="teams">${eventData.title}</div>
            <div class="time">${eventData.time}</div>
        </div>
        <div class="odds">
            ${eventData.options.map(option=>`<button class="bet">${option.label} — ${option.odds.toFixed(2).replace(".",",")}x</button>`).join("")}
        </div>
    `;

    card.querySelectorAll(".bet").forEach(button=>{

        button.onclick=function(){

            if(waiting)
                return;

            let bet=parseBetAmount(prompt("Введіть суму ставки"));

            if(isNaN(bet)||bet<=0)
                return;

            if(bet>money){

                showMessage("❌ Недостатньо грошей!",true);

                return;

            }

            currentButton=this;
            currentBet=bet;
            currentCoef=getCoef(this);

            waiting=true;

            disableButtons();
            removeEvent(card);

            showMessage("⏳ Очікуйте 10 секунд...");

            setTimeout(()=>{

                let chance=getChance(currentCoef);

                let win=Math.random()<chance;

                if(win){

                    let prize=Math.round(currentBet*currentCoef);

                    money+=prize;

                    addXP(25);

                    showMessage("🎉 Ви виграли "+prize+" ₴!\nВаш баланс тепер: "+money+" ₴");

                }else{

                    money-=currentBet;

                    addXP(10);

                    showMessage("❌ Ви програли "+currentBet+" ₴.\nЗалишилось: "+money+" ₴",true);

                }

                if(money<=0){

                    showMessage("💀 Ви збанкрутували!",true);

                    resetPlayer();

                }

                update();

                enableButtons();

                waiting=false;
                scheduleNextEvent();

            },10000);

        };

    });

    return card;

}

function addEvent(eventData,notify=false){

    const card=createEventCard(eventData);
    eventsListEl.appendChild(card);
    activeEvents.set(card.dataset.eventId,card);

    const timer=setTimeout(()=>{

        removeEvent(card);
        if(activeEvents.size<3)
            scheduleNextEvent();

    },90000+Math.random()*30000);

    card.expireTimer=timer;

    if(notify)
        showMessage("🆕 Новий захід доступний!");

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

    nextEventTimer=setTimeout(()=>{

        if(activeEvents.size<3){
            addEvent(getRandomEvent(),true);
        }

        scheduleNextEvent();

    },30000);

}

function renderUpgrades(){

    upgradePanelEl.innerHTML=`
        <h2>Покращення доходу</h2>
        <div class="upgrade-card">
            <div>
                <strong>Базовий дохід</strong><br>
                <span>+${passiveRate} $/с</span>
            </div>
            <div>Поточний рівень: ${passiveLevel}</div>
        </div>
        <div class="upgrade-card">
            <div>
                <strong>Покращити дохід</strong><br>
                <span>Коштує ${50+passiveLevel*20} $</span>
            </div>
            <button class="upgrade-btn" onclick="buyUpgrade()">Купити</button>
        </div>
    `;

}

function buyUpgrade(){

    const cost=50+passiveLevel*20;

    if(money<cost){
        showMessage("❌ Недостатньо грошей для покращення!",true);
        return;
    }

    money-=cost;
    passiveLevel++;
    passiveRate++;

    update();
    renderUpgrades();
    showMessage("⬆️ Покращення куплено! Тепер ви заробляєте "+passiveRate+" $/с");

}

function init(){

    const now=Date.now();
    const offlineSeconds=Math.floor((now-lastSeen)/1000);

    if(offlineSeconds>0){
        const offlineGain=offlineSeconds;
        money+=offlineGain;
        showMessage("💰 Ви заробили "+offlineGain+" $ офлайн за "+offlineSeconds+" с");
    }

    update();
    renderUpgrades();

    for(let i=0;i<3;i++)
        addEvent(getRandomEvent());

    scheduleNextEvent();

    setInterval(()=>{

        money+=passiveRate;
        update();

    },1000);

}

window.addEventListener("beforeunload",saveGame);

init();