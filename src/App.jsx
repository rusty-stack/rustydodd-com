import { useState, useEffect, useRef } from 'react'
import './App.css'

function useEscClose(onClose) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
}

function MatrixOverlay({ onClose }) {
  const canvasRef = useRef(null)
  useEscClose(onClose)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const fontSize = 14
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let drops = []
    let animId

    function init() {
      canvas.width = window.screen.width
      canvas.height = window.screen.height
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

    init()
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="matrix-overlay" onClick={onClose}>
      <canvas ref={canvasRef} className="matrix-canvas" />
      <span className="matrix-hint">tap or press ESC to exit</span>
    </div>
  )
}

const CLI_LINES = [
  { text: 'COMMAND LINE SCREEN  v2.1', type: 'header' },
  { text: 'Display: DISPLAY2  3440×1440  |  Auto-launch: enabled', type: 'sys' },
  { text: 'Connecting to feeds...  OK', type: 'sys' },
  { text: '', type: 'blank' },
  { text: '─── WEATHER ─────────────────────────────────────', type: 'divider' },
  { text: '  Memphis, TN  |  84°F  |  Partly Cloudy', type: 'weather' },
  { text: '  High 89°F  ·  Low 71°F  ·  Humidity 62%', type: 'weather' },
  { text: '  Wind 8 mph SW  ·  UV Index 7  ·  Sunrise 5:47 AM', type: 'weather' },
  { text: '', type: 'blank' },
  { text: '─── TOP NEWS ────────────────────────────────────', type: 'divider' },
  { text: '  Fed signals rate cut in Q3 as inflation cools to 2.4%', type: 'news' },
  { text: '  SpaceX Starship completes 4th successful orbital test', type: 'news' },
  { text: '  Senate passes AI transparency bill 67-31', type: 'news' },
  { text: '  Tesla unveils new factory automation system in Austin', type: 'news' },
  { text: '  Memphis Grizzlies land top-3 pick in NBA Draft lottery', type: 'news' },
  { text: '  Amazon expands same-day delivery to 15 new cities', type: 'news' },
  { text: '', type: 'blank' },
  { text: '─── PROJECTS ────────────────────────────────────', type: 'divider' },
  { text: '  signal-command-center    Railway   ● online', type: 'project' },
  { text: '  ai-trader                Railway   ● online', type: 'project' },
  { text: '  gorgias-email-responder  local      ○ idle', type: 'project' },
  { text: '  grocery-price-tracker    sched      ● next run Mon 10am', type: 'project' },
  { text: '  rustydodd.com            Railway   ● online', type: 'project' },
  { text: '', type: 'blank' },
  { text: '─── REMINDERS ───────────────────────────────────', type: 'divider' },
  { text: '  !  Back up Claude Code Projects folder', type: 'reminder' },
  { text: '  !  Follow up with Steve re: Gorgias API key', type: 'reminder' },
  { text: '  !  Finnhub key needed for AI Trader live feed', type: 'reminder' },
  { text: '', type: 'blank' },
  { text: '─── SYSTEM ──────────────────────────────────────', type: 'divider' },
  { text: '  Boot 12.4s  |  RAM 14.2/32 GB  |  CPU 6%  |  Uptime 14d', type: 'sys' },
  { text: '  Last boot: Thu Jun 11 06:32 AM  |  No errors detected', type: 'sys' },
  { text: '', type: 'blank' },
  { text: '  Ready.  Next update in 28 min  _', type: 'cursor' },
]

function CLIDemo({ onClose }) {
  const [lines, setLines] = useState([])
  const bottomRef = useRef(null)
  useEscClose(onClose)

  useEffect(() => {
    const timers = CLI_LINES.map((line, i) =>
      setTimeout(() => setLines(prev => [...prev, line]), i * 100)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="cli-overlay" onClick={onClose}>
      <div className="cli-window" onClick={e => e.stopPropagation()}>
        <div className="cli-titlebar">
          <span>COMMAND LINE SCREEN</span>
          <button className="cli-close" onClick={onClose}>✕</button>
        </div>
        <div className="cli-body">
          {lines.map((line, i) => (
            <div key={i} className={`cli-line cli-${line.type}`}>
              {line.text || ' '}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}

const GROCERY_ITEMS = [
  { name: 'Kroger Whole Milk 1gal',        price: 3.99, prev: 3.79 },
  { name: 'Kroger Large Eggs 12ct',         price: 2.49, prev: 2.49 },
  { name: 'Wonder White Bread 20oz',        price: 3.19, prev: 3.39 },
  { name: 'Kroger Salted Butter 1lb',       price: 4.79, prev: 4.79 },
  { name: 'Chicken Breast Boneless 2lb',    price: 6.98, prev: 7.49 },
  { name: 'Gala Apples 3lb bag',            price: 4.49, prev: 4.29 },
  { name: 'Bananas per lb',                 price: 0.59, prev: 0.59 },
  { name: 'Russet Potatoes 5lb',            price: 3.99, prev: 3.99 },
  { name: "Campbell's Chicken Soup 10oz",   price: 1.89, prev: 1.69 },
  { name: 'Kroger Orange Juice 52oz',       price: 4.29, prev: 4.29 },
  { name: 'Tide Simply Detergent 46oz',     price: 5.99, prev: 6.49 },
  { name: 'Kroger Rotini Pasta 16oz',       price: 1.19, prev: 1.19 },
  { name: 'Ragu Traditional Sauce 24oz',    price: 2.49, prev: 2.79 },
  { name: 'Kroger 2% Milk 1gal',            price: 3.79, prev: 3.59 },
]

const GROCERY_SEQUENCE = (() => {
  const seq = []
  let t = 0
  const term = (text, cls) => { seq.push({ type: 'term', text, cls, t }) }
  const row  = (item)       => { seq.push({ type: 'row',  item,     t }) }

  const boot = [
    ['$ node grocery-price-tracker.js',          'gpt-cmd'    ],
    ['Grocery Price Tracker  v1.4',               'gpt-header' ],
    ['Store: Kroger — Memphis, TN',               'gpt-info'   ],
    ['Sheet: Kroger Prices 2026',                 'gpt-info'   ],
    ['',                                          'gpt-blank'  ],
    ['Google Sheets API...  connected',           'gpt-ok'     ],
    ['Headless browser...   ready',               'gpt-ok'     ],
    ['kroger.com...         loaded',              'gpt-ok'     ],
    ['',                                          'gpt-blank'  ],
    [`Scanning ${GROCERY_ITEMS.length} items...`, 'gpt-info'   ],
    ['',                                          'gpt-blank'  ],
  ]
  boot.forEach(([text, cls]) => { term(text, cls); t += 130 })

  GROCERY_ITEMS.forEach((item, i) => {
    const n = String(i + 1).padStart(2, '0')
    term(`[${n}/${GROCERY_ITEMS.length}]  ${item.name}`, 'gpt-fetch')
    t += 370
    const diff = +(item.price - item.prev).toFixed(2)
    const arrow = diff > 0 ? ' ▲' : diff < 0 ? ' ▼' : '  '
    const diffStr = diff !== 0 ? `  (${diff > 0 ? '+' : '-'}$${Math.abs(diff).toFixed(2)})` : ''
    const cls = diff > 0 ? 'gpt-found-up' : diff < 0 ? 'gpt-found-down' : 'gpt-found-same'
    term(`         ✓  $${item.price.toFixed(2)}${arrow}${diffStr}`, cls)
    row(item)
    t += 90
  })

  t += 200
  term('', 'gpt-blank')
  term(`All ${GROCERY_ITEMS.length} items scanned.  Writing to sheet...`, 'gpt-info')
  t += 500
  term('✓ Sheet updated.  Next run: Mon, 10:00 AM', 'gpt-done')

  return seq
})()

function GroceryDemo({ onClose }) {
  const [termLines, setTermLines] = useState([])
  const [rows, setRows] = useState([])
  const termBottomRef = useRef(null)
  const sheetBottomRef = useRef(null)
  useEscClose(onClose)

  useEffect(() => {
    const timers = GROCERY_SEQUENCE.map(event =>
      setTimeout(() => {
        if (event.type === 'term') setTermLines(prev => [...prev, { text: event.text, cls: event.cls }])
        else setRows(prev => [...prev, event.item])
      }, event.t)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => { termBottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [termLines])
  useEffect(() => { sheetBottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [rows])

  return (
    <div className="gpt-overlay" onClick={onClose}>
      <div className="gpt-window" onClick={e => e.stopPropagation()}>
        <div className="cli-titlebar">
          <span>GROCERY PRICE TRACKER — Kroger Memphis, TN</span>
          <button className="cli-close" onClick={onClose}>✕</button>
        </div>
        <div className="gpt-body">
          <div className="gpt-terminal">
            <div className="gpt-pane-label">terminal</div>
            <div className="gpt-term-scroll">
              {termLines.map((l, i) => (
                <div key={i} className={`gpt-line ${l.cls}`}>{l.text || ' '}</div>
              ))}
              <div ref={termBottomRef} />
            </div>
          </div>
          <div className="gpt-sheet">
            <div className="gpt-pane-label">google sheets</div>
            <div className="gpt-sheet-head">
              <span>Item</span>
              <span>Price</span>
              <span>vs Last Week</span>
            </div>
            <div className="gpt-sheet-scroll">
              {rows.map((item, i) => {
                const diff = +(item.price - item.prev).toFixed(2)
                return (
                  <div key={i} className={`gpt-row${i % 2 === 0 ? ' gpt-row-even' : ''}`}>
                    <span className="gpt-col-name">{item.name}</span>
                    <span className="gpt-col-price">${item.price.toFixed(2)}</span>
                    <span className={diff > 0 ? 'gpt-delta-up' : diff < 0 ? 'gpt-delta-down' : 'gpt-delta-same'}>
                      {diff > 0 ? `▲ +$${diff.toFixed(2)}` : diff < 0 ? `▼ -$${Math.abs(diff).toFixed(2)}` : '—'}
                    </span>
                  </div>
                )
              })}
              <div ref={sheetBottomRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const games = [
  {
    title: 'Missile Command',
    desc: 'Defend your cities from incoming missiles and MIRVs across escalating waves.',
    tags: ['JavaScript', 'Canvas'],
    link: '/missile-command.html',
  },
  {
    title: 'Minesweeper',
    desc: 'Classic Windows 95-style — Beginner, Intermediate, and Expert. Works on mobile.',
    tags: ['JavaScript'],
    link: '/minesweeper.html',
  },
  {
    title: 'Snake',
    desc: 'Neon Snake with level progression and mobile D-pad support.',
    tags: ['JavaScript', 'Canvas'],
    link: '/snake.html',
  },
  {
    title: 'Tetris',
    desc: 'All 7 pieces, ghost piece, hold, next preview, wall kicks, and level progression.',
    tags: ['JavaScript', 'Canvas'],
    link: '/tetris.html',
  },
]

const projects = [
  {
    title: 'Grocery Price Tracker',
    desc: 'Automated tool that monitors grocery prices weekly and logs them to a spreadsheet.',
    tags: ['Node.js', 'Google Sheets'],
    demo: 'grocery',
  },
  {
    title: 'Matrix Screensaver',
    desc: 'Custom Matrix-style screensaver built from scratch.',
    tags: ['JavaScript', 'Canvas'],
    demo: 'matrix',
  },
  {
    title: 'Command Line Screen',
    desc: 'Always-on desktop overlay showing news, weather, projects, and reminders.',
    tags: ['PowerShell', 'JavaScript'],
    demo: 'cli',
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
    title: 'TikTok Video Generator',
    desc: 'AI-generated music and video pipeline for short-form social content.',
    tags: ['Node.js', 'AI'],
  },
  {
    title: 'Claude Code Custom Skills & Hooks',
    desc: 'Custom slash commands and automation hooks built into Claude Code — session journals, brain updates, project scaffolding, and event-driven reminders that run automatically on session start, stop, and context compaction.',
    tags: ['PowerShell', 'JavaScript', 'Claude Code'],
  },
  {
    title: 'Executive Assistant',
    desc: 'Personal productivity app with contacts, reminders, projects, and a calendar. Built in React with plans to migrate to a Railway-hosted backend with a full Postgres API.',
    tags: ['React', 'Vite', 'Node.js'],
  },
  {
    title: 'LED Light Install Business',
    desc: 'Planning and research for a side business specializing in residential and commercial LED lighting installations — sourcing, pricing, and service structure.',
    tags: ['Business', 'Planning'],
  },
  {
    title: 'Network Deployment & IT Solutions',
    desc: 'Dual-WAN pfSense home network with VLANs and network segmentation. Simulated in Cisco Packet Tracer ahead of real hardware deployment.',
    tags: ['pfSense', 'Networking', 'VLANs'],
  },
  {
    title: 'Custom SaaS & ERM Packages',
    desc: 'Design and development of custom software-as-a-service tools and enterprise resource management systems tailored to small business needs.',
    tags: ['SaaS', 'React', 'Node.js'],
  },
]

const HERO = 'RUSTY DODD'
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?'

const BOOT_LINES = [
  { text: 'BIOS v2.1.4 initialized', delay: 200 },
  { text: 'Loading kernel modules .......... OK', delay: 600 },
  { text: 'Mounting filesystems ............. OK', delay: 1000 },
  { text: 'Starting network services ........ OK', delay: 1400 },
  { text: 'Establishing connection .......... OK', delay: 1800 },
  { text: '', delay: 2100 },
  { text: 'Launching rustydodd.com ...', delay: 2300 },
  { text: '', delay: 2700 },
  { text: '> Welcome back.', delay: 2900 },
]

function BootSequence({ onClose }) {
  const [lines, setLines] = useState([])
  const [fading, setFading] = useState(false)
  useEscClose(onClose)

  useEffect(() => {
    const timers = BOOT_LINES.map(({ text, delay }) =>
      setTimeout(() => setLines(prev => [...prev, text]), delay)
    )
    const fadeTimer = setTimeout(() => setFading(true), 3600)
    const closeTimer = setTimeout(onClose, 4300)
    return () => [...timers, fadeTimer, closeTimer].forEach(clearTimeout)
  }, [onClose])

  return (
    <div className={`boot-overlay${fading ? ' boot-fade' : ''}`} onClick={onClose}>
      <div className="boot-terminal">
        {lines.map((line, i) => (
          <div key={i} className="boot-line">{line || ' '}</div>
        ))}
        {!fading && <span className="boot-cursor">█</span>}
      </div>
      <span className="matrix-hint">tap or press ESC to skip</span>
    </div>
  )
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function App() {
  const [activeDemo, setActiveDemo] = useState(null)
  const [heroText, setHeroText] = useState(HERO)

  useEffect(() => {
    let frame = 0
    const totalFrames = 45
    const id = setInterval(() => {
      frame++
      const resolved = Math.floor((frame / totalFrames) * HERO.length)
      const next = HERO.split('').map((char, i) => {
        if (char === ' ') return ' '
        if (i < resolved) return char
        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      }).join('')
      setHeroText(next)
      if (frame >= totalFrames) {
        setHeroText(HERO)
        clearInterval(id)
      }
    }, 30)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {activeDemo === 'matrix' && <MatrixOverlay onClose={() => setActiveDemo(null)} />}
      {activeDemo === 'cli' && <CLIDemo onClose={() => setActiveDemo(null)} />}
      {activeDemo === 'grocery' && <GroceryDemo onClose={() => setActiveDemo(null)} />}
      {activeDemo === 'boot' && <BootSequence onClose={() => setActiveDemo(null)} />}
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
        <h1 className="hero-name">{heroText}</h1>
        <p className="hero-tagline">Developer &middot; Builder &middot; Audio Nerd &middot; HVAC Installer &middot; Professional Musician</p>
        <p className="hero-bio">
          I build tools that solve real problems — inventory systems, trading bots,
          AI automations, and things that probably shouldn't exist.
          I also assist in HVAC installations and enjoy playing drums, percussion,
          and keyboards in local acts.
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
                <button className="demo-btn" onClick={() => setActiveDemo(p.demo)}>
                  ▶ Demo
                </button>
              )}
              {p.link && (
                <a className="demo-btn" href={p.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  ▶ Play
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="games" className="section">
        <p className="section-label">Games</p>
        <h2 className="section-title">Playable in the browser</h2>
        <div className="projects-grid">
          {games.map((g) => (
            <div className="card" key={g.title}>
              <div className="card-title">{g.title}</div>
              <p className="card-desc">{g.desc}</p>
              <div className="card-tags">
                {g.tags.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
              <a className="demo-btn" href={g.link} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                ▶ Play
              </a>
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
        <div className="footer-right">
          <button className="reboot-btn" onClick={() => setActiveDemo('boot')}>⟳ reboot</button>
          <span className="footer-byline">Built by Rusty Dodd</span>
        </div>
      </footer>
    </>
  )
}
