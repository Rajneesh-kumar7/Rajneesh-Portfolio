import React, { useEffect } from "react";
import { FiDownload, FiExternalLink, FiX } from "react-icons/fi";
import { TbNotes } from "react-icons/tb";
import "./styles/ResumeModal.css";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="resume-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="resume-modal-content">
        <div className="resume-modal-header">
          <h3>
            <TbNotes color="var(--accentColor, #c2a4ff)" /> Rajneesh Kumar — Resume
          </h3>
          <div className="resume-modal-actions">
            <a
              href="/resume.pdf"
              download="Rajneesh_Kumar_Resume.pdf"
              className="resume-action-btn"
              title="Download PDF"
            >
              <FiDownload /> Download
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-action-btn"
              title="Open full page"
            >
              <FiExternalLink /> Fullpage
            </a>
            <button
              onClick={onClose}
              className="resume-close-btn"
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>
        </div>
        <div className="resume-modal-body">
          <iframe
            src="/resume.pdf#toolbar=0"
            title="Rajneesh Kumar Resume"
            className="resume-iframe"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
