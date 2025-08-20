// Funções específicas do editor interativo para ex001.html

// Variáveis globais para o editor
let originalCode = '';

// Inicialização do editor
document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('preview-frame');
    
    if (editor && preview) {
        // Salva o código original
        originalCode = editor.value;
        
        // Atualiza preview inicial
        updatePreview();
        
        // Adiciona listener para atualização automática
        editor.addEventListener('input', updatePreview);
        
        // Adiciona suporte a atalhos de teclado
        editor.addEventListener('keydown', handleKeyboardShortcuts);
        

    }
});

// Função para resetar o editor
function resetEditor() {
    const editor = document.getElementById('html-editor');
    if (editor) {
        editor.value = originalCode;
        updatePreview();
        showMessage('Código resetado para o original!', 'success');
    }
}

// Função para copiar código do editor
function copyEditorCode() {
    const editor = document.getElementById('html-editor');
    if (editor) {
        navigator.clipboard.writeText(editor.value).then(() => {
            showMessage('Código copiado para a área de transferência!', 'success');
        }).catch(err => {
            // Fallback para navegadores mais antigos
            editor.select();
            document.execCommand('copy');
            showMessage('Código copiado!', 'success');
        });
    }
}

// Função para atualizar preview
function updatePreview() {
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('preview-frame');
    
    if (editor && preview) {
        const code = editor.value;
        const previewDoc = preview.contentDocument || preview.contentWindow.document;
        previewDoc.open();
        previewDoc.write(code);
        previewDoc.close();
    }
}

// Função para tela cheia


// Função para aplicar sugestões
function applySuggestion(suggestionNumber) {
    const editor = document.getElementById('html-editor');
    if (!editor) return;
    
    let newCode = '';
    
    switch(suggestionNumber) {
        case 1:
            // Mude o título
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Primeira Página</title>
</head>
<body>
    <h1>Olá, eu sou [SEU NOME]!</h1>
    <hr>
    <p>Estou praticando HTML e estou muito feliz!</p>
    <hr>
</body>
</html>`;
            showMessage('Sugestão aplicada: Título personalizado!', 'success');
            break;
            
        case 2:
            // Adicione mais conteúdo
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Primeira Página</title>
</head>
<body>
    <h1>Olá, Mundo!</h1>
    <hr>
    <p>Estou praticando HTML e estou muito feliz!</p>
    <p>Este é meu primeiro site e estou aprendendo muito.</p>
    <p>HTML é mais fácil do que eu imaginava!</p>
    <hr>
</body>
</html>`;
            showMessage('Sugestão aplicada: Mais conteúdo adicionado!', 'success');
            break;
            
        case 3:
            // Use outras tags
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Primeira Página</title>
</head>
<body>
    <h1>Olá, Mundo!</h1>
    <h2>Bem-vindo ao meu site</h2>
    <hr>
    <p>Estou praticando <strong>HTML</strong> e estou <em>muito feliz</em>!</p>
    <p>Este texto tem <strong>negrito</strong> e <em>itálico</em>.</p>
    <hr>
</body>
</html>`;
            showMessage('Sugestão aplicada: Novas tags adicionadas!', 'success');
            break;
            
        case 4:
            // Crie uma lista
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Primeira Página</title>
</head>
<body>
    <h1>Olá, Mundo!</h1>
    <hr>
    <p>Estou praticando HTML e estou muito feliz!</p>
    <h2>O que estou aprendendo:</h2>
    <ul>
        <li>Estrutura básica do HTML</li>
        <li>Tags de título (h1, h2, h3...)</li>
        <li>Parágrafos e quebras de linha</li>
        <li>Listas ordenadas e não ordenadas</li>
    </ul>
    <hr>
</body>
</html>`;
            showMessage('Sugestão aplicada: Lista criada!', 'success');
            break;
    }
    
    if (newCode) {
        editor.value = newCode;
        updatePreview();
    }
}

// Função para atalhos de teclado
function handleKeyboardShortcuts(e) {
    // Ctrl + Enter: Atualizar preview
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        updatePreview();
        showMessage('Preview atualizado!', 'info');
    }
    
    // Ctrl + R: Reset código
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetEditor();
    }
}

// Função para mostrar mensagens
function showMessage(message, type = 'info') {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.editor-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `editor-message editor-message-${type}`;
    messageDiv.textContent = message;
    
    // Adiciona estilos inline para garantir visibilidade
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    // Define cor baseada no tipo
    switch(type) {
        case 'success':
            messageDiv.style.backgroundColor = '#28a745';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#dc3545';
            break;
        case 'info':
        default:
            messageDiv.style.backgroundColor = '#007bff';
            break;
    }
    
    // Adiciona ao body
    document.body.appendChild(messageDiv);
    
    // Remove após 3 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 3000);
}