// Funções específicas do editor interativo para ex002.html

// Variáveis globais para o editor
let originalCodeEx002 = '';

// Inicialização do editor para ex002
document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('preview-frame');
    
    if (editor && preview) {
        // Salva o código original
        originalCodeEx002 = editor.value;
        
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
        editor.value = originalCodeEx002;
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



// Função para aplicar sugestões específicas do ex002
function applySuggestion(suggestionNumber) {
    const editor = document.getElementById('html-editor');
    if (!editor) return;
    
    let newCode = '';
    
    switch(suggestionNumber) {
        case 1:
            // Adicione mais parágrafos
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parágrafos e quebras de linha</title>
</head>
<body>
    <h1>Parágrafos e quebras de linha</h1>
    <hr>
    <p>Você pode escrever um parágrafo de qualquer jeito. Basta colocar tudo no meio do par de tags &lt;p&gt; e &lt;/p&gt;</p>
    <p>Este é um segundo parágrafo com mais conteúdo interessante.</p>
    <p>E aqui temos um terceiro parágrafo para demonstrar como múltiplos parágrafos funcionam.</p>
    <p>Se precisar quebrar o texto em algum lugar específico<br>como essa linha aqui, você pode usar a tag &lt;br&gt;.</p>
    <p>Símbolos especiais: &reg; &copy; &trade; &euro;</p>
    <p>Emojis: &#x1F596; &#x1F913;</p>
</body>
</html>`;
            showMessage('Sugestão aplicada: Mais parágrafos adicionados!', 'success');
            break;
            
        case 2:
            // Use quebras de linha
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parágrafos e quebras de linha</title>
</head>
<body>
    <h1>Parágrafos e quebras de linha</h1>
    <hr>
    <p>Você pode escrever um parágrafo de qualquer jeito.<br>
    Basta colocar tudo no meio do par de tags &lt;p&gt; e &lt;/p&gt;</p>
    <p>Se precisar quebrar o texto em algum lugar específico<br>
    como essa linha aqui,<br>
    você pode usar a tag &lt;br&gt; várias vezes.</p>
    <p>Endereço:<br>
    Rua das Flores, 123<br>
    Bairro Jardim<br>
    Cidade - Estado</p>
    <p>Símbolos especiais: &reg; &copy; &trade; &euro;</p>
    <p>Emojis: &#x1F596; &#x1F913;</p>
</body>
</html>`;
            showMessage('Sugestão aplicada: Quebras de linha adicionadas!', 'success');
            break;
            
        case 3:
            // Teste entidades HTML
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parágrafos e quebras de linha</title>
</head>
<body>
    <h1>Parágrafos e quebras de linha</h1>
    <hr>
    <p>Você pode escrever um parágrafo de qualquer jeito. Basta colocar tudo no meio do par de tags &lt;p&gt; e &lt;/p&gt;</p>
    <p>Se precisar quebrar o texto em algum lugar específico<br>como essa linha aqui, você pode usar a tag &lt;br&gt;.</p>
    <p>Entidades HTML importantes:</p>
    <p>&lt; significa "menor que" (less than)</p>
    <p>&gt; significa "maior que" (greater than)</p>
    <p>&amp; significa "e comercial" (ampersand)</p>
    <p>&nbsp; é um espaço não-quebrável</p>
    <p>&quot; são aspas duplas</p>
    <p>Símbolos especiais: &reg; &copy; &trade; &euro; &pound; &yen;</p>
    <p>Emojis: &#x1F596; &#x1F913;</p>
</body>
</html>`;
            showMessage('Sugestão aplicada: Entidades HTML demonstradas!', 'success');
            break;
            
        case 4:
            // Adicione emojis
            newCode = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parágrafos e quebras de linha</title>
</head>
<body>
    <h1>Parágrafos e quebras de linha &#x1F4DD;</h1>
    <hr>
    <p>Você pode escrever um parágrafo de qualquer jeito. Basta colocar tudo no meio do par de tags &lt;p&gt; e &lt;/p&gt; &#x1F44D;</p>
    <p>Se precisar quebrar o texto em algum lugar específico<br>como essa linha aqui, você pode usar a tag &lt;br&gt; &#x2728;</p>
    <p>Símbolos especiais: &reg; &copy; &trade; &euro;</p>
    <p>Emojis divertidos:</p>
    <p>&#x1F596; Mão com dedos abertos (Vulcano)</p>
    <p>&#x1F913; Rosto nerd</p>
    <p>&#x1F44D; Polegar para cima</p>
    <p>&#x1F4BB; Laptop</p>
    <p>&#x1F680; Foguete</p>
    <p>&#x2728; Estrelas brilhantes</p>
</body>
</html>`;
            showMessage('Sugestão aplicada: Emojis adicionados!', 'success');
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