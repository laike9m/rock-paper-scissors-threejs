let FizzyText = function () {
    this.Play = 'Click on your card.';
    this.scoreMe = 0;
    this.scoreOpponent = 0;
};

const text = new FizzyText();
let gui = new dat.GUI();
gui.add(text, 'Play');
gui.add(text, 'scoreMe', 0, 6).name("Your score").listen();
gui.add(text, 'scoreOpponent', 0, 6).name("Opponent score").listen();

const sceneManager = new SceneManager(text);

animate();

function animate() {
    requestAnimationFrame(animate);
    sceneManager.update();
}

