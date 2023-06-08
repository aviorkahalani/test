import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    MOUSE,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    Clock,
    MeshLambertMaterial,
    DirectionalLight,
    MeshToonMaterial,
    Color,
    MeshPhongMaterial,
    TextureLoader,
    LoadingManager,
    AmbientLight,
    SpotLight,
    HemisphereLight,
    SphereGeometry,
    AxesHelper,
    GridHelper
} from 'three';

//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from 'camera-controls';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'


const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
      DEG2RAD: MathUtils.DEG2RAD,
      clamp: MathUtils.clamp
    }
  };


// 1 scene
const scene = new Scene();
const canvas = document.getElementById('three-canvas');
const loader = new TextureLoader();

const gltfloader = new GLTFLoader();

const grid = new GridHelper(6, 6);
grid.material.depthTest = false;
grid.renderOrder = 0;
//scene.add(grid);

// 2 The object

const loadingScreen = document.getElementById('loader-container');
const progressText = document.getElementById('progress-text');

    gltfloader.load('./medieval_house_and_wine_shop.glb',
    (gltf) => {
        scene.add(gltf.scene.rotateY(5).translateY(-150).translateX(250).translateZ(-20));
        loadingScreen.classList.add('hidden');

        const gui = new GUI();

        const skyColorParam = {
            value: 0x8c8c8c,
        }

        gui.addColor(skyColorParam, 'value').name('Sky Color').onChange(() => {
            light.color.set(skyColorParam.value);
        });

        const lightColorParam = {
            value: 0xeb9824,
        }

        gui.addColor(lightColorParam, 'value').name('Sunset Color').onChange(() => {
            light1.color.set(lightColorParam.value);
        });

        const light2ColorParam = {
            value: 0xeb9824,
        }

        gui.addColor(light2ColorParam, 'value').name('Sunset 2 Color').onChange(() => {
            light2.color.set(light2ColorParam.value);
        });

        const ambientColorParam = {
            value: 0x7e5858,
        }

        gui.addColor(ambientColorParam, 'value').name('Ambient Color').onChange(() => {
            ambientLight.color.set(ambientColorParam.value);
        });

         const reflexColorParam = {
            value: 0x362121,
        }

        gui.addColor(reflexColorParam, 'value').name('Ground Reflex').onChange(() => {
            light.groundColor.set(reflexColorParam.value);
        });
    }, 
    (progress) => {
        console.log(progress);
        progressText.textContent = " Loading:  " + Math.min(Math.trunc(progress.loaded / progress.total) * 100, 100) + "%";
    },
    (error) => {
        console.log(error);
    })


// 3 The camera

const sizes = {
    width: 800,
    height: 600
}

const camera = new PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 1000;
camera.position.x = -800;
camera.position.y = 100;
scene.add(camera);

// 4 The Renderer
const renderer = new WebGLRenderer({canvas: canvas});
const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); //false =  (do not ) update the style of element
renderer.setClearColor(0xc2c2c2, 1);

// 5 Lights

const light1 = new DirectionalLight(0xeb9824, 0.9);
light1.position.set(-500, 300, 100).normalize();
scene.add(light1);

const light2 = new DirectionalLight(0xeb9824, 0.9);
light2.position.set(100, 800, 500).normalize();
scene.add(light2);


const ambientLight = new AmbientLight( 0x7e5858, 0.8);
scene.add(ambientLight);


const skyColor= 0x8c8c8c;
const groundColor= 0x362121;
const intensity = 1;
const light = new HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

const color = 0xFFFFFF;
const spotLight = new SpotLight(color, intensity, 3, 10 );
scene.add(spotLight);
//scene.add(spotLight.target)



// 6 Responsitivity 
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
})


// 7 Controls

CameraControls.install({THREE: subsetOfTHREE});
const clock = new Clock;
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;


// 8 Animation

function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// 10 Debugging





