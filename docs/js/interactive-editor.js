/**
 * Sistema de Editor de Código Interativo
 * Permite aos usuários editar e visualizar código HTML em tempo real
 */
class InteractiveEditor {
    constructor(editorId) {
        this.editorId = editorId;
        this.editor = null;
        this.preview = null;
        this.originalCode = '';
        this.isFullscreen = false;
        
        this.init();
    }

    init() {
        this.editor = document.getElementById(`${this.editorId}-editor`);
        this.preview = document.getElementById(`${this.editorId}-preview`);
        
        if (!this.editor || !this.preview) {
            console.error('Editor ou preview não encontrado');
            return;
        }

        // Salva o código original
        this.originalCode = this.editor.value;
        
        // Configura eventos
        this.setupEventListeners();
        
        // Atualiza preview inicial
        this.updatePreview();
    }

    setupEventListeners() {
        // Atualização automática do preview
        this.editor.addEventListener('input', () => {
            this.updatePreview();
        });

        // Botão de reset
        const resetBtn = document.getElementById(`${this.editorId}-reset`);
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetCode());
        }

        // Botão de copiar
        const copyBtn = document.getElementById(`${this.editorId}-copy`);
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyCode());
        }

        // Botão de atualizar
        const updateBtn = document.getElementById(`${this.editorId}-update`);
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updatePreview());
        }

        // Botão de tela cheia
        const fullscreenBtn = document.getElementById(`${this.editorId}-fullscreen`);
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Teclas de atalho
        this.editor.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Auto-indentação
        this.editor.addEventListener('keydown', (e) => {
            this.handleAutoIndent(e);
        });
    }

    updatePreview() {
        const code = this.editor.value;
        
        // Cria um documento HTML completo se necessário
        let fullHTML = code;
        if (!code.includes('<!DOCTYPE html>')) {
            fullHTML = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        p { line-height: 1.6; }
    </style>
</head>
<body>
${code}
</body>
</html>`;
        }
        
        // Atualiza o iframe
        const previewDoc = this.preview.contentDocument || this.preview.contentWindow.document;
        previewDoc.open();
        previewDoc.write(fullHTML);
        previewDoc.close();
    }

    resetCode() {
        this.editor.value = this.originalCode;
        this.updatePreview();
        this.showMessage('Código resetado para o original!', 'success');
    }

    async copyCode() {
        try {
            await navigator.clipboard.writeText(this.editor.value);
            this.showMessage('Código copiado para a área de transferência!', 'success');
        } catch (err) {
            // Fallback para navegadores mais antigos
            this.editor.select();
            document.execCommand('copy');
            this.showMessage('Código copiado!', 'success');
        }
    }

    toggleFullscreen() {
        const container = document.querySelector(`#${this.editorId}`);
        const fullscreenBtn = document.getElementById(`${this.editorId}-fullscreen`);
        
        if (!this.isFullscreen) {
            container.classList.add('fullscreen-editor');
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Sair da Tela Cheia';
            this.isFullscreen = true;
        } else {
            container.classList.remove('fullscreen-editor');
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Tela Cheia';
            this.isFullscreen = false;
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl + Enter: Atualizar preview
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            this.updatePreview();
            this.showMessage('Preview atualizado!', 'info');
        }
        
        // Ctrl + R: Reset código
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this.resetCode();
        }
        
        // Ctrl + C (quando nada selecionado): Copiar tudo
        if (e.ctrlKey && e.key === 'c' && this.editor.selectionStart === this.editor.selectionEnd) {
            e.preventDefault();
            this.copyCode();
        }
    }

    handleAutoIndent(e) {
        if (e.key === 'Enter') {
            const textarea = e.target;
            const cursorPos = textarea.selectionStart;
            const textBeforeCursor = textarea.value.substring(0, cursorPos);
            const currentLine = textBeforeCursor.split('\n').pop();
            
            // Conta os espaços no início da linha atual
            const indentMatch = currentLine.match(/^(\s*)/);
            const currentIndent = indentMatch ? indentMatch[1] : '';
            
            // Adiciona indentação extra se a linha termina com >
            let extraIndent = '';
            if (currentLine.trim().endsWith('>') && !currentLine.trim().startsWith('</')) {
                extraIndent = '    '; // 4 espaços
            }
            
            setTimeout(() => {
                const newCursorPos = textarea.selectionStart;
                const newIndent = currentIndent + extraIndent;
                
                textarea.value = textarea.value.substring(0, newCursorPos) + 
                               newIndent + 
                               textarea.value.substring(newCursorPos);
                               
                textarea.selectionStart = textarea.selectionEnd = newCursorPos + newIndent.length;
            }, 0);
        }
    }

    showMessage(message, type = 'info') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.editor-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `editor-message editor-message-${type}`;
        messageDiv.textContent = message;
        
        // Adiciona ao container do editor
        const container = document.querySelector(`#${this.editorId}`);
        container.appendChild(messageDiv);
        
        // Remove após 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Método para adicionar sugestões dinâmicas
    addSuggestion(title, description, code) {
        const suggestionsGrid = document.querySelector(`#${this.editorId} .suggestions-grid`);
        if (!suggestionsGrid) return;
        
        const suggestionCard = document.createElement('div');
        suggestionCard.className = 'suggestion-card';
        suggestionCard.innerHTML = `
            <h4>${title}</h4>
            <p>${description}</p>
            <button class="suggestion-apply-btn" data-code="${encodeURIComponent(code)}">
                Aplicar
            </button>
        `;
        
        // Adiciona evento de clique
        const applyBtn = suggestionCard.querySelector('.suggestion-apply-btn');
        applyBtn.addEventListener('click', () => {
            this.editor.value = decodeURIComponent(applyBtn.dataset.code);
            this.updatePreview();
            this.showMessage(`Sugestão "${title}" aplicada!`, 'success');
        });
        
        suggestionsGrid.appendChild(suggestionCard);
    }
}

// Inicialização automática quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Procura por editores na página e os inicializa
    const editors = document.querySelectorAll('[id$="-interactive-editor"]');
    editors.forEach(editorElement => {
        const editorId = editorElement.id.replace('-interactive-editor', '');
        new InteractiveEditor(editorId);
    });
});

// Exporta a classe para uso global
window.InteractiveEditor = InteractiveEditor;