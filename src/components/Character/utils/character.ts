import * as THREE from "three";
import { GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();

  const loadCharacter = () => {
    return new Promise<GLTF | null>((resolve, reject) => {
      loader.load(
        "/models/anime.glb",
        async (gltf) => {
          const character = gltf.scene;

          // Scale & position for ideal camera framing (camera at Y: 13.1, Z: 24.7)
          character.scale.set(4.0, 4.0, 4.0);
          character.position.set(0, 8.5, 0);

          // Face the camera directly (VRM rest pose faces -Z, rotating Math.PI faces +Z towards camera)
          character.rotation.y = Math.PI;

          // Configure shadow and materials
          character.traverse((child: any) => {
            if (child.isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.frustumCulled = false;

              // Ensure anime materials look crisp and clean
              if (mesh.material) {
                const mats = Array.isArray(mesh.material)
                  ? mesh.material
                  : [mesh.material];
                mats.forEach((m: any) => {
                  if (m.roughness !== undefined) m.roughness = 0.55;
                  if (m.metalness !== undefined) m.metalness = 0.1;
                });
              }
            }
          });

          // Pose arms naturally DOWN by sides from T-pose
          const lArm = character.getObjectByName("J_Bip_L_UpperArm");
          const rArm = character.getObjectByName("J_Bip_R_UpperArm");
          if (lArm) {
            lArm.rotation.z = 1.28;  // Rotates down along side
            lArm.rotation.y = -0.15; // Natural slight forward angle
            lArm.rotation.x = 0.05;
          }
          if (rArm) {
            rArm.rotation.z = -1.28; // Rotates down along side
            rArm.rotation.y = 0.15;  // Natural slight forward angle
            rArm.rotation.x = 0.05;
          }

          const lForearm = character.getObjectByName("J_Bip_L_LowerArm");
          const rForearm = character.getObjectByName("J_Bip_R_LowerArm");
          if (lForearm) lForearm.rotation.z = 0.22;
          if (rForearm) rForearm.rotation.z = -0.22;

          // Hands natural relaxed curve
          const lHand = character.getObjectByName("J_Bip_L_Hand");
          const rHand = character.getObjectByName("J_Bip_R_Hand");
          if (lHand) lHand.rotation.y = -0.1;
          if (rHand) rHand.rotation.y = 0.1;

          // Wire head and neck bones for mouse cursor tracking
          const headBone = character.getObjectByName("J_Bip_C_Head");
          if (headBone) {
            headBone.name = "spine006"; // Map to mouse tracking & GSAP
          }
          const neckBone = character.getObjectByName("J_Bip_C_Neck");
          if (neckBone) {
            neckBone.name = "spine005"; // Map to GSAP scroll timeline
          }

          // ScreenLight mesh for "What I Do" section
          const screenLightGeo = new THREE.PlaneGeometry(0.8, 0.5);
          const screenLightMat = new THREE.MeshStandardMaterial({
            color: 0xc2a4ff,
            emissive: 0xc2a4ff,
            emissiveIntensity: 2.5,
            transparent: true,
            opacity: 0,
          });
          const screenLightMesh = new THREE.Mesh(screenLightGeo, screenLightMat);
          screenLightMesh.name = "screenlight";
          screenLightMesh.position.set(0, 1.25, -0.4);
          character.add(screenLightMesh);

          // Subtle floating cyber ring around waist
          const auraRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.48, 0.015, 16, 64),
            new THREE.MeshBasicMaterial({
              color: 0xc2a4ff,
              transparent: true,
              opacity: 0.55,
            })
          );
          auraRing.rotation.x = Math.PI / 2;
          auraRing.position.set(0, 0.85, 0);
          auraRing.name = "auraRing";
          character.add(auraRing);

          await renderer.compileAsync(character, camera, scene);
          scene.add(character);

          setCharTimeline(character, camera);
          setAllTimeline();

          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error("Error loading anime GLTF model:", error);
          reject(error);
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
