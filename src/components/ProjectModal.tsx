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
      <div className="project-modal-card">
        <div className="project-modal-header">
          <div className="project-modal-header-info">
            <h2>{project.title}</h2>
            <span className="project-modal-category">{project.category}</span>
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
          <div className="project-modal-overview">
            <h4>Overview & Objective</h4>
            <p>{project.summary}</p>
          </div>

          <div className="project-modal-highlights">
            <h4>System Architecture & Engineering</h4>
            <ul>
              {project.architecture.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.split(":")[0]}:</strong>
                  {item.split(":").slice(1).join(":")}
                </li>
              ))}
            </ul>
          </div>

          <div className="project-modal-highlights">
            <h4>Key Features & Highlights</h4>
            <ul>
              {project.keyFeatures.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="project-modal-tech">
            <h4>Technologies Utilized</h4>
            <div className="project-modal-tags">
              {project.tags.map((tag, idx) => (
                <span className="project-modal-tag" key={idx}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="project-modal-actions">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-modal-btn-primary"
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
