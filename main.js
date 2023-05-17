import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';


class Graph {
    constructor(numNodes) {
        this.numNodes = numNodes;
        this.adjList = Array(numNodes).fill(null).map(() => []);
        this.nodeObjects = Array(numNodes).fill(null);
    }

    addEdge(src, dest) {
        this.adjList[src].push(dest);
        // Uncomment the following line for an undirected graph
        // this.adjList[dest].push(src);
    }

    BFS(startNode) {
        const visited = Array(this.numNodes).fill(false);
        const queue = [];

        visited[startNode] = true;
        queue.push(startNode);

        const bfs = (currentNode) => {
            if (!queue.length) return;

            currentNode = queue.shift();
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
        }

        bfs();
    }
}

const overlayCanvas = document.querySelector('#overlayCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: overlayCanvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

function addNode(id, x, y) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, id * 0.5); // Using id for z-coordinate
    scene.add(sphere);
    createLabel(id, x, y, id * 0.5);
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

let graph = new Graph(5);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 2);
graph.addEdge(2, 0);
graph.addEdge(2, 3);
graph.addEdge(3, 3);
graph.BFS(2);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}


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



animate();

