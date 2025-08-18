const fs = require('fs');
const path = require('path');

/**
 * Sistema de tags automáticas baseado no conteúdo dos exercícios
 * Analisa arquivos HTML/CSS/JS e gera tags relevantes
 */

class AutoTagger {
    constructor() {
        this.tagPatterns = {
            // HTML Tags
            'Formulários': [/form/i, /input/i, /button/i, /select/i, /textarea/i],
            'Tabelas': [/table/i, /thead/i, /tbody/i, /tr/i, /td/i, /th/i],
            'Listas': [/ul/i, /ol/i, /li/i, /dl/i, /dt/i, /dd/i],
            'Mídia': [/img/i, /video/i, /audio/i, /source/i, /picture/i],
            'Semântica': [/header/i, /nav/i, /main/i, /section/i, /article/i, /aside/i, /footer/i],
            'Links': [/href/i, /anchor/i, /<a\s/i],
            
            // CSS Tags
            'Flexbox': [/display:\s*flex/i, /flex-direction/i, /justify-content/i, /align-items/i],
            'Grid': [/display:\s*grid/i, /grid-template/i, /grid-area/i, /grid-column/i],
            'Animações': [/animation/i, /keyframes/i, /transition/i, /transform/i],
            'Responsivo': [/media\s*query/i, /@media/i, /viewport/i, /mobile/i],
            'Posicionamento': [/position:\s*(absolute|relative|fixed|sticky)/i, /z-index/i],
            'Cores': [/background-color/i, /color:/i, /gradient/i, /rgba/i, /hsla/i],
            'Tipografia': [/font-family/i, /font-size/i, /font-weight/i, /text-align/i],
            'Box Model': [/margin/i, /padding/i, /border/i, /width/i, /height/i],
            
            // JavaScript Tags
            'DOM': [/getElementById/i, /querySelector/i, /addEventListener/i, /createElement/i],
            'Eventos': [/click/i, /mouseover/i, /keydown/i, /submit/i, /load/i],
            'Funções': [/function/i, /=>/i, /return/i],
            'Variáveis': [/var\s/i, /let\s/i, /const\s/i],
            'Condicionais': [/if\s*\(/i, /else/i, /switch/i, /case/i],
            'Loops': [/for\s*\(/i, /while\s*\(/i, /forEach/i],
            'Arrays': [/\[\]/i, /Array/i, /push/i, /pop/i, /slice/i],
            'Objetos': [/\{\}/i, /Object/i, /\.prototype/i],
            
            // Conceitos Gerais
            'Acessibilidade': [/alt=/i, /aria-/i, /role=/i, /tabindex/i],
            'SEO': [/meta/i, /title/i, /description/i, /keywords/i],
            'Performance': [/lazy/i, /defer/i, /async/i, /preload/i],
            'Mobile First': [/mobile/i, /touch/i, /swipe/i, /responsive/i]
        };
    }

    /**
     * Analisa um diretório de exercício e gera tags
     */
    analyzeExercise(exercisePath) {
        const tags = new Set();
        
        try {
            const files = fs.readdirSync(exercisePath);
            
            for (const file of files) {
                const filePath = path.join(exercisePath, file);
                const ext = path.extname(file).toLowerCase();
                
                if (['.html', '.css', '.js'].includes(ext)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const fileTags = this.extractTags(content, ext);
                    fileTags.forEach(tag => tags.add(tag));
                }
            }
        } catch (error) {
            console.error(`Erro ao analisar ${exercisePath}:`, error.message);
        }
        
        return Array.from(tags);
    }

    /**
     * Extrai tags baseado no conteúdo do arquivo
     */
    extractTags(content, fileType) {
        const tags = [];
        
        for (const [tagName, patterns] of Object.entries(this.tagPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    tags.push(tagName);
                    break; // Evita duplicatas para o mesmo conceito
                }
            }
        }
        
        // Tags específicas por tipo de arquivo
        if (fileType === '.html') {
            tags.push('HTML');
        } else if (fileType === '.css') {
            tags.push('CSS');
        } else if (fileType === '.js') {
            tags.push('JavaScript');
        }
        
        return tags;
    }

    /**
     * Gera tags para todos os exercícios
     */
    generateAllTags() {
        const exercisesDir = path.join(__dirname, '..', 'exercicios');
        const challengesDir = path.join(__dirname, '..', 'desafios');
        const results = {
            exercises: {},
            challenges: {}
        };
        
        // Analisar exercícios
        if (fs.existsSync(exercisesDir)) {
            const exercises = fs.readdirSync(exercisesDir)
                .filter(dir => dir.startsWith('ex') && fs.statSync(path.join(exercisesDir, dir)).isDirectory());
            
            for (const exercise of exercises) {
                const exercisePath = path.join(exercisesDir, exercise);
                const tags = this.analyzeExercise(exercisePath);
                results.exercises[exercise] = tags;
            }
        }
        
        // Analisar desafios
        if (fs.existsSync(challengesDir)) {
            const challenges = fs.readdirSync(challengesDir)
                .filter(dir => dir.startsWith('d') && fs.statSync(path.join(challengesDir, dir)).isDirectory());
            
            for (const challenge of challenges) {
                const challengePath = path.join(challengesDir, challenge);
                const tags = this.analyzeExercise(challengePath);
                results.challenges[challenge] = tags;
            }
        }
        
        return results;
    }

    /**
     * Salva as tags em um arquivo JSON
     */
    saveTags(tags, outputPath = null) {
        const defaultPath = path.join(__dirname, 'generated-tags.json');
        const filePath = outputPath || defaultPath;
        
        fs.writeFileSync(filePath, JSON.stringify(tags, null, 2), 'utf8');
        console.log(`Tags salvas em: ${filePath}`);
    }

    /**
     * Gera estatísticas das tags
     */
    generateTagStats(tags) {
        const stats = {};
        
        // Contar ocorrências de cada tag
        for (const [type, items] of Object.entries(tags)) {
            for (const [item, itemTags] of Object.entries(items)) {
                for (const tag of itemTags) {
                    stats[tag] = (stats[tag] || 0) + 1;
                }
            }
        }
        
        // Ordenar por frequência
        const sortedStats = Object.entries(stats)
            .sort(([,a], [,b]) => b - a)
            .reduce((acc, [tag, count]) => {
                acc[tag] = count;
                return acc;
            }, {});
        
        return sortedStats;
    }

    /**
     * Executa o processo completo de geração de tags
     */
    run() {
        console.log('🏷️  Iniciando geração automática de tags...');
        
        const tags = this.generateAllTags();
        const stats = this.generateTagStats(tags);
        
        // Salvar resultados
        this.saveTags(tags);
        
        const statsPath = path.join(__dirname, 'tag-stats.json');
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
        
        console.log('✅ Tags geradas com sucesso!');
        console.log(`📊 Estatísticas salvas em: ${statsPath}`);
        console.log('\n📈 Top 10 tags mais usadas:');
        
        Object.entries(stats)
            .slice(0, 10)
            .forEach(([tag, count], index) => {
                console.log(`${index + 1}. ${tag}: ${count} ocorrências`);
            });
        
        return { tags, stats };
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const tagger = new AutoTagger();
    tagger.run();
}

module.exports = AutoTagger;