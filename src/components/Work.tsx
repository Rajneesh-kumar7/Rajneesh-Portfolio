import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

  const projects = [
    {
      title: "Fleet Flow",
      category: "Fleet Management Platform",
      tools: "React.js, Node.js, Express.js, MongoDB, JWT, RESTful APIs",
    },
    {
      title: "DevConnect",
      category: "Developer Networking Platform",
      tools: "React.js, Node.js, Express.js, MongoDB, Reusable Components",
    },
    {
      title: "MediGo",
      category: "Healthcare Web Application",
      tools: "Next.js, React.js, TypeScript, Tailwind CSS",
    },
    {
      title: "3D Spatial Studio",
      category: "Creative WebGL & Generative Art",
      tools: "Three.js, React Three Fiber, GLSL Shaders, GSAP",
    },
    {
      title: "CloudPulse Monitor",
      category: "Distributed Serverless Observability",
      tools: "Node.js, Express, Redis, Docker, PostgreSQL",
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
              </div>
              <WorkImage image="/images/placeholder.webp" alt={proj.title} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
