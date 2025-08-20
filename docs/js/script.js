// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funcionalidades
    initNavigation();
    initScrollEffects();
    initCardAnimations();
    initProgressTracking();
    
    // Inicializar sistema de progresso após um pequeno delay
    setTimeout(() => {
        initProgressSystem();
    }, 500);
    initSearchFunctionality();
    
    // Inicializar novas funcionalidades
    initTabNavigation();
    initLoadMoreSystem();
    initCardVisibility();
    animateProgressBar();
    createParticles();
    initializeLazyLoading();
    
    // Animações de entrada
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Navegação suave e ativa
function initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    // Navegação suave ao clicar nos links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajuste para header fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Destaca o link ativo baseado na posição do scroll
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Efeitos de scroll
function initScrollEffects() {
    // Parallax suave no header
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (header) {
            header.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.exercise-category, .challenge-card, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Animações dos cartões
function initCardAnimations() {
    const cards = document.querySelectorAll('.exercise-card, .challenge-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Efeito de clique
        card.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-3px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
    });
}

// Sistema de progresso (usando localStorage)
function initProgressTracking() {
    const exerciseCards = document.querySelectorAll('.exercise-card');
    const challengeCards = document.querySelectorAll('.challenge-card');
    
    // Carrega progresso salvo
    loadProgress();
    
    // Adiciona listeners para marcar como concluído
    exerciseCards.forEach(card => {
        const link = card.querySelector('a.card-link');
        if (!link || !link.href) return;
        
        const exerciseId = getExerciseId(link.href);
        if (!exerciseId) return;
        
        // Adiciona botão de marcar como concluído
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = '✓';
        completeBtn.title = 'Marcar como concluído';
        
        completeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleComplete(exerciseId, card);
        });
        
        card.appendChild(completeBtn);
    });
    
    challengeCards.forEach(card => {
        const link = card.querySelector('a.card-link');
        if (!link || !link.href) return;
        
        const challengeId = getChallengeId(link.href);
        if (!challengeId) return;
        
        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = '✓';
        completeBtn.title = 'Marcar como concluído';
        
        completeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleComplete(challengeId, card, 'challenge');
        });
        
        card.appendChild(completeBtn);
    });
    
    // Adiciona botão de reset (apenas para desenvolvimento)
    addResetButton();
}

// Funcionalidade de busca
function initSearchFunctionality() {
    // Funcionalidade de busca desabilitada temporariamente para evitar erros
    return;
}

// Sistema de navegação por abas
function initTabNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');
    
    function switchTab(targetTab) {
        // Remove active class from all tabs and sections
        navTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });
        contentSections.forEach(s => s.classList.remove('active'));

        // Add active class to target tab
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        targetTab.setAttribute('tabindex', '0');
        targetTab.focus();

        // Show corresponding section
        const targetSection = document.getElementById(targetTab.dataset.section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
    
    navTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchTab(tab);
        });
        
        // Keyboard navigation for tabs
        tab.addEventListener('keydown', (e) => {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = index > 0 ? index - 1 : navTabs.length - 1;
                    switchTab(navTabs[targetIndex]);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = index < navTabs.length - 1 ? index + 1 : 0;
                    switchTab(navTabs[targetIndex]);
                    break;
                case 'Home':
                    e.preventDefault();
                    switchTab(navTabs[0]);
                    break;
                case 'End':
                    e.preventDefault();
                    switchTab(navTabs[navTabs.length - 1]);
                    break;
            }
        });
    });
}

// Sistema "Carregar mais" para exercícios e desafios
function initLoadMoreSystem() {
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.content-section');
            const hiddenCards = section.querySelectorAll('.exercise-card:not(.visible), .challenge-card:not(.visible)');
            
            // Mostrar próximos 6 cards
            for (let i = 0; i < Math.min(6, hiddenCards.length); i++) {
                hiddenCards[i].classList.add('visible');
                hiddenCards[i].style.display = 'block';
            }
            
            // Esconder botão se não há mais cards
            const remainingHidden = section.querySelectorAll('.exercise-card:not(.visible), .challenge-card:not(.visible)');
            if (remainingHidden.length === 0) {
                btn.style.display = 'none';
            }
            
            // Atualizar contador
            updateLoadMoreCounter(btn, remainingHidden.length);
        });
    });
}

// Atualizar contador do botão "Carregar mais"
function updateLoadMoreCounter(btn, remaining) {
    const counter = btn.querySelector('.load-count');
    if (counter && remaining > 0) {
        counter.textContent = `+${Math.min(6, remaining)}`;
    }
}

// Inicializar sistema de cards com limite inicial
function initCardVisibility() {
    const exerciseCards = document.querySelectorAll('.exercise-card');
    const challengeCards = document.querySelectorAll('.challenge-card');
    
    // Mostrar apenas os primeiros 6 de cada tipo
    exerciseCards.forEach((card, index) => {
        if (index < 6) {
            card.classList.add('visible');
        } else {
            card.style.display = 'none';
        }
    });
    
    challengeCards.forEach((card, index) => {
        if (index < 6) {
            card.classList.add('visible');
        } else {
            card.style.display = 'none';
        }
    });
    
    // Atualizar contadores iniciais
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    loadMoreBtns.forEach(btn => {
        const section = btn.closest('.content-section');
        const hiddenCards = section.querySelectorAll('.exercise-card:not(.visible), .challenge-card:not(.visible)');
        updateLoadMoreCounter(btn, hiddenCards.length);
        
        if (hiddenCards.length === 0) {
            btn.style.display = 'none';
        }
    });
}

// Animação da barra de progresso
function animateProgressBar() {
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = '75%'; // Simula 75% de progresso
        }, 500);
    }
}

// Animação das partículas de fundo
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Sistema de Lazy Loading
function initializeLazyLoading() {
    // Configurar Intersection Observer para lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Observer para cards de exercícios
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.classList.add('visible');
                observer.unobserve(card);
            }
        });
    }, {
        rootMargin: '20px 0px',
        threshold: 0.1
    });

    // Aplicar lazy loading a imagens
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });

    // Aplicar lazy loading a cards
    document.querySelectorAll('.exercise-card, .challenge-card').forEach(card => {
        card.classList.add('lazy-card');
        cardObserver.observe(card);
    });
}

// Funções auxiliares para progresso
function getExerciseId(href) {
    if (!href || typeof href !== 'string') return null;
    const match = href.match(/ex(\d+)\.html/);
    return match ? `ex${match[1]}` : null;
}

function getChallengeId(href) {
    if (!href || typeof href !== 'string') return null;
    const match = href.match(/d(\d+)\.html/);
    return match ? `d${match[1]}` : null;
}

function toggleComplete(id, card, type = 'exercise') {
    if (!id) return;
    
    const completed = getCompletedItems();
    const key = `${type}_${id}`;
    
    if (completed.includes(key)) {
        // Remove da lista
        const index = completed.indexOf(key);
        completed.splice(index, 1);
        card.classList.remove('completed');
    } else {
        // Adiciona à lista
        completed.push(key);
        card.classList.add('completed');
        showCompletionToast(id, type);
    }
    
    localStorage.setItem('completedItems', JSON.stringify(completed));
    updateProgressStats();
}

function loadProgress() {
    const completed = getCompletedItems();
    
    completed.forEach(item => {
        const [type, id] = item.split('_');
        const selector = type === 'exercise' ? 
            `a[href*="${id}.html"]` : 
            `a[href*="${id}.html"]`;
        
        const card = document.querySelector(selector);
        if (card) {
            card.classList.add('completed');
        }
    });
    
    updateProgressStats();
}

function getCompletedItems() {
    const stored = localStorage.getItem('completedItems');
    return stored ? JSON.parse(stored) : [];
}

function updateProgressStats() {
    const completed = getCompletedItems();
    const totalExercises = document.querySelectorAll('.exercise-card').length;
    const totalChallenges = document.querySelectorAll('.challenge-card').length;
    const total = totalExercises + totalChallenges;
    
    const completedCount = completed.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    
    // Atualiza ou cria barra de progresso
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = createProgressBar();
    }
    
    // Atualiza elementos do dashboard
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    const completedCountEl = document.getElementById('completed-count');
    const totalCountEl = document.getElementById('total-count');
    const percentageValueEl = document.getElementById('percentage-value');
    
    // Atualiza barra de progresso
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${completedCount}/${total} concluídos (${percentage}%)`;
    }
    
    // Atualiza estatísticas
    if (completedCountEl) completedCountEl.textContent = completedCount;
    if (totalCountEl) totalCountEl.textContent = total;
    if (percentageValueEl) percentageValueEl.textContent = `${percentage}%`;
    
    // Atualiza marcos de progresso
    updateProgressMilestones(percentage);
    
    // Verifica e atualiza conquistas
    updateAchievements(completedCount, total, percentage, completed);
}

function updateProgressMilestones(percentage) {
    const milestones = document.querySelectorAll('.milestone');
    milestones.forEach(milestone => {
        const milestonePercentage = parseInt(milestone.dataset.percentage);
        if (percentage >= milestonePercentage) {
            milestone.classList.add('achieved');
        } else {
            milestone.classList.remove('achieved');
        }
    });
}

function updateAchievements(completedCount, total, percentage, completed) {
    // Primeira conquista: Primeiro exercício
    const firstExercise = document.getElementById('first-exercise');
    if (firstExercise && completedCount >= 1) {
        firstExercise.classList.add('unlocked');
    }
    
    // Conquista: 3 exercícios seguidos (verificar se há pelo menos 3 concluídos)
    const streak3 = document.getElementById('streak-3');
    if (streak3 && completedCount >= 3) {
        streak3.classList.add('unlocked');
    }
    
    // Conquista: Meio caminho (50% ou mais)
    const halfway = document.getElementById('halfway');
    if (halfway && percentage >= 50) {
        halfway.classList.add('unlocked');
    }
    
    // Conquista: Completou tudo (100%)
    const completedAll = document.getElementById('completed-all');
    if (completedAll && percentage >= 100) {
        completedAll.classList.add('unlocked');
        showMasterAchievement();
    }
}

function showMasterAchievement() {
    // Mostra uma animação especial quando completa tudo
    const toast = document.createElement('div');
    toast.className = 'master-achievement-toast';
    toast.innerHTML = `
        <div class="master-toast-content">
            <div class="master-icon">👑</div>
            <div class="master-text">
                <h3>Parabéns, Mestre!</h3>
                <p>Você completou todos os exercícios!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 500);
    }, 5000);
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-dashboard">
            <div class="progress-header">
                <h3 class="progress-title">
                    <span class="progress-icon">📊</span>
                    Seu Progresso de Aprendizado
                </h3>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-value" id="completed-count">0</span>
                        <span class="stat-label">Concluídos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="total-count">0</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="percentage-value">0%</span>
                        <span class="stat-label">Progresso</span>
                    </div>
                </div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                    <div class="progress-text">0/0 concluídos (0%)</div>
                </div>
                <div class="progress-milestones">
                    <div class="milestone" data-percentage="25">
                        <span class="milestone-icon">🌱</span>
                        <span class="milestone-label">Iniciante</span>
                    </div>
                    <div class="milestone" data-percentage="50">
                        <span class="milestone-icon">🚀</span>
                        <span class="milestone-label">Progredindo</span>
                    </div>
                    <div class="milestone" data-percentage="75">
                        <span class="milestone-icon">⭐</span>
                        <span class="milestone-label">Avançado</span>
                    </div>
                    <div class="milestone" data-percentage="100">
                        <span class="milestone-icon">🏆</span>
                        <span class="milestone-label">Mestre</span>
                    </div>
                </div>
            </div>
            <div class="progress-achievements">
                <div class="achievement" id="first-exercise">
                    <span class="achievement-icon">🎯</span>
                    <span class="achievement-text">Primeiro Exercício</span>
                </div>
                <div class="achievement" id="streak-3">
                    <span class="achievement-icon">🔥</span>
                    <span class="achievement-text">3 Seguidos</span>
                </div>
                <div class="achievement" id="halfway">
                    <span class="achievement-icon">🎖️</span>
                    <span class="achievement-text">Meio Caminho</span>
                </div>
                <div class="achievement" id="completed-all">
                    <span class="achievement-icon">👑</span>
                    <span class="achievement-text">Completou Tudo</span>
                </div>
            </div>
        </div>
    `;
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.appendChild(progressContainer);
    }
    
    return progressContainer.querySelector('.progress-bar');
}

function showCompletionToast(id, type) {
    const toast = document.createElement('div');
    toast.className = 'completion-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">🎉</span>
            <span class="toast-message">${type === 'exercise' ? 'Exercício' : 'Desafio'} ${id} concluído!</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animação de entrada
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-progress-btn';
    resetBtn.textContent = 'Resetar Progresso';
    resetBtn.title = 'Limpar todo o progresso salvo';
    
    resetBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
            localStorage.removeItem('completedItems');
            document.querySelectorAll('.completed').forEach(card => {
                card.classList.remove('completed');
            });
            updateProgressStats();
            alert('Progresso resetado com sucesso!');
        }
    });
    
    const footer = document.querySelector('.main-footer');
    if (footer) {
        footer.appendChild(resetBtn);
    }
}

// Adiciona estilos CSS dinamicamente
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .search-container {
            position: relative;
            max-width: 400px;
            margin: 2rem auto 0;
        }
        
        .search-input {
            width: 100%;
            padding: 1rem 3rem 1rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s ease;
        }
        
        .search-input:focus {
            border-color: #667eea;
        }
        
        .search-clear {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #718096;
            display: none;
        }
        
        .progress-container {
            margin-top: 2rem;
        }
        
        .progress-dashboard {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .progress-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
        }
        
        .progress-icon {
            font-size: 1.8rem;
        }
        
        .progress-stats {
            display: flex;
            gap: 2rem;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            display: block;
            font-size: 2rem;
            font-weight: 800;
            color: #4FD1C7;
            line-height: 1;
        }
        
        .stat-label {
            display: block;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.25rem;
        }
        
        .progress-bar-container {
            margin-bottom: 1.5rem;
        }
        
        .progress-bar {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            height: 40px;
            position: relative;
            overflow: hidden;
            margin-bottom: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .progress-fill {
            background: linear-gradient(135deg, #4FD1C7, #00F2FE);
            height: 100%;
            border-radius: 25px;
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            width: 0%;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: 700;
            color: white;
            font-size: 0.9rem;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .progress-milestones {
            display: flex;
            justify-content: space-between;
            position: relative;
        }
        
        .progress-milestones::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 0;
            right: 0;
            height: 2px;
            background: rgba(255, 255, 255, 0.2);
            z-index: 1;
        }
        
        .milestone {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
        }
        
        .milestone-icon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .milestone.achieved .milestone-icon {
            background: linear-gradient(135deg, #4FD1C7, #00F2FE);
            border-color: #4FD1C7;
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(79, 209, 199, 0.5);
        }
        
        .milestone-label {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.7);
            text-align: center;
            font-weight: 600;
        }
        
        .milestone.achieved .milestone-label {
            color: #4FD1C7;
        }
        
        .progress-achievements {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .achievement {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            transition: all 0.3s ease;
            opacity: 0.5;
        }
        
        .achievement.unlocked {
            opacity: 1;
            background: rgba(79, 209, 199, 0.1);
            border-color: rgba(79, 209, 199, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 209, 199, 0.2);
        }
        
        .achievement-icon {
            font-size: 1.5rem;
            filter: grayscale(100%);
            transition: filter 0.3s ease;
        }
        
        .achievement.unlocked .achievement-icon {
            filter: grayscale(0%);
        }
        
        .achievement-text {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }
        
        .achievement.unlocked .achievement-text {
            color: #4FD1C7;
        }
        
        .complete-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #e2e8f0;
            background: white;
            color: #718096;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .complete-btn:hover {
            border-color: #667eea;
            color: #667eea;
        }
        
        .completed .complete-btn {
            background: #48bb78;
            border-color: #48bb78;
            color: white;
        }
        
        .completed {
            opacity: 0.7;
            position: relative;
        }
        
        .completed::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(72, 187, 120, 0.1);
            border-radius: 10px;
        }
        
        .completion-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .completion-toast.show {
            transform: translateX(0);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .toast-icon {
            font-size: 1.2rem;
        }
        
        .toast-message {
            font-weight: 600;
            color: #2d3748;
        }
        
        .master-achievement-toast {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: linear-gradient(135deg, #667eea, #764ba2);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .master-achievement-toast.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .master-toast-content {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            color: white;
        }
        
        .master-icon {
            font-size: 4rem;
            animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        .master-text h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.8rem;
            font-weight: 800;
        }
        
        .master-text p {
            margin: 0;
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        /* Responsividade */
        @media (max-width: 768px) {
            .progress-header {
                flex-direction: column;
                text-align: center;
            }
            
            .progress-stats {
                gap: 1rem;
            }
            
            .stat-value {
                font-size: 1.5rem;
            }
            
            .progress-title {
                font-size: 1.2rem;
            }
            
            .progress-achievements {
                grid-template-columns: 1fr;
            }
            
            .milestone-label {
                font-size: 0.6rem;
            }
            
            .master-toast-content {
                flex-direction: column;
                text-align: center;
            }
            
            .master-icon {
                font-size: 3rem;
            }
            
            .master-text h3 {
                font-size: 1.5rem;
            }
        }
        
        @media (max-width: 480px) {
            .progress-dashboard {
                padding: 1rem;
            }
            
            .progress-stats {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .progress-milestones {
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: center;
            }
            
            .progress-milestones::before {
                display: none;
            }
        }
        
        .reset-progress-btn {
            background: #e53e3e;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-top: 1rem;
            transition: background 0.3s ease;
        }
        
        .reset-progress-btn:hover {
            background: #c53030;
        }
        
        .exercise-card,
        .challenge-card {
            position: relative;
        }
    `;
    
    document.head.appendChild(style);
}

// Sistema de Navegação Inteligente
class SmartNavigation {
    constructor() {
        this.initNavigation();
    }

    initNavigation() {
        // Detectar se estamos em uma página de exercício ou desafio
        const currentPath = window.location.pathname;
        const isExercise = currentPath.includes('/exercises/');
        const isChallenge = currentPath.includes('/challenges/');
        
        if (isExercise || isChallenge) {
            this.setupSmartNavigation(currentPath, isExercise);
        }
    }

    setupSmartNavigation(currentPath, isExercise) {
        const fileName = currentPath.split('/').pop();
        const currentNumber = this.extractNumber(fileName);
        
        if (currentNumber) {
            this.updateNavigationLinks(currentNumber, isExercise);
        }
    }

    extractNumber(fileName) {
        const match = fileName.match(/(ex|d)(\d+)/i);
        return match ? parseInt(match[2]) : null;
    }

    updateNavigationLinks(currentNumber, isExercise) {
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        if (isExercise) {
            // Lógica para exercícios
            if (currentNumber > 1) {
                const prevNumber = String(currentNumber - 1).padStart(3, '0');
                if (prevBtn && !prevBtn.textContent.includes('Voltar ao Curso')) {
                    prevBtn.href = `ex${prevNumber}.html`;
                    prevBtn.textContent = `← Exercício ${currentNumber - 1}`;
                }
            }
            
            // Para o próximo exercício, verificar se existe
            const nextNumber = String(currentNumber + 1).padStart(3, '0');
            if (nextBtn && !nextBtn.textContent.includes('Voltar ao Curso')) {
                // Por enquanto, apenas ex001 e ex002 existem
                if (currentNumber < 2) {
                    nextBtn.href = `ex${nextNumber}.html`;
                    nextBtn.textContent = `Exercício ${currentNumber + 1} →`;
                } else {
                    nextBtn.href = '../index.html';
                    nextBtn.textContent = 'Voltar ao Curso →';
                }
            }
        }
    }
}

// Adiciona os estilos quando a página carrega
addDynamicStyles();

// Sistema de Progresso e Desbloqueio
function initProgressSystem() {
    // Aguarda o sistema de progresso estar disponível
    if (typeof window.progressSystem === 'undefined') {
        setTimeout(initProgressSystem, 100);
        return;
    }
    
    // Aplicar sistema de desbloqueio aos cards
    applyUnlockSystem();
}

function applyUnlockSystem() {
    const exerciseCards = document.querySelectorAll('.exercise-card');
    
    exerciseCards.forEach(card => {
        const link = card.querySelector('a.card-link');
        if (!link || !link.href) return;
        
        const exerciseMatch = link.href.match(/ex(\d+)\.html/);
        if (!exerciseMatch) return;
        
        const exerciseId = `ex${exerciseMatch[1].padStart(3, '0')}`;
        const isUnlocked = window.progressSystem.isExerciseUnlocked(exerciseId);
        const exercise = window.progressSystem.exercises.find(ex => ex.id === exerciseId);
        
        // Aplicar estado visual baseado no desbloqueio
        if (!isUnlocked) {
            card.classList.add('locked');
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.5';
            
            // Alterar texto do link
            const linkText = link.querySelector('span:first-child');
            if (linkText) {
                linkText.textContent = '🔒 Bloqueado';
            }
            
            // Adicionar tooltip explicativo
            card.title = 'Complete o quiz do exercício anterior com 70% de acertos para desbloquear';
        } else {
            card.classList.remove('locked');
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
            
            // Marcar como completo se o quiz foi feito
            if (exercise && exercise.quizCompleted && exercise.quizScore >= 70) {
                card.classList.add('completed');
                
                // Adicionar indicador de conclusão
                if (!card.querySelector('.completion-badge')) {
                    const badge = document.createElement('div');
                    badge.className = 'completion-badge';
                    badge.innerHTML = '✅';
                    badge.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #10b981;
                        color: white;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        z-index: 2;
                    `;
                    card.style.position = 'relative';
                    card.appendChild(badge);
                }
            }
        }
    });
}

// Função para atualizar o sistema quando um quiz é completado
function updateExerciseProgress(exerciseId, score) {
    if (window.progressSystem) {
        window.progressSystem.completeQuiz(exerciseId, score);
        applyUnlockSystem(); // Reaplica o sistema para atualizar os cards
    }
}

// Inicializa navegação inteligente
new SmartNavigation();