import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech, Computer Science & Engineering</h4>
                <h5>Lovely Professional University | CGPA: 7.04</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Studying core CS fundamentals including data structures, algorithms, database
              management, and software engineering. Active member of Student Career Committee
              (SCC), organized and volunteered at 20+ technical events and coordinated 2 hackathons.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MERN Stack Development Training</h4>
                <h5>Lovely Professional University</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Completed hands-on training in responsive full stack applications, backend APIs,
              database CRUD operations, authentication, Git/GitHub, RESTful services, and
              frontend-backend integration.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack / MERN Stack Developer</h4>
                <h5>Building Production-Ready Applications</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Architecting full-stack platforms including Fleet Flow (fleet management),
              DevConnect (developer networking), and MediGo (healthcare web application)
              using React.js, Node.js, Express.js, MongoDB, Next.js, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
