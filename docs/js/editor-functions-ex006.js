// Editor functions for ex006.html - Tabelas em HTML

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
        case 'horarios':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabela de Horários</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-family: Arial, sans-serif;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        caption {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
    </style>
</head>
<body>
    <table>
        <caption>Horário de Aulas - 2º Semestre</caption>
        <thead>
            <tr>
                <th scope="col">Horário</th>
                <th scope="col">Segunda</th>
                <th scope="col">Terça</th>
                <th scope="col">Quarta</th>
                <th scope="col">Quinta</th>
                <th scope="col">Sexta</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">08:00 - 09:00</th>
                <td>Matemática</td>
                <td>História</td>
                <td>Matemática</td>
                <td>Física</td>
                <td>Química</td>
            </tr>
            <tr>
                <th scope="row">09:00 - 10:00</th>
                <td>Português</td>
                <td>Geografia</td>
                <td>Português</td>
                <td>Biologia</td>
                <td>Inglês</td>
            </tr>
            <tr>
                <th scope="row">10:00 - 10:20</th>
                <td colspan="5" style="background-color: #ffeb3b; font-weight: bold;">INTERVALO</td>
            </tr>
            <tr>
                <th scope="row">10:20 - 11:20</th>
                <td>Física</td>
                <td>Matemática</td>
                <td>História</td>
                <td>Português</td>
                <td>Educação Física</td>
            </tr>
            <tr>
                <th scope="row">11:20 - 12:20</th>
                <td>Química</td>
                <td>Biologia</td>
                <td>Geografia</td>
                <td>Inglês</td>
                <td>Arte</td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
            break;
            
        case 'precos':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabela de Preços</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: left;
        }
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: bold;
        }
        .price {
            font-weight: bold;
            color: #2e7d32;
            font-size: 1.1em;
        }
        .highlight {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
        }
        caption {
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
    </style>
</head>
<body>
    <table>
        <caption>Planos de Hospedagem Web</caption>
        <thead>
            <tr>
                <th scope="col">Plano</th>
                <th scope="col">Armazenamento</th>
                <th scope="col">Banda</th>
                <th scope="col">Domínios</th>
                <th scope="col">Preço/Mês</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Básico</td>
                <td>10 GB</td>
                <td>100 GB</td>
                <td>1</td>
                <td class="price">R$ 9,90</td>
            </tr>
            <tr class="highlight">
                <td>Profissional</td>
                <td>50 GB</td>
                <td>500 GB</td>
                <td>5</td>
                <td class="price">R$ 19,90</td>
            </tr>
            <tr>
                <td>Empresarial</td>
                <td>200 GB</td>
                <td>Ilimitada</td>
                <td>Ilimitados</td>
                <td class="price">R$ 39,90</td>
            </tr>
        </tbody>
        <tfoot>
            <tr style="background-color: #f5f5f5;">
                <td colspan="4" style="font-weight: bold;">Todos os planos incluem:</td>
                <td style="font-style: italic;">SSL Grátis</td>
            </tr>
        </tfoot>
    </table>
</body>
</html>`;
            break;
            
        case 'comparacao':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tabela Comparativa</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-family: Arial, sans-serif;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #2196F3;
            color: white;
            font-weight: bold;
        }
        .feature {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: left;
        }
        .yes {
            color: #4CAF50;
            font-weight: bold;
        }
        .no {
            color: #f44336;
            font-weight: bold;
        }
        .partial {
            color: #ff9800;
            font-weight: bold;
        }
        caption {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
    </style>
</head>
<body>
    <table>
        <caption>Comparação de Smartphones</caption>
        <thead>
            <tr>
                <th scope="col">Características</th>
                <th scope="col">iPhone 15</th>
                <th scope="col">Galaxy S24</th>
                <th scope="col">Pixel 8</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="feature" scope="row">Tela</td>
                <td>6.1" OLED</td>
                <td>6.2" AMOLED</td>
                <td>6.2" OLED</td>
            </tr>
            <tr>
                <td class="feature" scope="row">Câmera Principal</td>
                <td>48MP</td>
                <td>50MP</td>
                <td>50MP</td>
            </tr>
            <tr>
                <td class="feature" scope="row">Resistência à Água</td>
                <td class="yes">✓ IP68</td>
                <td class="yes">✓ IP68</td>
                <td class="yes">✓ IP68</td>
            </tr>
            <tr>
                <td class="feature" scope="row">Carregamento Sem Fio</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
            </tr>
            <tr>
                <td class="feature" scope="row">Entrada para Fone</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
                <td class="no">✗</td>
            </tr>
            <tr>
                <td class="feature" scope="row">IA Integrada</td>
                <td class="partial">Parcial</td>
                <td class="yes">✓</td>
                <td class="yes">✓</td>
            </tr>
        </tbody>
    </table>
</body>
</html>`;
            break;
            
        case 'relatorio':
            code = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Vendas</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-family: Arial, sans-serif;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: right;
        }
        th {
            background-color: #34495e;
            color: white;
            font-weight: bold;
        }
        .product {
            text-align: left;
            font-weight: bold;
        }
        .total {
            background-color: #ecf0f1;
            font-weight: bold;
        }
        .positive {
            color: #27ae60;
        }
        .negative {
            color: #e74c3c;
        }
        caption {
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <table>
        <caption>Relatório de Vendas - Q3 2024</caption>
        <thead>
            <tr>
                <th scope="col" class="product">Produto</th>
                <th scope="col">Jan</th>
                <th scope="col">Fev</th>
                <th scope="col">Mar</th>
                <th scope="col">Total</th>
                <th scope="col">Variação</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="product" scope="row">Notebooks</td>
                <td>R$ 45.000</td>
                <td>R$ 52.000</td>
                <td>R$ 48.000</td>
                <td>R$ 145.000</td>
                <td class="positive">+12%</td>
            </tr>
            <tr>
                <td class="product" scope="row">Smartphones</td>
                <td>R$ 78.000</td>
                <td>R$ 85.000</td>
                <td>R$ 92.000</td>
                <td>R$ 255.000</td>
                <td class="positive">+18%</td>
            </tr>
            <tr>
                <td class="product" scope="row">Tablets</td>
                <td>R$ 23.000</td>
                <td>R$ 19.000</td>
                <td>R$ 21.000</td>
                <td>R$ 63.000</td>
                <td class="negative">-8%</td>
            </tr>
            <tr>
                <td class="product" scope="row">Acessórios</td>
                <td>R$ 15.000</td>
                <td>R$ 18.000</td>
                <td>R$ 22.000</td>
                <td>R$ 55.000</td>
                <td class="positive">+25%</td>
            </tr>
        </tbody>
        <tfoot>
            <tr class="total">
                <td class="product" scope="row">TOTAL GERAL</td>
                <td>R$ 161.000</td>
                <td>R$ 174.000</td>
                <td>R$ 183.000</td>
                <td>R$ 518.000</td>
                <td class="positive">+14%</td>
            </tr>
        </tfoot>
    </table>
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