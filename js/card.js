// Randomly generating texture.
const textureManager = (function () {
    const paper = new THREE.TextureLoader().load('./image/paper.png');
    paper.name = "paper";
    const scissors = new THREE.TextureLoader().load('./image/scissors.png');
    scissors.name = "scissors";
    const rock = new THREE.TextureLoader().load('./image/rock.png');
    rock.name = "rock";
    const textures = [
        rock, paper, scissors
    ];
    let myCardTextureIndexes = [0, 1, 2, 0, 1, 2];
    let opponentCardTextureIndexes = [0, 1, 2, 0, 1, 2];

    return {
        getTextureForMyCard: function () {
            const index = myCardTextureIndexes.splice(
                Math.floor(Math.random() * myCardTextureIndexes.length), 1)[0];
            return textures[index];
        },
        getTextureForOpponentCard: function () {
            const index = opponentCardTextureIndexes.splice(
                Math.floor(Math.random() * opponentCardTextureIndexes.length), 1)[0];
            return textures[index];
        }
    }
})();

const stateEnum = Object.freeze({
    "initial": 1, "front": 2, "moving": 3, "following": 4, "final": 5
});

function MyCard(scene, index, context) {
    let dummy = null;
    let cube = null;
    let type;

    (function Create(scene, i) {
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(8, 12, 2),
            new THREE.MeshBasicMaterial());
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.position.y = 6;
        cube.position.z = 1;
        cube.name = "My Card " + i;
        context[cube.name] = stateEnum.initial;
        cube.material = Array(5).fill(
            new THREE.MeshLambertMaterial({
                color: 'green'
            })).concat(
            new THREE.MeshLambertMaterial({
                map: textureManager.getTextureForOpponentCard(), // back
            }));
        type = cube.material[5].map.name;
        dummy = new THREE.Object3D();
        dummy.position.set(5 + 10 * i, 0, -1);
        dummy.add(cube);
        scene.add(dummy);
    })
    (scene, index);

    return {
        cube: cube,
        isFinal: function () {
            return context[cube.name] === stateEnum.final;
        },
        onclick: function (callback) {
            // Only one card is allowed to move in one round.
            if (context[cube.name] === stateEnum.initial &&
                !Object.values(context).includes(stateEnum.moving)) {
                context[cube.name] = stateEnum.moving;
                new TWEEN.Tween(dummy.rotation)
                    .to({x: -Math.PI / 2}, 500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .chain(new TWEEN.Tween(cube.position)
                        .to({y: -20}, 2000)
                        .chain(new TWEEN.Tween(cube.rotation)
                            .to({y: Math.PI})
                            .onComplete(function () {
                                console.log("showdown complete");
                                context[cube.name] = stateEnum.final;
                            }))
                    )
                    .start();
                callback(type);
            }
        }
    }
}

function OpponentCard(scene, index, context) {
    let dummy = null;
    let cube = null;
    let type;

    (function Create(scene, i) {
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(8, 12, 2),
            new THREE.MeshBasicMaterial());
        cube.position.y = 6;
        cube.position.z = -1;
        cube.name = "Opponent Card " + i;
        context[cube.name] = stateEnum.initial;
        cube.material = Array(6).fill(
            new THREE.MeshLambertMaterial({
                color: 'red'
            }));
        cube.material[4] = new THREE.MeshLambertMaterial({
            map: textureManager.getTextureForMyCard() // front
        });
        type = cube.material[4].map.name;
        dummy = new THREE.Object3D();
        dummy.position.set(5 + 10 * i, 0, 55);
        dummy.add(cube);
        scene.add(dummy);
    })(scene, index);

    return {
        isFinal: function () {
            return context[cube.name] === stateEnum.final;
        },
        move: function (callback) {
            // Move opponent card only when my card is moving.
            if (context[cube.name] === stateEnum.initial &&
                Object.values(context).includes(stateEnum.moving) &&
                !Object.values(context).includes(stateEnum.following)) {
                context[cube.name] = stateEnum.following;
                new TWEEN.Tween(dummy.rotation)
                    .to({x: Math.PI / 2}, 500)
                    .easing(TWEEN.Easing.Quadratic.In)
                    .chain(new TWEEN.Tween(cube.position)
                        .to({y: -20}, 2000)
                        .chain(new TWEEN.Tween(cube.rotation)
                            .to({y: Math.PI})
                            .onComplete(function () {
                                context[cube.name] = stateEnum.final;
                                callback(type);
                            }))
                    )
                    .start();
                return true;    // move is executed.
            }
            return false;
        }
    }
}