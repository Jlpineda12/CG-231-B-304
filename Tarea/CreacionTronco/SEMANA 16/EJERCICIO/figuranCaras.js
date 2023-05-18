

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);
//Creacion escena
var scene = new THREE.Scene();
//Creacion camara
var camera = new THREE.PerspectiveCamera(80, WIDTH / HEIGHT);
//Posicion de la camara en la escena
camera.position.z = 4.5;
camera.position.x = -1.2;
camera.position.y = 2;
camera.rotation.set(0, -0.5, 0);
scene.add(camera);
//OrbitControls para navegar la vista en la escena
var controls = new THREE.OrbitControls(camera, renderer.domElement);
//Creacion funcion poligono 
function poligono(nlados, ladoigual)//Dicha funcion se crea para facilitar la cuenta de caras
{
  const vertices = [];//Arreglo de vertices vacio
    const ang = 2*Math.PI/nlados;
    for (let i = 0; i <= nlados; i++) {
        let x = ladoigual * Math.cos(i * ang);
        let y = ladoigual * Math.sin(i * ang);
        vertices[i] = new THREE.Vector3(x, y, 0);//Hallamos los vertices con trigonometria
    }
    return vertices;
}
//Creacion funcion para crear el tronco
function tronco(nlados, ladoigual,altura,apotema){//Se le agrega parametros pedidos
  
  const vertices=poligono(nlados,ladoigual);
  //Calcular apotemas y radios de las bases
  //Se calcula la altura de la parte piramidal del tronco restando el apotema de la base superior a la altura total.
  
  const apotemaInf = ladoigual / (2 * Math.tan(Math.PI / nlados));
  const apotemaSup = (apotemaInf * apotema) / 100;
  const radioInf = apotemaInf / Math.tan(Math.PI / nlados);
  const radioSup = apotemaSup / Math.tan(Math.PI / nlados);
  const alturaPiramide = altura - apotemaSup;

  // Creamos las geometrías de las bases y el cuerpo
  const geometriaInf = new THREE.BufferGeometry().setFromPoints(vertices);
  const geometriaSup = new THREE.BufferGeometry().setFromPoints(vertices);
  const geometriaCuerpo = new THREE.CylinderGeometry(radioInf, radioSup,alturaPiramide,nlados );

 // Creamos el material para todas las partes de la figura
 const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
 const materialVertices = new THREE.LineBasicMaterial({ color: 0x000000 });

// Creamos las mallas de las bases y el cuerpo
  const baseInf = new THREE.Mesh(geometriaInf, material);
  const baseSup = new THREE.Mesh(geometriaSup, material);
  const cuerpo = new THREE.Mesh(geometriaCuerpo, material);
  const meshVertices = new THREE.LineLoop(geometriaCuerpo, materialVertices);

  // Colocamos las bases y el cuerpo en su posición correcta,se organizan 
  baseInf.position.y = alturaPiramide / -2;
  baseSup.position.y = altura - apotemaSup / 2;
  cuerpo.position.y = (altura - apotemaSup) / 2;
  meshVertices.position.y = (altura - apotemaSup) / 2;

  // Juntamos todo para crear la figura ya terminada

  const terminado = new THREE.Group();

  terminado.add(cuerpo);
  terminado.add(meshVertices);

  // Retornamos el objeto Group
  return terminado;

}
const troncoFig = tronco(4, 1, 2, 20);
scene.add(troncoFig);


//Luz de la escena 
const light = new THREE.DirectionalLight(0xffffff, 1);
// Modificar la posición y dirección de la luz
light.position.set(-5, 10, 10);
light.target.position.set(0, 0, 0);

// Modificar el color y la intensidad de la luz
light.color.set(0xffa500);
light.intensity = 2;
scene.add(light);


const size = 150;
const divisions = 160;
//Grilla con ejes 
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);




function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();