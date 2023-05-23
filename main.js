import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';


class Graph {
    constructor(data) {
        this.numNodes = data.length;
        this.adjList = Array(this.numNodes).fill(null).map(() => []);
        this.nodeObjects = Array(this.numNodes).fill(null);
        this.queue = [];
        this.visited = Array(this.numNodes).fill(false);
        this.currentNode = null;

        // Parse data and build adjacency list
        data.forEach((node, index) => {
            this.nodeObjects[index] = addNode(node.id);
        });

        data.forEach((node, index) => {
            node.followers.forEach(follower => {
                const followerIndex = data.findIndex(item => item.id === follower);
                if (followerIndex !== -1) {
                    this.addEdge(index, followerIndex);
                }
            });
        });
    }

    addEdge(src, dest) {
        this.adjList[src].push(dest);
        addEdge(this.nodeObjects[src], this.nodeObjects[dest]);
    }

    BFS(startNode) {
        const visited = Array(this.numNodes).fill(false);
        const queue = [];
        const steps = [];

        visited[startNode] = true;
        queue.push(startNode);

        const bfs = (currentNode) => {
            if (!queue.length) return;

            currentNode = queue.shift();

            steps.push(() => {
                this.adjList[currentNode].forEach(it => {
                    if (!visited[it]) {
                        queue.push(it);
                        visited[it] = true;
                    }
                });

                bfs();
            });
        }

        bfs();

        return steps;
    }
}

const overlayCanvas = document.querySelector('#overlayCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: overlayCanvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

function addNode(id) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);

    const x = Math.random() * 3 - 1.5;
    const y = Math.random() * 3 - 1.5;
    sphere.position.set(x, y, 0);
    scene.add(sphere);
    createLabel(id, x, y, 0);

    return sphere;
}

function addEdge(node1, node2) {
    const points = [];
    points.push(new THREE.Vector3(node1.position.x, node1.position.y, node1.position.z));
    points.push(new THREE.Vector3(node2.position.x, node2.position.y, node2.position.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function createLabel(id, x, y, z) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = id;
    div.style.marginTop = '-1em';
    const label = new CSS2DObject(div)
    label.position.set(x, y, z);
    scene.add(label);
    return label;
}

// Fetch data from personas.json
fetch('personas.json')
    .then(response => response.json())
    .then(data => {
        let graph = new Graph(data);
        let stepIndex = 0;
        const steps = graph.BFS(0);

        function animate() {
            if (stepIndex < steps.length) {
                steps[stepIndex++]();
                renderer.render(scene, camera);
                labelRenderer.render(scene, camera);
                setTimeout(animate, 500); // Retardo de 500 ms entre cada paso
            }
        }

        // Agregar DragControls
        const dragControls = new DragControls(graph.nodeObjects, camera, renderer.domElement);
        dragControls.addEventListener('drag', function (event) {
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
        });
        
        animate();
    });

// Control de la cámara con las teclas "awsd"
document.addEventListener('keydown', function (event) {
    const speed = 0.1;
    switch (event.key) {
        case 'a':
            camera.position.x -= speed;
            break;
        case 'd':
            camera.position.x += speed;
            break;
        case 'w':
            camera.position.z -= speed;
            break;
        case 's':
            camera.position.z += speed;
            break;
    }
    // Renderiza la escena después de mover la cámara
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
});