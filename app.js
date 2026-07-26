import * as THREE from "three";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.querySelector("#avatar-canvas");
const stage = document.querySelector("#hero-stage");
const sceneButton = document.querySelector("#scene-button");
const sceneModeLabel = document.querySelector("#scene-mode-label");

const palette = {
  cream: 0xf5eee3,
  paper: 0xfffaf2,
  ink: 0x25241f,
  navy: 0x173e91,
  cyan: 0x2cc7df,
  orange: 0xff7a18,
  yellow: 0xffd449,
  skin: 0xe6b18a,
};

let renderer;
let scene;
let camera;
let avatar;
let eyes = [];
let dataGroup;
let particles = [];
let lines;
let sceneMode = 0;
let pointer = { x: 0, y: 0 };
let targetPointer = { x: 0, y: 0 };
let clock;

function roundedBox(width, height, depth, radius, material) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  );
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: radius * 0.35,
    bevelThickness: radius * 0.35,
  });
  geometry.center();
  return new THREE.Mesh(geometry, material);
}

function createAvatar() {
  const group = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({
    color: palette.skin,
    roughness: 0.8,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: palette.ink,
    roughness: 0.6,
  });
  const navy = new THREE.MeshStandardMaterial({
    color: palette.navy,
    roughness: 0.45,
  });
  const cyan = new THREE.MeshStandardMaterial({
    color: palette.cyan,
    roughness: 0.4,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: palette.orange,
    roughness: 0.45,
  });
  const paper = new THREE.MeshStandardMaterial({
    color: palette.paper,
    roughness: 0.75,
  });

  const body = roundedBox(2.08, 2.45, 0.75, 0.56, navy);
  body.position.set(0, -1.25, 0);
  body.rotation.x = -0.04;
  group.add(body);

  const shirtPanel = roundedBox(1.45, 1.2, 0.15, 0.28, cyan);
  shirtPanel.position.set(0, -1.23, 0.47);
  group.add(shirtPanel);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 40, 32),
    skin,
  );
  head.scale.y = 1.08;
  head.position.set(0, 0.62, 0);
  group.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(1.075, 40, 22, 0, Math.PI * 2, 0, 1.25),
    dark,
  );
  hair.position.set(0, 0.78, -0.03);
  hair.rotation.z = -0.08;
  group.add(hair);

  const fringe = new THREE.Mesh(
    new THREE.SphereGeometry(0.48, 24, 16),
    dark,
  );
  fringe.scale.set(1.45, 0.38, 0.7);
  fringe.position.set(-0.42, 1.38, 0.58);
  fringe.rotation.z = -0.34;
  group.add(fringe);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 16),
      skin,
    );
    ear.position.set(side * 1.01, 0.63, -0.02);
    ear.scale.x = 0.66;
    group.add(ear);

    const lens = new THREE.Mesh(
      new THREE.TorusGeometry(0.31, 0.045, 12, 28),
      dark,
    );
    lens.position.set(side * 0.39, 0.72, 0.91);
    group.add(lens);

    const eyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 20, 16),
      paper,
    );
    eyeWhite.position.set(side * 0.39, 0.72, 0.94);
    eyeWhite.scale.set(1, 1.15, 0.42);
    group.add(eyeWhite);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 16, 12),
      dark,
    );
    pupil.position.set(side * 0.39, 0.71, 1.07);
    eyes.push(pupil);
    group.add(pupil);
  });

  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.045, 0.045),
    dark,
  );
  bridge.position.set(0, 0.72, 0.92);
  group.add(bridge);

  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xd8906e, roughness: 0.8 }),
  );
  nose.scale.set(0.75, 1.15, 0.75);
  nose.position.set(0, 0.48, 1.02);
  group.add(nose);

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.035, 8, 24, Math.PI),
    dark,
  );
  smile.position.set(0, 0.25, 0.96);
  smile.rotation.z = Math.PI;
  group.add(smile);

  const laptop = roundedBox(2.22, 1.35, 0.16, 0.18, paper);
  laptop.position.set(0, -1.16, 1.03);
  laptop.rotation.x = -0.06;
  group.add(laptop);

  const laptopScreen = roundedBox(1.88, 1.04, 0.035, 0.1, dark);
  laptopScreen.position.set(0, -1.12, 1.14);
  group.add(laptopScreen);

  const regression = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.045, 0.03),
    orange,
  );
  regression.position.set(0, -1.11, 1.18);
  regression.rotation.z = 0.38;
  group.add(regression);

  for (let i = 0; i < 10; i += 1) {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 10),
      i % 3 === 0 ? orange : cyan,
    );
    const x = -0.72 + (i / 9) * 1.44;
    const y = -1.38 + (i / 9) * 0.52 + Math.sin(i * 2.1) * 0.13;
    dot.position.set(x, y, 1.2);
    group.add(dot);
  }

  const armGeometry = new THREE.CapsuleGeometry(0.19, 0.88, 8, 16);
  [-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(armGeometry, skin);
    arm.position.set(side * 1.12, -0.82, 0.55);
    arm.rotation.z = side * -0.48;
    arm.rotation.x = 0.28;
    group.add(arm);
  });

  const badge = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 28),
    orange,
  );
  badge.position.set(0.67, -0.72, 0.61);
  group.add(badge);

  return group;
}

function createDataObjects() {
  dataGroup = new THREE.Group();
  particles = [];

  const colors = [palette.cyan, palette.orange, palette.yellow, palette.navy];
  for (let i = 0; i < 30; i += 1) {
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.35,
    });
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(i % 7 === 0 ? 0.12 : 0.075, 16, 12),
      material,
    );
    particle.userData = {
      seed: i * 0.73,
      radius: 2.55 + (i % 5) * 0.23,
    };
    particles.push(particle);
    dataGroup.add(particle);
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: palette.navy,
    transparent: true,
    opacity: 0.16,
  });
  lines = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
  dataGroup.add(lines);
  scene.add(dataGroup);
  updateDataMode(0, true);
}

function updateDataMode(mode, immediate = false) {
  sceneMode = mode % 3;
  const names = ["scatter plot", "knowledge graph", "embedding space"];
  sceneModeLabel.textContent = names[sceneMode];
  const positions = [];

  particles.forEach((particle, index) => {
    const t = index / particles.length;
    let x;
    let y;
    let z;

    if (sceneMode === 0) {
      x = -2.7 + t * 5.4;
      y = -1.3 + t * 2.9 + Math.sin(index * 2.4) * 0.72;
      z = -0.7 + Math.cos(index * 1.7) * 0.65;
    } else if (sceneMode === 1) {
      const angle = t * Math.PI * 2;
      const ring = index % 3;
      const radius = 2.55 + ring * 0.48;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius * 0.7;
      z = Math.sin(index * 1.4) * 0.7;
    } else {
      const cluster = index % 3;
      const angle = index * 2.39;
      const centers = [
        [-2.1, 1.35],
        [2.0, 1.1],
        [0.2, -1.85],
      ];
      const radius = 0.25 + (index % 8) * 0.095;
      x = centers[cluster][0] + Math.cos(angle) * radius;
      y = centers[cluster][1] + Math.sin(angle) * radius;
      z = Math.cos(index * 1.8) * 0.6;
    }

    particle.userData.target = new THREE.Vector3(x, y, z);
    if (immediate) particle.position.copy(particle.userData.target);
    positions.push(x, y, z, 0, 0, 0);
  });

  if (sceneMode === 1) {
    const linePositions = [];
    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i].userData.target;
      const b = particles[(i + 5 + (i % 3)) % particles.length].userData.target;
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    lines.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );
    lines.visible = true;
  } else {
    lines.visible = false;
  }
}

function initThree() {
  if (!canvas || !stage) return;

  let hasWebGL = false;
  try {
    const probe = document.createElement("canvas");
    hasWebGL = Boolean(
      probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        probe.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    hasWebGL = false;
  }

  if (!hasWebGL) {
    stage.classList.add("no-webgl");
    canvas.hidden = true;
    return;
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    stage.classList.add("no-webgl");
    canvas.hidden = true;
    return;
  }

  stage.classList.add("webgl-ready");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.05, 9.7);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9cb5d9, 2.8));
  const key = new THREE.DirectionalLight(0xffffff, 4.5);
  key.position.set(4, 7, 8);
  scene.add(key);

  const rim = new THREE.PointLight(palette.cyan, 18, 12);
  rim.position.set(-4, 2, 4);
  scene.add(rim);

  const warm = new THREE.PointLight(palette.orange, 16, 10);
  warm.position.set(4, -2, 3);
  scene.add(warm);

  avatar = createAvatar();
  avatar.scale.setScalar(1.07);
  avatar.position.y = 0.14;
  scene.add(avatar);

  createDataObjects();
  clock = new THREE.Clock();
  resizeRenderer();
  animate();
}

function resizeRenderer() {
  if (!renderer || !stage) return;
  const rect = stage.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}

function animate() {
  const elapsed = clock.getElapsedTime();
  pointer.x += (targetPointer.x - pointer.x) * 0.055;
  pointer.y += (targetPointer.y - pointer.y) * 0.055;

  avatar.rotation.y = pointer.x * 0.2;
  avatar.rotation.x = -pointer.y * 0.08;
  avatar.position.y = 0.12 + (reducedMotion ? 0 : Math.sin(elapsed * 1.35) * 0.07);

  eyes.forEach((eye) => {
    eye.position.x +=
      (Math.sign(eye.position.x) * 0.39 + pointer.x * 0.045 - eye.position.x) *
      0.08;
    eye.position.y += (0.71 + pointer.y * 0.035 - eye.position.y) * 0.08;
  });

  particles.forEach((particle, index) => {
    particle.position.lerp(particle.userData.target, 0.045);
    if (!reducedMotion) {
      particle.position.y +=
        Math.sin(elapsed * 1.2 + particle.userData.seed) * 0.0018;
    }
    particle.scale.setScalar(
      1 + (reducedMotion ? 0 : Math.sin(elapsed * 1.5 + index) * 0.08),
    );
  });

  if (!reducedMotion) {
    dataGroup.rotation.z = Math.sin(elapsed * 0.28) * 0.025;
    dataGroup.rotation.y = pointer.x * 0.04;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

stage?.addEventListener("pointermove", (event) => {
  const rect = stage.getBoundingClientRect();
  targetPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  targetPointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
});

stage?.addEventListener("pointerleave", () => {
  targetPointer = { x: 0, y: 0 };
});

sceneButton?.addEventListener("click", () => {
  updateDataMode(sceneMode + 1);
});

window.addEventListener("resize", resizeRenderer);

const header = document.querySelector(".site-header");
window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 40),
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const cursor = document.querySelector(".cursor-orb");
if (window.matchMedia("(pointer: fine)").matches && cursor) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.opacity = "1";
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll("a, button, input").forEach((element) => {
    element.addEventListener("pointerenter", () =>
      cursor.classList.add("is-active"),
    );
    element.addEventListener("pointerleave", () =>
      cursor.classList.remove("is-active"),
    );
  });
}

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

const chart = document.querySelector("#data-chart");
const pointsGroup = chart?.querySelector(".data-points");
const gridGroup = chart?.querySelector(".grid-lines");
const connectionsGroup = chart?.querySelector(".connection-lines");
const trendGroup = chart?.querySelector(".trend-line");
const tooltip = document.querySelector("#chart-tooltip");
const sampleInput = document.querySelector("#sample-size");
const sampleValue = document.querySelector("#sample-value");
const chartEyebrow = document.querySelector("#chart-eyebrow");
const chartTitle = document.querySelector("#chart-title");
const tabs = document.querySelectorAll(".mode-tab");
let chartMode = "cells";

const chartModes = {
  cells: {
    eyebrow: "CRYOPRESERVATION EXPERIMENT",
    title: "Cooling rate vs viability",
    x: "Cooling rate",
    y: "Post-thaw viability",
    colors: ["#2cc7df", "#ff7a18"],
  },
  nlp: {
    eyebrow: "DOCUMENT EMBEDDINGS",
    title: "Semantic neighbourhoods",
    x: "Embedding dimension 1",
    y: "Embedding dimension 2",
    colors: ["#2cc7df", "#ffd449", "#ff7a18"],
  },
  network: {
    eyebrow: "BIOMEDICAL KNOWLEDGE GRAPH",
    title: "Connected evidence",
    x: "",
    y: "",
    colors: ["#2cc7df", "#ffd449", "#ff7a18", "#fffaf2"],
  },
};

function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );
  return element;
}

function buildGrid() {
  if (!gridGroup) return;
  gridGroup.replaceChildren();
  for (let x = 80; x <= 860; x += 130) {
    gridGroup.append(svgElement("line", { x1: x, y1: 55, x2: x, y2: 420 }));
  }
  for (let y = 80; y <= 420; y += 68) {
    gridGroup.append(svgElement("line", { x1: 70, y1: y, x2: 870, y2: y }));
  }
}

function getPoint(index, count, mode) {
  const randomA = seededRandom(index + count * 0.17);
  const randomB = seededRandom(index * 2.41 + count);

  if (mode === "cells") {
    const x = 90 + randomA * 745;
    const baseline = 385 - ((x - 90) / 745) * 250;
    return {
      x,
      y: Math.max(75, Math.min(402, baseline + (randomB - 0.5) * 130)),
      group: index % 2,
      label: `Run ${index + 1}`,
      value: `${Math.round(55 + ((402 - baseline) / 327) * 40 + randomB * 6)}% viability`,
    };
  }

  if (mode === "nlp") {
    const group = index % 3;
    const centers = [
      [250, 180],
      [580, 150],
      [480, 340],
    ];
    const angle = randomA * Math.PI * 2;
    const radius = 20 + randomB * 105;
    return {
      x: centers[group][0] + Math.cos(angle) * radius,
      y: centers[group][1] + Math.sin(angle) * radius * 0.65,
      group,
      label: ["Methods", "Results", "Discussion"][group],
      value: `Similarity ${(0.72 + randomB * 0.26).toFixed(2)}`,
    };
  }

  const angle = (index / count) * Math.PI * 2 + randomA * 0.2;
  const ring = index % 4;
  const radius = 70 + ring * 56 + randomB * 20;
  return {
    x: 465 + Math.cos(angle) * radius * 1.45,
    y: 245 + Math.sin(angle) * radius * 0.78,
    group: index % 4,
    label: ["Gene", "Disease", "Drug", "Paper"][index % 4],
    value: `${2 + Math.floor(randomB * 18)} connections`,
  };
}

function renderChart() {
  if (!pointsGroup || !connectionsGroup || !trendGroup) return;
  const count = Number(sampleInput?.value || 72);
  const config = chartModes[chartMode];
  const points = Array.from({ length: count }, (_, index) =>
    getPoint(index, count, chartMode),
  );

  sampleValue.textContent = String(count);
  chartEyebrow.textContent = config.eyebrow;
  chartTitle.textContent = config.title;
  chart.querySelector(".axis-label--x").textContent = config.x;
  chart.querySelector(".axis-label--y").textContent = config.y;

  pointsGroup.replaceChildren();
  connectionsGroup.replaceChildren();
  trendGroup.replaceChildren();

  if (chartMode === "cells") {
    trendGroup.append(
      svgElement("path", { d: "M 90 375 C 280 340, 560 220, 835 120" }),
    );
  }

  if (chartMode === "network") {
    points.forEach((point, index) => {
      const target = points[(index * 7 + 11) % points.length];
      if (index % 2 === 0) {
        connectionsGroup.append(
          svgElement("line", {
            x1: point.x,
            y1: point.y,
            x2: target.x,
            y2: target.y,
          }),
        );
      }
    });
  }

  points.forEach((point, index) => {
    const circle = svgElement("circle", {
      cx: point.x,
      cy: point.y,
      r: chartMode === "network" && index % 9 === 0 ? 9 : 6,
      fill: config.colors[point.group % config.colors.length],
      tabindex: "0",
      "aria-label": `${point.label}, ${point.value}`,
    });

    const showTooltip = () => {
      const shell = chart.closest(".chart-shell").getBoundingClientRect();
      const svgRect = chart.getBoundingClientRect();
      tooltip.innerHTML = `<strong>${point.label}</strong><br>${point.value}`;
      tooltip.style.left = `${(point.x / 900) * svgRect.width + svgRect.left - shell.left + 12}px`;
      tooltip.style.top = `${(point.y / 480) * svgRect.height + svgRect.top - shell.top - 16}px`;
      tooltip.classList.add("is-visible");
    };
    circle.addEventListener("pointerenter", showTooltip);
    circle.addEventListener("focus", showTooltip);
    circle.addEventListener("pointerleave", () =>
      tooltip.classList.remove("is-visible"),
    );
    circle.addEventListener("blur", () =>
      tooltip.classList.remove("is-visible"),
    );
    pointsGroup.append(circle);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    chartMode = tab.dataset.mode;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    renderChart();
  });
});

sampleInput?.addEventListener("input", renderChart);

document.querySelector("#year").textContent = new Date().getFullYear();
buildGrid();
renderChart();
initThree();
