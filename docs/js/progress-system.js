/**
 * Sistema de Progresso e Desbloqueio de Exercícios
 * Integra quizzes aos exercícios para controlar o progresso do usuário
 */

class ProgressSystem {
    constructor() {
        this.storageKey = 'html_css_progress';
        this.minQuizScore = 70; // 70% mínimo para desbloquear próximo exercício
        this.exercises = [
            {
                id: 'ex001',
                title: 'Olá, Mundo!',
                difficulty: 'beginner',
                unlocked: true, // Primeiro exercício sempre desbloqueado
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual é a estrutura básica de um documento HTML?',
                            options: [
                                '&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/html&gt;',
                                '&lt;document&gt;&lt;header&gt;&lt;/header&gt;&lt;content&gt;&lt;/content&gt;&lt;/document&gt;',
                                '&lt;page&gt;&lt;top&gt;&lt;/top&gt;&lt;main&gt;&lt;/main&gt;&lt;/page&gt;',
                                '&lt;website&gt;&lt;info&gt;&lt;/info&gt;&lt;data&gt;&lt;/data&gt;&lt;/website&gt;'
                            ],
                            correct: 0,
                            explanation: 'A estrutura básica do HTML consiste nas tags html, head (para metadados) e body (para conteúdo visível).'
                        },
                        {
                            type: 'multiple',
                            question: 'O que significa a tag &lt;!DOCTYPE html&gt;?',
                            options: [
                                'Define o tipo de documento como HTML5',
                                'Cria um comentário no HTML',
                                'Define o título da página',
                                'Importa uma biblioteca externa'
                            ],
                            correct: 0,
                            explanation: 'DOCTYPE html declara que o documento usa HTML5, ajudando o navegador a renderizar corretamente.'
                        },
                        {
                            type: 'boolean',
                            question: 'A tag &lt;meta charset="UTF-8"&gt; deve estar sempre dentro da tag &lt;head&gt;.',
                            correct: true,
                            explanation: 'Sim, meta tags devem estar dentro do head para definir metadados do documento.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual tag é usada para criar o título principal de uma página?',
                            options: [
                                '&lt;h1&gt;',
                                '&lt;title&gt;',
                                '&lt;header&gt;',
                                '&lt;main&gt;'
                            ],
                            correct: 0,
                            explanation: 'A tag &lt;h1&gt; é usada para o título principal visível na página, enquanto &lt;title&gt; é para o título na aba do navegador.'
                        },
                        {
                            type: 'multiple',
                            question: 'O que a tag &lt;hr&gt; faz em HTML?',
                            options: [
                                'Cria uma linha horizontal divisória',
                                'Define um cabeçalho',
                                'Cria um link',
                                'Adiciona uma imagem'
                            ],
                            correct: 0,
                            explanation: 'A tag &lt;hr&gt; (horizontal rule) cria uma linha horizontal para separar conteúdo.'
                        }
                    ]
                }
            },
            {
                id: 'ex002',
                title: 'Parágrafos e Quebras',
                difficulty: 'beginner',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual tag é usada para criar parágrafos em HTML?',
                            options: [
                                '&lt;p&gt;',
                                '&lt;paragraph&gt;',
                                '&lt;text&gt;',
                                '&lt;para&gt;'
                            ],
                            correct: 0,
                            explanation: 'A tag &lt;p&gt; é a forma padrão de criar parágrafos em HTML.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como fazer uma quebra de linha simples em HTML?',
                            options: [
                                '&lt;br&gt;',
                                '&lt;break&gt;',
                                '&lt;newline&gt;',
                                '&lt;line&gt;'
                            ],
                            correct: 0,
                            explanation: 'A tag &lt;br&gt; (break) cria uma quebra de linha simples.'
                        },
                        {
                            type: 'boolean',
                            question: 'A tag &lt;br&gt; precisa de uma tag de fechamento.',
                            correct: false,
                            explanation: 'A tag &lt;br&gt; é uma tag vazia (void element) e não precisa de fechamento.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual é a diferença entre &lt;br&gt; e &lt;p&gt;?',
                            options: [
                                '&lt;br&gt; quebra linha, &lt;p&gt; cria parágrafo com espaçamento',
                                'São exatamente iguais',
                                '&lt;p&gt; quebra linha, &lt;br&gt; cria parágrafo',
                                'Ambos criam parágrafos'
                            ],
                            correct: 0,
                            explanation: '&lt;br&gt; apenas quebra a linha, enquanto &lt;p&gt; cria um parágrafo completo com espaçamento adequado.'
                        }
                    ]
                }
            }
        ];
        
        this.loadProgress();
    }

    // Carrega progresso do localStorage
    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const progress = JSON.parse(saved);
            this.exercises.forEach(exercise => {
                const savedEx = progress.find(p => p.id === exercise.id);
                if (savedEx) {
                    exercise.unlocked = savedEx.unlocked;
                    exercise.completed = savedEx.completed;
                    exercise.quizCompleted = savedEx.quizCompleted;
                    exercise.quizScore = savedEx.quizScore;
                }
            });
        }
    }

    // Salva progresso no localStorage
    saveProgress() {
        const progress = this.exercises.map(ex => ({
            id: ex.id,
            unlocked: ex.unlocked,
            completed: ex.completed,
            quizCompleted: ex.quizCompleted,
            quizScore: ex.quizScore
        }));
        localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }

    // Verifica se exercício está desbloqueado
    isExerciseUnlocked(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        return exercise ? exercise.unlocked : false;
    }

    // Marca exercício como completado
    completeExercise(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
            exercise.completed = true;
            this.saveProgress();
        }
    }

    // Completa quiz e verifica se desbloqueia próximo exercício
    completeQuiz(exerciseId, score) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
            exercise.quizCompleted = true;
            exercise.quizScore = score;
            
            // Se passou no quiz (70%+), desbloqueia próximo exercício
            if (score >= this.minQuizScore) {
                const currentIndex = this.exercises.findIndex(ex => ex.id === exerciseId);
                if (currentIndex !== -1 && currentIndex < this.exercises.length - 1) {
                    this.exercises[currentIndex + 1].unlocked = true;
                }
            }
            
            this.saveProgress();
            
            // Notifica o sistema principal se disponível
            if (typeof window.updateExerciseProgress === 'function') {
                window.updateExerciseProgress();
            }
            
            // Notifica o sistema de navegação se disponível
            if (typeof window.exerciseNavigation === 'object' && window.exerciseNavigation.onProgressUpdate) {
                window.exerciseNavigation.onProgressUpdate();
            }
            
            return score >= this.minQuizScore;
        }
        return false;
    }

    // Obtém quiz de um exercício
    getExerciseQuiz(exerciseId) {
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        return exercise ? exercise.quiz : null;
    }

    // Obtém informações de progresso
    getProgressInfo() {
        const total = this.exercises.length;
        const completed = this.exercises.filter(ex => ex.completed).length;
        const quizCompleted = this.exercises.filter(ex => ex.quizCompleted && ex.quizScore >= this.minQuizScore).length;
        
        return {
            total,
            completed,
            quizCompleted,
            percentage: Math.round((completed / total) * 100)
        };
    }

    // Obtém próximo exercício disponível
    getNextAvailableExercise() {
        return this.exercises.find(ex => ex.unlocked && !ex.completed);
    }

    // Reseta progresso (para desenvolvimento/teste)
    resetProgress() {
        this.exercises.forEach((exercise, index) => {
            exercise.unlocked = index === 0; // Apenas primeiro desbloqueado
            exercise.completed = false;
            exercise.quizCompleted = false;
            exercise.quizScore = 0;
        });
        this.saveProgress();
    }
}

// Instância global do sistema de progresso
window.progressSystem = new ProgressSystem();