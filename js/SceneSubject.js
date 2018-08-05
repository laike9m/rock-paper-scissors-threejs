function Cards(scene, eventControl, text) {

    let myCards = [];
    let opponentCards = [];
    let gameEnded = false;

    scene.add(new THREE.AxesHelper(20));

    let context = {};
    for (let i = 0; i < 6; i++) {
        const card = MyCard(scene, i, context);
        myCards.push(card);
        opponentCards.push(new OpponentCard(scene, i, context));
        eventControl.attach(card.cube);
    }

    eventControl.attachEvent('onclick', function () {
        console.log('Card at number ' + this.event.item + ' is pressed');
        myCards[this.event.item].onclick(function (typeMe) {
            // Find an opponent card that can move.
            while (!opponentCards[
                Math.floor(Math.random() * opponentCards.length)]
                .move(function (typeOpponent) {
                    if (typeMe === typeOpponent) {
                        console.log("DRAW!");
                        return;
                    }
                    if (typeMe === "rock" && typeOpponent === "scissors" ||
                        typeMe === "paper" && typeOpponent === "rock" ||
                        typeMe === "scissors" && typeOpponent === "paper") {
                        console.log("You win!");
                        text.scoreMe++;
                    } else {
                        console.log("You lose!");
                        text.scoreOpponent++;
                    }
                })) ;
        });
    });

    this.update = function (time) {
        if (!gameEnded && myCards.every(function (card) {
            return card.isFinal();
        }) && opponentCards.every(function (card) {
            return card.isFinal();
        })) {
            gameEnded = true;
            setTimeout(function () {
                if (text.scoreMe > text.scoreOpponent) {
                    window.alert("You win! Refresh to restart.");
                } else if (text.scoreMe === text.scoreOpponent) {
                    window.alert("It's a draw! Refresh to restart.");
                } else {
                    window.alert("You lose! Refresh to restart.");
                }
            }, 1000);
        }
    }
}

function GeneralLights(scene) {

    const light = new THREE.PointLight(
        "#2222ff", 1);
    scene.add(light);

    this.update = function (time) {
        light.intensity = (Math.sin(time) + 1.5) / 1.5;
        light.color.setHSL(Math.sin(time), 0.5, 0.5);
    }
}