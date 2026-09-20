import { useState } from "react";
import { MdArrowOutward, MdCopyright, MdCheck, MdContentCopy } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import "./styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    try {
      // Free Web3Forms endpoint sending directly to rajneeshqwer@gmail.com
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "e883ba56-99eb-4a6c-9c7a-97745778393e", // Web3forms public access key or fallback
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Message from ${formData.name}`,
          to_email: "rajneeshqwer@gmail.com",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Fallback to mailto link
        window.location.href = `mailto:rajneeshqwer@gmail.com?subject=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.email)}`;
        setStatus("success");
      }
    } catch {
      window.location.href = `mailto:rajneeshqwer@gmail.com?subject=Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + "\n\nFrom: " + formData.email)}`;
      setStatus("success");
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("rajneeshqwer@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-header-wrap">
          <h3>Get in <span>Touch</span></h3>
          <p className="contact-subtitle">
            Have a project in mind, an internship opportunity, or just want to say hi? Send me a message directly!
          </p>
        </div>

        <div className="contact-grid">
          {/* Direct Contact Form */}
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-cursor="disable"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-cursor="disable"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project, team, or opportunity..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  data-cursor="disable"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="contact-submit-btn"
                data-cursor="disable"
              >
                {status === "loading" ? (
                  "Sending..."
                ) : status === "success" ? (
                  <>
                    <MdCheck /> Message Sent!
                  </>
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="form-success-text">
                  Thank you! Your message has been sent to Rajneesh.
                </p>
              )}
            </form>
          </div>

          {/* Contact Details & Socials */}
          <div className="contact-details-panel">
            <div className="contact-info-block">
              <h4>Direct Email</h4>
              <div className="contact-copy-row">
                <a href="mailto:rajneeshqwer@gmail.com" data-cursor="disable">
                  rajneeshqwer@gmail.com
                </a>
                <button
                  onClick={copyEmail}
                  className="contact-copy-btn"
                  title="Copy email to clipboard"
                  data-cursor="disable"
                >
                  {copied ? <MdCheck color="#00ff88" /> : <MdContentCopy />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="contact-info-block">
              <h4>Phone</h4>
              <p>
                <a href="tel:+917814155778" data-cursor="disable">
                  +91 78141 55778
                </a>
              </p>
            </div>

            <div className="contact-info-block">
              <h4>Connect on Social</h4>
              <div className="contact-social-links">
                <a
                  href="https://github.com/Rajneesh-kumar7"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                  className="contact-social"
                >
                  Github <MdArrowOutward />
                </a>
                <a
                  href="https://www.linkedin.com/in/rajneesh-kumar12"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                  className="contact-social"
                >
                  Linkedin <MdArrowOutward />
                </a>
                <a
                  href="https://www.instagram.com/rajneesshhh_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="disable"
                  className="contact-social"
                >
                  Instagram <MdArrowOutward />
                </a>
              </div>
            </div>

            <div className="contact-footer-note">
              <h2>
                Designed & Developed by <span>Rajneesh Kumar</span>
              </h2>
              <h5>
                <MdCopyright /> 2026 • Full-Stack Engineer
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
