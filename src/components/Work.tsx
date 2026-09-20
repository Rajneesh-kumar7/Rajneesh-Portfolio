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
      category: "Healthcare Web Application",
      tools: "Next.js, React.js, TypeScript, Tailwind CSS",
      image: "/images/next.webp",
      link: "https://github.com/Rajneesh-kumar7/medigo",
      summary:
        "A modern healthcare web platform engineered to simplify doctor discovery, appointment scheduling, and patient record management with an accessible, high-performance UI.",
      architecture: [
        "Next.js App Router Architecture: Server and client components split for optimal first contentful paint (FCP) and SEO performance.",
        "Strict Type Safety: Comprehensive TypeScript interfaces ensuring bug-free data flow across consultation schedules and doctor profiles.",
        "Modern Responsive Design: Mobile-first utility styling utilizing Tailwind CSS with high-contrast accessibility standards."
      ],
      keyFeatures: [
        "Doctor search and filtering by specialty, availability, and hospital",
        "Streamlined multi-step patient consultation booking flow",
        "Modular UI architecture allowing rapid feature expansion"
      ],
      tags: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "REST APIs", "Modern UI"],
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
