import { useEffect, useState, useRef } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import Marquee from "react-fast-marquee";
import Lightning from "./Lightning";

const Loading = ({ percent: externalPercent }: { percent?: number }) => {
  const { setIsLoading } = useLoading();
  const [internalPercent, setInternalPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isFinishedRef = useRef(false);

  const percent =
    externalPercent !== undefined && externalPercent > 0
      ? externalPercent
      : internalPercent;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < 100) {
        current += Math.floor(Math.random() * 8) + 6;
        if (current > 100) current = 100;
        setInternalPercent(current);
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // Transition to 'loaded' (shows Welcome) once percent reaches 100
  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setLoaded(true);
    }
  }, [percent, loaded]);

  // Once loaded, wait 450ms then trigger the expansion click & initialFX
  useEffect(() => {
    if (!loaded) return;

    const clickTimer = setTimeout(() => {
      setClicked(true);

      const finishTimer = setTimeout(() => {
        if (isFinishedRef.current) return;
        isFinishedRef.current = true;

        import("./utils/initialFX")
          .then((module) => {
            if (module?.initialFX) {
              module.initialFX();
            }
          })
          .catch((err) => console.warn("initialFX error:", err))
          .finally(() => {
            setIsLoading(false);
          });
      }, 550);

      return () => clearTimeout(finishTimer);
    }, 450);

    return () => clearTimeout(clickTimer);
  }, [loaded, setIsLoading]);

  // Safety fallback: if anything stalls, force dismiss loader after 2.6 seconds
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!isFinishedRef.current) {
        isFinishedRef.current = true;
        import("./utils/initialFX")
          .then((module) => {
            if (module?.initialFX) {
              module.initialFX();
            }
          })
          .catch((err) => console.warn("initialFX fallback error:", err))
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, 2600);

    return () => clearTimeout(safetyTimer);
  }, [setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          RK.
        </a>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        {/* Fullscreen Animated Lightning Element */}
        <div className="loading-lightning-wrapper">
          <Lightning
            hue={270}
            xOffset={0}
            speed={1}
            intensity={1.3}
            size={1}
          />
        </div>

        <div className="loading-marquee">
          <Marquee>
            <span> Full-Stack Developer</span> <span>MERN Stack Engineer</span>
            <span> Full-Stack Developer</span> <span>MERN Stack Engineer</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked ? "loading-clicked" : ""}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let isDone = false;

  // Snappy ramp-up
  let interval = setInterval(() => {
    if (percent < 90) {
      const step = Math.floor(Math.random() * 8) + 6;
      percent = Math.min(percent + step, 90);
      setLoading(percent);
    }
  }, 30);

  function clear() {
    isDone = true;
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    if (isDone) return Promise.resolve(100);
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent += 5;
          setLoading(Math.min(percent, 100));
        } else {
          isDone = true;
          resolve(percent);
          clearInterval(interval);
        }
      }, 15);
    });
  }

  // Safety fallback: after 1.5s, if loaded() isn't triggered yet, automatically complete
  setTimeout(() => {
    if (!isDone) {
      loaded();
    }
  }, 1500);

  return { loaded, percent, clear };
};

