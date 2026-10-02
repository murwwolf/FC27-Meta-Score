import { useEffect, useRef, useState } from "react";

const SUCCESS_MESSAGE = "Thank you for joining FC 27 Meta Score. Hope you enjoy it.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const submitting = useRef(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape" && !submitting.current) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current || status === "loading") return;

    submitting.current = true;
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(result.message || "We couldn't complete your signup. Please try again.");
        return;
      }

      if (result.duplicate) {
        setStatus("duplicate");
        setMessage(result.message);
        return;
      }

      setStatus("success");
      setMessage(SUCCESS_MESSAGE);
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the signup service. Please try again.");
    } finally {
      submitting.current = false;
    }
  }

  const completed = status === "success" || status === "duplicate";

  return (
    <div
      className="signup-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && status !== "loading") onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="signup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        aria-describedby="signup-description"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = dialogRef.current?.querySelectorAll("button:not(:disabled), input:not(:disabled)");
          if (!controls?.length) return;
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <button className="signup-close" type="button" onClick={onClose} aria-label="Close signup" disabled={status === "loading"}>
          <span aria-hidden="true">×</span>
        </button>

        <div className="signup-art" aria-hidden="true">
          <span className="signup-art-mark">27</span>
          <div className="signup-art-copy">
            <span>FC27 / META SCORE</span>
            <strong>YOUR NEXT<br />META MOVE.</strong>
            <i />
            <small>THE GAME, READ DIFFERENTLY.</small>
          </div>
          <span className="signup-art-index">EST. 2026</span>
        </div>

        <div className="signup-content">
          <div className="signup-eyebrow"><span /> THE INNER CIRCLE</div>
          <h2 id="signup-title">JOIN THE<br /><span>META.</span></h2>
          <p id="signup-description" className="signup-intro">
            Get in on FC 27 Meta Score. Just your name and email to get started.
          </p>

          {completed ? (
            <div className={`signup-feedback signup-feedback--${status}`} role="status">
              <span className="signup-feedback-mark" aria-hidden="true">{status === "success" ? "✓" : "✦"}</span>
              <p>{message}</p>
              <button className="signup-submit" type="button" onClick={onClose}>BACK TO THE GAME</button>
            </div>
          ) : (
            <form className="signup-form" onSubmit={handleSubmit}>
              <label className="signup-field">
                <span>NAME</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={100}
                  required
                  autoFocus
                  disabled={status === "loading"}
                />
              </label>
              <label className="signup-field">
                <span>EMAIL</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  pattern={EMAIL_PATTERN.source}
                  required
                  disabled={status === "loading"}
                />
              </label>
              {status === "error" && <p className="signup-error" role="alert">{message}</p>}
              <button className="signup-submit" type="submit" disabled={status === "loading"}>
                {status === "loading" ? <><span className="signup-spinner" aria-hidden="true" /> JOINING...</> : "JOIN FC27 META SCORE"}
                {status !== "loading" && <span aria-hidden="true">→</span>}
              </button>
              <p className="signup-privacy">NO PASSWORD. NO NOISE. JUST THE GAME.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

export default SignupModal;
