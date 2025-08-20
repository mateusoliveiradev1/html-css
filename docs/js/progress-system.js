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
                            difficulty: 'easy',
                            hint: 'Pense nas três partes principais: o container geral, a seção de informações e a seção de conteúdo visível.',
                            explanation: 'A estrutura básica do HTML consiste nas tags html (container principal), head (para metadados) e body (para conteúdo visível). Esta é a base de qualquer documento HTML válido.'
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
                            difficulty: 'medium',
                            hint: 'Esta declaração sempre aparece no início do documento e informa ao navegador qual versão do HTML está sendo usada.',
                            explanation: 'DOCTYPE html declara que o documento usa HTML5, ajudando o navegador a renderizar corretamente. Sem ela, o navegador pode entrar em "modo quirks" e interpretar o código de forma inconsistente.'
                        },
                        {
                            type: 'boolean',
                            question: 'A tag &lt;meta charset="UTF-8"&gt; deve estar sempre dentro da tag &lt;head&gt;.',
                            correct: true,
                            difficulty: 'easy',
                            hint: 'Meta tags contêm informações sobre o documento, não conteúdo visível.',
                            explanation: 'Verdadeiro! Meta tags devem estar dentro do head para definir metadados do documento. O charset="UTF-8" especifica a codificação de caracteres, permitindo acentos e caracteres especiais.'
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
                            difficulty: 'easy',
                            hint: 'Procure pela tag de cabeçalho de nível 1, que representa o título mais importante da página.',
                            explanation: 'A tag &lt;h1&gt; é usada para o título principal visível na página. É importante para SEO e acessibilidade usar apenas um &lt;h1&gt; por página. A tag &lt;title&gt; é para o título na aba do navegador.'
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
                            difficulty: 'medium',
                            hint: 'HR significa "Horizontal Rule" - pense em uma régua horizontal que separa conteúdos.',
                            explanation: 'A tag &lt;hr&gt; (horizontal rule) cria uma linha horizontal para separar conteúdo. É útil para dividir seções de uma página de forma visual e semântica.'
                        },
                        {
                            type: 'boolean',
                            question: 'O atributo lang="pt-br" na tag &lt;html&gt; é importante para acessibilidade.',
                            correct: true,
                            difficulty: 'medium',
                            hint: 'Pense em como tecnologias assistivas e tradutores automáticos identificam o idioma do conteúdo.',
                            explanation: 'Verdadeiro! O atributo lang ajuda leitores de tela a pronunciar corretamente, tradutores automáticos a funcionar melhor e motores de busca a identificar o idioma do conteúdo, melhorando a acessibilidade e SEO.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual é a função da tag &lt;meta name="viewport"&gt;?',
                            options: [
                                'Controlar como a página é exibida em dispositivos móveis',
                                'Definir palavras-chave para SEO',
                                'Importar fontes externas',
                                'Criar animações CSS'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Pense em como as páginas web se adaptam a diferentes tamanhos de tela, especialmente em celulares.',
                            explanation: 'A meta viewport controla a escala e dimensões da página em dispositivos móveis, sendo essencial para design responsivo.'
                        },
                        {
                            type: 'multiple',
                            question: 'Onde deve ser colocada a tag &lt;title&gt; em um documento HTML?',
                            options: [
                                'Dentro da tag &lt;head&gt;',
                                'Dentro da tag &lt;body&gt;',
                                'Antes da tag &lt;html&gt;',
                                'Depois da tag &lt;/html&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'A tag title define informações sobre o documento, não conteúdo visível. Onde ficam essas informações?',
                            explanation: 'A tag &lt;title&gt; deve estar sempre dentro do &lt;head&gt; pois define metadados sobre o documento.'
                        },
                        {
                            type: 'boolean',
                            question: 'É obrigatório fechar todas as tags HTML.',
                            correct: false,
                            difficulty: 'medium',
                            hint: 'Pense em tags como <br>, <hr>, <img> - elas têm conteúdo interno ou são auto-suficientes?',
                            explanation: 'Não, algumas tags são "void elements" (como &lt;hr&gt;, &lt;br&gt;, &lt;img&gt;, &lt;meta&gt;) e não precisam ser fechadas.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual é a diferença entre &lt;h1&gt; e &lt;title&gt;?',
                            options: [
                                '&lt;h1&gt; é visível na página, &lt;title&gt; aparece na aba do navegador',
                                '&lt;h1&gt; é para SEO, &lt;title&gt; é para estilo',
                                'Não há diferença, são sinônimos',
                                '&lt;h1&gt; é mais importante que &lt;title&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Um você vê no conteúdo da página, o outro você vê na aba do navegador. Qual é qual?',
                            explanation: '&lt;h1&gt; cria o título principal visível no conteúdo da página, enquanto &lt;title&gt; define o título que aparece na aba do navegador e nos resultados de busca.'
                        },
                        {
                            type: 'multiple',
                            question: 'Por que usar UTF-8 como charset?',
                            options: [
                                'Suporta caracteres especiais e acentos de todos os idiomas',
                                'Torna a página mais rápida',
                                'É obrigatório por lei',
                                'Melhora o design da página'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Pense em acentos (á, ç, ñ), símbolos especiais (€, ©) e emojis (😊) - o que é necessário para exibi-los corretamente?',
                            explanation: 'UTF-8 é uma codificação universal que suporta caracteres de praticamente todos os idiomas, incluindo acentos, símbolos especiais e emojis.'
                        },
                        {
                            type: 'boolean',
                            question: 'A estrutura HTML deve sempre seguir a ordem: DOCTYPE, html, head, body.',
                            correct: true,
                            difficulty: 'easy',
                            hint: 'Pense na estrutura básica de qualquer documento HTML válido - existe uma ordem lógica padrão?',
                            explanation: 'Sim, esta é a estrutura padrão e recomendada para documentos HTML válidos e bem formados.'
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
                            difficulty: 'easy',
                            hint: 'Pense na primeira letra da palavra "parágrafo" em inglês (paragraph). Esta é uma das tags mais fundamentais do HTML.',
                            explanation: 'A tag &lt;p&gt; é a forma padrão de criar parágrafos em HTML. Ela automaticamente adiciona espaçamento antes e depois do texto, criando uma estrutura semântica clara para o conteúdo textual.'
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
                            difficulty: 'easy',
                            hint: 'Pense na abreviação da palavra "break" (quebrar) em inglês. É uma tag muito curta e simples.',
                            explanation: 'A tag &lt;br&gt; (break) cria uma quebra de linha simples sem adicionar espaçamento extra. É útil para quebras dentro de um mesmo parágrafo, como em endereços ou poesias.'
                        },
                        {
                            type: 'boolean',
                            question: 'A tag &lt;br&gt; precisa de uma tag de fechamento.',
                            correct: false,
                            difficulty: 'medium',
                            hint: 'A tag &lt;br&gt; tem conteúdo interno ou é apenas uma instrução simples de quebra? Pense nas "void elements" do HTML.',
                            explanation: 'Falso! A tag &lt;br&gt; é uma tag vazia (void element) e não precisa de fechamento. Ela apenas instrui o navegador a quebrar a linha naquele ponto específico.'
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
                            difficulty: 'medium',
                            hint: 'Um apenas "quebra" a linha, o outro cria um bloco completo de texto com margens. Pense na diferença semântica entre eles.',
                            explanation: '&lt;br&gt; apenas quebra a linha sem adicionar espaçamento, enquanto &lt;p&gt; cria um parágrafo completo com espaçamento adequado (margin) antes e depois. Use &lt;p&gt; para parágrafos distintos e &lt;br&gt; para quebras dentro do mesmo parágrafo.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual símbolo HTML representa um espaço em branco não-quebrável?',
                            options: [
                                '&amp;nbsp;',
                                '&amp;space;',
                                '&amp;blank;',
                                '&amp;gap;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'NBSP significa "Non-Breaking Space". É muito útil quando você não quer que duas palavras sejam separadas em linhas diferentes.',
                            explanation: '&amp;nbsp; (non-breaking space) cria um espaço que não permite quebra de linha. É útil para manter palavras juntas, como "10&amp;nbsp;km" ou "R$&amp;nbsp;50,00".'
                        },
                        {
                            type: 'boolean',
                            question: 'É uma boa prática usar múltiplas tags &lt;br&gt; seguidas para criar espaçamento vertical.',
                            correct: false,
                            difficulty: 'medium',
                            hint: 'Pense na separação entre conteúdo (HTML) e apresentação (CSS). Qual é a forma mais semântica de controlar espaçamento?',
                            explanation: 'Falso! Usar múltiplas tags &lt;br&gt; para espaçamento é considerado má prática. O espaçamento deve ser controlado via CSS (margin, padding). Use &lt;br&gt; apenas para quebras de linha semanticamente necessárias.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual entidade HTML é usada para exibir o símbolo de "menor que" (&lt;)?',
                            options: [
                                '&amp;lt;',
                                '&amp;less;',
                                '&amp;smaller;',
                                '&amp;minor;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'LT significa "Less Than" (menor que). É essencial quando você quer mostrar código HTML na página sem que seja interpretado.',
                            explanation: '&amp;lt; (less than) exibe o símbolo &lt; sem que o navegador o interprete como início de uma tag HTML. Essencial para mostrar código HTML como texto.'
                        },
                        {
                            type: 'multiple',
                            question: 'Quando usar &lt;br&gt; é mais apropriado?',
                            options: [
                                'Em endereços, poesias ou quebras dentro do mesmo contexto',
                                'Para separar todos os parágrafos',
                                'Para criar espaçamento entre seções',
                                'Para substituir a tag &lt;p&gt; sempre'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Pense em situações onde você precisa quebrar a linha mas o conteúdo ainda faz parte do mesmo "pensamento" ou contexto.',
                            explanation: 'Use &lt;br&gt; quando precisar quebrar linhas dentro do mesmo contexto semântico, como endereços (Rua X&lt;br&gt;Cidade Y), poesias ou listas simples. Para conteúdos distintos, use &lt;p&gt;.'
                        },
                        {
                            type: 'boolean',
                            question: 'Parágrafos vazios (&lt;p&gt;&lt;/p&gt;) são uma boa prática para criar espaçamento.',
                            correct: false,
                            difficulty: 'medium',
                            hint: 'Pense na separação entre estrutura (HTML) e apresentação (CSS). Qual é a forma mais semântica?',
                            explanation: 'Falso! Parágrafos vazios violam a semântica HTML e devem ser evitados. Use CSS (margin, padding) para controlar espaçamento. Parágrafos devem conter conteúdo significativo.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual entidade HTML representa o símbolo "&" (e comercial)?',
                            options: [
                                '&amp;amp;',
                                '&amp;and;',
                                '&amp;et;',
                                '&amp;symbol;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'AMP significa "ampersand", que é o nome técnico do símbolo &. É fundamental para exibir outros códigos HTML.',
                            explanation: '&amp;amp; exibe o símbolo & sem que seja interpretado como início de uma entidade HTML. É essencial quando você quer mostrar outras entidades como texto (ex: mostrar "&amp;lt;" na página).'
                        },
                        {
                            type: 'multiple',
                            question: 'Como exibir múltiplos espaços consecutivos em HTML?',
                            options: [
                                'Usando &amp;nbsp; entre as palavras',
                                'Adicionando espaços normais no código',
                                'Usando a tag &lt;space&gt;',
                                'Pressionando Tab no código'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'HTML colapsa espaços múltiplos em um só. Para preservar espaçamento específico, você precisa de uma entidade especial.',
                            explanation: 'HTML automaticamente colapsa múltiplos espaços em um só. Para exibir espaços múltiplos, use &amp;nbsp; (non-breaking space) entre as palavras ou considere usar CSS white-space: pre.'
                        },
                        {
                            type: 'boolean',
                            question: 'A tag &lt;p&gt; pode conter outras tags &lt;p&gt; dentro dela.',
                            correct: false,
                            difficulty: 'hard',
                            hint: 'Pense na hierarquia HTML. Parágrafos são elementos de bloco - eles podem conter outros elementos de bloco?',
                            explanation: 'Falso! A tag &lt;p&gt; não pode conter outros elementos de bloco como &lt;p&gt;, &lt;div&gt;, &lt;h1&gt;, etc. Ela pode conter apenas elementos inline como &lt;span&gt;, &lt;strong&gt;, &lt;em&gt;, texto e &lt;br&gt;.'
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