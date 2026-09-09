import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import "./styles/TechStack.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SiCplusplus,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiC,
  SiPhp,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiJsonwebtokens,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
} from "react-icons/si";

interface TechItem {
  id: string;
  name: string;
  category: "LANGUAGES" | "FRONTEND" | "BACKEND & DB" | "TOOLS & DEVOPS";
  color: string;
  icon: React.ReactNode;
}

const TECH_DATA: TechItem[] = [
  // Languages
  { id: "cpp", name: "C++", category: "LANGUAGES", color: "#00599C", icon: <SiCplusplus /> },
  { id: "js", name: "JavaScript", category: "LANGUAGES", color: "#F7DF1E", icon: <SiJavascript /> },
  { id: "ts", name: "TypeScript", category: "LANGUAGES", color: "#3178C6", icon: <SiTypescript /> },
  { id: "py", name: "Python", category: "LANGUAGES", color: "#3776AB", icon: <SiPython /> },
  { id: "c", name: "C", category: "LANGUAGES", color: "#A8B9CC", icon: <SiC /> },
  { id: "php", name: "PHP", category: "LANGUAGES", color: "#777BB4", icon: <SiPhp /> },

  // Frontend
  { id: "react", name: "React.js", category: "FRONTEND", color: "#61DAFB", icon: <SiReact /> },
  { id: "next", name: "Next.js", category: "FRONTEND", color: "#FFFFFF", icon: <SiNextdotjs /> },
  { id: "tailwind", name: "Tailwind CSS", category: "FRONTEND", color: "#06B6D4", icon: <SiTailwindcss /> },
  { id: "bootstrap", name: "Bootstrap", category: "FRONTEND", color: "#7952B3", icon: <SiBootstrap /> },
  { id: "html", name: "HTML5", category: "FRONTEND", color: "#E34F26", icon: <SiHtml5 /> },
  { id: "css", name: "CSS3", category: "FRONTEND", color: "#1572B6", icon: <SiCss /> },

  // Backend & DB
  { id: "node", name: "Node.js", category: "BACKEND & DB", color: "#5FA04E", icon: <SiNodedotjs /> },
  { id: "express", name: "Express.js", category: "BACKEND & DB", color: "#E0E0E0", icon: <SiExpress /> },
  { id: "mongo", name: "MongoDB", category: "BACKEND & DB", color: "#47A248", icon: <SiMongodb /> },
  { id: "mysql", name: "MySQL", category: "BACKEND & DB", color: "#4479A1", icon: <SiMysql /> },
  { id: "jwt", name: "JWT Auth", category: "BACKEND & DB", color: "#D63AFF", icon: <SiJsonwebtokens /> },
  { id: "rest", name: "RESTful APIs", category: "BACKEND & DB", color: "#FF6C37", icon: <SiPostman /> },

  // Tools & DevOps
  { id: "git", name: "Git", category: "TOOLS & DEVOPS", color: "#F05032", icon: <SiGit /> },
  { id: "github", name: "GitHub", category: "TOOLS & DEVOPS", color: "#FFFFFF", icon: <SiGithub /> },
  { id: "docker", name: "Docker", category: "TOOLS & DEVOPS", color: "#2496ED", icon: <SiDocker /> },
  { id: "postman", name: "Postman", category: "TOOLS & DEVOPS", color: "#FF6C37", icon: <SiPostman /> },
];

const CATEGORIES = ["ALL", "LANGUAGES", "FRONTEND", "BACKEND & DB", "TOOLS & DEVOPS"] as const;

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);

  // Spherical Coordinates pre-computation (Fibonacci Sphere distribution)
  const spherePoints = useMemo(() => {
    const total = TECH_DATA.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    return TECH_DATA.map((item, i) => {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / total);

      // Unit sphere coords
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);

      return { item, x, y, z };
    });
  }, []);

  // Physics & Rotation State
  const rotX = useRef(0.2);
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0.0035); // Base continuous idle rotation
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const animFrameId = useRef(0);

  // Node DOM elements ref
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Background Canvas for Cyber Rings & Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // Particles inside the sphere
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 2,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let ringAngle = 0;

    const renderCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const r = Math.min(width, height) * 0.42;

      // Central energy glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.1);
      grad.addColorStop(0, "rgba(194, 164, 255, 0.12)");
      grad.addColorStop(0.45, "rgba(100, 70, 180, 0.04)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Holographic Rings
      ringAngle += 0.008;
      ctx.save();
      ctx.translate(cx, cy);

      // Ring 1 (tilted)
      ctx.save();
      ctx.rotate(ringAngle * 0.7);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(194, 164, 255, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.restore();

      // Ring 2 (counter-tilted)
      ctx.save();
      ctx.rotate(-ringAngle * 0.9);
      ctx.scale(1, 0.42);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(116, 185, 241, 0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.restore();

      // Render internal floating particles
      particles.forEach((p) => {
        // Rotate particle coords
        const cosY = Math.cos(rotY.current);
        const sinY = Math.sin(rotY.current);
        const cosX = Math.cos(rotX.current);
        const sinX = Math.sin(rotX.current);

        const x = p.x * cosY + p.z * sinY;
        let z = -p.x * sinY + p.z * cosY;
        const y = p.y * cosX - z * sinX;
        z = p.y * sinX + z * cosX;

        const screenX = x * r;
        const screenY = y * r;
        const depth = (z + 1.2) / 2.4;

        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194, 164, 255, ${p.alpha * depth})`;
        ctx.fill();
      });

      ctx.restore();
      requestAnimationFrame(renderCanvas);
    };

    const canvasAnimId = requestAnimationFrame(renderCanvas);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(canvasAnimId);
    };
  }, []);

  // 3D Tag Projection & Physics Animation Loop
  const updateNodes = useCallback(() => {
    const stage = containerRef.current;
    if (!stage) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const radius = Math.min(width, height) * 0.4;

    // Apply inertia and friction
    if (!isDragging.current) {
      // Return to steady gentle idle spin
      const targetVelY = isHovered.current ? 0.0008 : 0.0032;
      velY.current += (targetVelY - velY.current) * 0.05;
      velX.current *= 0.93;

      rotY.current += velY.current;
      rotX.current += velX.current;

      // Restrict pitch angle so it doesn't flip upside down
      rotX.current = Math.max(-0.8, Math.min(0.8, rotX.current));
    }

    const cosY = Math.cos(rotY.current);
    const sinY = Math.sin(rotY.current);
    const cosX = Math.cos(rotX.current);
    const sinX = Math.sin(rotX.current);

    spherePoints.forEach((point, i) => {
      const el = nodeRefs.current[i];
      if (!el) return;

      // 3D rotation matrix around Y then X
      const x1 = point.x * cosY + point.z * sinY;
      const z1 = -point.x * sinY + point.z * cosY;
      const y1 = point.y * cosX - z1 * sinX;
      const zFinal = point.y * sinX + z1 * cosX;

      // Projected 2D position with perspective relative to center (left: 50%, top: 50%)
      const scale = (zFinal + 2.2) / 3.2; // range ~0.38 to ~1.05
      const offsetX = x1 * radius;
      const offsetY = y1 * radius;
      const opacity = Math.max(0.25, (zFinal + 1.2) / 2.2);

      el.style.transform = `translate(-50%, -50%) translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0px) scale(${scale.toFixed(3)})`;
      el.style.zIndex = `${Math.round((zFinal + 2) * 100)}`;
      el.style.opacity = `${opacity.toFixed(2)}`;
    });

    animFrameId.current = requestAnimationFrame(updateNodes);
  }, [spherePoints]);

  useEffect(() => {
    animFrameId.current = requestAnimationFrame(updateNodes);
    return () => cancelAnimationFrame(animFrameId.current);
  }, [updateNodes]);

  // Pointer & Drag Handlers
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    velX.current = 0;
    velY.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    rotY.current += dx * 0.006;
    rotX.current -= dy * 0.006;
    rotX.current = Math.max(-0.8, Math.min(0.8, rotX.current));

    velY.current = dx * 0.004;
    velX.current = -dy * 0.004;

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <section className="techstack-wrapper" id="techstack">
      {/* Section Header */}
      <div className="techstack-header">
        <span className="subtitle">// EXPERTISE & CAPABILITIES</span>
        <h2>My Tech Stack</h2>
        <div className="drag-hint">
          <span>✦ Drag to rotate sphere in 3D</span>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="techstack-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`techstack-filter-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3D Sphere Interactive Stage */}
      <div
        ref={containerRef}
        className="techstack-sphere-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Background ambient canvas (glowing core, cyber rings, dust) */}
        <canvas ref={canvasRef} className="techstack-bg-canvas" />

        {/* 3D Projected Tech Badges */}
        <div className="techstack-tag-container">
          {spherePoints.map(({ item }, i) => {
            const isMatch = selectedCategory === "ALL" || item.category === selectedCategory;

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[i] = el)}
                className={`tech-node ${isMatch ? "highlighted" : "dimmed"}`}
                style={{ "--node-color": item.color } as React.CSSProperties}
                onMouseEnter={() => {
                  isHovered.current = true;
                  setHoveredTech(item);
                }}
                onMouseLeave={() => {
                  isHovered.current = false;
                }}
              >
                <div className="tech-node-badge">
                  <span className="tech-node-icon" style={{ color: item.color }}>
                    {item.icon}
                  </span>
                  <span className="tech-node-label">{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Active Tech Details Card */}
        {hoveredTech && (
          <div className="techstack-active-card">
            <span style={{ fontSize: "1.3rem", color: hoveredTech.color }}>
              {hoveredTech.icon}
            </span>
            <div>
              <div className="techstack-card-title">{hoveredTech.name}</div>
            </div>
            <span className="techstack-card-cat">{hoveredTech.category}</span>
          </div>
        )}
      </div>
    </section>
  );
}
