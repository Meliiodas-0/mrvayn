import { BufferAttribute, BufferGeometry, type Material } from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import type { Letterform, Point } from "./letterforms";

// Cast each letter as one continuous surface, including its branching joins.
export function castLetter(glyph: Letterform, material: Material) {
  const resolution = 64;
  const extent = 2.15;
  const depth = .55;
  const radius = .41;
  const strokes = glyph.strokes.map(stroke => {
    const edges: [Point, Point][] = [];
    let previous = stroke.start;
    stroke.segments.forEach(segment => {
      const start = previous;
      const steps = segment.kind === "curve" ? 16 : 1;
      for (let step = 1; step <= steps; step++) {
        const t = step / steps;
        const u = 1 - t;
        const end: Point = segment.kind === "line" ? segment.to : [
          u * u * start[0] + 2 * u * t * segment.control[0] + t * t * segment.to[0],
          u * u * start[1] + 2 * u * t * segment.control[1] + t * t * segment.to[1],
        ];
        edges.push([previous, end]);
        previous = end;
      }
    });
    return edges;
  });

  const surface = new MarchingCubes(resolution, material, false, false, 40000);
  surface.isolation = 0;
  for (let gy = 0; gy < resolution; gy++) {
    const y = (gy / resolution * 2 - 1) * extent;
    for (let gx = 0; gx < resolution; gx++) {
      const x = (gx / resolution * 2 - 1) * extent;
      let distance = Infinity;
      strokes.forEach(edges => {
        let squared = Infinity;
        edges.forEach(([a, b]) => {
          const dx = b[0] - a[0];
          const dy = b[1] - a[1];
          const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
          squared = Math.min(squared, (x - a[0] - t * dx) ** 2 + (y - a[1] - t * dy) ** 2);
        });
        const next = Math.sqrt(squared);
        const blend = Math.max(.18 - Math.abs(distance - next), 0) / .18;
        distance = Math.min(distance, next) - blend * blend * .045;
      });
      for (let gz = 0; gz < resolution; gz++) {
        const z = (gz / resolution * 2 - 1) * depth / .74;
        surface.field[gx + gy * resolution + gz * resolution * resolution] = radius - Math.sqrt(distance * distance + z * z);
      }
    }
  }
  surface.blur(.85);
  surface.update();
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(surface.positionArray.slice(0, surface.count * 3), 3));
  geometry.setAttribute("normal", new BufferAttribute(surface.normalArray.slice(0, surface.count * 3), 3));
  geometry.scale(extent, extent, depth);
  geometry.computeBoundingSphere();
  // Retain only the finished mesh, not the temporary voxel volume or spare buffers.
  surface.geometry.dispose();
  return geometry;
}
