function SceneManager(text) {

    const clock = new THREE.Clock();

    const scene = buildScene();
    const renderer = buildRender();
    const camera = buildCamera();
    const eventControl = new THREE.EventsControls(camera, renderer.domElement);
    const sceneSubjects = createSceneSubjects(scene);
    const cameraControl = buildControl(camera);

    function buildControl(camera) {
        const eventControl = new THREE.OrbitControls(camera);
        eventControl.target.set(30, 10, -20);
        camera.position.set(30, 70, -25);
        console.log(camera);
        eventControl.update();
        eventControl.minPolarAngle = Math.PI / 3;
        eventControl.maxPolarAngle = Math.PI / 3;
        eventControl.maxDistance = 40;
        eventControl.update();
        return eventControl;
    }

    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");
        return scene;
    }

    function buildRender() {
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setSize(window.innerWidth, window.innerWidth);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        document.body.appendChild(renderer.domElement);
        renderer.domElement.id = "context";
        return renderer;
    }

    function buildCamera() {
        const aspectRatio = 400 / 300;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    }

    function createSceneSubjects(scene) {
        return [
            new Lights(scene),
            new Ground(scene),
            new Cards(scene, eventControl, text)
        ];
    }

    this.update = function () {
        const elapsedTime = clock.getElapsedTime();

        eventControl.update();
        cameraControl.update();
        TWEEN.update();

        for (let i = 0; i < sceneSubjects.length; i++)
            if (sceneSubjects[i].hasOwnProperty('update'))
                sceneSubjects[i].update(elapsedTime);

        renderer.render(scene, camera);
    };
}
