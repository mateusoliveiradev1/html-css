/**
 * Sistema de Quiz Integrado aos Exercícios
 * Gerencia quizzes dentro das páginas de exercícios
 */

class ExerciseQuiz {
    constructor(exerciseId, containerId) {
        this.exerciseId = exerciseId;
        this.container = document.getElementById(containerId);
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.quiz = null;
        this.startTime = null;
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Container do quiz não encontrado');
            return;
        }

        // Carrega quiz do sistema de progresso
        this.quiz = window.progressSystem.getExerciseQuiz(this.exerciseId);
        if (!this.quiz) {
            console.error('Quiz não encontrado para o exercício:', this.exerciseId);
            return;
        }

        this.renderQuizStart();
    }

    renderQuizStart() {
        const isUnlocked = window.progressSystem.isExerciseUnlocked(this.exerciseId);
        const exercise = window.progressSystem.exercises.find(ex => ex.id === this.exerciseId);
        
        this.container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h3>🧠 Quiz do Exercício</h3>
                    <p>Complete o quiz com pelo menos 70% de acertos para desbloquear o próximo exercício!</p>
                </div>
                
                ${exercise && exercise.quizCompleted ? `
                    <div class="quiz-completed">
                        <div class="score-display ${exercise.quizScore >= 70 ? 'passed' : 'failed'}">
                            <span class="score-icon">${exercise.quizScore >= 70 ? '✅' : '❌'}</span>
                            <span class="score-text">Pontuação: ${exercise.quizScore}%</span>
                        </div>
                        <p class="quiz-status">
                            ${exercise.quizScore >= 70 
                                ? '🎉 Parabéns! Você passou no quiz e desbloqueou o próximo exercício!' 
                                : '📚 Você pode refazer o quiz para melhorar sua pontuação.'}
                        </p>
                    </div>
                ` : ''}
                
                <div class="quiz-info">
                    <div class="info-item">
                        <span class="info-icon">📝</span>
                        <span>${this.quiz.questions.length} questões</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">⏱️</span>
                        <span>Sem limite de tempo</span>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🎯</span>
                        <span>70% para passar</span>
                    </div>
                </div>
                
                <button class="quiz-start-btn" onclick="exerciseQuiz.startQuiz()">
                    <span>🚀</span>
                    ${exercise && exercise.quizCompleted ? 'Refazer Quiz' : 'Iniciar Quiz'}
                </button>
            </div>
        `;
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = Date.now();
        
        this.renderQuestion();
    }

    renderQuestion() {
        const question = this.quiz.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quiz.questions.length) * 100;
        
        this.container.innerHTML = `
            <div class="quiz-container active">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">Questão ${this.currentQuestion + 1} de ${this.quiz.questions.length}</span>
                </div>
                
                <div class="question-container">
                    <h4 class="question-title">Questão ${this.currentQuestion + 1}</h4>
                    <p class="question-text">${question.question}</p>
                    
                    <div class="options-container">
                        ${this.renderOptions(question)}
                    </div>
                </div>
                
                <div class="quiz-actions">
                    ${this.currentQuestion > 0 ? `
                        <button class="quiz-btn secondary" onclick="exerciseQuiz.previousQuestion()">
                            ← Anterior
                        </button>
                    ` : ''}
                    
                    <button class="quiz-btn primary" id="next-btn" onclick="exerciseQuiz.nextQuestion()" disabled>
                        ${this.currentQuestion === this.quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima →'}
                    </button>
                </div>
            </div>
        `;
    }

    renderOptions(question) {
        if (question.type === 'multiple') {
            return question.options.map((option, index) => `
                <label class="option-label">
                    <input type="radio" name="question" value="${index}" onchange="exerciseQuiz.selectAnswer(${index})">
                    <span class="option-text">${option}</span>
                </label>
            `).join('');
        } else if (question.type === 'boolean') {
            return `
                <label class="option-label">
                    <input type="radio" name="question" value="true" onchange="exerciseQuiz.selectAnswer(true)">
                    <span class="option-text">Verdadeiro</span>
                </label>
                <label class="option-label">
                    <input type="radio" name="question" value="false" onchange="exerciseQuiz.selectAnswer(false)">
                    <span class="option-text">Falso</span>
                </label>
            `;
        }
        return '';
    }

    selectAnswer(answer) {
        this.answers[this.currentQuestion] = answer;
        document.getElementById('next-btn').disabled = false;
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            
            // Restaura resposta anterior se existir
            if (this.answers[this.currentQuestion] !== undefined) {
                const answer = this.answers[this.currentQuestion];
                const input = document.querySelector(`input[value="${answer}"]`);
                if (input) {
                    input.checked = true;
                    document.getElementById('next-btn').disabled = false;
                }
            }
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.quiz.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            
            // Restaura resposta se já foi respondida
            if (this.answers[this.currentQuestion] !== undefined) {
                const answer = this.answers[this.currentQuestion];
                const input = document.querySelector(`input[value="${answer}"]`);
                if (input) {
                    input.checked = true;
                    document.getElementById('next-btn').disabled = false;
                }
            }
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        // Calcula pontuação
        this.score = 0;
        this.quiz.questions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const correctAnswer = question.correct;
            
            if (question.type === 'boolean') {
                if ((userAnswer === 'true') === correctAnswer) {
                    this.score++;
                }
            } else {
                if (parseInt(userAnswer) === correctAnswer) {
                    this.score++;
                }
            }
        });
        
        const percentage = Math.round((this.score / this.quiz.questions.length) * 100);
        const passed = percentage >= 70;
        
        // Salva resultado no sistema de progresso
        const unlockedNext = window.progressSystem.completeQuiz(this.exerciseId, percentage);
        
        // Notifica o sistema principal para atualizar os cards
        if (typeof window.updateExerciseProgress === 'function') {
            window.updateExerciseProgress(this.exerciseId, percentage);
        }
        
        this.renderResults(percentage, passed, unlockedNext);
    }

    renderResults(percentage, passed, unlockedNext) {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - this.startTime) / 1000);
        
        this.container.innerHTML = `
            <div class="quiz-container results">
                <div class="results-header">
                    <div class="score-circle ${passed ? 'passed' : 'failed'}">
                        <span class="score-percentage">${percentage}%</span>
                        <span class="score-label">Pontuação</span>
                    </div>
                    
                    <h3 class="results-title">
                        ${passed ? '🎉 Parabéns!' : '📚 Continue Estudando!'}
                    </h3>
                    
                    <p class="results-message">
                        ${passed 
                            ? 'Você passou no quiz! Excelente trabalho.' 
                            : 'Você precisa de pelo menos 70% para passar. Revise o conteúdo e tente novamente.'}
                    </p>
                </div>
                
                <div class="results-details">
                    <div class="detail-item">
                        <span class="detail-icon">✅</span>
                        <span>Acertos: ${this.score}/${this.quiz.questions.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⏱️</span>
                        <span>Tempo: ${timeSpent}s</span>
                    </div>
                    ${unlockedNext ? `
                        <div class="detail-item unlock">
                            <span class="detail-icon">🔓</span>
                            <span>Próximo exercício desbloqueado!</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="results-actions">
                    <button class="quiz-btn secondary" onclick="exerciseQuiz.showReview()">
                        📝 Ver Respostas
                    </button>
                    
                    <button class="quiz-btn primary" onclick="exerciseQuiz.renderQuizStart()">
                        🔄 Refazer Quiz
                    </button>
                    
                    ${unlockedNext ? `
                        <a href="../index.html" class="quiz-btn success">
                            🚀 Próximo Exercício
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }

    showReview() {
        let reviewHTML = `
            <div class="quiz-container review">
                <div class="review-header">
                    <h3>📝 Revisão das Respostas</h3>
                    <button class="close-review" onclick="exerciseQuiz.renderResults(${Math.round((this.score / this.quiz.questions.length) * 100)}, ${this.score / this.quiz.questions.length >= 0.7}, false)">✕</button>
                </div>
                
                <div class="review-questions">
        `;
        
        this.quiz.questions.forEach((question, index) => {
            const userAnswer = this.answers[index];
            const correctAnswer = question.correct;
            let isCorrect = false;
            let userAnswerText = '';
            let correctAnswerText = '';
            
            if (question.type === 'boolean') {
                isCorrect = (userAnswer === 'true') === correctAnswer;
                userAnswerText = userAnswer === 'true' ? 'Verdadeiro' : 'Falso';
                correctAnswerText = correctAnswer ? 'Verdadeiro' : 'Falso';
            } else {
                isCorrect = parseInt(userAnswer) === correctAnswer;
                userAnswerText = question.options[userAnswer] || 'Não respondida';
                correctAnswerText = question.options[correctAnswer];
            }
            
            reviewHTML += `
                <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="question-header">
                        <span class="question-number">Questão ${index + 1}</span>
                        <span class="question-result">${isCorrect ? '✅' : '❌'}</span>
                    </div>
                    
                    <p class="question-text">${question.question}</p>
                    
                    <div class="answer-comparison">
                        <div class="user-answer">
                            <strong>Sua resposta:</strong> ${userAnswerText}
                        </div>
                        ${!isCorrect ? `
                            <div class="correct-answer">
                                <strong>Resposta correta:</strong> ${correctAnswerText}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="explanation">
                        <strong>Explicação:</strong> ${question.explanation}
                    </div>
                </div>
            `;
        });
        
        reviewHTML += `
                </div>
            </div>
        `;
        
        this.container.innerHTML = reviewHTML;
    }
}

// Função global para inicializar quiz em uma página de exercício
function initExerciseQuiz(exerciseId, containerId = 'quiz-container') {
    // Aguarda o sistema de progresso estar carregado
    if (window.progressSystem) {
        window.exerciseQuiz = new ExerciseQuiz(exerciseId, containerId);
    } else {
        // Aguarda um pouco e tenta novamente
        setTimeout(() => initExerciseQuiz(exerciseId, containerId), 100);
    }
}