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

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const flex = document.querySelector<HTMLElement>(".work-flex");
      if (!flex) return;
      const totalWidth = flex.scrollWidth;
      const viewportWidth = window.innerWidth;
      translateX = Math.max(totalWidth - viewportWidth + 200, viewportWidth * 1.5);
    }

    setTranslateX();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${translateX}`,
        scrub: 1,
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
      ease: "none",
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
      category: "Fleet Management Platform",
      tools: "React.js, Node.js, Express.js, MongoDB, JWT Auth, REST APIs",
      image: "/images/node.webp",
      link: "https://github.com/Rajneesh-kumar7",
      summary:
        "A full-scale fleet tracking and logistics management web application designed to monitor vehicles, driver schedules, fuel logs, and maintenance operations in real time.",
      architecture: [
        "Role-Based Access Control (RBAC): Differentiated access tiers for Fleet Managers, Dispatchers, and Drivers with encrypted JWT cookies.",
        "Database Modeling: Indexed MongoDB schemas for low-latency queries on fleet routes, driver logs, and vehicle maintenance status.",
        "RESTful Service Layer: Modular Express.js architecture with custom middlewares for validation, logging, and error handling."
      ],
      keyFeatures: [
        "Interactive fleet health metrics & vehicle status monitoring",
        "Driver trip assignment and trip duration logging",
        "Fuel efficiency analysis and preventive maintenance alerts"
      ],
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth", "RESTful APIs", "Mongoose"],
    },
    {
      title: "DevConnect",
      category: "Developer Squad & Collaboration Platform",
      tools: "React.js, Node.js, Express.js, MongoDB, Socket.io, Tailwind CSS, AI Tools",
      image: "/images/devconnect.png",
      link: "https://github.com/Rajneesh-kumar7",
      summary:
        "Where ambitious builders assemble squads, collaborate, and ship real projects. Built with real-time collaboration rooms, hackathon squad assembly, interactive developer workspaces, and integrated AI tools.",
      architecture: [
        "Real-Time Collaboration: Interactive rooms and live developer workspaces powered by Socket.io and Node.js.",
        "Squad & Hackathon Assembly: Intelligent team-matching system allowing developers to assemble squads by skills, roles, and project domains.",
        "Modular UI & State Architecture: Clean, high-performance React component hierarchy with Tailwind CSS and responsive micro-interactions."
      ],
      keyFeatures: [
        "Hackathon squad matching & team recruitment workflow",
        "Real-time interactive collaboration rooms & workspaces",
        "Curated AI tools directory & developer showcase feeds",
        "Custom dark UI with 3D typography and ambient audio effects"
      ],
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Tailwind CSS", "Hackathons", "AI Tools"],
    },
    {
      title: "MediGo",
      category: "Modern Healthcare & Emergency Platform",
      tools: "Next.js, React.js, TypeScript, Tailwind CSS, 3D Web Graphics",
      image: "/images/medigo.png",
      link: "https://github.com/Rajneesh-kumar7/medigo",
      summary:
        "Healthcare that keeps pace with you — because every moment counts. Engineered to find verified doctors, connect with nearby hospitals, book video consultations, and trigger rapid emergency help with live responder telemetry.",
      architecture: [
        "Next.js App Router Architecture: Server and client components split for optimal performance, instant hydration, and 3D visual rendering.",
        "Emergency Telemetry & Proximity Engine: Nearby hospital responder status tracking (active distance monitoring) with live network connection indicators.",
        "Strict Type Safety & Telemedicine: End-to-end TypeScript interfaces handling verified doctor directories (12,400+ doctors), partner hospitals (300+), and video consult workflows."
      ],
      keyFeatures: [
        "Instant 24/7 Emergency Help & active nearby hospital responder tracking",
        "Doctor directory & video consult booking with 12,400+ verified practitioners",
        "Partner hospital connectivity network with live proximity status across 300+ centers",
        "Modern glassmorphism UI featuring 3D DNA graphics and dark mode toggle"
      ],
      tags: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Emergency Dispatch", "Telemedicine", "3D Web"],
    },
  ];

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((proj, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{proj.title}</h4>
                    <p>{proj.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{proj.tools}</p>
                <div className="work-links-group">
                  <button
                    onClick={() => setSelectedProject(proj)}
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
                    View on GitHub <MdArrowOutward />
                  </a>
                </div>
              </div>
              <WorkImage image={proj.image} alt={proj.title} link={proj.link} />
            </div>
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
