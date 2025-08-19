// Sistema de Navegação Moderno
class NavigationSystem {
  constructor() {
    this.currentExercise = this.getCurrentExercise();
    this.totalExercises = 24; // Total de exercícios planejados
    this.init();
  }

  init() {
    this.createNavigationHTML();
    this.bindEvents();
    this.updateNavigationState();
    this.handleScroll();
  }

  getCurrentExercise() {
    const path = window.location.pathname;
    const match = path.match(/ex(\d{3})\.html/);
    return match ? parseInt(match[1]) : 1;
  }

  createNavigationHTML() {
    const nav = document.createElement('nav');
    nav.className = 'main-navigation';
    nav.innerHTML = `
      <div class="nav-container">
        <a href="../index.html" class="nav-brand">
          <div class="logo">H</div>
          <span>HTML & CSS</span>
        </a>

        <ul class="nav-links">
          <li class="nav-item">
            <a href="../index.html" class="nav-link">
              <span>🏠</span>
              <span>Início</span>
            </a>
          </li>
          <li class="nav-item">
            <div class="exercise-nav">
              <button class="exercise-nav-btn" id="prevExercise" title="Exercício Anterior">
                ‹
              </button>
              <span class="current-exercise">Ex ${String(this.currentExercise).padStart(3, '0')}</span>
              <button class="exercise-nav-btn" id="nextExercise" title="Próximo Exercício">
                ›
              </button>
            </div>
          </li>
          <li class="nav-item">
            <a href="#challenges" class="nav-link">
              <span>🎯</span>
              <span>Desafios</span>
            </a>
          </li>
          <li class="nav-item">
            <button class="help-button" id="helpButton">
              <span>❓</span>
              <span>Ajuda</span>
            </button>
          </li>
        </ul>

        <button class="mobile-menu-btn" id="mobileMenuBtn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    `;

    // Inserir no início do body
    document.body.insertBefore(nav, document.body.firstChild);
  }

  bindEvents() {
    // Navegação entre exercícios
    document.getElementById('prevExercise')?.addEventListener('click', () => {
      this.navigateToExercise(this.currentExercise - 1);
    });

    document.getElementById('nextExercise')?.addEventListener('click', () => {
      this.navigateToExercise(this.currentExercise + 1);
    });

    // Botão de ajuda
    document.getElementById('helpButton')?.addEventListener('click', () => {
      this.showHelpModal();
    });

    // Botão de desafios
    document.querySelector('a[href="#challenges"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showChallengesModal();
    });

    // Menu mobile
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Scroll handler
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
  }

  navigateToExercise(exerciseNumber) {
    if (exerciseNumber < 1 || exerciseNumber > this.totalExercises) {
      return;
    }

    const exerciseId = String(exerciseNumber).padStart(3, '0');
    const url = `ex${exerciseId}.html`;
    
    // Todos os exercícios de 001 a 024 estão disponíveis
    window.location.href = url;
  }

  updateNavigationState() {
    const prevBtn = document.getElementById('prevExercise');
    const nextBtn = document.getElementById('nextExercise');

    if (prevBtn) {
      prevBtn.disabled = this.currentExercise <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = this.currentExercise >= this.totalExercises;
    }
  }

  handleScroll() {
    const nav = document.querySelector('.main-navigation');
    if (window.scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }

  toggleMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn?.classList.toggle('active');
    navLinks?.classList.toggle('active');
  }

  closeMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    menuBtn?.classList.remove('active');
    navLinks?.classList.remove('active');
  }

  showHelpModal() {
    const modal = this.createHelpModal();
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }

  showChallengesModal() {
    const modal = this.createChallengesModal();
    document.body.appendChild(modal);
    
    // Trigger animation
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  }

  createHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
      <div class="help-content">
        <button class="help-close" onclick="this.closest('.help-modal').remove()">&times;</button>
        <h2 style="color: #667eea; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span>❓</span> Central de Ajuda
        </h2>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #4a5568; margin-bottom: 15px;">🚀 Navegação Rápida</h3>
          <div style="background: #f7fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p><strong>Atalhos do Teclado:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><kbd style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">←</kbd> Exercício anterior</li>
              <li><kbd style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">→</kbd> Próximo exercício</li>
              <li><kbd style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">H</kbd> Abrir ajuda</li>
              <li><kbd style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">Esc</kbd> Fechar modal</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #4a5568; margin-bottom: 15px;">📚 Como Usar os Exercícios</h3>
          <div style="display: grid; gap: 15px;">
            <div style="background: #f0fff4; padding: 15px; border-radius: 8px; border-left: 4px solid #48bb78;">
              <strong>1. Leia o Objetivo</strong><br>
              Comece sempre lendo o objetivo do exercício para entender o que será aprendido.
            </div>
            <div style="background: #fffaf0; padding: 15px; border-radius: 8px; border-left: 4px solid #ed8936;">
              <strong>2. Siga o Passo a Passo</strong><br>
              Execute cada etapa na ordem apresentada para melhor compreensão.
            </div>
            <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #4299e1;">
              <strong>3. Pratique os Conceitos</strong><br>
              Leia a seção de conceitos para aprofundar seu conhecimento.
            </div>
            <div style="background: #faf5ff; padding: 15px; border-radius: 8px; border-left: 4px solid #9f7aea;">
              <strong>4. Faça os Desafios</strong><br>
              Complete os desafios extras para fixar o aprendizado.
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #4a5568; margin-bottom: 15px;">🎯 Dicas de Estudo</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Pratique regularmente, mesmo que por pouco tempo</li>
            <li>Não tenha pressa - entenda cada conceito antes de avançar</li>
            <li>Experimente modificar os códigos dos exemplos</li>
            <li>Use as ferramentas de desenvolvedor do navegador (F12)</li>
            <li>Consulte a documentação oficial quando tiver dúvidas</li>
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="margin-bottom: 10px;">💡 Precisa de Mais Ajuda?</h3>
          <p style="margin: 0; opacity: 0.9;">Consulte a documentação oficial do HTML5 e CSS3 ou participe de comunidades de desenvolvedores online.</p>
        </div>
      </div>
    `;

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
  }

  createChallengesModal() {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
      <div class="help-content">
        <button class="help-close" onclick="this.closest('.help-modal').remove()">&times;</button>
        <h2 style="color: #667eea; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span>🎯</span> Desafios Disponíveis
        </h2>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #4a5568; margin-bottom: 15px;">🟠 Desafios HTML Básico</h3>
          <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            <div class="challenge-item" onclick="window.open('../desafios/d001/index.html', '_blank')">
              <strong>D001 - Mensagens</strong><br>
              <small>Página com diferentes tipos de mensagens • ⭐ Básico</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d002/index.html', '_blank')">
              <strong>D002 - Imagem Flexível</strong><br>
              <small>Imagem que se adapta ao container • ⭐ Básico</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d003/index.html', '_blank')">
              <strong>D003 - Mapa Mundi</strong><br>
              <small>Mapa interativo com links • ⭐ Básico</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d004/index.html', '_blank')">
              <strong>D004 - Emojis</strong><br>
              <small>Página temática com emojis • ⭐ Básico</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d005/index.html', '_blank')">
              <strong>D005 - Social</strong><br>
              <small>Perfil social com foto e informações • ⭐⭐ Intermediário</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d006/index.html', '_blank')">
              <strong>D006 - Tags HTML</strong><br>
              <small>Página sobre tags HTML com exemplos • ⭐⭐ Intermediário</small>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #4a5568; margin-bottom: 15px;">🔵 Desafios CSS</h3>
          <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            <div class="challenge-item" onclick="window.open('../desafios/d007/index.html', '_blank')">
              <strong>D007 - Imagem Flexível</strong><br>
              <small>Técnicas avançadas de imagens responsivas • ⭐⭐ Intermediário</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d008/index.html', '_blank')">
              <strong>D008 - Navegação</strong><br>
              <small>Menu de navegação responsivo • ⭐⭐ Intermediário</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d009/index.html', '_blank')">
              <strong>D009 - Vídeos</strong><br>
              <small>Página com vídeos incorporados • ⭐⭐ Intermediário</small>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #4a5568; margin-bottom: 15px;">🟢 Projetos Completos</h3>
          <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            <div class="challenge-item" onclick="window.open('../desafios/d010/android.html', '_blank')">
              <strong>D010 - Site do Android</strong><br>
              <small>Site completo sobre Android • ⭐⭐⭐ Avançado</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d011/index.html', '_blank')">
              <strong>D011 - Astronauta</strong><br>
              <small>Página temática sobre espaço • ⭐⭐⭐ Avançado</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d012/index.html', '_blank')">
              <strong>D012 - Cordel Moderno</strong><br>
              <small>Cordel com efeitos visuais • ⭐⭐⭐ Avançado</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d013/index.html', '_blank')">
              <strong>D013 - Tabelas</strong><br>
              <small>Desafios com tabelas complexas • ⭐⭐⭐ Avançado</small>
            </div>
            <div class="challenge-item" onclick="window.open('../desafios/d014/index.html', '_blank')">
              <strong>D014 - Redes Sociais</strong><br>
              <small>Projeto de redes sociais • ⭐⭐⭐⭐ Expert</small>
            </div>
          </div>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <h3 style="margin-bottom: 10px;">💡 Dica</h3>
          <p style="margin: 0; opacity: 0.9;">Os desafios são organizados por dificuldade. Comece pelos básicos e vá progredindo gradualmente!</p>
        </div>
      </div>
    `;

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
  }

  handleKeyboardShortcuts(e) {
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.navigateToExercise(this.currentExercise - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.navigateToExercise(this.currentExercise + 1);
        break;
      case 'h':
      case 'H':
        e.preventDefault();
        this.showHelpModal();
        break;
      case 'Escape':
        this.closeMobileMenu();
        break;
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      background: ${type === 'info' ? '#4299e1' : '#f56565'};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      z-index: 2001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NavigationSystem();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationSystem;
}