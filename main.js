import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';


class Graph {
    constructor(numNodes) {
        this.numNodes = numNodes;
        this.adjList = Array(numNodes).fill(null).map(() => []);
        this.nodeObjects = Array(numNodes).fill(null);
        this.queue = [];
        this.visited = Array(numNodes).fill(false);
        this.currentNode = null;
    }

    addEdge(src, dest) {
        this.adjList[src].push(dest);
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
                // Create node if it doesn't exist
                if (!this.nodeObjects[currentNode]) {
                    this.nodeObjects[currentNode] = addNode(currentNode, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5);
                }

                this.adjList[currentNode].forEach(it => {
                    if (!visited[it]) {
                        queue.push(it);
                        visited[it] = true;
                        // Create node if it doesn't exist
                        if (!this.nodeObjects[it]) {
                            this.nodeObjects[it] = addNode(it, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5);
                        }
                        // Add edge
                        addEdge(this.nodeObjects[currentNode], this.nodeObjects[it]);
                    }
                });

                bfs();
            });
        }

        bfs();

        return steps;
    }

    nextStep() {
        if (!this.queue.length) return false;

        this.currentNode = this.queue.shift();

        this.adjList[this.currentNode].forEach(it => {
            if (!this.visited[it]) {
                this.queue.push(it);
                this.visited[it] = true;
                if (!this.nodeObjects[it]) {
                    this.nodeObjects[it] = addNode(it, Math.random() * 3 - 1.5, Math.random() * 3 - 1.5);
                }
                addEdge(this.nodeObjects[this.currentNode], this.nodeObjects[it]);
            }
        });
        return true;
    }
}

const overlayCanvas = document.querySelector('#overlayCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: overlayCanvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

function addNode(id) {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32); // Reduced size of nodes
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);

    // Adjusted the positions to include padding
    const x = Math.random() * 3.0 - 1.25;
    const y = Math.random() * 3.0 - 1.25;
    sphere.position.set(x, y, id * 0.1); // Adjusted the positions and z-coordinate
    scene.add(sphere);
    createLabel(id, x, y, id * 0.1);
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


let graph = new Graph(10);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(2, 5);
graph.addEdge(2, 6);
graph.addEdge(3, 7);
graph.addEdge(3, 8);
graph.addEdge(4, 9);



const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

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

animate();


