// Sistema de Ajuda Contextual Avançado
class HelpSystem {
  constructor() {
    this.tooltips = new Map();
    this.guides = new Map();
    this.currentGuide = null;
    this.init();
  }

  init() {
    this.createHelpStyles();
    this.setupTooltips();
    this.setupGuides();
    this.bindEvents();
  }

  createHelpStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Tooltip Styles */
      .help-tooltip {
        position: absolute;
        background: rgba(45, 55, 72, 0.95);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        max-width: 300px;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        line-height: 1.4;
      }

      .help-tooltip.show {
        opacity: 1;
        visibility: visible;
      }

      .help-tooltip::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid rgba(45, 55, 72, 0.95);
      }

      .help-tooltip.bottom::before {
        top: auto;
        bottom: -6px;
        border-bottom: none;
        border-top: 6px solid rgba(45, 55, 72, 0.95);
      }

      .help-tooltip.left::before {
        top: 50%;
        left: auto;
        right: -6px;
        transform: translateY(-50%);
        border-left: 6px solid rgba(45, 55, 72, 0.95);
        border-right: none;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }

      .help-tooltip.right::before {
        top: 50%;
        left: -6px;
        transform: translateY(-50%);
        border-right: 6px solid rgba(45, 55, 72, 0.95);
        border-left: none;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }

      /* Help Indicator */
      .help-indicator {
        position: relative;
        cursor: help;
      }

      .help-indicator::after {
        content: '?';
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        background: #667eea;
        color: white;
        border-radius: 50%;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: all 0.3s ease;
      }

      .help-indicator:hover::after {
        opacity: 1;
        transform: scale(1.1);
      }

      /* Interactive Guide */
      .interactive-guide {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 15000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .interactive-guide.active {
        opacity: 1;
        visibility: visible;
      }

      .guide-content {
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        transform: translateY(20px);
        transition: transform 0.3s ease;
      }

      .interactive-guide.active .guide-content {
        transform: translateY(0);
      }

      .guide-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #e2e8f0;
      }

      .guide-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2d3748;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .guide-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        transition: color 0.3s ease;
        padding: 8px;
        border-radius: 50%;
      }

      .guide-close:hover {
        color: #333;
        background: #f7fafc;
      }

      .guide-step {
        margin-bottom: 30px;
        padding: 25px;
        background: #f8fafc;
        border-radius: 15px;
        border-left: 4px solid #667eea;
      }

      .guide-step h3 {
        color: #2d3748;
        margin-bottom: 15px;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .guide-step-number {
        background: #667eea;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .guide-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #e2e8f0;
      }

      .guide-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .guide-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .guide-btn-secondary {
        background: #e2e8f0;
        color: #4a5568;
      }

      .guide-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      /* Highlight Effect */
      .help-highlight {
        position: relative;
        z-index: 16000;
        box-shadow: 0 0 0 4px #667eea, 0 0 0 8px rgba(102, 126, 234, 0.3);
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      /* Progress Indicator */
      .guide-progress {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e2e8f0;
        transition: all 0.3s ease;
      }

      .progress-dot.active {
        background: #667eea;
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(style);
  }

  setupTooltips() {
    // Definir tooltips contextuais para diferentes elementos
    this.tooltips.set('.exercise-title', {
      text: 'Este é o título do exercício atual. Cada exercício foca em um conceito específico do HTML/CSS.',
      position: 'bottom'
    });

    this.tooltips.set('.info-card', {
      text: 'Informações rápidas sobre o exercício: tipo, duração estimada, nível de dificuldade e tecnologias utilizadas.',
      position: 'top'
    });

    this.tooltips.set('.content-section h2', {
      text: 'Seções organizadas do exercício. Siga a ordem para melhor aprendizado.',
      position: 'right'
    });

    this.tooltips.set('.code-block', {
      text: 'Exemplo de código. Você pode copiar e colar este código para testar.',
      position: 'top'
    });

    this.tooltips.set('.quiz-card', {
      text: 'Quiz interativo para testar seu conhecimento. Clique nas opções para ver o feedback.',
      position: 'left'
    });
  }

  setupGuides() {
    // Guia para iniciantes
    this.guides.set('beginner', {
      title: '🚀 Guia para Iniciantes',
      steps: [
        {
          title: 'Bem-vindo ao Curso!',
          content: 'Este é um curso prático de HTML5 e CSS3. Cada exercício foi cuidadosamente projetado para ensinar conceitos fundamentais de forma progressiva.'
        },
        {
          title: 'Como Navegar',
          content: 'Use os botões ← e → no header para navegar entre exercícios. Você também pode usar as setas do teclado para navegação rápida.'
        },
        {
          title: 'Estrutura dos Exercícios',
          content: 'Cada exercício contém: Objetivo, Passo a Passo, Conceitos Importantes, Desafios Extras e Quiz. Siga esta ordem para melhor aprendizado.'
        },
        {
          title: 'Dicas de Estudo',
          content: 'Pratique cada conceito antes de avançar. Use as ferramentas de desenvolvedor (F12) para experimentar e modificar os códigos.'
        },
        {
          title: 'Precisa de Ajuda?',
          content: 'Clique no botão "Ajuda" no header a qualquer momento. Você também pode pressionar a tecla "H" para acesso rápido.'
        }
      ]
    });

    // Guia de navegação
    this.guides.set('navigation', {
      title: '🧭 Guia de Navegação',
      steps: [
        {
          title: 'Header de Navegação',
          content: 'O header fixo no topo contém todas as ferramentas de navegação. Ele permanece visível enquanto você rola a página.'
        },
        {
          title: 'Navegação entre Exercícios',
          content: 'Use os botões ← e → para navegar entre exercícios. O número atual é exibido no centro.'
        },
        {
          title: 'Atalhos de Teclado',
          content: 'Setas ← → para navegar, H para ajuda, Esc para fechar modais. Estes atalhos funcionam em qualquer lugar da página.'
        },
        {
          title: 'Menu Mobile',
          content: 'Em dispositivos móveis, use o botão ☰ para acessar o menu de navegação completo.'
        }
      ]
    });
  }

  bindEvents() {
    // Adicionar tooltips aos elementos
    this.addTooltipListeners();
    
    // Adicionar guias contextuais
    this.addGuideButtons();
    
    // Detectar primeiro acesso
    if (!localStorage.getItem('help_system_visited')) {
      setTimeout(() => {
        this.showGuide('beginner');
        localStorage.setItem('help_system_visited', 'true');
      }, 2000);
    }
  }

  addTooltipListeners() {
    this.tooltips.forEach((config, selector) => {
      document.querySelectorAll(selector).forEach(element => {
        element.classList.add('help-indicator');
        
        element.addEventListener('mouseenter', (e) => {
          this.showTooltip(e.target, config.text, config.position);
        });
        
        element.addEventListener('mouseleave', () => {
          this.hideTooltip();
        });
      });
    });
  }

  addGuideButtons() {
    // Adicionar botão de guia para iniciantes
    const helpButton = document.querySelector('.help-button');
    if (helpButton) {
      helpButton.addEventListener('click', () => {
        this.showGuideMenu();
      });
    }
  }

  showTooltip(element, text, position = 'top') {
    this.hideTooltip(); // Remove tooltip anterior
    
    const tooltip = document.createElement('div');
    tooltip.className = `help-tooltip ${position}`;
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top, left;
    
    switch(position) {
      case 'top':
        top = rect.top - tooltipRect.height - 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 10;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 10;
        break;
    }
    
    // Ajustar posição se sair da tela
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    
    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left}px`;
    
    setTimeout(() => tooltip.classList.add('show'), 10);
  }

  hideTooltip() {
    const existing = document.querySelector('.help-tooltip');
    if (existing) {
      existing.remove();
    }
  }

  showGuideMenu() {
    const modal = document.createElement('div');
    modal.className = 'interactive-guide';
    modal.innerHTML = `
      <div class="guide-content">
        <div class="guide-header">
          <h2 class="guide-title">
            <span>📚</span> Escolha um Guia
          </h2>
          <button class="guide-close">&times;</button>
        </div>
        
        <div style="display: grid; gap: 20px;">
          <button class="guide-option" data-guide="beginner" style="
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 15px;
            text-align: left;
            cursor: pointer;
            transition: transform 0.3s ease;
          ">
            <h3 style="margin-bottom: 8px; font-size: 1.2rem;">🚀 Guia para Iniciantes</h3>
            <p style="margin: 0; opacity: 0.9;">Perfeito se esta é sua primeira vez aqui</p>
          </button>
          
          <button class="guide-option" data-guide="navigation" style="
            padding: 20px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            border-radius: 15px;
            text-align: left;
            cursor: pointer;
            transition: transform 0.3s ease;
          ">
            <h3 style="margin-bottom: 8px; font-size: 1.2rem;">🧭 Guia de Navegação</h3>
            <p style="margin: 0; opacity: 0.9;">Aprenda a navegar eficientemente pelo curso</p>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Event listeners
    modal.querySelector('.guide-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    modal.querySelectorAll('.guide-option').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
      btn.addEventListener('click', () => {
        const guideType = btn.dataset.guide;
        modal.remove();
        this.showGuide(guideType);
      });
    });
  }

  showGuide(guideType) {
    const guide = this.guides.get(guideType);
    if (!guide) return;
    
    this.currentGuide = {
      ...guide,
      currentStep: 0
    };
    
    this.renderGuide();
  }

  renderGuide() {
    const guide = this.currentGuide;
    const currentStep = guide.steps[guide.currentStep];
    
    const modal = document.createElement('div');
    modal.className = 'interactive-guide active';
    modal.innerHTML = `
      <div class="guide-content">
        <div class="guide-header">
          <h2 class="guide-title">${guide.title}</h2>
          <button class="guide-close">&times;</button>
        </div>
        
        <div class="guide-step">
          <h3>
            <span class="guide-step-number">${guide.currentStep + 1}</span>
            ${currentStep.title}
          </h3>
          <p>${currentStep.content}</p>
        </div>
        
        <div class="guide-navigation">
          <button class="guide-btn guide-btn-secondary" id="prevStep" ${guide.currentStep === 0 ? 'disabled' : ''}>
            ← Anterior
          </button>
          
          <div class="guide-progress">
            ${guide.steps.map((_, index) => 
              `<div class="progress-dot ${index === guide.currentStep ? 'active' : ''}"></div>`
            ).join('')}
          </div>
          
          <button class="guide-btn guide-btn-primary" id="nextStep">
            ${guide.currentStep === guide.steps.length - 1 ? 'Finalizar' : 'Próximo →'}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.guide-close').addEventListener('click', () => {
      modal.remove();
      this.currentGuide = null;
    });
    
    modal.querySelector('#prevStep').addEventListener('click', () => {
      if (guide.currentStep > 0) {
        guide.currentStep--;
        modal.remove();
        this.renderGuide();
      }
    });
    
    modal.querySelector('#nextStep').addEventListener('click', () => {
      if (guide.currentStep < guide.steps.length - 1) {
        guide.currentStep++;
        modal.remove();
        this.renderGuide();
      } else {
        modal.remove();
        this.currentGuide = null;
      }
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        this.currentGuide = null;
      }
    });
  }
}

// Initialize help system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HelpSystem();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HelpSystem;
}