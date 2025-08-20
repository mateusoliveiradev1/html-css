// Variáveis globais para o editor do ex003
let originalCodeEx003 = '';

// Inicialização do editor para ex003
document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('html-editor');
    const previewFrame = document.getElementById('preview-frame');
    
    if (editor && previewFrame) {
        // Salva o código original
        originalCodeEx003 = editor.value;
        
        // Atualiza o preview inicial
        updatePreview();
        
        // Adiciona listeners
        editor.addEventListener('input', updatePreview);
        editor.addEventListener('keydown', handleKeyboardShortcuts);
        
    }
});

// Função para resetar o editor
function resetEditor() {
    const editor = document.getElementById('html-editor');
    if (editor) {
        editor.value = originalCodeEx003;
        updatePreview();
        showMessage('Editor resetado!', 'info');
    }
}

// Função para copiar código do editor
function copyEditorCode() {
    const editor = document.getElementById('html-editor');
    if (editor) {
        navigator.clipboard.writeText(editor.value).then(() => {
            showMessage('Código copiado!', 'success');
        }).catch(() => {
            showMessage('Erro ao copiar código', 'error');
        });
    }
}

// Função para atualizar preview
function updatePreview() {
    const editor = document.getElementById('html-editor');
    const previewFrame = document.getElementById('preview-frame');
    
    if (editor && previewFrame) {
        const code = editor.value;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
    }
}


// Função para aplicar sugestões específicas do ex003
function applySuggestion(suggestionNumber) {
    const editor = document.getElementById('html-editor');
    if (!editor) return;
    
    let code = '';
    
    switch(suggestionNumber) {
        case 1: // Galeria Simples
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galeria Simples</title>
    <style>
        .galeria {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 20px;
        }
        .galeria img {
            width: 200px;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <h1>Minha Galeria</h1>
    <div class="galeria">
        <img src="https://via.placeholder.com/200x150/FF6B6B/white?text=Foto+1" alt="Primeira foto">
        <img src="https://via.placeholder.com/200x150/4ECDC4/white?text=Foto+2" alt="Segunda foto">
        <img src="https://via.placeholder.com/200x150/45B7D1/white?text=Foto+3" alt="Terceira foto">
        <img src="https://via.placeholder.com/200x150/96CEB4/white?text=Foto+4" alt="Quarta foto">
        <img src="https://via.placeholder.com/200x150/FFEAA7/white?text=Foto+5" alt="Quinta foto">
        <img src="https://via.placeholder.com/200x150/DDA0DD/white?text=Foto+6" alt="Sexta foto">
    </div>
</body>
</html>`;
            break;
            
        case 2: // Imagens Responsivas
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imagens Responsivas</title>
    <style>
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .responsive-img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .img-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Imagens Responsivas</h1>
        
        <h2>Imagem que se adapta ao container:</h2>
        <img src="https://via.placeholder.com/800x400/3498DB/white?text=Imagem+Responsiva" alt="Banner responsivo" class="responsive-img">
        
        <h2>Grid responsivo de imagens:</h2>
        <div class="img-grid">
            <img src="https://via.placeholder.com/300x200/E74C3C/white?text=Grid+1" alt="Imagem 1" class="responsive-img">
            <img src="https://via.placeholder.com/300x200/2ECC71/white?text=Grid+2" alt="Imagem 2" class="responsive-img">
            <img src="https://via.placeholder.com/300x200/F39C12/white?text=Grid+3" alt="Imagem 3" class="responsive-img">
        </div>
    </div>
</body>
</html>`;
            break;
            
        case 3: // Imagens com Links
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imagens Clicáveis</title>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .btn-img {
            display: inline-block;
            margin: 10px;
            transition: transform 0.3s ease;
            border-radius: 8px;
            overflow: hidden;
        }
        .btn-img:hover {
            transform: scale(1.05);
        }
        .btn-img img {
            display: block;
            width: 150px;
            height: 100px;
            object-fit: cover;
        }
        .social-links {
            margin-top: 30px;
        }
        .social-links a {
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Imagens Clicáveis</h1>
        
        <h2>Botões de Navegação:</h2>
        <a href="#home" class="btn-img">
            <img src="https://via.placeholder.com/150x100/3498DB/white?text=Home" alt="Ir para Home">
        </a>
        <a href="#sobre" class="btn-img">
            <img src="https://via.placeholder.com/150x100/2ECC71/white?text=Sobre" alt="Ir para Sobre">
        </a>
        <a href="#contato" class="btn-img">
            <img src="https://via.placeholder.com/150x100/E74C3C/white?text=Contato" alt="Ir para Contato">
        </a>
        
        <h2>Links para Sites Externos:</h2>
        <div class="social-links">
            <a href="https://github.com" target="_blank">
                <img src="https://via.placeholder.com/80x80/333333/white?text=GitHub" alt="Visitar GitHub">
            </a>
            <a href="https://linkedin.com" target="_blank">
                <img src="https://via.placeholder.com/80x80/0077B5/white?text=LinkedIn" alt="Visitar LinkedIn">
            </a>
            <a href="https://twitter.com" target="_blank">
                <img src="https://via.placeholder.com/80x80/1DA1F2/white?text=Twitter" alt="Visitar Twitter">
            </a>
        </div>
    </div>
</body>
</html>`;
            break;
            
        case 4: // Imagens com Legendas
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imagens com Legendas</title>
    <style>
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        figure {
            margin: 30px 0;
            text-align: center;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        figure img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }
        figcaption {
            margin-top: 15px;
            font-style: italic;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Galeria com Legendas</h1>
        
        <figure>
            <img src="https://via.placeholder.com/600x300/3498DB/white?text=Paisagem+Principal" alt="Bela paisagem montanhosa">
            <figcaption>
                <strong>Paisagem Montanhosa</strong><br>
                Uma vista deslumbrante das montanhas ao pôr do sol, capturada durante uma expedição fotográfica.
            </figcaption>
        </figure>
        
        <div class="gallery">
            <figure>
                <img src="https://via.placeholder.com/300x200/E74C3C/white?text=Natureza" alt="Floresta verde">
                <figcaption>
                    <strong>Floresta Verdejante</strong><br>
                    A exuberante vegetação da mata atlântica preservada.
                </figcaption>
            </figure>
            
            <figure>
                <img src="https://via.placeholder.com/300x200/2ECC71/white?text=Cidade" alt="Skyline urbano">
                <figcaption>
                    <strong>Skyline Urbano</strong><br>
                    O contraste entre a arquitetura moderna e o céu azul.
                </figcaption>
            </figure>
            
            <figure>
                <img src="https://via.placeholder.com/300x200/F39C12/white?text=Arte" alt="Obra de arte abstrata">
                <figcaption>
                    <strong>Arte Contemporânea</strong><br>
                    Expressão artística através de formas e cores vibrantes.
                </figcaption>
            </figure>
        </div>
    </div>
</body>
</html>`;
            break;
    }
    
    editor.value = code;
    updatePreview();
    showMessage(`Sugestão ${suggestionNumber} aplicada!`, 'success');
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
    messageDiv.className = `editor-message ${type}`;
    messageDiv.textContent = message;
    
    // Adiciona ao DOM
    document.body.appendChild(messageDiv);
    
    // Remove após 3 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Função para lidar com atalhos de teclado
function handleKeyboardShortcuts(e) {
    // Ctrl+Enter: Atualizar preview
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        updatePreview();
        showMessage('Preview atualizado!', 'success');
    }
    
    // Ctrl+R: Resetar editor
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetEditor();
    }
    
}