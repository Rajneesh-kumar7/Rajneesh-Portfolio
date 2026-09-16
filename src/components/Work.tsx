import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";

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
      tools: "React.js, Node.js, Express.js, MongoDB, JWT Auth, REST APIs",
      image: "/images/node.webp",
      link: "https://github.com/Rajneesh-kumar7",
    },
    {
      title: "DevConnect",
      category: "Developer Networking Platform",
      tools: "React.js, Node.js, Express.js, MongoDB, Reusable Components",
      image: "/images/react.webp",
      link: "https://github.com/Rajneesh-kumar7",
    },
    {
      title: "MediGo",
      category: "Healthcare Web Application",
      tools: "Next.js, React.js, TypeScript, Tailwind CSS",
      image: "/images/next.webp",
      link: "https://github.com/Rajneesh-kumar7/medigo",
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
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="work-project-link"
                >
                  View on GitHub <MdArrowOutward />
                </a>
              </div>
              <WorkImage image={proj.image} alt={proj.title} link={proj.link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
