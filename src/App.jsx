import { useState, useEffect, useRef } from 'react'
import './App.css'

function MatrixOverlay({ onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const fontSize = 14
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let drops = []
    let animId

    function init() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const cols = Math.floor(canvas.width / fontSize)
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -50))
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const y = drops[i] * fontSize
        ctx.fillStyle = drops[i] < 2 ? '#c8ffc8' : '#00cc44'
        ctx.fillText(char, i * fontSize, y)
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }

      animId = requestAnimationFrame(draw)
    }

    function onResize() { init() }

    init()
    draw()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="matrix-overlay" onClick={onClose}>
      <canvas ref={canvasRef} className="matrix-canvas" />
      <span className="matrix-hint">click anywhere or press ESC to exit</span>
    </div>
  )
}

const projects = [
  {
    title: 'Signal Command Center',
    desc: 'Admin portal for Seismic Audio connecting inventory, orders, and shipping platforms across multiple services.',
    tags: ['React', 'Node.js', 'Railway'],
  },
  {
    title: 'AI Trader',
    desc: 'Automated stock trading bot with a live dashboard. Monitors market feeds and executes strategy-based trades.',
    tags: ['Node.js', 'React', 'Vite'],
  },
  {
    title: 'Gorgias Email AI',
    desc: 'AI-powered customer support responder that classifies tickets and drafts replies from a knowledge base.',
    tags: ['Node.js', 'Anthropic Claude'],
  },
  {
    title: 'Grocery Price Tracker',
    desc: 'Automated tool that monitors grocery prices weekly and logs them to a spreadsheet.',
    tags: ['Node.js', 'Google Sheets'],
  },
  {
    title: 'TikTok Video Generator',
    desc: 'AI-generated music and video pipeline for short-form social content.',
    tags: ['Node.js', 'AI'],
  },
  {
    title: 'Startup Monitor',
    desc: 'System watchdog that logs every boot and surfaces recurring issues with a postmortem display.',
    tags: ['PowerShell', 'Node.js'],
  },
  {
    title: 'Matrix Screensaver',
    desc: 'Custom Matrix-style screensaver built from scratch.',
    tags: ['JavaScript', 'Canvas'],
    demo: true,
  },
  {
    title: 'Command Line Screen',
    desc: 'Always-on desktop overlay showing news, weather, projects, and reminders.',
    tags: ['PowerShell', 'JavaScript'],
  },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function App() {
  const [showMatrix, setShowMatrix] = useState(false)

  return (
    <>
      {showMatrix && <MatrixOverlay onClose={() => setShowMatrix(false)} />}
      <nav className="nav">
        <a href="#" className="nav-brand">rustydodd.com</a>
        <a
          href="#contact"
          className="nav-contact"
          onClick={(e) => { e.preventDefault(); scrollTo('contact') }}
        >
          Contact
        </a>
      </nav>

      <div className="hero">
        <h1 className="hero-name">RUSTY DODD</h1>
        <p className="hero-tagline">Developer &middot; Builder &middot; Audio Nerd</p>
        <p className="hero-bio">
          I build tools that solve real problems — inventory systems, trading bots,
          AI automations, and things that probably shouldn't exist.
        </p>
        <a
          href="#projects"
          className="hero-btn"
          onClick={(e) => { e.preventDefault(); scrollTo('projects') }}
        >
          See My Work ↓
        </a>
      </div>

      <section id="projects" className="section">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Things I've built</h2>
        <div className="projects-grid">
          {projects.map((p) => (
            <div className="card" key={p.title}>
              <div className="card-title">{p.title}</div>
              <p className="card-desc">{p.desc}</p>
              <div className="card-tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
              {p.demo && (
                <button className="demo-btn" onClick={() => setShowMatrix(true)}>
                  ▶ Demo
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="about-section">
        <div className="section">
          <p className="section-label">About</p>
          <p className="about-text">
            Works at Seismic Audio. Builds things on the side. Interested in AI,
            automation, and making software that does the boring stuff so people
            don't have to.
          </p>
        </div>
      </div>

      <section id="contact" className="contact-section">
        <p className="section-label">Contact</p>
        <a href="mailto:rusty@seismicaudiospeakers.com" className="contact-email">
          rusty@seismicaudiospeakers.com
        </a>
        <p className="contact-sub">Open to interesting projects.</p>
      </section>

      <footer>
        <div className="footer-links">
          <a href="#" className="footer-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
        <span className="footer-byline">Built by Rusty Dodd</span>
      </footer>
    </>
  )
}
