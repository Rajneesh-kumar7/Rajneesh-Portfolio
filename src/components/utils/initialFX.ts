import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (smoother && typeof (smoother as any).paused === "function") {
    (smoother as any).paused(false);
  }
  const main = document.getElementsByTagName("main")[0];
  if (main) {
    main.classList.add("main-active");
  }
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 0.5,
  });

  try {
    const landingText = new SplitText(
      [".landing-info h3", ".landing-intro h2", ".landing-intro h1", ".landing-h2-1"],
      {
        type: "chars,lines",
        linesClass: "split-line",
      }
    );
    if (landingText?.chars?.length) {
      gsap.fromTo(
        landingText.chars,
        { opacity: 0, y: 80, filter: "blur(5px)" },
        {
          opacity: 1,
          duration: 1.2,
          filter: "blur(0px)",
          ease: "power3.inOut",
          y: 0,
          stagger: 0.025,
          delay: 0.3,
        }
      );
    }
  } catch (err) {
    console.warn("SplitText error:", err);
  }

  try {
    const TextProps = { type: "chars,lines", linesClass: "split-h2" };
    const landingText2 = new SplitText(".landing-h2-info", TextProps);
    if (landingText2?.chars?.length) {
      gsap.fromTo(
        landingText2.chars,
        { opacity: 0, y: 80, filter: "blur(5px)" },
        {
          opacity: 1,
          duration: 1.2,
          filter: "blur(0px)",
          ease: "power3.inOut",
          y: 0,
          stagger: 0.025,
          delay: 0.3,
        }
      );
    }

    const landingText3 = new SplitText(".landing-h2-info-1", TextProps);
    if (landingText2 && landingText3) {
      LoopText(landingText2, landingText3);
    }
  } catch (err) {
    console.warn("LoopText error:", err);
  }

  try {
    gsap.fromTo(
      [".header", ".icons-section", ".nav-fade"],
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power1.inOut",
        delay: 0.1,
      }
    );

    gsap.fromTo(
      [".hero-status-badge", ".hero-bio", ".hero-actions", ".hero-stack-strip"],
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );

    gsap.fromTo(
      ".hero-terminal-card",
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.35,
      }
    );
  } catch (err) {
    console.warn("Header/Hero anim error:", err);
  }
}

function LoopText(Text1: SplitText, Text2: SplitText) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
