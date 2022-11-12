import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const brown = '#8A515E'
const yellow = '#F5E69D'
const orange = '#EE9269'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)
renderer.domElement.setAttribute('class', 'webgl')

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  500
)
camera.position.set(0, 25, 20)

const scene = new THREE.Scene()
scene.background = new THREE.Color(brown)

const sphereGeometry = new THREE.SphereGeometry(5, 32, 16)
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: brown,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)

addSmallSpheres()

function addSmallSpheres() {
  const sphereVertexs = sphereGeometry.attributes.position.array

  const sharedSphereGeometry = new THREE.SphereGeometry(0.2, 32, 16)
  const yellowMaterial = new THREE.MeshBasicMaterial({
    color: yellow,
  })
  const orangeMaterial = new THREE.MeshBasicMaterial({
    color: orange,
  })
  for (let i = 0; i < 200; i++) {
    const type = Math.floor(Math.random() * 2) === 0 ? 'small' : 'big'
    const sphere = new THREE.Mesh(sharedSphereGeometry, type === 'small' ? yellowMaterial : orangeMaterial)
    const pos = Math.floor((Math.random() * sphereVertexs.length) / 3)
    sphere.position.x = sphereVertexs[pos * 3]
    sphere.position.y = sphereVertexs[pos * 3 + 1]
    sphere.position.z = sphereVertexs[pos * 3 + 2]
    if (type === 'big') {
      sphere.scale.set(2, 2, 2)
    }
    scene.add(sphere)

    animateSmallSphere(sphere)
  }
}

function animateSmallSphere(sphere: THREE.Mesh) {
  const sphericalStart = new THREE.Spherical()
  sphericalStart.setFromVector3(sphere.position)
  const startPhi = sphericalStart.phi
  const startTheta= sphericalStart.theta

  const animationObj = {
    angle: 0
  }

  gsap.to(
    animationObj,
    {
      angle: Math.PI *2,
      repeat: -1,
      yoyo: true,
      duration: 5,
      onUpdate: function () {
        sphericalStart.phi = startPhi + Math.sin(animationObj.angle) * 0.7
        sphericalStart.theta = startTheta + Math.cos(animationObj.angle) * 0.7

        sphere.position.setFromSpherical(sphericalStart)
      },
    }
  )
}

const clock = new THREE.Clock()
function animate() {
  const elapsedTime = clock.getElapsedTime()

  camera.position.x = Math.sin(elapsedTime) * 15
  camera.position.z = Math.cos(elapsedTime) * 25
  camera.lookAt(sphere.position)

  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
})
