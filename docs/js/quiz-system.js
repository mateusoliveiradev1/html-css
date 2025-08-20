/**
 * Sistema de Quiz Escalável
 * Desenvolvido para suportar múltiplos tipos de quiz e fácil expansão
 */

class QuizSystem {
    constructor() {
        this.quizzes = new Map();
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.timeLimit = 0;
        this.timer = null;
        this.startTime = null;
        
        this.init();
    }
    
    init() {
        this.loadQuizData();
        this.bindEvents();
    }
    
    // Carregar dados dos quizzes (preparado para expansão)
    loadQuizData() {
        // Quiz de HTML Básico
        this.registerQuiz('html-basico', {
            title: 'HTML Básico',
            description: 'Teste seus conhecimentos sobre HTML básico',
            difficulty: 'Iniciante',
            timeLimit: 300, // 5 minutos
            questions: [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'Qual tag HTML é usada para criar um parágrafo?',
                    options: ['<p>', '<paragraph>', '<para>', '<text>'],
                    correct: 0,
                    explanation: 'A tag <p> é a forma padrão de criar parágrafos em HTML.'
                },
                {
                    id: 2,
                    type: 'multiple-choice',
                    question: 'Qual atributo é usado para definir o texto alternativo de uma imagem?',
                    options: ['title', 'alt', 'description', 'text'],
                    correct: 1,
                    explanation: 'O atributo "alt" fornece texto alternativo para imagens, importante para acessibilidade.'
                },
                {
                    id: 3,
                    type: 'true-false',
                    question: 'A tag <br> precisa de uma tag de fechamento.',
                    correct: false,
                    explanation: 'A tag <br> é uma tag vazia (self-closing) e não precisa de fechamento.'
                },
                {
                    id: 4,
                    type: 'code-completion',
                    question: 'Complete o código para criar um link:',
                    code: '<a ____="https://example.com">Clique aqui</a>',
                    correct: 'href',
                    explanation: 'O atributo "href" define o destino do link.'
                },
                {
                    id: 5,
                    type: 'multiple-choice',
                    question: 'Qual tag é usada para criar uma lista não ordenada?',
                    options: ['<ol>', '<ul>', '<list>', '<items>'],
                    correct: 1,
                    explanation: 'A tag <ul> (unordered list) cria listas com marcadores.'
                }
            ]
        });
        
        // Quiz de CSS Básico
        this.registerQuiz('css-basico', {
            title: 'CSS Básico',
            description: 'Teste seus conhecimentos sobre CSS básico',
            difficulty: 'Iniciante',
            timeLimit: 400, // 6 minutos e 40 segundos
            questions: [
                {
                    id: 1,
                    type: 'multiple-choice',
                    question: 'Qual propriedade CSS é usada para mudar a cor do texto?',
                    options: ['text-color', 'color', 'font-color', 'text-style'],
                    correct: 1,
                    explanation: 'A propriedade "color" define a cor do texto em CSS.'
                },
                {
                    id: 2,
                    type: 'code-completion',
                    question: 'Complete o código CSS para centralizar texto:',
                    code: 'text-align: ____;',
                    correct: 'center',
                    explanation: 'text-align: center; centraliza o texto horizontalmente.'
                },
                {
                    id: 3,
                    type: 'true-false',
                    question: 'CSS significa "Cascading Style Sheets".',
                    correct: true,
                    explanation: 'CSS significa "Cascading Style Sheets" (Folhas de Estilo em Cascata).'
                }
            ]
        });
    }
    
    // Registrar um novo quiz
    registerQuiz(id, quizData) {
        this.quizzes.set(id, quizData);
    }
    
    // Obter lista de quizzes disponíveis
    getAvailableQuizzes() {
        return Array.from(this.quizzes.entries()).map(([id, quiz]) => ({
            id,
            title: quiz.title,
            description: quiz.description,
            difficulty: quiz.difficulty,
            questionCount: quiz.questions.length,
            timeLimit: quiz.timeLimit
        }));
    }
    
    // Iniciar um quiz
    startQuiz(quizId) {
        const quiz = this.quizzes.get(quizId);
        if (!quiz) {
            throw new Error(`Quiz '${quizId}' não encontrado`);
        }
        
        this.currentQuiz = quiz;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.startTime = Date.now();
        
        if (quiz.timeLimit > 0) {
            this.startTimer(quiz.timeLimit);
        }
        
        this.showQuestion();
    }
    
    // Mostrar questão atual
    showQuestion() {
        if (!this.currentQuiz) return;
        
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const container = document.getElementById('quiz-container');
        
        if (!container) {
            console.error('Container do quiz não encontrado');
            return;
        }
        
        container.innerHTML = this.generateQuestionHTML(question);
        this.bindQuestionEvents();
    }
    
    // Gerar HTML da questão
    generateQuestionHTML(question) {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        
        let questionHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${this.currentQuestionIndex + 1} de ${this.currentQuiz.questions.length}</span>
                </div>
                ${this.timeLimit > 0 ? '<div class="quiz-timer" id="quiz-timer"></div>' : ''}
            </div>
            
            <div class="question-container">
                <h3 class="question-title">Questão ${this.currentQuestionIndex + 1}</h3>
                <p class="question-text">${question.question}</p>
        `;
        
        switch (question.type) {
            case 'multiple-choice':
                questionHTML += this.generateMultipleChoiceHTML(question);
                break;
            case 'true-false':
                questionHTML += this.generateTrueFalseHTML(question);
                break;
            case 'code-completion':
                questionHTML += this.generateCodeCompletionHTML(question);
                break;
        }
        
        questionHTML += `
                <div class="question-actions">
                    <button class="btn btn-primary" id="submit-answer" disabled>Responder</button>
                    ${this.currentQuestionIndex > 0 ? '<button class="btn btn-secondary" id="prev-question">Anterior</button>' : ''}
                </div>
            </div>
        `;
        
        return questionHTML;
    }
    
    // Gerar HTML para múltipla escolha
    generateMultipleChoiceHTML(question) {
        let html = '<div class="options-container">';
        question.options.forEach((option, index) => {
            html += `
                <label class="option-label">
                    <input type="radio" name="answer" value="${index}" class="option-input">
                    <span class="option-text">${option}</span>
                </label>
            `;
        });
        html += '</div>';
        return html;
    }
    
    // Gerar HTML para verdadeiro/falso
    generateTrueFalseHTML(question) {
        return `
            <div class="options-container">
                <label class="option-label">
                    <input type="radio" name="answer" value="true" class="option-input">
                    <span class="option-text">Verdadeiro</span>
                </label>
                <label class="option-label">
                    <input type="radio" name="answer" value="false" class="option-input">
                    <span class="option-text">Falso</span>
                </label>
            </div>
        `;
    }
    
    // Gerar HTML para completar código
    generateCodeCompletionHTML(question) {
        return `
            <div class="code-container">
                <pre class="code-block">${question.code}</pre>
                <input type="text" class="code-input" placeholder="Digite sua resposta..." id="code-answer">
            </div>
        `;
    }
    
    // Vincular eventos da questão
    bindQuestionEvents() {
        const submitBtn = document.getElementById('submit-answer');
        const prevBtn = document.getElementById('prev-question');
        const inputs = document.querySelectorAll('input[name="answer"], #code-answer');
        
        // Habilitar botão quando resposta for selecionada
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                submitBtn.disabled = false;
            });
            
            input.addEventListener('input', () => {
                submitBtn.disabled = input.value.trim() === '';
            });
        });
        
        // Submeter resposta
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }
        
        // Questão anterior
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }
    }
    
    // Submeter resposta
    submitAnswer() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        let userAnswer = null;
        
        switch (question.type) {
            case 'multiple-choice':
                const selectedOption = document.querySelector('input[name="answer"]:checked');
                userAnswer = selectedOption ? parseInt(selectedOption.value) : null;
                break;
            case 'true-false':
                const selectedTF = document.querySelector('input[name="answer"]:checked');
                userAnswer = selectedTF ? selectedTF.value === 'true' : null;
                break;
            case 'code-completion':
                const codeInput = document.getElementById('code-answer');
                userAnswer = codeInput ? codeInput.value.trim().toLowerCase() : null;
                break;
        }
        
        if (userAnswer === null) return;
        
        // Salvar resposta
        this.userAnswers[this.currentQuestionIndex] = userAnswer;
        
        // Verificar se está correto
        const isCorrect = this.checkAnswer(question, userAnswer);
        if (isCorrect) {
            this.score++;
        }
        
        // Mostrar feedback
        this.showFeedback(question, userAnswer, isCorrect);
    }
    
    // Verificar resposta
    checkAnswer(question, userAnswer) {
        switch (question.type) {
            case 'multiple-choice':
                return userAnswer === question.correct;
            case 'true-false':
                return userAnswer === question.correct;
            case 'code-completion':
                return userAnswer === question.correct.toLowerCase();
            default:
                return false;
        }
    }
    
    // Mostrar feedback
    showFeedback(question, userAnswer, isCorrect) {
        const container = document.getElementById('quiz-container');
        const feedbackHTML = `
            <div class="feedback-container ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-icon">
                    ${isCorrect ? '✅' : '❌'}
                </div>
                <h3 class="feedback-title">
                    ${isCorrect ? 'Correto!' : 'Incorreto'}
                </h3>
                <p class="feedback-explanation">${question.explanation}</p>
                <button class="btn btn-primary" id="next-question">
                    ${this.currentQuestionIndex < this.currentQuiz.questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}
                </button>
            </div>
        `;
        
        container.innerHTML = feedbackHTML;
        
        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });
    }
    
    // Próxima questão
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.finishQuiz();
        } else {
            this.showQuestion();
        }
    }
    
    // Questão anterior
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }
    
    // Finalizar quiz
    finishQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - this.startTime) / 1000);
        const percentage = Math.round((this.score / this.currentQuiz.questions.length) * 100);
        
        this.showResults({
            score: this.score,
            total: this.currentQuiz.questions.length,
            percentage,
            timeSpent
        });
    }
    
    // Mostrar resultados
    showResults(results) {
        const container = document.getElementById('quiz-container');
        const grade = this.getGrade(results.percentage);
        
        container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Quiz Concluído!</h2>
                    <div class="score-circle ${grade.class}">
                        <span class="score-percentage">${results.percentage}%</span>
                        <span class="score-text">${results.score}/${results.total}</span>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="result-item">
                        <span class="result-label">Nota:</span>
                        <span class="result-value ${grade.class}">${grade.letter}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Tempo:</span>
                        <span class="result-value">${this.formatTime(results.timeSpent)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Acertos:</span>
                        <span class="result-value">${results.score} de ${results.total}</span>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" id="restart-quiz">Refazer Quiz</button>
                    <button class="btn btn-secondary" id="back-to-menu">Voltar ao Menu</button>
                </div>
            </div>
        `;
        
        // Vincular eventos dos botões
        document.getElementById('restart-quiz').addEventListener('click', () => {
            this.startQuiz(this.getCurrentQuizId());
        });
        
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showQuizMenu();
        });
    }
    
    // Obter nota baseada na porcentagem
    getGrade(percentage) {
        if (percentage >= 90) return { letter: 'A+', class: 'grade-a-plus' };
        if (percentage >= 80) return { letter: 'A', class: 'grade-a' };
        if (percentage >= 70) return { letter: 'B', class: 'grade-b' };
        if (percentage >= 60) return { letter: 'C', class: 'grade-c' };
        if (percentage >= 50) return { letter: 'D', class: 'grade-d' };
        return { letter: 'F', class: 'grade-f' };
    }
    
    // Formatar tempo
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Iniciar timer
    startTimer(timeLimit) {
        this.timeLimit = timeLimit;
        this.timer = setInterval(() => {
            this.timeLimit--;
            this.updateTimerDisplay();
            
            if (this.timeLimit <= 0) {
                this.finishQuiz();
            }
        }, 1000);
    }
    
    // Atualizar display do timer
    updateTimerDisplay() {
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(this.timeLimit);
            
            if (this.timeLimit <= 30) {
                timerElement.classList.add('timer-warning');
            }
        }
    }
    
    // Mostrar menu de quizzes
    showQuizMenu() {
        const container = document.getElementById('quiz-container');
        const quizzes = this.getAvailableQuizzes();
        
        let menuHTML = `
            <div class="quiz-menu">
                <h2>Escolha um Quiz</h2>
                <div class="quiz-list">
        `;
        
        quizzes.forEach(quiz => {
            menuHTML += `
                <div class="quiz-item" data-quiz-id="${quiz.id}">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    <div class="quiz-meta">
                        <span class="difficulty ${quiz.difficulty.toLowerCase()}">${quiz.difficulty}</span>
                        <span class="question-count">${quiz.questionCount} questões</span>
                        <span class="time-limit">${this.formatTime(quiz.timeLimit)}</span>
                    </div>
                    <button class="btn btn-primary start-quiz-btn" data-quiz-id="${quiz.id}">
                        Iniciar Quiz
                    </button>
                </div>
            `;
        });
        
        menuHTML += `
                </div>
            </div>
        `;
        
        container.innerHTML = menuHTML;
        
        // Vincular eventos dos botões
        document.querySelectorAll('.start-quiz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const quizId = e.target.dataset.quizId;
                this.startQuiz(quizId);
            });
        });
    }
    
    // Obter ID do quiz atual
    getCurrentQuizId() {
        for (const [id, quiz] of this.quizzes.entries()) {
            if (quiz === this.currentQuiz) {
                return id;
            }
        }
        return null;
    }
    
    // Vincular eventos globais
    bindEvents() {
        // Eventos podem ser adicionados aqui conforme necessário
    }
}

// Inicializar sistema quando DOM estiver carregado
let quizSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    quizSystem = new QuizSystem();
    
    // Mostrar menu se container existir
    if (document.getElementById('quiz-container')) {
        quizSystem.showQuizMenu();
    }
});

// Exportar para uso global
window.QuizSystem = QuizSystem;
window.quizSystem = quizSystem;