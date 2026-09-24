import { useState, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import ProjectModal, { ProjectDetail } from "./ProjectModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";
import { FiInfo, FiLayers, FiCpu, FiCheckCircle, FiGithub } from "react-icons/fi";

gsap.registerPlugin(useGSAP);

interface ProjectCardProps {
  proj: ProjectDetail;
  index: number;
  onSelect: (p: ProjectDetail) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ proj, index, onSelect }) => {
  const [activeTab, setActiveTab] = useState<"highlights" | "architecture" | "stack">("highlights");
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="work-box"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--card-accent": proj.accentColor,
          "--card-glow": proj.accentGlow,
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        } as React.CSSProperties
      }
    >
      <div className="work-card-top">
        {/* Top Header Badge Strip */}
        <div className="work-card-badge-row">
          <span className="work-card-index">0{index + 1}</span>
          <span className="work-card-category">{proj.category}</span>
          <span className="work-card-status-pulse">
            <span
              className="pulse-dot"
              style={{ background: proj.accentColor, boxShadow: `0 0 8px ${proj.accentColor}` }}
            ></span>
            PRODUCTION
          </span>
        </div>

        {/* Project Title */}
        <div className="work-card-title-row">
          <h3 className="work-card-title">{proj.title}</h3>
        </div>

        {/* Memorable Tagline */}
        <p className="work-card-tagline">"{proj.tagline}"</p>

        {/* Key Impact Metrics Strip */}
        <div className="work-card-metrics">
          {proj.metrics.map((m, idx) => (
            <div className="work-metric-pill" key={idx}>
              <span className="metric-pill-val" style={{ color: proj.accentColor }}>
                {m.value}
              </span>
              <span className="metric-pill-lbl">{m.label}</span>
            </div>
          ))}
        </div>

        {/* In-Card Interactive Tabs */}
        <div className="work-card-tabs">
          <button
            className={`work-card-tab ${activeTab === "highlights" ? "active" : ""}`}
            onClick={() => setActiveTab("highlights")}
            type="button"
          >
            <FiCheckCircle /> Highlights
          </button>
          <button
            className={`work-card-tab ${activeTab === "architecture" ? "active" : ""}`}
            onClick={() => setActiveTab("architecture")}
            type="button"
          >
            <FiLayers /> Architecture
          </button>
          <button
            className={`work-card-tab ${activeTab === "stack" ? "active" : ""}`}
            onClick={() => setActiveTab("stack")}
            type="button"
          >
            <FiCpu /> Stack
          </button>
        </div>

        {/* In-Card Tab Content Area */}
        <div className="work-card-tab-content">
          {activeTab === "highlights" && (
            <ul className="work-card-list">
              {proj.keyFeatures.slice(0, 3).map((item, idx) => (
                <li key={idx}>
                  <span className="bullet-dot" style={{ background: proj.accentColor }}></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "architecture" && (
            <ul className="work-card-list">
              {proj.architecture.slice(0, 3).map((item, idx) => {
                const parts = item.split(":");
                return (
                  <li key={idx}>
                    <span className="bullet-dot" style={{ background: proj.accentColor }}></span>
                    <span>
                      <strong style={{ color: proj.accentColor }}>{parts[0]}:</strong>
                      {parts.slice(1).join(":")}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {activeTab === "stack" && (
            <div className="work-card-tags">
              {proj.tags.map((tag, idx) => (
                <span className="work-card-tag" key={idx}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Group */}
        <div className="work-links-group">
          <button
            onClick={() => onSelect(proj)}
            className="work-details-btn"
            aria-label={`View ${proj.title} case study`}
            style={{
              borderColor: `${proj.accentColor}60`,
              boxShadow: `0 0 15px ${proj.accentGlow}`,
            }}
          >
            <FiInfo /> Case Study
          </button>
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="work-project-link"
          >
            <FiGithub /> GitHub <MdArrowOutward />
          </a>
        </div>
      </div>

      {/* Screenshot & Visual Media */}
      <div className="work-image-container">
        <div
          className="work-image-glow"
          style={{
            background: `radial-gradient(circle, ${proj.accentGlow} 0%, transparent 70%)`,
          }}
        />
        <WorkImage image={proj.image} alt={proj.title} link={proj.link} />
      </div>
    </div>
  );
};

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const flex = document.querySelector<HTMLElement>(".work-flex");
      if (!flex) return;
      const totalWidth = flex.scrollWidth;
      const viewportWidth = window.innerWidth;
      translateX = Math.max(totalWidth - viewportWidth + 300, viewportWidth * 1.8);
    }

    setTranslateX();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${translateX}`,
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        pinType: !ScrollTrigger.isTouch ? "transform" : "fixed",
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: () => -translateX,
      ease: "power1.out",
    });

    const onResize = () => {
      setTranslateX();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onResize);
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  const projects: ProjectDetail[] = [
    {
      title: "Fleet Flow",
      category: "Fleet Management & Logistics Intelligence",
      accentColor: "#00f5a0",
      accentGlow: "rgba(0, 245, 160, 0.22)",
      tagline: "Unified vehicle telemetry, automated driver dispatch, and preventive maintenance intelligence.",
      coreProblem:
        "Enterprise logistics operations lose up to 20% in preventable fuel waste, face sudden vehicle breakdowns, and suffer chaotic driver shift handoffs due to fragmented manual logs.",
      metrics: [
        { label: "Fuel Reduction", value: "15%" },
        { label: "Alert Engine", value: "Real-time" },
        { label: "Access Security", value: "JWT RBAC" },
      ],
      tools: "React.js, Node.js, Express.js, MongoDB, JWT Auth, REST APIs, Mongoose",
      image: "/images/node.webp",
      link: "https://github.com/Rajneesh-kumar7",
      summary:
        "A full-scale fleet tracking and logistics management web application designed to monitor vehicles, driver schedules, fuel logs, and maintenance operations in real time.",
      architecture: [
        "Role-Based Access Control (RBAC): Differentiated access tiers for Fleet Managers, Dispatchers, and Drivers with encrypted JWT cookies.",
        "Geospatial & Fleet Database Modeling: Indexed MongoDB schemas for low-latency queries on fleet routes, driver shift logs, and vehicle maintenance status.",
        "RESTful Micro-Service Layer: Modular Express.js architecture with custom middlewares for validation, Winston logging, and error handling.",
      ],
      keyFeatures: [
        "Interactive fleet health metrics & vehicle status monitoring",
        "Driver trip assignment and trip duration logging",
        "Fuel efficiency analysis and preventive maintenance alerts",
        "Automated trip log generation and route analytics",
      ],
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "RESTful APIs", "Mongoose", "Telemetry"],
    },
    {
      title: "DevConnect",
      category: "Developer Squad & Collaboration Platform",
      accentColor: "#c084fc",
      accentGlow: "rgba(192, 132, 252, 0.22)",
      tagline: "Where ambitious builders assemble squads, collaborate in real time, and ship real projects.",
      coreProblem:
        "Solo developers and hackathon participants struggle to find complementary teammates across stacks, lack dedicated real-time workspaces, and miss curated AI tools.",
      metrics: [
        { label: "Sync Latency", value: "< 50ms" },
        { label: "Squad Match", value: "Domain-Based" },
        { label: "Real-Time Comms", value: "Socket.io" },
      ],
      tools: "React.js, Node.js, Express.js, MongoDB, Socket.io, Tailwind CSS, WebSockets",
      image: "/images/devconnect.png",
      link: "https://github.com/Rajneesh-kumar7",
      summary:
        "Where ambitious builders assemble squads, collaborate, and ship real projects. Built with real-time collaboration rooms, hackathon squad assembly, interactive developer workspaces, and integrated AI tools.",
      architecture: [
        "Real-Time Event Engine: Interactive rooms and live developer workspaces powered by Socket.io, Node.js, and bidirectional WebSockets.",
        "Squad & Hackathon Assembly: Intelligent team-matching system allowing developers to assemble squads by skills, roles, and project domains.",
        "Modular UI & State Architecture: Clean, high-performance React component hierarchy with Tailwind CSS and responsive micro-interactions.",
      ],
      keyFeatures: [
        "Hackathon squad matching & team recruitment workflow",
        "Real-time interactive collaboration rooms & workspaces",
        "Curated AI tools directory & developer showcase feeds",
        "Custom dark UI with 3D typography and ambient audio effects",
      ],
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Tailwind CSS", "Hackathons", "AI Tools"],
    },
    {
      title: "MediGo",
      category: "Modern Healthcare & Emergency Platform",
      accentColor: "#2dd4bf",
      accentGlow: "rgba(45, 212, 191, 0.22)",
      tagline: "Healthcare that keeps pace with you — because every moment counts.",
      coreProblem:
        "Patients delay critical treatment due to cumbersome appointment systems and the complete absence of live proximity hospital responder coordination during medical emergencies.",
      metrics: [
        { label: "Verified Doctors", value: "12,400+" },
        { label: "Hospital Partners", value: "300+" },
        { label: "Emergency Response", value: "24/7 Live" },
      ],
      tools: "Next.js, React.js, TypeScript, Tailwind CSS, 3D Web Graphics",
      image: "/images/medigo.png",
      link: "https://github.com/Rajneesh-kumar7/medigo",
      summary:
        "Healthcare that keeps pace with you — because every moment counts. Engineered to find verified doctors, connect with nearby hospitals, book video consultations, and trigger rapid emergency help with live responder telemetry.",
      architecture: [
        "Next.js App Router Architecture: Server and client components split for optimal performance, instant hydration, and 3D visual rendering.",
        "Emergency Telemetry & Proximity Engine: Nearby hospital responder status tracking (active distance monitoring) with live network connection indicators.",
        "Strict Type Safety & Telemedicine: End-to-end TypeScript interfaces handling verified doctor directories (12,400+ doctors), partner hospitals (300+), and video consult workflows.",
      ],
      keyFeatures: [
        "Instant 24/7 Emergency Help & active nearby hospital responder tracking",
        "Doctor directory & video consult booking with 12,400+ verified practitioners",
        "Partner hospital connectivity network with live proximity status across 300+ centers",
        "Modern glassmorphism UI featuring 3D DNA graphics and dark mode toggle",
      ],
      tags: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Emergency Dispatch", "Telemedicine", "3D Web"],
    },
    {
      title: "Argus Kernel",
      category: "AI API Firewall & LLM Security Gateway",
      accentColor: "#38bdf8",
      accentGlow: "rgba(56, 189, 248, 0.22)",
      tagline: "Protect • Inspect • Govern • Route • Monitor every AI request before it reaches your model.",
      coreProblem:
        "Deploying LLMs in production exposes apps to prompt injection, jailbreaks, data poisoning, and severe compliance violations from accidental PII leakage to third-party AI APIs.",
      metrics: [
        { label: "Firewall Latency", value: "< 15ms" },
        { label: "PII Protection", value: "6 Types Redacted" },
        { label: "Multi-LLM Routing", value: "4+ Providers" },
      ],
      tools: "React 19, TypeScript, Node.js, Express.js, Tailwind CSS, Recharts, Mongoose, Zod",
      image: "/images/argus.png",
      link: "https://github.com/Rajneesh-kumar7",
      summary:
        "An enterprise-grade open-source AI API Firewall engineered to sit between client applications and Large Language Models (LLMs). Protects, inspects, governs, routes, and monitors every AI prompt and response with real-time prompt injection defense and automated PII redaction.",
      architecture: [
        "Firewall Pipeline Interceptor: Pre-flight request and response evaluation pipeline executing heuristic prompt injection checks and automated regex/entropy-based PII redaction.",
        "Multi-Provider Routing Engine: Dynamic intelligent routing layer with automatic failover and latency/cost telemetry across OpenAI, Google Gemini, Groq, and Ollama.",
        "Observability & Policy Engine: High-performance dashboard built with React 19 and Recharts offering deep request inspection, prompt replay sandbox, and real-time security audit trails.",
      ],
      keyFeatures: [
        "Real-time prompt injection & jailbreak detection heuristics",
        "Automated PII detection & redaction (emails, SSNs, credit cards, API keys)",
        "Multi-LLM gateway routing across OpenAI, Gemini, Groq & Ollama",
        "Interactive Firewall Playground with prompt replay & request inspector",
        "Live telemetry analytics tracking request latencies, token consumption & costs",
      ],
      tags: ["React 19", "TypeScript", "Node.js", "Express.js", "AI Firewall", "LLM Security", "Cybersecurity", "Recharts"],
    },
  ];

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-header-wrap">
          <h2>
            Featured <span>Engineering Projects</span>
          </h2>
          <p className="work-subtitle">
            Production-grade full stack applications, real-time distributed systems, and AI security architectures.
          </p>
        </div>
        <div className="work-flex">
          {projects.map((proj, index) => (
            <ProjectCard
              key={index}
              proj={proj}
              index={index}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default Work;
