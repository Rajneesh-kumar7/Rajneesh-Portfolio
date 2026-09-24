import { useState } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import ProjectModal, { ProjectDetail } from "./ProjectModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";
import { FiInfo } from "react-icons/fi";

gsap.registerPlugin(useGSAP);

interface ProjectCardProps {
  proj: ProjectDetail;
  index: number;
  onSelect: (p: ProjectDetail) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ proj, index, onSelect }) => {
  const browserDomain = proj.title.toLowerCase().replace(/[^a-z0-9]/g, "") + ".app";

  return (
    <div className="work-box">
      {/* Editorial Content */}
      <div className="work-card-content">
        <div className="work-card-meta">
          <span className="work-card-num">0{index + 1}</span>
          <span className="work-card-divider">/</span>
          <span className="work-card-category">{proj.category}</span>
        </div>

        <h3 className="work-card-title">{proj.title}</h3>
        <p className="work-card-desc">{proj.summary}</p>

        {/* Clean Tech Stack Pills */}
        <div className="work-card-tags">
          {proj.tags.slice(0, 5).map((tag, idx) => (
            <span className="work-card-tag" key={idx}>
              {tag}
            </span>
          ))}
        </div>

        {/* Minimalist Action Links */}
        <div className="work-links-group">
          <button
            onClick={() => onSelect(proj)}
            className="work-details-btn"
            aria-label={`View ${proj.title} case study`}
          >
            <FiInfo /> Case Study
          </button>
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="work-project-link"
          >
            Source Code <MdArrowOutward />
          </a>
        </div>
      </div>

      {/* Elegant Browser Mockup Window */}
      <div className="work-browser-frame">
        <div className="browser-titlebar">
          <div className="browser-dots">
            <span className="dot dot-red"></span>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="browser-url">{browserDomain}</span>
        </div>
        <div className="browser-viewport">
          <WorkImage image={proj.image} alt={proj.title} link={proj.link} />
        </div>
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
      category: "Logistics & Fleet Management",
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
      image: "/images/fleetflow.png",
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
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "REST APIs", "Mongoose"],
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
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Tailwind CSS", "Hackathons"],
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
      tags: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Emergency Dispatch", "3D Web"],
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
      tags: ["React 19", "TypeScript", "Node.js", "Express.js", "AI Firewall", "Cybersecurity"],
    },
  ];

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-header-wrap">
          <h2>
            Featured <span>Projects</span>
          </h2>
          <p className="work-subtitle">
            Selected full-stack web applications, real-time distributed platforms, and security tools.
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
