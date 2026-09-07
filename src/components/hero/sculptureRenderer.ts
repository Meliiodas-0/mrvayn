import {
  ACESFilmicToneMapping, Box3, Color, DirectionalLight, DoubleSide,
  Group, Mesh, MeshBasicMaterial, MeshPhysicalMaterial,
  OrthographicCamera, PlaneGeometry, PMREMGenerator,
  Scene, Vector3, WebGLRenderer,
} from "three";
import { castLetter } from "./sculptureGeometry";
import { DESKTOP_LETTERS, LETTERFORMS, PHONE_LETTERS } from "./letterforms";
import { HERO_MOTION, type HeroMotion } from "@/lib/heroMotion";
import { letterPose, type SculptureScroll } from "./sculptureTimeline";

export interface SculptureRenderer {
  update: (x: number, y: number, tuning: HeroMotion, scroll: SculptureScroll) => void;
  setVisible: (visible: boolean) => void;
  dispose: () => void;
}

export function createSculpture(host: HTMLElement, onContextLost: () => void): SculptureRenderer {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x07080b, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.className = "sculpture-canvas";
  const scene = new Scene();
  const camera = new OrthographicCamera(-7, 7, 4.5, -4.5, .1, 100);
  camera.position.set(0, 0, 22);
  const assembly = new Group();
  scene.add(assembly);

  // Original neutral studio environment. Its softboxes appear only as reflections.
  const lightRoom = new Scene();
  lightRoom.background = new Color(.075, .08, .09);
  const softboxGeometry = new PlaneGeometry(1, 1);
  const lights: MeshBasicMaterial[] = [];
  const addSoftbox = (x: number, y: number, z: number, w: number, h: number, intensity: number) => {
    const material = new MeshBasicMaterial({ color: new Color(intensity, intensity, intensity), side: DoubleSide });
    lights.push(material);
    const panel = new Mesh(softboxGeometry, material);
    panel.position.set(x, y, z);
    panel.scale.set(w, h, 1);
    panel.lookAt(0, 0, 0);
    lightRoom.add(panel);
  };
  addSoftbox(-5, 7, 7, 5, 9, 5);
  addSoftbox(7, 2, 6, 3, 10, 3);
  addSoftbox(0, -7, 4, 8, 2, 1.8);
  addSoftbox(-9, -2, -2, 2, 8, 3);
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(lightRoom, .02);
  scene.environment = environment.texture;
  pmrem.dispose();
  softboxGeometry.dispose();
  lights.forEach(light => light.dispose());

  const material = new MeshPhysicalMaterial({
    color: 0x23252a,
    metalness: .84,
    roughness: .32,
    clearcoat: .85,
    clearcoatRoughness: .24,
    envMapIntensity: 1.05,
  });
  const key = new DirectionalLight(0xdde3ed, 2.2);
  key.position.set(-6, 8, 8);
  scene.add(key);
  const rim = new DirectionalLight(0xa3afbf, .75);
  rim.position.set(7, -3, 4);
  scene.add(rim);

  const geometries = LETTERFORMS.map(glyph => castLetter(glyph, material));
  const letters = geometries.map((geometry, index) => {
    const letter = new Mesh(geometry, material);
    letter.name = LETTERFORMS[index].letter;
    assembly.add(letter);
    return letter;
  });

  let disposed = false;
  let contextLost = false;
  let visible = true;
  let frame = 0;
  let x = 0;
  let y = 0;
  let tuning: HeroMotion = HERO_MOTION;
  let layout: typeof DESKTOP_LETTERS | typeof PHONE_LETTERS = DESKTOP_LETTERS;
  let viewHeight = 10;
  let viewWidth = 16;
  let phone = false;
  let scroll: SculptureScroll = { distance: 0, chapter: 0, outro: 0 };
  const render = () => {
    frame = 0;
    if (disposed || contextLost || !visible) return;
    assembly.rotation.set(-y * tuning.rotation * .65, x * tuning.rotation, 0);
    scene.environmentRotation.set(y * tuning.lightTravel * .2, x * tuning.lightTravel + Math.min(scroll.distance, 1) * .2, 0);
    letters.forEach((letter, index) => {
      const pose = letterPose(index, { width: viewWidth, height: viewHeight, phone, letters: layout }, scroll, tuning);
      letter.position.set(pose.x, pose.y, (index % 3) * .18);
      letter.scale.setScalar(pose.scale);
      letter.rotation.set(
        pose.rx + y * .045 * (index % 2 ? -1 : 1),
        pose.ry + x * .07 * (index % 2 ? 1 : -.7),
        pose.rz + x * .018 * (index % 2 ? -1 : 1),
      );
    });
    renderer.render(scene, camera);
  };
  const invalidate = () => {
    if (!frame && !disposed && !contextLost && visible) frame = requestAnimationFrame(render);
  };
  const resize = () => {
    if (disposed) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    phone = width < 640;
    layout = phone ? PHONE_LETTERS : DESKTOP_LETTERS;
    letters.forEach((letter, index) => {
      const [lx, ly, angle] = layout[index];
      letter.position.set(lx, ly, (index % 3) * .18);
      letter.rotation.set(0, 0, angle);
      letter.scale.setScalar(1);
    });
    assembly.rotation.set(0, 0, 0);
    assembly.position.set(0, 0, 0);
    assembly.updateMatrixWorld(true);
    const box = new Box3().setFromObject(assembly);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    assembly.position.set(-center.x, -center.y, 0);
    const aspect = width / height;
    viewHeight = Math.max(size.y * 1.22, size.x / aspect * 1.065);
    viewWidth = viewHeight * aspect;
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    // Bound GPU work at 2K as well as on high-density phones.
    const pixelBudget = Math.sqrt(2200000 / (width * height));
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, phone ? 1.5 : 1.75, pixelBudget));
    renderer.setSize(width, height, false);
    invalidate();
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    onContextLost();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  host.appendChild(renderer.domElement);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  if (frame) { cancelAnimationFrame(frame); frame = 0; }
  render();

  return {
    update: (nextX, nextY, nextTuning, nextScroll) => { x = nextX; y = nextY; tuning = nextTuning; scroll = nextScroll; invalidate(); },
    setVisible: value => {
      visible = value;
      if (!value && frame) { cancelAnimationFrame(frame); frame = 0; }
      else invalidate();
    },
    dispose: () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.remove();
      geometries.forEach(geometry => geometry.dispose());
      material.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
