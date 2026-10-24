import * as THREE from 'three';
import { makeChair } from '../Utils/index.js';

function makeWindowFrame(wx, wy, wz) {
  const wGroup = new THREE.Group();
  const wMat = new THREE.MeshStandardMaterial({
    color: 0x3a2858,
    emissive: 0x8070d0,
    emissiveIntensity: 0.35,
  });

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.06), wMat);
  top.position.y = 0.87;
  const bot = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.06), wMat);
  bot.position.y = -0.87;
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.8, 0.06), wMat);
  left.position.x = -0.67;
  const right = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.8, 0.06), wMat);
  right.position.x = 0.67;
  wGroup.add(top, bot, left, right);

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.28, 1.7),
    new THREE.MeshStandardMaterial({
      color: 0x5060a8,
      emissive: 0x6080c8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  wGroup.add(glass);
  wGroup.position.set(wx, wy, wz);
  return wGroup;
}

export function createFloatRoom() {
  const group = new THREE.Group();
  group.position.z = -8;

  // Room floor
  const roomFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
      color: 0x322850,
      roughness: 0.92,
      metalness: 0.08,
    })
  );
  roomFloor.rotation.x = -Math.PI / 2;
  roomFloor.position.y = -2;
  roomFloor.receiveShadow = true;
  group.add(roomFloor);

  // Floating chairs
  const chair1 = makeChair(-1.2, 0.5, 0);
  const chair2 = makeChair(1.5, 0.2, 0.5);
  const chair3 = makeChair(0.2, 0.8, -1);
  group.add(chair1, chair2, chair3);

  // Table
  const tableMat = new THREE.MeshStandardMaterial({
    color: 0x483868,
    roughness: 0.65,
    metalness: 0.15,
    emissive: 0x5040a0,
    emissiveIntensity: 0.3,
  });
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 0.9),
    tableMat
  );
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  tableTop.position.set(0, 0.3, 0.5);
  group.add(tableTop);

  // Small icosahedra on table
  const objGeo = new THREE.IcosahedronGeometry(0.1, 0);
  const objMat = new THREE.MeshStandardMaterial({
    color: 0xa890f0,
    emissive: 0x7060c8,
    emissiveIntensity: 0.45,
    roughness: 0.3,
    metalness: 0.6,
  });
  for (let i = 0; i < 5; i++) {
    const obj = new THREE.Mesh(objGeo, objMat);
    obj.position.set(
      tableTop.position.x + (Math.random() - 0.5) * 1,
      tableTop.position.y + 0.12,
      tableTop.position.z + (Math.random() - 0.5) * 0.6
    );
    obj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    obj.castShadow = true;
    group.add(obj);
  }

  // Window
  const win1 = makeWindowFrame(-3.5, 0.5, 0);
  win1.rotation.y = Math.PI / 2;
  group.add(win1);

  // Floating books
  for (let i = 0; i < 6; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.2 + Math.random() * 0.1,
        0.5 + Math.random() * 0.3,
        0.08
      ),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 0.35, 0.38),
        roughness: 0.9,
      })
    );
    book.position.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 2 + 0.5,
      (Math.random() - 0.5) * 3 - 1
    );
    book.rotation.set(
      Math.random() * 0.4 - 0.2,
      Math.random() * Math.PI,
      Math.random() * 0.3
    );
    book.castShadow = true;
    group.add(book);
  }

  // Expose animated objects
  group.userData.chair1 = chair1;
  group.userData.chair2 = chair2;
  group.userData.chair3 = chair3;
  group.userData.tableTop = tableTop;

  return group;
}
