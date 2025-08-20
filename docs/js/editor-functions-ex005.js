// Editor Functions for Exercise 5 - Lists in HTML

// Global variables
let originalCode = '';
let currentTab = 'html';

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
});

function initializeEditor() {
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        originalCode = htmlEditor.value;
        updatePreview();
    }
}

function setupEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Editor input
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        htmlEditor.addEventListener('input', updatePreview);
        htmlEditor.addEventListener('keydown', handleKeyboardShortcuts);
    }
}

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    const tabs = document.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update panels
    const panels = document.querySelectorAll('.editor-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    const activePanel = document.getElementById(tabName + '-panel');
    if (activePanel) {
        activePanel.style.display = 'block';
    }
    
    if (tabName === 'preview') {
        updatePreview();
    }
}

function updatePreview() {
    const htmlEditor = document.getElementById('html-editor');
    const previewIframe = document.getElementById('preview-iframe');
    
    if (htmlEditor && previewIframe) {
        const code = htmlEditor.value;
        previewIframe.srcdoc = code;
    }
}

function resetEditor() {
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        htmlEditor.value = originalCode;
        updatePreview();
        showMessage('Editor resetado para o código original!', 'success');
    }
}

function copyEditorCode() {
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        htmlEditor.select();
        document.execCommand('copy');
        showMessage('Código copiado para a área de transferência!', 'success');
    }
}

function handleKeyboardShortcuts(event) {
    // Ctrl+S to save (prevent default and show message)
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        showMessage('💾 Código salvo automaticamente!', 'info');
    }
    
    // Ctrl+Enter to update preview
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        updatePreview();
        showMessage('🔄 Preview atualizado!', 'info');
    }
    
    // Ctrl+R to reset
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        resetEditor();
    }
}

function showMessage(message, type = 'info') {
    const messageElement = document.getElementById('editor-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `editor-message ${type}`;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

// Code suggestion functions
function applySuggestion(type) {
    const htmlEditor = document.getElementById('html-editor');
    if (!htmlEditor) return;
    
    let code = '';
    
    switch(type) {
        case 'todo':
            code = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Lista de Tarefas</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        ul { list-style-type: none; padding-left: 0; }
        li { padding: 10px; margin: 5px 0; background: #f0f0f0; border-radius: 5px; }
        .completed { text-decoration: line-through; opacity: 0.6; }
    </style>
</head>
<body>
    <h1>📋 Minhas Tarefas</h1>
    <ul>
        <li>✅ Estudar HTML</li>
        <li>⏳ Praticar CSS</li>
        <li>📝 Fazer exercícios</li>
        <li>🎯 Criar projeto</li>
        <li>📚 Ler documentação</li>
        <li>💻 Desenvolver portfolio</li>
    </ul>
    
    <h2>🎯 Tarefas Concluídas</h2>
    <ul>
        <li class="completed">✅ Configurar ambiente</li>
        <li class="completed">✅ Instalar editor</li>
    </ul>
</body>
</html>`;
            break;
            
        case 'recipe':
            code = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Receita de Bolo</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        .recipe-section { margin: 20px 0; padding: 15px; border-left: 4px solid #ff6b6b; }
        ul, ol { padding-left: 30px; }
        li { margin: 8px 0; line-height: 1.5; }
        .ingredients { background: #f8f9fa; }
        .instructions { background: #e3f2fd; }
    </style>
</head>
<body>
    <h1>🍰 Receita de Bolo de Chocolate</h1>
    
    <div class="recipe-section ingredients">
        <h2>🥄 Ingredientes:</h2>
        <ul>
            <li>2 xícaras de farinha de trigo</li>
            <li>1 xícara de açúcar</li>
            <li>3 ovos</li>
            <li>1 xícara de leite</li>
            <li>1/2 xícara de óleo</li>
            <li>3 colheres de chocolate em pó</li>
            <li>1 colher de fermento</li>
        </ul>
    </div>
    
    <div class="recipe-section instructions">
        <h2>👩‍🍳 Modo de preparo:</h2>
        <ol>
            <li>Pré-aqueça o forno a 180°C</li>
            <li>Em uma tigela, misture os ingredientes secos</li>
            <li>Em outra tigela, bata os ovos com o açúcar</li>
            <li>Adicione o leite e o óleo aos ovos</li>
            <li>Misture os ingredientes líquidos aos secos</li>
            <li>Despeje em forma untada</li>
            <li>Asse por 35-40 minutos</li>
            <li>Deixe esfriar antes de desenformar</li>
        </ol>
    </div>
    
    <p><strong>⏰ Tempo de preparo:</strong> 20 minutos | <strong>🔥 Tempo de forno:</strong> 40 minutos</p>
</body>
</html>`;
            break;
            
        case 'menu':
            code = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Menu de Navegação</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        nav { background: #333; padding: 10px; border-radius: 5px; }
        nav > ul { list-style: none; padding: 0; margin: 0; display: flex; }
        nav > ul > li { position: relative; margin-right: 20px; }
        nav a { color: white; text-decoration: none; padding: 10px 15px; display: block; }
        nav a:hover { background: #555; border-radius: 3px; }
        .submenu { position: absolute; top: 100%; left: 0; background: #444; min-width: 200px; display: none; }
        nav li:hover .submenu { display: block; }
        .submenu li { margin: 0; }
        .submenu a { border-bottom: 1px solid #555; }
    </style>
</head>
<body>
    <h1>🌐 Site da Empresa</h1>
    
    <nav>
        <ul>
            <li>
                <a href="#">🏠 Início</a>
            </li>
            <li>
                <a href="#">📋 Produtos</a>
                <ul class="submenu">
                    <li><a href="#">💻 Eletrônicos</a></li>
                    <li><a href="#">👕 Roupas</a></li>
                    <li><a href="#">📚 Livros</a></li>
                    <li><a href="#">🏠 Casa e Jardim</a></li>
                </ul>
            </li>
            <li>
                <a href="#">ℹ️ Sobre</a>
                <ul class="submenu">
                    <li><a href="#">👥 Nossa Equipe</a></li>
                    <li><a href="#">🎯 Missão</a></li>
                    <li><a href="#">📈 História</a></li>
                </ul>
            </li>
            <li>
                <a href="#">📞 Contato</a>
            </li>
        </ul>
    </nav>
    
    <main style="margin-top: 30px;">
        <h2>Bem-vindo ao nosso site!</h2>
        <p>Use o menu acima para navegar pelas diferentes seções.</p>
    </main>
</body>
</html>`;
            break;
            
        case 'glossary':
            code = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Glossário de Desenvolvimento Web</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: 0 auto; }
        dl { margin: 20px 0; }
        dt { 
            font-weight: bold; 
            font-size: 1.1em; 
            color: #2c3e50; 
            margin-top: 20px;
            padding: 10px;
            background: #ecf0f1;
            border-left: 4px solid #3498db;
        }
        dd { 
            margin: 10px 0 10px 20px; 
            padding: 10px;
            line-height: 1.6;
            border-left: 2px solid #bdc3c7;
            padding-left: 15px;
        }
        .category { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px;
        }
        .category h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>📚 Glossário de Desenvolvimento Web</h1>
    
    <div class="category">
        <h2>🌐 Linguagens de Marcação e Estilo</h2>
        <dl>
            <dt>HTML (HyperText Markup Language)</dt>
            <dd>Linguagem de marcação padrão para criar páginas web. Define a estrutura e o conteúdo das páginas usando elementos e tags.</dd>
            
            <dt>CSS (Cascading Style Sheets)</dt>
            <dd>Linguagem de folhas de estilo usada para descrever a apresentação visual de documentos HTML. Controla layout, cores, fontes e animações.</dd>
            
            <dt>XML (eXtensible Markup Language)</dt>
            <dd>Linguagem de marcação que define regras para codificar documentos de forma legível tanto para humanos quanto para máquinas.</dd>
        </dl>
    </div>
    
    <div class="category">
        <h2>💻 Linguagens de Programação</h2>
        <dl>
            <dt>JavaScript</dt>
            <dd>Linguagem de programação interpretada, orientada a objetos e baseada em eventos. Essencial para criar interatividade em páginas web.</dd>
            
            <dt>TypeScript</dt>
            <dd>Superset do JavaScript que adiciona tipagem estática opcional. Desenvolvido pela Microsoft para melhorar a manutenibilidade do código.</dd>
            
            <dt>Python</dt>
            <dd>Linguagem de programação de alto nível, interpretada e de propósito geral. Muito usada em desenvolvimento web, ciência de dados e automação.</dd>
        </dl>
    </div>
    
    <div class="category">
        <h2>🛠️ Ferramentas e Conceitos</h2>
        <dl>
            <dt>API (Application Programming Interface)</dt>
            <dd>Conjunto de definições e protocolos para construir e integrar software de aplicações. Permite comunicação entre diferentes sistemas.</dd>
            
            <dt>Framework</dt>
            <dd>Estrutura de software que fornece uma base para desenvolvimento de aplicações. Inclui bibliotecas, ferramentas e convenções.</dd>
            
            <dt>Responsive Design</dt>
            <dd>Abordagem de design web que faz com que páginas sejam renderizadas bem em diversos dispositivos e tamanhos de tela.</dd>
            
            <dt>SEO (Search Engine Optimization)</dt>
            <dd>Prática de otimizar websites para melhorar sua visibilidade e ranking nos resultados de motores de busca.</dd>
        </dl>
    </div>
</body>
</html>`;
            break;
            
        default:
            showMessage('Tipo de sugestão não encontrado!', 'error');
            return;
    }
    
    htmlEditor.value = code;
    updatePreview();
    
    // Switch to HTML tab if not already there
    if (currentTab !== 'html') {
        switchTab('html');
    }
    
    showMessage(`✨ Código "${getSuggestionName(type)}" aplicado com sucesso!`, 'success');
}

function getSuggestionName(type) {
    const names = {
        'todo': 'Lista de Tarefas',
        'recipe': 'Receita Passo a Passo',
        'menu': 'Menu de Navegação',
        'glossary': 'Glossário Técnico'
    };
    return names[type] || type;
}

// Export functions for global access
window.resetEditor = resetEditor;
window.copyEditorCode = copyEditorCode;
window.applySuggestion = applySuggestion;
window.switchTab = switchTab;
window.updatePreview = updatePreview;