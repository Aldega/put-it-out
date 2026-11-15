// Static validation for generated glTF files (no dependencies).
// Run: node roblox/assets/validate-rocket-meshes.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
let errors = 0;
for (const file of ['rocket-engine.gltf', 'rocket-stand.gltf']) {
  const path = join(here, 'generated', file);
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  const buffers = doc.buffers || [];
  if (!doc.asset || doc.asset.version !== '2.0' || buffers.length !== 1) throw new Error(file + ': invalid glTF header');
  const encoded = (buffers[0].uri || '').split(',')[1];
  const raw = Buffer.from(encoded || '', 'base64');
  if (raw.length !== buffers[0].byteLength) throw new Error(file + ': invalid binary buffer length');
  const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
  let triangles = 0;
  for (const mesh of doc.meshes || []) {
    for (const primitive of mesh.primitives) {
      const position = doc.accessors[primitive.attributes.POSITION];
      const normal = doc.accessors[primitive.attributes.NORMAL];
      const indices = doc.accessors[primitive.indices];
      if (position.count !== normal.count) throw new Error(mesh.name + ': mismatched normals');
      if (indices.count % 3 !== 0) throw new Error(mesh.name + ': non-triangle index count');
      if (indices.count / 3 > 20000) throw new Error(mesh.name + ': over Roblox 20k triangle budget');
      triangles += indices.count / 3;
      const ib = doc.bufferViews[indices.bufferView];
      const pv = doc.bufferViews[position.bufferView];
      const nv = doc.bufferViews[normal.bufferView];
      for (const v of [ib,pv,nv]) {
        if (v.byteOffset + v.byteLength > raw.length) throw new Error(mesh.name + ': buffer view out of range');
      }
      for (let i = 0; i < indices.count; i++) {
        const idx = view.getUint32(ib.byteOffset + i * 4, true);
        if (idx >= position.count) throw new Error(mesh.name + ': invalid vertex index');
      }
      for (let i = 0; i < position.count; i++) {
        for (let j = 0; j < 3; j++) {
          const p = view.getFloat32(pv.byteOffset + i * 12 + j * 4, true);
          const n = view.getFloat32(nv.byteOffset + i * 12 + j * 4, true);
          if (!Number.isFinite(p) || !Number.isFinite(n)) throw new Error(mesh.name + ': NaN in geometry');
        }
      }
    }
  }
  console.log(file + ': OK, ' + doc.meshes.length + ' meshes, ' + triangles + ' triangles');
}
if (errors) process.exit(1);
