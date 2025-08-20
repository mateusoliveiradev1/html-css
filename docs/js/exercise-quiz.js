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
        this.hasNavigatedForward = false; // Rastreia se já navegou para frente
        
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
        const hasPassed = exercise && exercise.quizCompleted && exercise.quizScore >= 70;
        
        // Se já passou no quiz, redireciona automaticamente para o próximo exercício
        if (hasPassed) {
            const nextExerciseId = `ex${String(parseInt(this.exerciseId.replace('ex', '')) + 1).padStart(3, '0')}`;
            const nextExerciseExists = document.querySelector(`[data-exercise="${nextExerciseId}"]`) !== null;
            
            if (nextExerciseExists) {
                this.container.innerHTML = `
                    <div class="quiz-container">
                        <div class="quiz-completed">
                            <div class="score-display passed">
                                <span class="score-icon">✅</span>
                                <span class="score-text">Pontuação: ${exercise.quizScore}%</span>
                            </div>
                            <p class="quiz-status">
                                🎉 Parabéns! Você já passou neste quiz e o próximo exercício está desbloqueado!
                            </p>
                            <div class="quiz-skip-info">
                                <p class="skip-message">💡 <strong>Redirecionando automaticamente...</strong> Ou clique no botão "Próximo Exercício" na navegação.</p>
                            </div>
                        </div>
                        
                        <button class="quiz-start-btn" onclick="exerciseQuiz.startQuiz()">
                            <span>🔄</span>
                            Refazer Quiz (Opcional)
                        </button>
                    </div>
                `;
                
                // Redireciona automaticamente após 3 segundos
                setTimeout(() => {
                    window.location.href = `${nextExerciseId}.html`;
                }, 3000);
                return;
            }
        }
        
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
        
        // Se a questão já foi respondida, desabilita as opções e mostra feedback
        if (this.answers[this.currentQuestion] !== undefined) {
            const radioInputs = document.querySelectorAll('input[type="radio"]');
            radioInputs.forEach(input => {
                input.disabled = true;
                if (input.value === this.answers[this.currentQuestion]) {
                    input.checked = true;
                }
            });
            
            // Mostra feedback da resposta já dada
            this.showInstantFeedback(this.answers[this.currentQuestion]);
        }
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.score = 0;
        this.startTime = Date.now();
        
        // Embaralha as questões a cada nova tentativa
        this.shuffleQuestions();
        
        this.renderQuestion();
    }
    
    shuffleQuestions() {
        // Implementa algoritmo Fisher-Yates para embaralhar questões
        for (let i = this.quiz.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.quiz.questions[i], this.quiz.questions[j]] = [this.quiz.questions[j], this.quiz.questions[i]];
        }
    }
    
    shuffleArray(array) {
        // Método genérico para embaralhar arrays usando Fisher-Yates
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
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
                    <div class="question-header">
                        <h4 class="question-title">Questão ${this.currentQuestion + 1}</h4>
                        ${question.difficulty ? `<span class="difficulty-badge ${question.difficulty}">${this.getDifficultyText(question.difficulty)}</span>` : ''}
                    </div>
                    <p class="question-text">${question.question}</p>
                    
                    ${question.hint ? `
                        <div class="question-hint" id="hint-${this.currentQuestion}" style="display: none;">
                            <div class="hint-content">
                                <span class="hint-icon">💡</span>
                                <span class="hint-text">${question.hint}</span>
                            </div>
                        </div>
                        <button class="hint-btn" onclick="exerciseQuiz.toggleHint(${this.currentQuestion})">
                            <span class="hint-btn-icon">💡</span>
                            <span class="hint-btn-text">Ver Dica</span>
                        </button>
                    ` : ''}
                    
                    <div class="options-container">
                        ${this.renderOptions(question)}
                    </div>
                    
                    <div class="feedback-container" id="feedback-container" style="display: none;"></div>
                </div>
                
                <div class="quiz-actions">
                    ${this.currentQuestion > 0 ? `
                        <button class="quiz-btn secondary" onclick="exerciseQuiz.previousQuestion()" ${this.hasNavigatedForward ? 'disabled' : ''}>
                            ← Anterior
                        </button>
                    ` : ''}
                    
                    <button class="quiz-btn primary" id="next-btn" onclick="exerciseQuiz.nextQuestion()" ${this.answers[this.currentQuestion] === undefined ? 'disabled' : ''}>
                        ${this.currentQuestion === this.quiz.questions.length - 1 ? 'Finalizar Quiz' : 'Próxima →'}
                    </button>
                </div>
            </div>
        `;
    }

    renderOptions(question) {
        if (question.type === 'multiple') {
            // Cria array com opções e seus índices originais
            const optionsWithIndex = question.options.map((option, index) => ({
                text: option,
                originalIndex: index
            }));
            
            // Embaralha as opções
            const shuffledOptions = this.shuffleArray([...optionsWithIndex]);
            
            return shuffledOptions.map((option) => `
                <label class="option-label">
                    <input type="radio" name="question" value="${option.originalIndex}" onchange="exerciseQuiz.selectAnswer('${option.originalIndex}')">
                    <span class="option-text">${option.text}</span>
                </label>
            `).join('');
        } else if (question.type === 'boolean') {
            // Para questões booleanas, também embaralha a ordem
            const booleanOptions = [
                { value: 'true', text: 'Verdadeiro' },
                { value: 'false', text: 'Falso' }
            ];
            
            const shuffledBooleans = this.shuffleArray([...booleanOptions]);
            
            return shuffledBooleans.map(option => `
                <label class="option-label">
                    <input type="radio" name="question" value="${option.value}" onchange="exerciseQuiz.selectAnswer('${option.value}')">
                    <span class="option-text">${option.text}</span>
                </label>
            `).join('');
        }
        return '';
    }

    selectAnswer(answer) {
        // Verifica se já foi respondida esta questão
        if (this.answers[this.currentQuestion] !== undefined) {
            return; // Bloqueia mudança de resposta
        }
        
        this.answers[this.currentQuestion] = answer;
        document.getElementById('next-btn').disabled = false;
        
        // Desabilita todas as opções após seleção
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.disabled = true;
        });
        
        // Adiciona feedback imediato visual
        this.showInstantFeedback(answer);
    }
    
    showInstantFeedback(selectedAnswer) {
        const question = this.quiz.questions[this.currentQuestion];
        const isCorrect = this.checkAnswer(question, selectedAnswer);
        const feedbackContainer = document.getElementById('feedback-container');
        
        // Remove feedback anterior
        feedbackContainer.style.display = 'none';
        
        // Adiciona classe visual à opção selecionada
        const options = document.querySelectorAll('.option-label');
        options.forEach(option => {
            option.classList.remove('selected', 'correct-preview', 'incorrect-preview');
        });
        
        const selectedOption = document.querySelector(`input[value="${selectedAnswer}"]`).closest('.option-label');
        selectedOption.classList.add('selected');
        
        // Mostra feedback após um pequeno delay para melhor UX
        setTimeout(() => {
            selectedOption.classList.add(isCorrect ? 'correct-preview' : 'incorrect-preview');
            
            feedbackContainer.innerHTML = `
                <div class="instant-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                    <div class="feedback-text">
                        <strong>${isCorrect ? 'Correto!' : 'Incorreto'}</strong>
                        <p class="feedback-explanation">${question.explanation || (isCorrect ? 'Boa! Você acertou.' : 'Revise o conteúdo e tente novamente.')}</p>
                    </div>
                </div>
            `;
            feedbackContainer.style.display = 'block';
        }, 300);
    }
    
    checkAnswer(question, userAnswer) {
        if (question.type === 'boolean') {
            return (userAnswer === 'true') === question.correct;
        } else {
            return parseInt(userAnswer) === question.correct;
        }
    }
    
    getDifficultyText(difficulty) {
        const difficulties = {
            'easy': 'Fácil',
            'medium': 'Médio',
            'hard': 'Difícil'
        };
        return difficulties[difficulty] || 'Médio';
    }
    
    toggleHint(questionIndex) {
        const hint = document.getElementById(`hint-${questionIndex}`);
        const btn = document.querySelector('.hint-btn');
        
        if (hint.style.display === 'none') {
            hint.style.display = 'block';
            btn.innerHTML = `
                <span class="hint-btn-icon">🔍</span>
                <span class="hint-btn-text">Ocultar Dica</span>
            `;
        } else {
            hint.style.display = 'none';
            btn.innerHTML = `
                <span class="hint-btn-icon">💡</span>
                <span class="hint-btn-text">Ver Dica</span>
            `;
        }
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
            this.hasNavigatedForward = true; // Marca que navegou para frente
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
                    
                    ${!passed ? `
                        <div class="failure-feedback">
                            <div class="failure-icon">⚠️</div>
                            <div class="failure-content">
                                <h4>Não desanime! Continue estudando</h4>
                                <p>Você obteve ${percentage}% de acertos. Para desbloquear o próximo exercício, você precisa de pelo menos 70%.</p>
                                <div class="study-tips">
                                    <h5>💡 Dicas para melhorar:</h5>
                                    <ul>
                                        <li>📖 Releia o conteúdo do exercício</li>
                                        <li>🔍 Use as dicas disponíveis nas questões</li>
                                        <li>📝 Revise suas respostas incorretas</li>
                                        <li>🔄 Refaça o quiz quando se sentir preparado</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ` : ''}
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
                        <a href="${this.getNextExerciseUrl()}" class="quiz-btn success">
                            🚀 Próximo Exercício
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getNextExerciseUrl() {
        const currentIndex = window.progressSystem.exercises.findIndex(ex => ex.id === this.exerciseId);
        if (currentIndex !== -1 && currentIndex < window.progressSystem.exercises.length - 1) {
            const nextExercise = window.progressSystem.exercises[currentIndex + 1];
            return `${nextExercise.id}.html`;
        }
        return '../index.html'; // Volta para o curso se não há próximo exercício
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