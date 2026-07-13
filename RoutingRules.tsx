@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --color-obsidian: #0a0a0a;
  --color-card-dark: #121212;
  --color-card-border: #222222;
  --color-electric-green: #00ffcc;
  --color-deep-purple: #8a2be2;
  --color-soft-amber: #ffaa00;
}

/* Custom glow animations and global styling classes */
body {
  background-color: #0a0a0a;
  color: #f3f4f6;
  font-family: var(--font-sans);
}

.text-glow-green {
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.4);
}

.text-glow-purple {
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.4);
}

.glow-border-green {
  box-shadow: 0 0 15px rgba(0, 255, 204, 0.15);
  border-color: rgba(0, 255, 204, 0.3);
}

.glow-border-purple {
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.15);
  border-color: rgba(138, 43, 226, 0.3);
}

.glassmorphism {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glassmorphism-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.interactive-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(22, 22, 22, 0.8);
}

/* Hide scrollbars for slick financial dashboard views */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
