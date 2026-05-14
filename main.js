
// Theme management
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

class TotoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
    this.shadowRoot.querySelector('button').addEventListener('click', () => this.generateNumbers());
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: block;
          font-family: inherit;
        }
        .generator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: var(--card-bg);
          border-radius: 1.5rem;
          box-shadow: var(--shadow-lg);
          transition: all var(--transition-speed);
          border: 1px solid var(--primary-color);
        }
        .generator:hover {
          box-shadow: var(--glow);
        }
        .numbers {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .number {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--card-bg), var(--bg-color));
          border: 2px solid var(--primary-color);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--text-color);
          box-shadow: var(--shadow-md);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        }
        .number:not(:empty) {
          transform: scale(1.1);
          box-shadow: var(--glow);
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
          border-color: transparent;
        }
        button {
          padding: 1rem 2.5rem;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          color: white;
          border: none;
          border-radius: 3rem;
          box-shadow: var(--shadow-md);
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        button:hover {
          transform: scale(1.05);
          box-shadow: var(--glow);
          filter: brightness(1.1);
        }
        button:active {
          transform: scale(0.95);
        }
      </style>
      <div class="generator">
        <div class="numbers">
          <div class="number"></div>
          <div class="number"></div>
          <div class="number"></div>
          <div class="number"></div>
          <div class="number"></div>
          <div class="number"></div>
        </div>
        <button>Generate Numbers</button>
      </div>
    \`;
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 49) + 1);
    }
    const numberElements = this.shadowRoot.querySelectorAll('.number');
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    
    numberElements.forEach((el, i) => {
      el.textContent = '';
      el.style.transitionDelay = \`\${i * 0.05}s\`;
      setTimeout(() => {
        el.textContent = sortedNumbers[i];
      }, i * 100);
    });
  }
}

if (!customElements.get('toto-generator')) {
  customElements.define('toto-generator', TotoGenerator);
}
