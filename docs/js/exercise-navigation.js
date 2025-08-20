/**
 * Sistema de Navegação Controlada para Exercícios
 * Impede acesso a exercícios não desbloqueados
 */

class ExerciseNavigation {
    constructor() {
        this.progressSystem = null;
        this.init();
    }

    init() {
        // Aguarda o sistema de progresso estar disponível
        if (typeof window.progressSystem === 'undefined') {
            setTimeout(() => this.init(), 100);
            return;
        }

        this.checkPageAccess();
        this.setupNavigationControl();
    }

    checkPageAccess() {
        // Verifica se o usuário tem acesso à página atual
        const currentPath = window.location.pathname;
        const exerciseId = this.getExerciseIdFromHref(currentPath);
        
        if (exerciseId && exerciseId !== 'ex001') {
            const isUnlocked = window.progressSystem.isExerciseUnlocked(exerciseId);
            
            if (!isUnlocked) {
                this.redirectToLastAvailable();
                return;
            }
        }
    }

    redirectToLastAvailable() {
        // Encontra o último exercício disponível
        const exercises = window.progressSystem.exercises;
        let lastAvailable = 'ex001';
        
        for (const exercise of exercises) {
            if (exercise.unlocked) {
                lastAvailable = exercise.id;
            } else {
                break;
            }
        }
        
        // Mostra mensagem e redireciona
        this.showAccessDeniedMessage(this.getExerciseIdFromHref(window.location.pathname), true);
        
        setTimeout(() => {
            window.location.href = `${lastAvailable}.html`;
        }, 3000);
    }

    setupNavigationControl() {
        // Intercepta cliques em links de navegação
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // Verifica se é um link para exercício
            const href = link.getAttribute('href');
            if (!href || !href.includes('ex') || !href.includes('.html')) return;

            // Extrai ID do exercício do link
            const exerciseId = this.getExerciseIdFromHref(href);
            if (!exerciseId) return;

            // Verifica se o exercício está desbloqueado
            const isUnlocked = window.progressSystem.isExerciseUnlocked(exerciseId);
            
            if (!isUnlocked) {
                e.preventDefault();
                this.showAccessDeniedMessage(exerciseId);
                return false;
            }
        });

        // Atualiza visual dos botões de navegação
        this.updateNavigationButtons();
    }

    getExerciseIdFromHref(href) {
        if (!href) return null;
        const match = href.match(/ex(\d+)(?:\.html)?/);
        return match ? `ex${match[1]}` : null;
    }

    updateNavigationButtons() {
        const navButtons = document.querySelectorAll('.nav-btn.next');
        
        navButtons.forEach(button => {
            const href = button.getAttribute('href');
            const exerciseId = this.getExerciseIdFromHref(href);
            
            if (exerciseId) {
                const isUnlocked = window.progressSystem.isExerciseUnlocked(exerciseId);
                
                if (!isUnlocked) {
                    button.classList.add('locked');
                    button.setAttribute('title', 'Complete o quiz atual para desbloquear');
                    
                    // Adiciona ícone de cadeado
                    const lockIcon = document.createElement('span');
                    lockIcon.innerHTML = '🔒';
                    lockIcon.className = 'lock-icon';
                    button.appendChild(lockIcon);
                } else {
                    button.classList.remove('locked');
                    button.removeAttribute('title');
                    
                    // Remove ícone de cadeado se existir
                    const lockIcon = button.querySelector('.lock-icon');
                    if (lockIcon) {
                        lockIcon.remove();
                    }
                }
            }
        });
    }

    showAccessDeniedMessage(exerciseId, isRedirect = false) {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.access-denied-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria mensagem de acesso negado
        const message = document.createElement('div');
        message.className = 'access-denied-message';
        
        const content = isRedirect ? 
            `<div class="message-content">
                <span class="icon">🔒</span>
                <h3>Acesso Negado</h3>
                <p>Você não tem permissão para acessar este exercício. Complete os exercícios anteriores primeiro.</p>
                <p><strong>Redirecionando em 3 segundos...</strong></p>
            </div>` :
            `<div class="message-content">
                <span class="icon">🔒</span>
                <h3>Exercício Bloqueado</h3>
                <p>Complete o quiz do exercício atual com pelo menos 70% de acerto para desbloquear o próximo exercício.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Entendi</button>
            </div>`;
            
        message.innerHTML = content;

        // Adiciona estilos inline para a mensagem
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const messageContent = message.querySelector('.message-content');
        messageContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        `;

        const icon = message.querySelector('.icon');
        icon.style.cssText = `
            font-size: 3rem;
            display: block;
            margin-bottom: 1rem;
        `;

        const title = message.querySelector('h3');
        title.style.cssText = `
            color: #e74c3c;
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
        `;

        const text = message.querySelector('p');
        text.style.cssText = `
            color: #666;
            margin: 0 0 1.5rem 0;
            line-height: 1.5;
        `;

        const button = message.querySelector('.close-btn');
        if (button) {
            button.style.cssText = `
                background: #3498db;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                transition: background 0.3s ease;
            `;
        }

        if (button) {
            button.addEventListener('mouseenter', () => {
                button.style.background = '#2980b9';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = '#3498db';
            });
        }

        // Adiciona animações CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .nav-btn.locked {
                opacity: 0.6;
                cursor: not-allowed;
                position: relative;
            }
            .nav-btn.locked .lock-icon {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #e74c3c;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(message);

        // Remove mensagem automaticamente após 5 segundos
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 5000);
    }

    // Atualiza navegação quando progresso muda
    onProgressUpdate() {
        this.updateNavigationButtons();
    }
}

// Inicializa quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.exerciseNavigation = new ExerciseNavigation();
    });
} else {
    window.exerciseNavigation = new ExerciseNavigation();
}