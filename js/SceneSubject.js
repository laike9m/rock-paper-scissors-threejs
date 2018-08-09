function Cards(scene, eventControl, text) {

    let myCards = [];
    let opponentCards = [];
    let cardsLeft = 6;
    let prompt;

    let cardContext = {};
    for (let i = 0; i < cardsLeft; i++) {
        const card = MyCard(scene, i, cardContext);
        myCards.push(card);
        opponentCards.push(new OpponentCard(scene, i, cardContext));
        eventControl.attach(card.cube);
    }

    eventControl.attachEvent('onclick', function () {
        console.log('Card at number ' + this.event.item + ' is pressed');
        myCards[this.event.item].onclick(function (typeMe) {
            // Find an opponent card that can move.
            while (!opponentCards[
                Math.floor(Math.random() * opponentCards.length)]
                .move(function (typeOpponent) {
                    cardsLeft--;
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
                })) {
                ;
            }
        });
    });

    this.update = function () {
        if (cardsLeft === 0) {
            let promptText;
            if (text.scoreMe > text.scoreOpponent) {
                promptText = "You win! Refresh to restart.";
            } else if (text.scoreMe === text.scoreOpponent) {
                promptText = "It's a draw! Refresh to restart.";
            } else {
                promptText = "You lose! Refresh to restart.";
            }
            if (prompt === undefined) {
                prompt = new Prompt(scene, promptText);
            }
            prompt.update();
        }
    }
}

function Prompt(scene, text) {
    let promptText;
    let textWidth;
    let uniforms = {
        min: {
            type: "f",
            value: 10
        },
        max: {
            type: "f",
            value: 20
        },
        uDirLightPos: {
            type: "v3",
            value: new THREE.Vector3(30, 20, -20)
        },
        uDirLightColor: {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
        "uSpecularColor": {
            type: "c",
            value: new THREE.Color(0xffffff)
        },
    };

    const loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        ShaderLoader("shaders/vertex.glsl",
            "shaders/fragment.glsl", function (vertex, fragment) {
                let geometry = new THREE.TextBufferGeometry(text, {
                    font: font,
                    size: 5,
                    height: 0.1,
                });
                const count = geometry.attributes.position.count;
                const customColor = new THREE.Float32BufferAttribute(count * 3, 3);
                geometry.addAttribute('customColor', customColor);
                const color = new THREE.Color("#42dff4");
                for (var i = 0, l = customColor.count; i < l; i++) {
                    color.toArray(customColor.array, i * customColor.itemSize);
                }
                geometry.computeBoundingBox();
                textWidth = geometry.boundingBox.max.x;

                const shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: vertex,
                    fragmentShader: fragment
                });
                promptText = new THREE.Mesh(
                    geometry, shaderMaterial
                );
                promptText.rotation.y = Math.PI;
                promptText.position.set(70, 20, 40);
                scene.add(promptText);
                console.log("promptText created successfully.");
            });
    });

    this.update = function () {
        const time = Date.now() * 0.001;

        let ratio;
        for (let i = 0; i < 4; i++) {
            ratio = Math.tan(Math.PI / 4 * i + time * 0.3);
            if (ratio > 0 && ratio < 1) {
                break;
            }
        }
        uniforms.min.value = Math.abs(textWidth * ratio);
        uniforms.max.value = 10 + Math.abs(textWidth * ratio);
    };
}

function Ground(scene) {
    const gridHelper = new THREE.GridHelper(80/*size*/, 16/*divisions*/, '#42dff4', '#42dff4');
    gridHelper.position.set(30, 0, 25);
    gridHelper.scale.z = 0.8;
    scene.add(gridHelper);
}

function Lights(scene) {
    const light = new THREE.PointLight("#FFFFFF", 5, 100, 2);
    light.position.set(30, 30, -20);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
}
