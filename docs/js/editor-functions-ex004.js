// Editor functions for ex004.html - Links em HTML

// Initialize editor when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    updatePreview();
});

// Initialize the editor
function initializeEditor() {
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        htmlEditor.addEventListener('input', updatePreview);
    }
}

// Reset editor to initial state
function resetCode() {
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        htmlEditor.value = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Meus Links</title>
</head>
<body>
    <h1>Meus Links Favoritos</h1>
    
    <!-- Adicione seus links aqui -->
    
</body>
</html>`;
        updatePreview();
        showMessage('Código resetado!', 'success');
    }
}

// Copy code to clipboard
function copyCode() {
    const htmlEditor = document.getElementById('html-editor');
    if (htmlEditor) {
        htmlEditor.select();
        document.execCommand('copy');
        showMessage('Código copiado!', 'success');
    }
}

// Update preview iframe
function updatePreview() {
    const htmlEditor = document.getElementById('html-editor');
    const previewFrame = document.getElementById('preview-frame');
    
    if (htmlEditor && previewFrame) {
        const code = htmlEditor.value;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    // Create message element if it doesn't exist
    let messageEl = document.getElementById('editor-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'editor-message';
        messageEl.className = 'editor-message';
        const editorContainer = document.querySelector('.editor-container');
        if (editorContainer) {
            editorContainer.appendChild(messageEl);
        }
    }
    
    messageEl.textContent = message;
    messageEl.className = `editor-message ${type}`;
    messageEl.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}

// Apply code suggestions
function applySuggestion(type) {
    const htmlEditor = document.getElementById('html-editor');
    if (!htmlEditor) return;
    
    let suggestion = '';
    
    switch(type) {
        case 'basic-link':
            suggestion = `    <p><a href="https://www.google.com">Visitar Google</a></p>`;
            break;
            
        case 'external-link':
            suggestion = `    <p><a href="https://www.github.com" target="_blank">GitHub (nova aba)</a></p>`;
            break;
            
        case 'email-link':
            suggestion = `    <p><a href="mailto:contato@exemplo.com">Enviar Email</a></p>`;
            break;
            
        case 'internal-link':
            suggestion = `    <p><a href="#secao1">Ir para Seção 1</a></p>
    
    <h2 id="secao1">Seção 1</h2>
    <p>Conteúdo da seção 1</p>`;
            break;
            
        default:
            return;
    }
    
    // Insert suggestion before closing body tag
    let currentCode = htmlEditor.value;
    const bodyCloseIndex = currentCode.lastIndexOf('</body>');
    
    if (bodyCloseIndex !== -1) {
        const beforeBody = currentCode.substring(0, bodyCloseIndex);
        const afterBody = currentCode.substring(bodyCloseIndex);
        htmlEditor.value = beforeBody + suggestion + '\n    \n' + afterBody;
    } else {
        // If no closing body tag, append to end
        htmlEditor.value = currentCode + '\n' + suggestion;
    }
    
    updatePreview();
    showMessage('Sugestão aplicada!', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to update preview
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        updatePreview();
        showMessage('Preview atualizado!', 'info');
    }
    
    // Ctrl+R to reset code
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetCode();
    }
});