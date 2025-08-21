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
            },
            {
                id: 'ex003',
                title: 'Imagens em HTML',
                difficulty: 'beginner',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual tag é usada para inserir imagens em HTML?',
                            options: [
                                '&lt;img&gt;',
                                '&lt;image&gt;',
                                '&lt;picture&gt;',
                                '&lt;photo&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Pense na abreviação da palavra "image" em inglês. Esta é uma das tags mais usadas na web.',
                            explanation: 'A tag &lt;img&gt; é a forma padrão de inserir imagens em HTML. É uma tag auto-fechada que não precisa de tag de fechamento.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo é obrigatório na tag &lt;img&gt;?',
                            options: [
                                'src',
                                'alt',
                                'width',
                                'height'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Este atributo especifica o caminho ou URL da imagem que será exibida.',
                            explanation: 'O atributo "src" (source) é obrigatório pois especifica o caminho da imagem. Sem ele, a tag não sabe qual imagem exibir.'
                        },
                        {
                            type: 'multiple',
                            question: 'Para que serve o atributo "alt" em imagens?',
                            options: [
                                'Texto alternativo para acessibilidade',
                                'Alterar o tamanho da imagem',
                                'Definir a altura da imagem',
                                'Criar um link na imagem'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Este atributo é fundamental para acessibilidade e SEO. Pense em usuários que não podem ver a imagem.',
                            explanation: 'O atributo "alt" fornece texto alternativo que é lido por leitores de tela e exibido quando a imagem não carrega, sendo essencial para acessibilidade.'
                        },
                        {
                            type: 'boolean',
                            question: 'A tag &lt;img&gt; precisa de uma tag de fechamento &lt;/img&gt;.',
                            correct: false,
                            difficulty: 'easy',
                            hint: 'Pense se a tag &lt;img&gt; contém conteúdo entre abertura e fechamento.',
                            explanation: 'Falso! A tag &lt;img&gt; é uma tag auto-fechada (void element) e não precisa de tag de fechamento. Ela não contém conteúdo interno.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual formato de imagem é mais adequado para fotografias na web?',
                            options: [
                                'JPEG',
                                'PNG',
                                'GIF',
                                'SVG'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Este formato oferece boa compressão para imagens com muitas cores e gradientes.',
                            explanation: 'JPEG é ideal para fotografias pois oferece boa compressão com perda aceitável de qualidade, resultando em arquivos menores.'
                        },
                        {
                            type: 'multiple',
                            question: 'O que faz o atributo loading="lazy" em uma imagem?',
                            options: [
                                'Atrasa o carregamento até a imagem estar visível',
                                'Carrega a imagem imediatamente',
                                'Reduz a qualidade da imagem',
                                'Aplica um filtro de desfoque'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Este atributo melhora a performance da página ao carregar imagens apenas quando necessário.',
                            explanation: 'O loading="lazy" implementa carregamento preguiçoso, carregando a imagem apenas quando ela está prestes a entrar na viewport, melhorando a performance.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo é usado para criar imagens responsivas com múltiplas resoluções?',
                            options: [
                                'srcset',
                                'src',
                                'sizes',
                                'responsive'
                            ],
                            correct: 0,
                            difficulty: 'hard',
                            hint: 'Este atributo permite definir um conjunto de fontes de imagem para diferentes resoluções.',
                            explanation: 'O atributo "srcset" permite definir múltiplas versões da imagem para diferentes resoluções, permitindo que o navegador escolha a mais adequada.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual elemento HTML é usado para agrupar uma imagem com sua legenda?',
                            options: [
                                '&lt;figure&gt;',
                                '&lt;div&gt;',
                                '&lt;section&gt;',
                                '&lt;caption&gt;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Este elemento semântico é específico para conteúdo ilustrativo com legendas.',
                            explanation: 'O elemento &lt;figure&gt; é semanticamente correto para agrupar uma imagem com sua legenda usando &lt;figcaption&gt;.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual formato de imagem oferece a melhor compressão para a web moderna?',
                            options: [
                                'AVIF',
                                'JPEG',
                                'PNG',
                                'GIF'
                            ],
                            correct: 0,
                            difficulty: 'hard',
                            hint: 'Este é o formato mais recente, desenvolvido pela Alliance for Open Media.',
                            explanation: 'AVIF é o formato mais moderno, oferecendo compressão superior ao JPEG e WebP, mas ainda não é suportado por todos os navegadores.'
                        },
                        {
                            type: 'boolean',
                            question: 'Para imagens puramente decorativas, o atributo alt deve estar vazio (alt="").',
                            correct: true,
                            difficulty: 'medium',
                            hint: 'Pense na experiência de usuários que usam leitores de tela com imagens que não agregam informação.',
                            explanation: 'Verdadeiro! Para imagens decorativas, use alt="" (vazio) para que leitores de tela as ignorem, melhorando a experiência de usuários com deficiência visual.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo previne o layout shift durante o carregamento de imagens?',
                            options: [
                                'width e height',
                                'loading',
                                'decoding',
                                'fetchpriority'
                            ],
                            correct: 0,
                            difficulty: 'hard',
                            hint: 'Estes atributos permitem que o navegador reserve o espaço correto antes da imagem carregar.',
                            explanation: 'Definir width e height permite que o navegador reserve o espaço correto antes da imagem carregar, evitando mudanças bruscas no layout (layout shift).'
                        },
                        {
                            type: 'multiple',
                            question: 'O elemento &lt;picture&gt; é usado principalmente para:',
                            options: [
                                'Fornecer fallbacks para diferentes formatos de imagem',
                                'Criar galerias de imagens',
                                'Aplicar filtros CSS',
                                'Redimensionar imagens automaticamente'
                            ],
                            correct: 0,
                            difficulty: 'hard',
                            hint: 'Este elemento permite usar formatos modernos com compatibilidade para navegadores antigos.',
                            explanation: 'O elemento &lt;picture&gt; permite definir múltiplas fontes de imagem com diferentes formatos, permitindo fallbacks gracioso para navegadores que não suportam formatos modernos.'
                        }
                    ]
                }
            },
            {
                id: 'ex004',
                title: 'Links em HTML',
                difficulty: 'beginner',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual tag é usada para criar links em HTML?',
                            options: [
                                '&lt;a&gt;',
                                '&lt;link&gt;',
                                '&lt;url&gt;',
                                '&lt;href&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Esta tag vem da palavra "anchor" (âncora) em inglês.',
                            explanation: 'A tag &lt;a&gt; (anchor) é usada para criar links. O atributo href especifica o destino do link.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo especifica o destino de um link?',
                            options: [
                                'href',
                                'src',
                                'link',
                                'url'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Este atributo significa "hypertext reference".',
                            explanation: 'O atributo "href" especifica o URL ou caminho para onde o link deve direcionar o usuário.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como fazer um link abrir em uma nova aba?',
                            options: [
                                'target="_blank"',
                                'new="true"',
                                'tab="new"',
                                'window="new"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Use o atributo "target" com um valor específico.',
                            explanation: 'O atributo target="_blank" faz com que o link abra em uma nova aba ou janela do navegador.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como criar um link de email em HTML?',
                            options: [
                                'href="mailto:email@exemplo.com"',
                                'href="email:email@exemplo.com"',
                                'href="send:email@exemplo.com"',
                                'href="mail:email@exemplo.com"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Use o protocolo específico para emails seguido de dois pontos.',
                            explanation: 'O protocolo "mailto:" é usado para criar links que abrem o cliente de email padrão com o destinatário pré-preenchido.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como criar um link interno (âncora) para uma seção da mesma página?',
                            options: [
                                'href="#secao"',
                                'href="@secao"',
                                'href="/secao"',
                                'href=".secao"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Use o símbolo # seguido do id do elemento de destino.',
                            explanation: 'Links internos usam # seguido do id do elemento. Por exemplo, href="#topo" leva ao elemento com id="topo".'
                        },
                        {
                            type: 'boolean',
                            question: 'O atributo rel="noopener" é recomendado para links que abrem em nova aba por questões de segurança.',
                            correct: true,
                            difficulty: 'medium',
                            hint: 'Pense em segurança ao abrir links externos em novas abas.',
                            explanation: 'Verdadeiro! O rel="noopener" previne que a nova página acesse a janela original através do window.opener, melhorando a segurança.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como criar um link para fazer uma ligação telefônica?',
                            options: [
                                'href="tel:+5511999999999"',
                                'href="phone:+5511999999999"',
                                'href="call:+5511999999999"',
                                'href="mobile:+5511999999999"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Use o protocolo específico para telefone seguido do número com código do país.',
                            explanation: 'O protocolo "tel:" é usado para criar links que abrem o discador do dispositivo com o número pré-preenchido.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo fornece uma descrição adicional do link para acessibilidade?',
                            options: [
                                'title',
                                'alt',
                                'description',
                                'info'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Este atributo também cria um tooltip quando você passa o mouse sobre o link.',
                            explanation: 'O atributo "title" fornece informações adicionais sobre o link, aparecendo como tooltip e sendo lido por leitores de tela.'
                        },
                        {
                            type: 'boolean',
                            question: 'É possível adicionar parâmetros como assunto e corpo em links de email usando mailto.',
                            correct: true,
                            difficulty: 'medium',
                            hint: 'Pense em como você pode pré-preencher campos do email como assunto e mensagem.',
                            explanation: 'Verdadeiro! Você pode usar parâmetros como ?subject=Assunto&body=Mensagem para pré-preencher campos do email.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual é a diferença entre target="_blank" e target="_self"?',
                            options: [
                                '_blank abre em nova aba, _self abre na mesma aba',
                                '_blank abre na mesma aba, _self abre em nova aba',
                                'Ambos fazem a mesma coisa',
                                '_blank é para links externos, _self para internos'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Pense no comportamento padrão dos links e quando você quer abrir em nova aba.',
                            explanation: 'target="_blank" abre o link em uma nova aba/janela, enquanto target="_self" (padrão) abre na mesma aba.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como criar um link para enviar SMS?',
                            options: [
                                'href="sms:+5511999999999"',
                                'href="text:+5511999999999"',
                                'href="message:+5511999999999"',
                                'href="msg:+5511999999999"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Use o protocolo específico para mensagens de texto.',
                            explanation: 'O protocolo "sms:" é usado para criar links que abrem o aplicativo de mensagens com o número pré-preenchido.'
                        },
                        {
                            type: 'boolean',
                            question: 'O atributo aria-label pode ser usado para melhorar a acessibilidade de links.',
                            correct: true,
                            difficulty: 'medium',
                            hint: 'Pense em como leitores de tela podem entender melhor o propósito de um link.',
                            explanation: 'Verdadeiro! O aria-label fornece uma descrição alternativa do link para tecnologias assistivas, melhorando a acessibilidade.'
                        }
                    ]
                }
            },
            {
                id: 'ex005',
                title: 'Listas em HTML',
                difficulty: 'beginner',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual tag cria uma lista não ordenada?',
                            options: [
                                '&lt;ul&gt;',
                                '&lt;ol&gt;',
                                '&lt;list&gt;',
                                '&lt;li&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Pense em "unordered list".',
                            explanation: 'A tag &lt;ul&gt; (unordered list) cria listas com marcadores, sem numeração.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual tag é usada para cada item de uma lista?',
                            options: [
                                '&lt;li&gt;',
                                '&lt;item&gt;',
                                '&lt;list-item&gt;',
                                '&lt;bullet&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Abreviação de "list item".',
                            explanation: 'A tag &lt;li&gt; (list item) define cada item individual dentro de uma lista.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo da tag &lt;ol&gt; permite usar letras maiúsculas como marcadores?',
                            options: [
                                'type="A"',
                                'style="A"',
                                'marker="A"',
                                'format="A"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'O atributo que define o tipo de numeração.',
                            explanation: 'O atributo type="A" faz com que a lista ordenada use letras maiúsculas (A, B, C...) como marcadores.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como criar uma lista aninhada corretamente?',
                            options: [
                                'Colocar a lista dentro de um &lt;li&gt;',
                                'Colocar a lista após o &lt;/ul&gt;',
                                'Usar uma &lt;div&gt; entre as listas',
                                'Adicionar o atributo nested="true"'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'A lista aninhada deve estar dentro do item da lista pai.',
                            explanation: 'Para criar listas aninhadas, a lista filha deve estar dentro de um elemento &lt;li&gt; da lista pai.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual tag é usada para criar listas de definição?',
                            options: [
                                '&lt;dl&gt;',
                                '&lt;def&gt;',
                                '&lt;definition&gt;',
                                '&lt;glossary&gt;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Abreviação de "description list".',
                            explanation: 'A tag &lt;dl&gt; (description list) é usada para criar listas de definição com termos e descrições.'
                        },
                        {
                            type: 'multiple',
                            question: 'Em uma lista de definição, qual tag define o termo?',
                            options: [
                                '&lt;dt&gt;',
                                '&lt;dd&gt;',
                                '&lt;term&gt;',
                                '&lt;def&gt;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Abreviação de "definition term".',
                            explanation: 'A tag &lt;dt&gt; (definition term) define o termo que será explicado na lista de definição.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo da &lt;ol&gt; permite iniciar a numeração em um valor específico?',
                            options: [
                                'start',
                                'begin',
                                'initial',
                                'value'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'O atributo que define onde a numeração deve começar.',
                            explanation: 'O atributo start permite definir o número inicial da lista ordenada, como start="5" para começar no 5.'
                        },
                        {
                            type: 'true_false',
                            question: 'É possível colocar parágrafos e imagens dentro de itens de lista (&lt;li&gt;).',
                            correct: true,
                            difficulty: 'easy',
                            hint: 'Itens de lista podem conter qualquer conteúdo HTML.',
                            explanation: 'Verdadeiro! Itens de lista podem conter qualquer elemento HTML: parágrafos, imagens, links, outras listas, etc.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual é a estrutura HTML inválida?',
                            options: [
                                '&lt;ul&gt;&lt;p&gt;Texto&lt;/p&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;',
                                '&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;',
                                '&lt;ol&gt;&lt;li&gt;Primeiro&lt;/li&gt;&lt;li&gt;Segundo&lt;/li&gt;&lt;/ol&gt;',
                                '&lt;dl&gt;&lt;dt&gt;Termo&lt;/dt&gt;&lt;dd&gt;Definição&lt;/dd&gt;&lt;/dl&gt;'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Apenas &lt;li&gt; pode ser filho direto de &lt;ul&gt; ou &lt;ol&gt;.',
                            explanation: 'A primeira opção é inválida porque &lt;p&gt; não pode ser filho direto de &lt;ul&gt;. Apenas &lt;li&gt; são permitidos.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual atributo ARIA melhora a acessibilidade de listas?',
                            options: [
                                'aria-labelledby',
                                'aria-hidden',
                                'aria-expanded',
                                'aria-selected'
                            ],
                            correct: 0,
                            difficulty: 'hard',
                            hint: 'Atributo que conecta a lista com seu título.',
                            explanation: 'O aria-labelledby conecta a lista com um elemento que a descreve, melhorando a navegação para leitores de tela.'
                        },
                        {
                            type: 'true_false',
                            question: 'O atributo "reversed" em &lt;ol&gt; faz a numeração ser decrescente.',
                            correct: true,
                            difficulty: 'medium',
                            hint: 'Este atributo inverte a ordem da numeração.',
                            explanation: 'Verdadeiro! O atributo reversed faz com que a lista ordenada seja numerada de forma decrescente.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual é o melhor caso de uso para listas de definição (&lt;dl&gt;)?',
                            options: [
                                'Glossários e FAQs',
                                'Menus de navegação',
                                'Listas de compras',
                                'Instruções passo a passo'
                            ],
                            correct: 0,
                            difficulty: 'medium',
                            hint: 'Estruturas que relacionam termos com suas explicações.',
                            explanation: 'Listas de definição são ideais para glossários, FAQs e qualquer conteúdo que relacione termos com definições.'
                        }
                    ]
                }
            },
            {
                id: 'ex006',
                title: 'Tabelas em HTML',
                difficulty: 'intermediate',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual tag cria uma tabela em HTML?',
                            options: [
                                '&lt;table&gt;',
                                '&lt;tab&gt;',
                                '&lt;grid&gt;',
                                '&lt;data&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'É literalmente a palavra "table" em inglês.',
                            explanation: 'A tag &lt;table&gt; é usada para criar tabelas em HTML.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual tag define uma linha de tabela?',
                            options: [
                                '&lt;tr&gt;',
                                '&lt;td&gt;',
                                '&lt;th&gt;',
                                '&lt;row&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Abreviação de "table row".',
                            explanation: 'A tag &lt;tr&gt; (table row) define uma linha na tabela.'
                        }
                    ]
                }
            },
            {
                id: 'ex007',
                title: 'Formulários em HTML',
                difficulty: 'intermediate',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'Qual tag cria um formulário em HTML?',
                            options: [
                                '&lt;form&gt;',
                                '&lt;input&gt;',
                                '&lt;field&gt;',
                                '&lt;submit&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'É a palavra "form" em inglês.',
                            explanation: 'A tag &lt;form&gt; é usada para criar formulários que coletam dados do usuário.'
                        },
                        {
                            type: 'multiple',
                            question: 'Qual tag cria campos de entrada de dados?',
                            options: [
                                '&lt;input&gt;',
                                '&lt;field&gt;',
                                '&lt;data&gt;',
                                '&lt;entry&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Esta tag significa "entrada" em inglês.',
                            explanation: 'A tag &lt;input&gt; cria diferentes tipos de campos de entrada como texto, email, senha, etc.'
                        }
                    ]
                }
            },
            {
                id: 'ex008',
                title: 'Fundamentos de CSS',
                difficulty: 'intermediate',
                unlocked: false,
                completed: false,
                quizCompleted: false,
                quizScore: 0,
                quiz: {
                    questions: [
                        {
                            type: 'multiple',
                            question: 'O que significa CSS?',
                            options: [
                                'Cascading Style Sheets',
                                'Computer Style System',
                                'Creative Style Syntax',
                                'Coded Style Structure'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'CSS é sobre folhas de estilo em cascata.',
                            explanation: 'CSS significa Cascading Style Sheets (Folhas de Estilo em Cascata), usado para estilizar páginas web.'
                        },
                        {
                            type: 'multiple',
                            question: 'Como aplicar CSS interno em HTML?',
                            options: [
                                'Usando a tag &lt;style&gt;',
                                'Usando a tag &lt;css&gt;',
                                'Usando a tag &lt;design&gt;',
                                'Usando a tag &lt;format&gt;'
                            ],
                            correct: 0,
                            difficulty: 'easy',
                            hint: 'Esta tag vai dentro do &lt;head&gt; do documento.',
                            explanation: 'A tag &lt;style&gt; dentro do &lt;head&gt; permite escrever CSS interno no documento HTML.'
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