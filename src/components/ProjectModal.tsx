import React, { useEffect } from "react";
import { FiX, FiGithub, FiExternalLink } from "react-icons/fi";
import "./styles/ProjectModal.css";

export interface ProjectDetail {
  title: string;
  category: string;
  tools: string;
  image: string;
  link: string;
  liveUrl?: string;
  tagline: string;
  accentColor: string;
  accentGlow: string;
  metrics: { label: string; value: string }[];
  coreProblem: string;
  summary: string;
  architecture: string[];
  keyFeatures: string[];
  tags: string[];
}

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="project-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="project-modal-card"
        style={{
          borderColor: `${project.accentColor}55`,
          boxShadow: `0 25px 60px rgba(0, 0, 0, 0.85), 0 0 50px ${project.accentGlow}`,
        }}
      >
        <div className="project-modal-header">
          <div className="project-modal-header-info">
            <h2>{project.title}</h2>
            <span
              className="project-modal-category"
              style={{ color: project.accentColor }}
            >
              {project.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="project-modal-close"
            aria-label="Close project details"
          >
            <FiX />
          </button>
        </div>

        <div className="project-modal-body">
          {/* Tagline Banner */}
          <div
            className="project-modal-tagline-box"
            style={{
              background: `linear-gradient(90deg, ${project.accentGlow}, transparent)`,
              borderLeft: `4px solid ${project.accentColor}`,
            }}
          >
            <p className="project-modal-tagline">"{project.tagline}"</p>
          </div>

          {/* Metrics Strip */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="project-modal-metrics">
              {project.metrics.map((m, idx) => (
                <div
                  className="project-modal-metric-chip"
                  key={idx}
                  style={{ borderColor: `${project.accentColor}40` }}
                >
                  <span
                    className="metric-val"
                    style={{ color: project.accentColor }}
                  >
                    {m.value}
                  </span>
                  <span className="metric-lbl">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Engineering Problem Statement */}
          <div className="project-modal-overview">
            <h4>Engineering Problem & Motivation</h4>
            <p>{project.coreProblem}</p>
          </div>

          {/* Solution & Overview */}
          <div className="project-modal-overview">
            <h4>Architectural Solution</h4>
            <p>{project.summary}</p>
          </div>

          {/* Deep System Architecture */}
          <div className="project-modal-highlights">
            <h4>System Architecture & Engineering Highlights</h4>
            <ul>
              {project.architecture.map((item, idx) => {
                const parts = item.split(":");
                return (
                  <li key={idx}>
                    <strong style={{ color: project.accentColor }}>
                      {parts[0]}:
                    </strong>
                    {parts.slice(1).join(":")}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Key Features */}
          <div className="project-modal-highlights">
            <h4>Core Features & Capabilities</h4>
            <ul>
              {project.keyFeatures.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="project-modal-tech">
            <h4>Technologies Utilized</h4>
            <div className="project-modal-tags">
              {project.tags.map((tag, idx) => (
                <span
                  className="project-modal-tag"
                  key={idx}
                  style={{
                    borderColor: `${project.accentColor}35`,
                    color: "#fff",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="project-modal-actions">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-modal-btn-primary"
              style={{
                background: project.accentColor,
                color: "#0b080c",
                borderColor: project.accentColor,
              }}
            >
              <FiGithub /> Source Code on GitHub
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-btn-secondary"
              >
                <FiExternalLink /> Live Application
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
