function SceneManager(text) {
    const scene = buildScene();
    const renderer = buildRender();
    const camera = buildCamera();
    const eventControl = new THREE.EventsControls(camera, renderer.domElement);
    const sceneSubjects = createSceneSubjects(scene);
    const cameraControl = buildControl(camera);
    window.addEventListener('resize', onWindowResize, false);

    function buildControl(camera) {
        let cameraControl = new THREE.OrbitControls(camera);
        cameraControl.target.set(30, 20, -5);
        cameraControl.update();
        cameraControl.minPolarAngle = Math.PI / 3;
        cameraControl.maxPolarAngle = Math.PI / 3;
        cameraControl.maxDistance = 40;
        cameraControl.update();
        return cameraControl;
    }

    function buildScene() {
        let scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");
        return scene;
    }

    function buildRender() {
        let renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    function buildCamera() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        let camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.set(30, 50, -10);
        return camera;
    }

    function createSceneSubjects(scene) {
        return [
            new Lights(scene),
            new Ground(scene),
            new Cards(scene, eventControl, text),
        ];
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
    }

    this.update = function () {
        eventControl.update();
        cameraControl.update();
        TWEEN.update();

        for (let i = 0; i < sceneSubjects.length; i++)
            {if (sceneSubjects[i].hasOwnProperty('update'))
                {sceneSubjects[i].update();}}

        renderer.render(scene, camera);
    };
}
