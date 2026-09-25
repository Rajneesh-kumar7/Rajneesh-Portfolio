import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      const rect = canvasDiv.current.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let chestBone: THREE.Object3D | null = null;
      let auraRing: THREE.Object3D | null = null;
      let faceMesh: any = null;
      let blinkTimer = 0;
      let isBlinking = false;
      let blinkProgress = 0;
      const charBaseY = 8.5;
      let isHovered = false;
      let joyWeight = 0;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          const character = gltf.scene;
          setChar(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          chestBone = character.getObjectByName("J_Bip_C_Chest") || null;
          auraRing = character.getObjectByName("auraRing") || null;

          character.traverse((child: any) => {
            if (
              child.isMesh &&
              child.morphTargetDictionary &&
              child.morphTargetDictionary["Fcl_EYE_Close"] !== undefined
            ) {
              faceMesh = child;
            }
          });

          let introStarted = false;
          const triggerIntro = () => {
            if (introStarted) return;
            introStarted = true;
            light.turnOnLights();
            animations.startIntro();
          };

          progress.loaded().then(() => {
            setTimeout(triggerIntro, 500);
          });

          // Fallback in case progress.loaded is slow or already resolved
          setTimeout(triggerIntro, 1200);

          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      if (hoverDivRef.current) {
        hoverDivRef.current.addEventListener("mouseenter", () => {
          isHovered = true;
        });
        hoverDivRef.current.addEventListener("mouseleave", () => {
          isHovered = false;
        });
      }

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      document.addEventListener("mousemove", onMouseMove);

      let animId = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);

        const time = clock.getElapsedTime();
        const delta = Math.min(clock.getDelta(), 0.1);

        if (character) {
          character.position.y = charBaseY + Math.sin(time * 1.5) * 0.05;
        }
        if (chestBone) {
          chestBone.rotation.x = Math.sin(time * 1.8) * 0.015;
        }
        if (auraRing) {
          auraRing.rotation.z = time * 0.6;
          auraRing.position.y = 0.85 + Math.sin(time * 2.0) * 0.02;
        }

        // Natural anime eye blinking
        if (faceMesh && faceMesh.morphTargetDictionary) {
          const eyeCloseIndex = faceMesh.morphTargetDictionary["Fcl_EYE_Close"];
          if (eyeCloseIndex !== undefined) {
            blinkTimer += delta;
            if (!isBlinking && blinkTimer > 2.8 + Math.random() * 2) {
              isBlinking = true;
              blinkTimer = 0;
              blinkProgress = 0;
            }
            if (isBlinking) {
              blinkProgress += delta * 14;
              const weight = Math.sin(Math.min(blinkProgress, Math.PI));
              faceMesh.morphTargetInfluences[eyeCloseIndex] = weight;
              if (blinkProgress >= Math.PI) {
                isBlinking = false;
                faceMesh.morphTargetInfluences[eyeCloseIndex] = 0;
              }
            }
          }

          // Subtle friendly smile on hover
          const joyIndex = faceMesh.morphTargetDictionary["Fcl_ALL_Joy"];
          if (joyIndex !== undefined) {
            const targetJoy = isHovered ? 0.65 : 0;
            joyWeight = THREE.MathUtils.lerp(joyWeight, targetJoy, 0.1);
            faceMesh.morphTargetInfluences[joyIndex] = joyWeight;
          }
        }

        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animId);
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
