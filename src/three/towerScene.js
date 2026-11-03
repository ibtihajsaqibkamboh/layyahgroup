import * as THREE from 'three'

/*
 * Procedural luxury tower for the hero.
 * Floors assemble from the podium upward, gold fins rise, the crown lights,
 * then the camera drifts slowly. Rendering pauses when the hero is off-screen.
 */

const GOLD = 0x28b9ef

// Seeded random so the lit-window pattern is the same on every visit.
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// One strip of windows as a canvas texture: warm lit units, dark glass between.
function windowStrip(seed) {
  const rnd = seeded(seed)
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 64
  const g = c.getContext('2d')
  g.fillStyle = '#04060a'
  g.fillRect(0, 0, 512, 64)
  const cols = 14
  const w = 512 / cols
  for (let i = 0; i < cols; i++) {
    const lit = rnd() > 0.52
    g.fillStyle = lit
      ? `rgba(242, 204, 140, ${0.55 + rnd() * 0.45})`
      : `rgba(52, 86, 112, ${0.18 + rnd() * 0.22})`
    g.fillRect(i * w + 3, 6, w - 6, 52)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// A small studio "room" baked into an environment map, so the glass reflects
// soft light without loading any HDR file.
function studioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new THREE.Scene()
  room.background = new THREE.Color(0x0d0b24)
  const panel = new THREE.BoxGeometry(1, 1, 1)
  const addLight = (color, intensity, pos, scale) => {
    const m = new THREE.Mesh(panel, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity) }))
    m.position.set(pos[0], pos[1], pos[2])
    m.scale.set(scale[0], scale[1], scale[2])
    room.add(m)
  }
  addLight(0xffe2b0, 6, [-6, 4, 2], [0.2, 6, 8]) // warm softbox
  addLight(0xbcd2ff, 2.5, [6, 3, -3], [0.2, 4, 6]) // cool fill
  addLight(0xffffff, 3, [0, 8, 0], [10, 0.2, 10]) // overhead
  const env = pmrem.fromScene(room, 0.04).texture
  pmrem.dispose()
  panel.dispose()
  return env
}

export function createTowerScene(canvas, { lowPower = false, reducedMotion = false } = {}) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, alpha: true, powerPreference: 'high-performance' })
  } catch (e) {
    return null // no WebGL: the hero falls back to its CSS backdrop
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.4 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  scene.environment = studioEnvironment(renderer)
  scene.fog = new THREE.Fog(0x0d0b24, 30, 70)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
  const lookAt = new THREE.Vector3(0, 8.5, 0)

  // Lights
  scene.add(new THREE.HemisphereLight(0xdfe6f0, 0x1a1712, 0.55))
  const sun = new THREE.DirectionalLight(0xffd9a0, 2.2)
  sun.position.set(-14, 22, 12)
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0x8fb4ff, 0.8)
  rim.position.set(12, 8, -14)
  scene.add(rim)

  // Materials
  const concrete = new THREE.MeshStandardMaterial({ color: 0x2b2d31, roughness: 0.85, metalness: 0.05 })
  const slabMat = new THREE.MeshStandardMaterial({ color: 0xd9d6cf, roughness: 0.6, metalness: 0.0 })
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.28, metalness: 1, envMapIntensity: 1.4 })
  const glassMats = [11, 37, 73].map(
    (seed) =>
      new THREE.MeshStandardMaterial({
        color: 0x0a1118,
        roughness: 0.08,
        metalness: 0.9,
        emissive: 0xffffff,
        emissiveMap: windowStrip(seed),
        emissiveIntensity: 0,
        envMapIntensity: 1.6,
      }),
  )

  const tower = new THREE.Group()
  scene.add(tower)

  // Ground and drawing grid
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(60, 64),
    new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.95 }),
  )
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
  const grid = new THREE.GridHelper(60, 40, GOLD, 0x34373d)
  grid.material.transparent = true
  grid.material.opacity = 0.16
  grid.position.y = 0.01
  scene.add(grid)

  // Podium (two-storey base with a lit lobby band)
  const PODIUM_H = 1.6
  const podium = new THREE.Group()
  const podiumBox = new THREE.Mesh(new THREE.BoxGeometry(9, PODIUM_H, 8), concrete)
  podiumBox.position.y = PODIUM_H / 2
  const lobby = new THREE.Mesh(
    new THREE.BoxGeometry(9.05, 0.6, 8.05),
    new THREE.MeshStandardMaterial({ color: 0x0c0d0f, emissive: 0xf0c784, emissiveIntensity: 0.0, roughness: 0.3 }),
  )
  lobby.position.y = 0.42
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(5, 0.08, 1.6), gold)
  canopy.position.set(0, 0.9, 4.7)
  podium.add(podiumBox, lobby, canopy)
  tower.add(podium)

  // Floors
  const FLOORS = lowPower ? 16 : 22
  const FLOOR_H = 0.74
  const SETBACK_AT = Math.round(FLOORS * 0.7)
  const W1 = 5.6
  const W2 = 4.4
  const floors = []
  for (let i = 0; i < FLOORS; i++) {
    const w = i >= SETBACK_AT ? W2 : W1
    const f = new THREE.Group()
    f.position.y = PODIUM_H + i * FLOOR_H
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.34, 0.12, w + 0.34), slabMat)
    slab.position.y = 0.06
    const glass = new THREE.Mesh(new THREE.BoxGeometry(w, FLOOR_H - 0.12, w), glassMats[i % 3])
    glass.position.y = 0.12 + (FLOOR_H - 0.12) / 2
    f.add(slab, glass)
    f.userData.baseY = f.position.y
    tower.add(f)
    floors.push(f)
  }
  const roofY = PODIUM_H + FLOORS * FLOOR_H

  // Gold corner fins (grow from their base)
  const fins = []
  const addFins = (w, y0, h) => {
    const geo = new THREE.BoxGeometry(0.1, h, 0.1)
    geo.translate(0, h / 2, 0)
    const o = w / 2 + 0.2
    ;[
      [o, o],
      [-o, o],
      [o, -o],
      [-o, -o],
      [0, o + 0.02],
      [0, -o - 0.02],
    ].forEach(([x, z]) => {
      const fin = new THREE.Mesh(geo, gold)
      fin.position.set(x, y0, z)
      fin.scale.y = 0.0001
      tower.add(fin)
      fins.push(fin)
    })
  }
  addFins(W1, PODIUM_H, SETBACK_AT * FLOOR_H)
  addFins(W2, PODIUM_H + SETBACK_AT * FLOOR_H, (FLOORS - SETBACK_AT) * FLOOR_H)

  // Roof slab and open crown frame
  const roof = new THREE.Mesh(new THREE.BoxGeometry(W2 + 0.5, 0.18, W2 + 0.5), slabMat)
  roof.position.y = roofY + 0.09
  tower.add(roof)
  const crownGeo = new THREE.BoxGeometry(W2 * 0.86, 1.5, W2 * 0.86)
  const crown = new THREE.LineSegments(
    new THREE.EdgesGeometry(crownGeo),
    new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }),
  )
  crown.position.y = roofY + 0.9
  tower.add(crown)
  crownGeo.dispose()

  // Floating dust in the light
  const DUST = lowPower ? 90 : 220
  const dustPos = new Float32Array(DUST * 3)
  const rnd = seeded(5)
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (rnd() - 0.5) * 30
    dustPos[i * 3 + 1] = rnd() * 22
    dustPos[i * 3 + 2] = (rnd() - 0.5) * 30
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: 0xe8cf9f, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false }),
  )
  scene.add(dust)

  // Layout: tower sits right of the headline on wide screens, centred behind it on narrow ones
  let wide = true
  const camBase = new THREE.Vector3()
  function resize() {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    wide = camera.aspect > 1.05
    tower.position.x = wide ? 6.2 : 0
    tower.position.z = wide ? 0 : -6
    camBase.set(wide ? 6 : 14, wide ? 5.5 : 4, wide ? 34 : 38)
    camera.fov = wide ? 30 : 36
    camera.updateProjectionMatrix()
  }
  resize()

  // State driven by GSAP and input
  const state = { spin: 0, scroll: 0, mx: 0, my: 0, built: 0 }
  const target = { mx: 0, my: 0 }

  function render() {
    const s = state.scroll
    camera.position.set(
      camBase.x + state.mx * 1.6 - s * 4,
      camBase.y + state.my * 0.8 + s * 9,
      camBase.z - s * 6,
    )
    lookAt.set(wide ? 4 : 0, 8.5 + s * 6, 0)
    camera.lookAt(lookAt)
    tower.rotation.y = -0.55 + state.spin
    renderer.render(scene, camera)
  }

  let running = false
  let raf = 0
  const clock = new THREE.Clock()
  function loop() {
    if (!running) return
    const dt = Math.min(clock.getDelta(), 0.05)
    if (!reducedMotion) {
      state.spin += dt * 0.05
      state.mx += (target.mx - state.mx) * 0.04
      state.my += (target.my - state.my) * 0.04
      dust.rotation.y += dt * 0.01
      dust.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.3
    }
    render()
    raf = requestAnimationFrame(loop)
  }

  function start() {
    if (running) return
    running = true
    clock.getDelta()
    raf = requestAnimationFrame(loop)
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  // Hidden pre-build state
  floors.forEach((f) => {
    f.scale.y = 0.0001
    f.position.y = f.userData.baseY + 1.5
  })
  podium.scale.y = 0.0001
  render()

  // Called by the hero once the opening sequence hands over.
  function build(gsap) {
    const finish = () => {
      glassMats.forEach((m) => (m.emissiveIntensity = 1))
      lobby.material.emissiveIntensity = 1.2
      crown.material.opacity = 1
      fins.forEach((f) => (f.scale.y = 1))
      floors.forEach((f) => {
        f.scale.y = 1
        f.position.y = f.userData.baseY
      })
      podium.scale.y = 1
      render()
    }
    if (reducedMotion || !gsap) return finish()
    const tl = gsap.timeline()
    tl.to(podium.scale, { y: 1, duration: 0.7, ease: 'power3.out' })
    floors.forEach((f, i) => {
      tl.to(f.scale, { y: 1, duration: 0.55, ease: 'power3.out' }, 0.35 + i * 0.07)
      tl.to(f.position, { y: f.userData.baseY, duration: 0.65, ease: 'power3.out' }, 0.35 + i * 0.07)
    })
    const done = 0.35 + FLOORS * 0.07
    tl.to(fins.map((f) => f.scale), { y: 1, duration: 1.1, ease: 'expo.out', stagger: 0.03 }, done - 0.5)
    tl.to(crown.material, { opacity: 1, duration: 0.8 }, done)
    tl.to(glassMats, { emissiveIntensity: 1, duration: 1.4, ease: 'power2.inOut', stagger: 0.15 }, done - 0.6)
    tl.to(lobby.material, { emissiveIntensity: 1.2, duration: 1 }, done - 0.2)
    tl.fromTo(state, { spin: -0.6 }, { spin: 0, duration: done + 1.2, ease: 'power3.out' }, 0)
    return tl
  }

  const onPointer = (e) => {
    target.mx = (e.clientX / window.innerWidth - 0.5) * 2
    target.my = (e.clientY / window.innerHeight - 0.5) * -2
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('resize', resize)

  function setScroll(p) {
    state.scroll = p
    if (!running) render()
  }

  function dispose() {
    stop()
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('resize', resize)
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (m.emissiveMap) m.emissiveMap.dispose()
          m.dispose()
        })
      }
    })
    if (scene.environment) scene.environment.dispose()
    renderer.dispose()
  }

  return { start, stop, build, setScroll, dispose, render }
}
