// Editor functions for ex008.html - Fundamentos de CSS

// Variáveis globais
let originalHtmlCode = '';
let originalCssCode = '';
let currentTab = 'html';

// Inicialização do editor
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    setupKeyboardShortcuts();
});

function initializeEditor() {
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('code-editor');
    
    if (htmlEditor) {
        originalHtmlCode = htmlEditor.value;
    }
    
    if (cssEditor) {
        originalCssCode = cssEditor.value;
        updatePreview();
    }
}

function setupEventListeners() {
    // Tabs do editor
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Editores de código
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('code-editor');
    
    if (htmlEditor) {
        htmlEditor.addEventListener('input', updatePreview);
    }
    
    if (cssEditor) {
        cssEditor.addEventListener('input', updatePreview);
    }

    // Botões de ação
    const copyBtn = document.getElementById('copy-code');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCode);
    }

    const resetBtn = document.getElementById('reset-editor');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetEditor);
    }

    // Sugestões de código
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            applySuggestion(this.dataset.suggestion);
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter para alternar para preview
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            switchTab('preview');
        }
        
        // Ctrl+R para resetar (previne reload da página)
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            resetEditor();
        }
        
        // Ctrl+1, Ctrl+2, Ctrl+3 para alternar tabs
        if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const tabs = ['html', 'css', 'preview'];
            switchTab(tabs[parseInt(e.key) - 1]);
        }
    });
}

function switchTab(tabName) {
    // Atualizar botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Atualizar conteúdo
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });

    currentTab = tabName;
    
    if (tabName === 'preview') {
        updatePreview();
    }
}

function updatePreview() {
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('code-editor');
    const preview = document.getElementById('preview-iframe');
    
    if (htmlEditor && cssEditor && preview) {
        let htmlCode = htmlEditor.value;
        const cssCode = cssEditor.value;
        
        // Se estamos na aba CSS, criar HTML com o CSS inline
        if (currentTab === 'css') {
            htmlCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview CSS</title>
    <style>
${cssCode}
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Fundamentos de CSS</h1>
        
        <p>Este é um parágrafo normal com texto explicativo sobre CSS.</p>
        
        <div class="destaque">
            Esta é uma caixa destacada com fundo azul e texto branco.
        </div>
        
        <div class="lista">
            <h3>Propriedades CSS Básicas:</h3>
            <ul>
                <li>color - Define a cor do texto</li>
                <li>background-color - Define a cor de fundo</li>
                <li>font-size - Define o tamanho da fonte</li>
                <li>padding - Define o espaçamento interno</li>
                <li>margin - Define o espaçamento externo</li>
            </ul>
        </div>
        
        <button class="botao">Botão Estilizado</button>
    </div>
</body>
</html>`;
        } else {
            // Injetar CSS no HTML existente
            if (htmlCode.includes('<style>')) {
                htmlCode = htmlCode.replace(/(<style>)[\s\S]*?(<\/style>)/, `$1\n${cssCode}\n        $2`);
            }
        }
        
        const blob = new Blob([htmlCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        preview.src = url;
        
        // Limpar URL anterior para evitar vazamentos de memória
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}

function copyCode() {
    let editor;
    let message = '';
    
    if (currentTab === 'html') {
        editor = document.getElementById('html-editor');
        message = 'Código HTML copiado! 📋';
    } else if (currentTab === 'css') {
        editor = document.getElementById('code-editor');
        message = 'Código CSS copiado! 📋';
    } else {
        editor = document.getElementById('code-editor');
        message = 'Código CSS copiado! 📋';
    }
    
    if (editor) {
        editor.select();
        document.execCommand('copy');
        showMessage(message, 'success');
    }
}

function resetEditor() {
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('code-editor');
    
    if (htmlEditor) {
        htmlEditor.value = originalHtmlCode;
    }
    
    if (cssEditor) {
        cssEditor.value = originalCssCode;
    }
    
    updatePreview();
    showMessage('Editor resetado para o código original! 🔄', 'info');
}

function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('editor-message');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `editor-message ${type}`;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

function applySuggestion(suggestion) {
    const cssEditor = document.getElementById('code-editor');
    if (!cssEditor) return;

    let code = '';
    
    switch(suggestion) {
        case 'card':
            code = `/* Card Moderno */
.card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin: 20px 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e1e5e9;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
    border-bottom: 2px solid #f8f9fa;
    padding-bottom: 16px;
    margin-bottom: 16px;
}

.card-title {
    font-size: 1.5em;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
}

.card-content {
    color: #555;
    line-height: 1.6;
}

.card-footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
    text-align: right;
}

/* HTML para testar */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    padding: 20px;
}

.container {
    max-width: 600px;
    margin: 0 auto;
}`;
            break;
            
        case 'botoes':
            code = `/* Botões Estilizados */
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    margin: 5px;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-success {
    background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
    color: white;
}

.btn-success:hover {
    transform: scale(1.05);
}

.btn-danger {
    background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
    color: white;
}

.btn-danger:hover {
    box-shadow: 0 0 20px rgba(255, 65, 108, 0.5);
}

.btn-outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
}

.btn-outline:hover {
    background: #667eea;
    color: white;
}

.btn-round {
    border-radius: 50px;
    padding: 15px 30px;
}

/* HTML para testar */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 40px;
    background: #f8f9fa;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}`;
            break;
            
        case 'tipografia':
            code = `/* Tipografia e Hierarquia */
body {
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.6;
    color: #333;
    background: #fefefe;
    padding: 40px;
    max-width: 800px;
    margin: 0 auto;
}

.display-1 {
    font-size: 3.5rem;
    font-weight: 300;
    line-height: 1.2;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.display-2 {
    font-size: 2.5rem;
    font-weight: 400;
    color: #34495e;
    margin-bottom: 1rem;
}

h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1rem;
    border-bottom: 3px solid #3498db;
    padding-bottom: 0.5rem;
}

h2 {
    font-size: 1.5rem;
    font-weight: 500;
    color: #34495e;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

h3 {
    font-size: 1.25rem;
    font-weight: 500;
    color: #555;
    margin-bottom: 0.75rem;
}

.lead {
    font-size: 1.25rem;
    font-weight: 300;
    color: #666;
    margin-bottom: 2rem;
}

p {
    margin-bottom: 1rem;
    text-align: justify;
}

.text-muted {
    color: #6c757d;
    font-style: italic;
}

.text-highlight {
    background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 500;
}

blockquote {
    border-left: 4px solid #3498db;
    padding-left: 20px;
    margin: 2rem 0;
    font-style: italic;
    color: #555;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 0 8px 8px 0;
}

.small {
    font-size: 0.875rem;
    color: #6c757d;
}`;
            break;
            
        case 'layout':
            code = `/* Layout Básico */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav {
    display: flex;
    gap: 2rem;
}

.nav a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav a:hover {
    opacity: 0.8;
}

.main {
    flex: 1;
    padding: 2rem 0;
    background: #f8f9fa;
}

.main .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero {
    text-align: center;
    padding: 4rem 0;
    background: white;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.hero p {
    font-size: 1.25rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
}

.content-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-4px);
}

.footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: auto;
}

.footer .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}`;
            break;
    }
    
    if (code) {
        cssEditor.value = code;
        updatePreview();
        showMessage(`Exemplo "${suggestion}" carregado! 🎉`, 'success');
        
        // Alternar para a aba CSS
        switchTab('css');
    }
}