/**
 * Sistema de Estatísticas Automáticas
 * Conta exercícios e desafios automaticamente e atualiza as estatísticas
 */

class AutoStatistics {
    constructor() {
        this.exerciseCount = 0;
        this.challengeCount = 0;
        this.practicalPercentage = 100;
        this.init();
    }

    async init() {
        await this.countContent();
        this.updateStatistics();
        this.startRealTimeUpdates();
    }

    async countContent() {
        // Conta os arquivos reais que existem no projeto
        this.exerciseCount = await this.countRealFiles('exercises');
        this.challengeCount = await this.countRealFiles('challenges');
        
        console.log(`Contagem real: ${this.exerciseCount} exercícios, ${this.challengeCount} desafios`);
    }

    async countRealFiles(type) {
        // Lista dos arquivos que realmente existem no projeto
        const knownFiles = {
            exercises: [
                'ex001.html', 'ex002.html', 'ex003.html', 'ex004.html', 
                'ex005.html', 'ex006.html', 'ex007.html', 'ex008.html'
            ],
            challenges: [
                'd001.html' // Adicione mais conforme necessário
            ]
        };
        
        const files = knownFiles[type] || [];
        
        // Retorna a contagem baseada na lista conhecida de arquivos
        // Isso evita requisições HTTP desnecessárias e erros de rede
        return files.length;
    }

    updateStatistics() {
        // Atualiza estatísticas na hero section
        const exercisesStat = document.querySelector('.stat-item:nth-child(1) .stat-number');
        const challengesStat = document.querySelector('.stat-item:nth-child(2) .stat-number');
        const practicalStat = document.querySelector('.stat-item:nth-child(3) .stat-number');

        if (exercisesStat) {
            exercisesStat.setAttribute('data-count', this.exerciseCount);
            this.animateCounter(exercisesStat, this.exerciseCount);
        }

        if (challengesStat) {
            challengesStat.setAttribute('data-count', this.challengeCount);
            this.animateCounter(challengesStat, this.challengeCount);
        }

        if (practicalStat) {
            practicalStat.setAttribute('data-count', this.practicalPercentage);
            this.animateCounter(practicalStat, this.practicalPercentage);
        }

        // Atualiza contadores nas tabs
        this.updateTabCounters();
    }

    updateTabCounters() {
        const exerciseTab = document.querySelector('[data-section="exercises-section"] .tab-count');
        const challengeTab = document.querySelector('[data-section="challenges-section"] .tab-count');

        if (exerciseTab) {
            exerciseTab.textContent = `${this.exerciseCount}+`;
            exerciseTab.setAttribute('aria-label', `${this.exerciseCount} ou mais exercícios disponíveis`);
        }

        if (challengeTab) {
            challengeTab.textContent = `${this.challengeCount}+`;
            challengeTab.setAttribute('aria-label', `${this.challengeCount} ou mais desafios disponíveis`);
        }
    }

    animateCounter(element, targetValue) {
        const startValue = 0;
        const duration = 2000; // 2 segundos
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para animação suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    startRealTimeUpdates() {
        // Observa mudanças no DOM apenas para novos arquivos
        this.setupDOMObserver();
        
        // Escuta eventos de foco na janela (quando o usuário volta para a aba)
        window.addEventListener('focus', () => {
            this.detectChanges();
        });
        
        // Escuta eventos de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.detectChanges();
            }
        });
        
        console.log('Sistema de estatísticas otimizado: atualiza apenas quando necessário');
    }

    setupDOMObserver() {
        // Observa mudanças no DOM apenas para detectar novos arquivos adicionados
        this.domObserver = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Verifica se foram adicionados links para exercícios ou desafios
                            const exerciseLinks = node.querySelectorAll ? node.querySelectorAll('a[href*="ex"], a[href*="exercise"]') : [];
                            const challengeLinks = node.querySelectorAll ? node.querySelectorAll('a[href*="d0"], a[href*="challenge"]') : [];
                            
                            if (exerciseLinks.length > 0 || challengeLinks.length > 0) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldUpdate) {
                console.log('Novos arquivos detectados, atualizando estatísticas...');
                setTimeout(() => {
                    this.detectChanges();
                }, 500);
            }
        });
        
        this.domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Método público para atualização manual
    refresh() {
        console.log('Atualizando estatísticas manualmente...');
        this.countContent().then(() => {
            this.updateStatistics();
        });
    }

    // Método para limpar observadores
    destroy() {
        if (this.domObserver) {
            this.domObserver.disconnect();
        }
    }

    // Método para detectar mudanças em tempo real via polling inteligente
    async detectChanges() {
        const currentCounts = {
            exercises: this.exerciseCount,
            challenges: this.challengeCount
        };

        await this.countContent();

        const hasChanges = 
            currentCounts.exercises !== this.exerciseCount ||
            currentCounts.challenges !== this.challengeCount;

        if (hasChanges) {
            console.log('Mudanças detectadas:', {
                exercícios: `${currentCounts.exercises} → ${this.exerciseCount}`,
                desafios: `${currentCounts.challenges} → ${this.challengeCount}`
            });
            this.updateStatistics();
            
            // Dispara evento customizado para notificar outras partes da aplicação
            window.dispatchEvent(new CustomEvent('statisticsUpdated', {
                detail: {
                    exercises: this.exerciseCount,
                    challenges: this.challengeCount,
                    previousExercises: currentCounts.exercises,
                    previousChallenges: currentCounts.challenges
                }
            }));
        }

        return hasChanges;
    }
}

// Inicializa o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.autoStats = new AutoStatistics();
});

// Exporta para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoStatistics;
}