document.querySelectorAll(".bet").forEach(button => {

    button.onclick = function () {

        let bet = Number(prompt("Введіть суму ставки"));

        if (isNaN(bet) || bet <= 0) return;

        if (bet > money) {
            showMessage("❌ Недостатньо грошей!", true);
            return;
        }

        // Блокуємо всі кнопки
        document.querySelectorAll(".bet").forEach(btn => {
            btn.disabled = true;
        });

        showMessage("⏳ Зачекайте 10 секунд...");

        let coef = Number(
            this.innerText
                .replace(",", ".")
                .split("—")[1]
                .replace("x", "")
                .trim()
        );

        setTimeout(() => {

            // 50% шанс виграти
            let win = Math.random() < 0.5;

            if (win) {

                let prize = Math.round(bet * coef);

                money += prize;

                xp += 25;

                showMessage("🎉 Ви виграли " + prize + " ₴");

            } else {

                money -= bet;

                xp += 10;

                showMessage("❌ Ставка не зайшла. Ви програли " + bet + " ₴", true);

            }

            while (xp >= needXP) {

                xp -= needXP;

                level++;

                needXP += 50;

                showMessage("🏆 Новий рівень " + level);

            }

            if (money <= 0) {

                money = 100;
                level = 0;
                xp = 0;
                needXP = 100;

                showMessage("💀 Ви збанкрутували!", true);

            }

            update();

            // Розблоковуємо кнопки
            document.querySelectorAll(".bet").forEach(btn => {
                btn.disabled = false;
            });

        }, 10000);

    };

});