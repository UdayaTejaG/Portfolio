import * as THREE from 'https://cdn.skypack.dev/three@0.137.5';


let click = false

const world = {
  plane: {
    width: 1000,
    height: 400,
    widthSegments: 100,
    heightSegments: 100
  }
}

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  // vertice position randomization
  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.6) * 2
      array[i + 1] = y + (Math.random() - 0.6) * 2
      array[i + 2] = z + (Math.random() - 0.7) * 1
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0, 0)
  }

  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}


const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  100,
  innerWidth / innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

camera.position.z = 150
camera.lookAt(0, 0.00135, 0)
console.log(camera)

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
)



const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
generatePlane()



const stars = new THREE.SphereGeometry(0.15, 0.15, 0.15);
const stars_material = new THREE.MeshPhongMaterial({
  color: 0x00ff00, emissive: 0xffffff,
  emissiveIntensity: 1000
});
const cube = []

for (var i = 0; i < 5000; i++) {
  cube[i] = new THREE.Mesh(stars, stars_material);
  cube[i].position.setX(Math.random() * 300)
  cube[i].position.setY((Math.random()) * 250)
  cube[i].position.setZ((Math.random()) * 200)
  scene.add(cube[i]);
}
for (var i = 5000; i < 10000; i++) {
  cube[i] = new THREE.Mesh(stars, stars_material);
  cube[i].position.setX(Math.random() * -300)
  cube[i].position.setY((Math.random()) * 250)
  cube[i].position.setZ((Math.random()) * 200)
  scene.add(cube[i]);
}
for (var i = 10000; i < 10500; i++) {
  cube[i] = new THREE.Mesh(stars, stars_material);
  cube[i].position.setX(Math.random() * 300)
  cube[i].position.setY((Math.random()) * -100)
  cube[i].position.setZ((Math.random()) * 200)
  scene.add(cube[i]);
}
for (var i = 10500; i < 11000; i++) {
  cube[i] = new THREE.Mesh(stars, stars_material);
  cube[i].position.setX(Math.random() * -300)
  cube[i].position.setY((Math.random()) * -100)
  cube[i].position.setZ((Math.random()) * 200)
  scene.add(cube[i]);
}




const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const mouse = {
  x: undefined,
  y: undefined
}

let frame = 0
let startframe = 0


function animate() {

  setTimeout(function () {

    requestAnimationFrame(animate);

  }, 12 - startframe);
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  frame += 0.01
    
  if (click) {

    startframe += 0.006
    moveCamera(camera, startframe);

  }


  const {
    array,
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.029

    // y
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.029
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})


document.getElementById('ViewWork').onclick = function clickView(dom) {
  document.getElementById('start_text').className = 'fade-out '; 
  setTimeout(function () {
    document.getElementById('start_text').style = 'display:none;';
    click = true
  }, 2000);

}



function moveCamera(camera, per) {
  if (camera.position.y < 145) {
    var x = 0
    var y0 = 0
    var z0 = 150
    var y1 = 0
    var z1 = 40
    var y2 = 150
    var z2 = 40
    var k = per


    var z = ((1 - k) * (1 - k)) * z0 + 2 * (1 - k) * k * z1 + (k * k) * z2
    var y = (k * k) * y2

    var az = 40//c2
    var ay = y1 - (y1 - y2) * k//c1

    var m = (z - az) / (y - ay)

    var looky = ay - (1 / m) * az


    camera.position.set(x, y, z);
    camera.lookAt(0, looky, 0);

  }
  else {
    document.body.removeChild(renderer.domElement)
    setTimeout(function () {
    document.getElementById('textapp').className = '"absolute text-black text-center "';
    document.getElementById('after_text').style = 'display:block;bac';
    document.getElementById('after_text').className = 'fade-in text-black text-4xl';
  },500)
    click = false
  }
};







window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight)

}


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


