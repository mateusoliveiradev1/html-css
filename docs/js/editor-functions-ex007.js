// Editor functions for ex007.html - Formulários em HTML

// Variáveis globais
let originalCode = '';
let currentTab = 'html';

// Inicialização do editor
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
    setupKeyboardShortcuts();
});

function initializeEditor() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        originalCode = editor.value;
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

    // Editor de código
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.addEventListener('input', updatePreview);
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
        
        // Ctrl+C quando não há seleção para copiar todo o código
        if (e.ctrlKey && e.key === 'c') {
            const selection = window.getSelection().toString();
            if (!selection) {
                e.preventDefault();
                copyCode();
            }
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
    const editor = document.getElementById('code-editor');
    const preview = document.getElementById('preview-iframe');
    
    if (editor && preview) {
        const code = editor.value;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        preview.src = url;
        
        // Limpar URL anterior para evitar vazamentos de memória
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}

function copyCode() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.select();
        document.execCommand('copy');
        showMessage('Código copiado para a área de transferência! 📋', 'success');
    }
}

function resetEditor() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.value = originalCode;
        updatePreview();
        showMessage('Editor resetado para o código original! 🔄', 'info');
    }
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
    const editor = document.getElementById('code-editor');
    if (!editor) return;

    let code = '';
    
    switch(suggestion) {
        case 'login':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .login-header h2 {
            color: #333;
            margin: 0;
            font-size: 28px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        input {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn-login {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .btn-login:hover {
            transform: translateY(-2px);
        }
        .forgot-password {
            text-align: center;
            margin-top: 20px;
        }
        .forgot-password a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
        }
        .forgot-password a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h2>🔐 Login</h2>
        </div>
        
        <form action="/login" method="post">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required placeholder="seu@email.com">
            </div>
            
            <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required placeholder="Digite sua senha">
            </div>
            
            <button type="submit" class="btn-login">Entrar</button>
        </form>
        
        <div class="forgot-password">
            <a href="#">Esqueceu sua senha?</a>
        </div>
    </div>
</body>
</html>`;
            break;
            
        case 'cadastro':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .signup-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .signup-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .signup-header h2 {
            color: #333;
            margin: 0;
            font-size: 28px;
        }
        .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .form-group {
            flex: 1;
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        input, select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        input:focus, select:focus {
            outline: none;
            border-color: #74b9ff;
            box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.1);
        }
        .checkbox-group {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 20px;
        }
        .checkbox-group input {
            width: auto;
            margin-top: 2px;
        }
        .checkbox-group label {
            margin-bottom: 0;
            font-size: 14px;
            line-height: 1.4;
        }
        .btn-signup {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .btn-signup:hover {
            transform: translateY(-2px);
        }
        @media (max-width: 600px) {
            .form-row {
                flex-direction: column;
                gap: 0;
            }
        }
    </style>
</head>
<body>
    <div class="signup-container">
        <div class="signup-header">
            <h2>📝 Criar Conta</h2>
        </div>
        
        <form action="/cadastro" method="post">
            <div class="form-row">
                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required placeholder="Seu nome">
                </div>
                <div class="form-group">
                    <label for="sobrenome">Sobrenome:</label>
                    <input type="text" id="sobrenome" name="sobrenome" required placeholder="Seu sobrenome">
                </div>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required placeholder="seu@email.com">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input type="password" id="password" name="password" required placeholder="Mínimo 8 caracteres" minlength="8">
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirmar Senha:</label>
                    <input type="password" id="confirm-password" name="confirm-password" required placeholder="Confirme sua senha">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="nascimento">Data de Nascimento:</label>
                    <input type="date" id="nascimento" name="nascimento" required>
                </div>
                <div class="form-group">
                    <label for="genero">Gênero:</label>
                    <select id="genero" name="genero" required>
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                        <option value="nao-informar">Prefiro não informar</option>
                    </select>
                </div>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="termos" name="termos" required>
                <label for="termos">Eu aceito os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a></label>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="newsletter" name="newsletter">
                <label for="newsletter">Desejo receber newsletters e promoções por email</label>
            </div>
            
            <button type="submit" class="btn-signup">Criar Conta</button>
        </form>
    </div>
</body>
</html>`;
            break;
            
        case 'pesquisa':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesquisa Avançada</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        .search-container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            max-width: 800px;
            margin: 0 auto;
        }
        .search-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .search-header h2 {
            color: #333;
            margin: 0;
            font-size: 24px;
        }
        .search-main {
            margin-bottom: 30px;
        }
        .search-input {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e9ecef;
            border-radius: 50px;
            font-size: 18px;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }
        .search-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }
        .filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .filter-group {
            display: flex;
            flex-direction: column;
        }
        .filter-group label {
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }
        .filter-group select,
        .filter-group input {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        .checkbox-filters {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .checkbox-item input {
            width: auto;
        }
        .checkbox-item label {
            margin: 0;
            font-size: 14px;
        }
        .search-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
        .btn {
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #007bff;
            color: white;
        }
        .btn-primary:hover {
            background: #0056b3;
        }
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        .btn-secondary:hover {
            background: #545b62;
        }
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="search-container">
        <div class="search-header">
            <h2>🔍 Pesquisa Avançada</h2>
        </div>
        
        <form action="/pesquisar" method="get">
            <div class="search-main">
                <input type="text" name="q" class="search-input" placeholder="Digite sua pesquisa..." required>
            </div>
            
            <div class="section-title">Filtros</div>
            <div class="filters">
                <div class="filter-group">
                    <label for="categoria">Categoria:</label>
                    <select id="categoria" name="categoria">
                        <option value="">Todas as categorias</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="ciencia">Ciência</option>
                        <option value="educacao">Educação</option>
                        <option value="saude">Saúde</option>
                        <option value="esportes">Esportes</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="data-inicio">Data Início:</label>
                    <input type="date" id="data-inicio" name="data-inicio">
                </div>
                
                <div class="filter-group">
                    <label for="data-fim">Data Fim:</label>
                    <input type="date" id="data-fim" name="data-fim">
                </div>
                
                <div class="filter-group">
                    <label for="idioma">Idioma:</label>
                    <select id="idioma" name="idioma">
                        <option value="">Qualquer idioma</option>
                        <option value="pt">Português</option>
                        <option value="en">Inglês</option>
                        <option value="es">Espanhol</option>
                        <option value="fr">Francês</option>
                    </select>
                </div>
            </div>
            
            <div class="section-title">Tipo de Conteúdo</div>
            <div class="checkbox-filters">
                <div class="checkbox-item">
                    <input type="checkbox" id="artigos" name="tipo[]" value="artigos">
                    <label for="artigos">Artigos</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="videos" name="tipo[]" value="videos">
                    <label for="videos">Vídeos</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="imagens" name="tipo[]" value="imagens">
                    <label for="imagens">Imagens</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="documentos" name="tipo[]" value="documentos">
                    <label for="documentos">Documentos</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="noticias" name="tipo[]" value="noticias">
                    <label for="noticias">Notícias</label>
                </div>
                <div class="checkbox-item">
                    <input type="checkbox" id="podcasts" name="tipo[]" value="podcasts">
                    <label for="podcasts">Podcasts</label>
                </div>
            </div>
            
            <div class="search-actions">
                <button type="submit" class="btn btn-primary">🔍 Pesquisar</button>
                <button type="reset" class="btn btn-secondary">🔄 Limpar Filtros</button>
            </div>
        </form>
    </div>
</body>
</html>`;
            break;
            
        case 'feedback':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário de Feedback</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .feedback-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            max-width: 700px;
            margin: 0 auto;
        }
        .feedback-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .feedback-header h2 {
            color: #333;
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .feedback-header p {
            color: #666;
            margin: 0;
            font-size: 16px;
        }
        .form-group {
            margin-bottom: 25px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
            font-size: 14px;
        }
        input, select, textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        textarea {
            resize: vertical;
            min-height: 120px;
        }
        .rating-group {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-top: 10px;
        }
        .rating-item {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 8px 15px;
            border: 2px solid #e1e5e9;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .rating-item:hover {
            border-color: #667eea;
            background-color: #f8f9ff;
        }
        .rating-item input {
            width: auto;
            margin: 0;
            padding: 0;
        }
        .rating-item.selected {
            border-color: #667eea;
            background-color: #667eea;
            color: white;
        }
        .checkbox-group {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-top: 10px;
        }
        .checkbox-group input {
            width: auto;
            margin-top: 2px;
        }
        .checkbox-group label {
            margin-bottom: 0;
            font-weight: normal;
            line-height: 1.4;
        }
        .btn-submit {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .btn-submit:hover {
            transform: translateY(-2px);
        }
        .required {
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <div class="feedback-container">
        <div class="feedback-header">
            <h2>💬 Seu Feedback é Importante</h2>
            <p>Ajude-nos a melhorar nossos serviços com sua opinião</p>
        </div>
        
        <form action="/feedback" method="post">
            <div class="form-group">
                <label for="nome">Nome <span class="required">*</span></label>
                <input type="text" id="nome" name="nome" required placeholder="Seu nome completo">
            </div>
            
            <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input type="email" id="email" name="email" required placeholder="seu@email.com">
            </div>
            
            <div class="form-group">
                <label for="servico">Serviço Avaliado <span class="required">*</span></label>
                <select id="servico" name="servico" required>
                    <option value="">Selecione o serviço</option>
                    <option value="atendimento">Atendimento ao Cliente</option>
                    <option value="produto">Qualidade do Produto</option>
                    <option value="entrega">Processo de Entrega</option>
                    <option value="website">Navegação no Website</option>
                    <option value="suporte">Suporte Técnico</option>
                    <option value="outro">Outro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Avaliação Geral <span class="required">*</span></label>
                <div class="rating-group">
                    <div class="rating-item">
                        <input type="radio" id="rating-1" name="avaliacao" value="1" required>
                        <label for="rating-1">😞 Ruim</label>
                    </div>
                    <div class="rating-item">
                        <input type="radio" id="rating-2" name="avaliacao" value="2">
                        <label for="rating-2">😐 Regular</label>
                    </div>
                    <div class="rating-item">
                        <input type="radio" id="rating-3" name="avaliacao" value="3">
                        <label for="rating-3">🙂 Bom</label>
                    </div>
                    <div class="rating-item">
                        <input type="radio" id="rating-4" name="avaliacao" value="4">
                        <label for="rating-4">😊 Muito Bom</label>
                    </div>
                    <div class="rating-item">
                        <input type="radio" id="rating-5" name="avaliacao" value="5">
                        <label for="rating-5">🤩 Excelente</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="comentarios">Comentários e Sugestões</label>
                <textarea id="comentarios" name="comentarios" placeholder="Conte-nos mais sobre sua experiência..."></textarea>
            </div>
            
            <div class="form-group">
                <label for="melhorias">O que podemos melhorar?</label>
                <textarea id="melhorias" name="melhorias" placeholder="Suas sugestões são muito valiosas para nós..."></textarea>
            </div>
            
            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="recomendaria" name="recomendaria" value="sim">
                    <label for="recomendaria">Eu recomendaria este serviço para outras pessoas</label>
                </div>
            </div>
            
            <div class="form-group">
                <div class="checkbox-group">
                    <input type="checkbox" id="contato" name="contato" value="sim">
                    <label for="contato">Autorizo o contato para esclarecimentos sobre este feedback</label>
                </div>
            </div>
            
            <button type="submit" class="btn-submit">📤 Enviar Feedback</button>
        </form>
    </div>
    
    <script>
        // Adicionar interatividade aos ratings
        document.querySelectorAll('.rating-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remove seleção anterior
                document.querySelectorAll('.rating-item').forEach(r => r.classList.remove('selected'));
                // Adiciona seleção atual
                this.classList.add('selected');
                // Marca o radio button
                this.querySelector('input').checked = true;
            });
        });
    </script>
</body>
</html>`;
            break;
    }
    
    if (code) {
        editor.value = code;
        updatePreview();
        showMessage(`Exemplo "${suggestion}" carregado! 🎉`, 'success');
        
        // Alternar para a aba HTML se estiver em preview
        if (currentTab === 'preview') {
            switchTab('html');
        }
    }
}