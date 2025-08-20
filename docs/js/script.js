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
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetSection = tab.dataset.section;
            
            // Remove active class from all tabs and sections
            navTabs.forEach(t => t.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
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
    
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${completedCount}/${total} concluídos (${percentage}%)`;
    }
}

function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
            <div class="progress-text">0/0 concluídos (0%)</div>
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
        
        .progress-bar {
            background: #e2e8f0;
            border-radius: 25px;
            height: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill {
            background: linear-gradient(135deg, #667eea, #764ba2);
            height: 100%;
            border-radius: 25px;
            transition: width 0.5s ease;
            width: 0%;
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-weight: 600;
            color: #2d3748;
            font-size: 0.9rem;
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