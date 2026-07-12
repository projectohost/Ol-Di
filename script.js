const moneyEl = document.getElementById("money");
const levelEl = document.getElementById("level");
const xpBar = document.getElementById("xpBar");

let money = Number(localStorage.getItem("money")) || 100;
let level = Number(localStorage.getItem("level")) || 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let needXP = Number(localStorage.getItem("needXP")) || 100;

let currentButton = null;
let currentCoef = 0;
let currentBet = 0;
let waiting = false;

function saveGame(){

    localStorage.setItem("money",money);
    localStorage.setItem("level",level);
    localStorage.setItem("xp",xp);
    localStorage.setItem("needXP",needXP);

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

    update();

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

update();
document.querySelectorAll(".bet").forEach(button=>{

    button.onclick=function(){

        if(waiting)
            return;

        let bet=Number(prompt("Введіть суму ставки"));

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

        showMessage("⏳ Очікуйте 10 секунд...");

        setTimeout(()=>{

            let chance=getChance(currentCoef);

            let win=Math.random()<chance;

            if(win){

                let prize=Math.round(currentBet*currentCoef);

                money+=prize;

                addXP(25);

                currentButton.classList.remove("betLose");
                currentButton.classList.add("betWin");

                showMessage("🎉 Ви виграли "+prize+" ₴");

            }else{

                money-=currentBet;

                addXP(10);

                currentButton.classList.remove("betWin");
                currentButton.classList.add("betLose");

                showMessage("❌ Ви програли "+currentBet+" ₴",true);

            }

            setTimeout(()=>{

                currentButton.classList.remove("betWin");
                currentButton.classList.remove("betLose");

            },600);

            if(money<=0){

                showMessage("💀 Ви збанкрутували!",true);

                resetPlayer();

            }

            update();

            enableButtons();

            waiting=false;

        },10000);

    };

});

window.addEventListener("beforeunload",saveGame);

update();