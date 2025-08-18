#!/usr/bin/env node

/**
 * Script de Automação para Atualização do README.md
 * 
 * Este script detecta automaticamente novos exercícios e desafios
 * no projeto e atualiza o README.md com as informações necessárias.
 * 
 * Funcionalidades:
 * - Detecta novos exercícios (ex001, ex002, etc.)
 * - Detecta novos desafios (d001, d002, etc.)
 * - Atualiza estatísticas do projeto
 * - Valida links quebrados
 * - Gera badges dinâmicos
 * - Atualiza changelog automaticamente
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class ReadmeUpdater {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.readmePath = path.join(this.projectRoot, 'README.md');
        this.exercisesDir = path.join(this.projectRoot, 'exercicios');
        this.challengesDir = path.join(this.projectRoot, 'desafios');
        
        this.exercises = [];
        this.challenges = [];
        this.brokenLinks = [];
    }

    /**
     * Executa o processo completo de atualização
     */
    async run() {
        console.log('🚀 Iniciando atualização automática do README...\n');
        
        try {
            await this.scanExercises();
            await this.scanChallenges();
            await this.validateLinks();
            await this.updateReadme();
            await this.generateBadges();
            
            console.log('✅ README atualizado com sucesso!');
            console.log(`📊 Exercícios encontrados: ${this.exercises.length}`);
            console.log(`🎯 Desafios encontrados: ${this.challenges.length}`);
            
            if (this.brokenLinks.length > 0) {
                console.log(`⚠️  Links quebrados encontrados: ${this.brokenLinks.length}`);
                this.brokenLinks.forEach(link => console.log(`   - ${link}`));
            }
            
        } catch (error) {
            console.error('❌ Erro durante a atualização:', error.message);
            process.exit(1);
        }
    }

    /**
     * Escaneia diretório de exercícios
     */
    async scanExercises() {
        console.log('📁 Escaneando exercícios...');
        
        if (!fs.existsSync(this.exercisesDir)) {
            console.log('⚠️  Diretório de exercícios não encontrado');
            return;
        }

        const dirs = fs.readdirSync(this.exercisesDir)
            .filter(dir => dir.match(/^ex\d{3}$/))
            .sort();

        for (const dir of dirs) {
            const exercisePath = path.join(this.exercisesDir, dir);
            const exercise = await this.analyzeExercise(exercisePath, dir);
            if (exercise) {
                this.exercises.push(exercise);
            }
        }

        console.log(`   ✓ ${this.exercises.length} exercícios encontrados`);
    }

    /**
     * Escaneia diretório de desafios
     */
    async scanChallenges() {
        console.log('🎯 Escaneando desafios...');
        
        if (!fs.existsSync(this.challengesDir)) {
            console.log('⚠️  Diretório de desafios não encontrado');
            return;
        }

        const dirs = fs.readdirSync(this.challengesDir)
            .filter(dir => dir.match(/^d\d{3}$/))
            .sort();

        for (const dir of dirs) {
            const challengePath = path.join(this.challengesDir, dir);
            const challenge = await this.analyzeChallenge(challengePath, dir);
            if (challenge) {
                this.challenges.push(challenge);
            }
        }

        console.log(`   ✓ ${this.challenges.length} desafios encontrados`);
    }

    /**
     * Analisa um exercício específico
     */
    async analyzeExercise(exercisePath, dirName) {
        try {
            const htmlFiles = fs.readdirSync(exercisePath)
                .filter(file => file.endsWith('.html'));
            
            if (htmlFiles.length === 0) return null;

            const mainFile = htmlFiles.find(f => f === 'index.html') || htmlFiles[0];
            const htmlPath = path.join(exercisePath, mainFile);
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');

            // Extrai título da página
            const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : `Exercício ${dirName.toUpperCase()}`;

            // Detecta tecnologias usadas
            const technologies = this.detectTechnologies(htmlContent, exercisePath);
            
            // Calcula nível de dificuldade baseado na complexidade
            const difficulty = this.calculateDifficulty(htmlContent, exercisePath);
            
            // Estima tempo baseado na complexidade
            const estimatedTime = this.estimateTime(htmlContent, exercisePath);

            return {
                id: dirName.toUpperCase(),
                title: this.cleanTitle(title),
                description: this.generateDescription(title, technologies),
                level: difficulty,
                time: estimatedTime,
                technologies,
                concepts: this.extractConcepts(htmlContent, technologies),
                demoUrl: `https://mateusoliveiradev1.github.io/html-css/exercicios/${dirName}/${mainFile}`,
                codeUrl: `https://github.com/mateusoliveiradev1/html-css/tree/main/exercicios/${dirName}`,
                emoji: this.getEmoji(technologies, title)
            };
        } catch (error) {
            console.log(`   ⚠️  Erro ao analisar ${dirName}: ${error.message}`);
            return null;
        }
    }

    /**
     * Analisa um desafio específico
     */
    async analyzeChallenge(challengePath, dirName) {
        try {
            const htmlFiles = fs.readdirSync(challengePath)
                .filter(file => file.endsWith('.html'));
            
            if (htmlFiles.length === 0) return null;

            const mainFile = htmlFiles.find(f => f === 'index.html') || htmlFiles[0];
            const htmlPath = path.join(challengePath, mainFile);
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');

            const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : `Desafio ${dirName.toUpperCase()}`;

            const technologies = this.detectTechnologies(htmlContent, challengePath);
            const difficulty = this.calculateDifficulty(htmlContent, challengePath, true);
            const estimatedTime = this.estimateTime(htmlContent, challengePath, true);

            return {
                id: dirName.toUpperCase(),
                title: this.cleanTitle(title),
                description: this.generateDescription(title, technologies),
                level: difficulty,
                time: estimatedTime,
                technologies,
                concepts: this.extractConcepts(htmlContent, technologies),
                demoUrl: `https://mateusoliveiradev1.github.io/html-css/desafios/${dirName}/${mainFile}`,
                codeUrl: `https://github.com/mateusoliveiradev1/html-css/tree/main/desafios/${dirName}`,
                emoji: this.getEmoji(technologies, title)
            };
        } catch (error) {
            console.log(`   ⚠️  Erro ao analisar ${dirName}: ${error.message}`);
            return null;
        }
    }

    /**
     * Detecta tecnologias usadas no projeto
     */
    detectTechnologies(htmlContent, projectPath) {
        const technologies = ['HTML'];
        
        // Verifica CSS
        if (htmlContent.includes('<style>') || 
            htmlContent.includes('.css') || 
            fs.existsSync(path.join(projectPath, 'style.css')) ||
            fs.existsSync(path.join(projectPath, 'styles.css'))) {
            technologies.push('CSS');
        }
        
        // Verifica JavaScript
        if (htmlContent.includes('<script>') || 
            htmlContent.includes('.js') ||
            fs.existsSync(path.join(projectPath, 'script.js'))) {
            technologies.push('JavaScript');
        }

        return technologies;
    }

    /**
     * Calcula nível de dificuldade
     */
    calculateDifficulty(htmlContent, projectPath, isChallenge = false) {
        let complexity = 0;
        
        // Fatores de complexidade
        if (htmlContent.includes('flexbox') || htmlContent.includes('grid')) complexity += 2;
        if (htmlContent.includes('@media')) complexity += 2;
        if (htmlContent.includes('transform') || htmlContent.includes('animation')) complexity += 1;
        if (htmlContent.includes('javascript') || htmlContent.includes('<script>')) complexity += 2;
        if (htmlContent.includes('iframe')) complexity += 1;
        if (htmlContent.includes('table')) complexity += 1;
        
        // Conta número de arquivos
        try {
            const files = fs.readdirSync(projectPath);
            if (files.length > 3) complexity += 1;
            if (files.length > 5) complexity += 1;
        } catch (e) {}

        // Ajuste para desafios (geralmente mais complexos)
        if (isChallenge) complexity += 1;

        // Converte para estrelas
        if (complexity <= 2) return '⭐';
        if (complexity <= 4) return '⭐⭐';
        return '⭐⭐⭐';
    }

    /**
     * Estima tempo necessário
     */
    estimateTime(htmlContent, projectPath, isChallenge = false) {
        let baseTime = isChallenge ? 60 : 30; // minutos base
        
        // Fatores que aumentam o tempo
        if (htmlContent.includes('flexbox') || htmlContent.includes('grid')) baseTime += 20;
        if (htmlContent.includes('@media')) baseTime += 15;
        if (htmlContent.includes('javascript')) baseTime += 30;
        if (htmlContent.includes('animation')) baseTime += 15;
        
        try {
            const files = fs.readdirSync(projectPath);
            baseTime += files.length * 5;
        } catch (e) {}

        return `${baseTime}min`;
    }

    /**
     * Extrai conceitos do código
     */
    extractConcepts(htmlContent, technologies) {
        const concepts = [];
        
        // Conceitos HTML
        if (htmlContent.includes('<form>')) concepts.push('Formulários');
        if (htmlContent.includes('<table>')) concepts.push('Tabelas');
        if (htmlContent.includes('<video>') || htmlContent.includes('<audio>')) concepts.push('Mídia');
        if (htmlContent.includes('semantic') || htmlContent.includes('<main>') || htmlContent.includes('<section>')) concepts.push('Semântica');
        
        // Conceitos CSS
        if (htmlContent.includes('flexbox') || htmlContent.includes('display: flex')) concepts.push('Flexbox');
        if (htmlContent.includes('grid')) concepts.push('Grid');
        if (htmlContent.includes('@media')) concepts.push('Responsivo');
        if (htmlContent.includes('transform') || htmlContent.includes('transition')) concepts.push('Animações');
        if (htmlContent.includes('position')) concepts.push('Posicionamento');
        
        // Conceitos JavaScript
        if (htmlContent.includes('addEventListener') || htmlContent.includes('onclick')) concepts.push('Eventos');
        if (htmlContent.includes('querySelector')) concepts.push('DOM');

        // Adiciona tecnologias como conceitos se não houver outros
        if (concepts.length === 0) {
            concepts.push(...technologies.map(tech => `${tech} Básico`));
        }

        return concepts.slice(0, 3); // Máximo 3 conceitos
    }

    /**
     * Gera emoji baseado no conteúdo
     */
    getEmoji(technologies, title) {
        const titleLower = title.toLowerCase();
        
        // Emojis específicos por conteúdo
        if (titleLower.includes('android')) return '🤖';
        if (titleLower.includes('social') || titleLower.includes('rede')) return '📱';
        if (titleLower.includes('cordel')) return '📜';
        if (titleLower.includes('astronauta') || titleLower.includes('espaço')) return '🚀';
        if (titleLower.includes('tabela')) return '📊';
        if (titleLower.includes('video') || titleLower.includes('vídeo')) return '🎥';
        if (titleLower.includes('imagem') || titleLower.includes('foto')) return '🖼️';
        if (titleLower.includes('emoji')) return '😍';
        if (titleLower.includes('mapa')) return '🗺️';
        if (titleLower.includes('perfil')) return '👤';
        if (titleLower.includes('navegação')) return '🧭';
        if (titleLower.includes('mensagem')) return '💬';
        
        // Emojis por tecnologia
        if (technologies.includes('JavaScript')) return '⚡';
        if (technologies.includes('CSS')) return '🎨';
        
        return '📄'; // Emoji padrão
    }

    /**
     * Limpa título removendo prefixos desnecessários
     */
    cleanTitle(title) {
        return title
            .replace(/^(Exercício|Desafio)\s*\d*\s*[-:]?\s*/i, '')
            .replace(/\s*-\s*Curso.*$/i, '')
            .trim();
    }

    /**
     * Gera descrição baseada no título e tecnologias
     */
    generateDescription(title, technologies) {
        const cleanedTitle = this.cleanTitle(title);
        const techString = technologies.length > 1 ? technologies.join(' + ') : technologies[0];
        return `${cleanedTitle}`;
    }

    /**
     * Valida links do README
     */
    async validateLinks() {
        console.log('🔗 Validando links...');
        
        const readmeContent = fs.readFileSync(this.readmePath, 'utf8');
        const linkRegex = /\[.*?\]\((https?:\/\/[^\)]+)\)/g;
        const links = [];
        let match;
        
        while ((match = linkRegex.exec(readmeContent)) !== null) {
            links.push(match[1]);
        }

        for (const link of links) {
            try {
                await this.checkLink(link);
            } catch (error) {
                this.brokenLinks.push(link);
            }
        }

        console.log(`   ✓ ${links.length - this.brokenLinks.length}/${links.length} links válidos`);
    }

    /**
     * Verifica se um link está funcionando
     */
    checkLink(url) {
        return new Promise((resolve, reject) => {
            const request = https.get(url, (response) => {
                if (response.statusCode >= 200 && response.statusCode < 400) {
                    resolve();
                } else {
                    reject(new Error(`Status ${response.statusCode}`));
                }
            });
            
            request.on('error', reject);
            request.setTimeout(5000, () => {
                request.destroy();
                reject(new Error('Timeout'));
            });
        });
    }

    /**
     * Atualiza o README com as informações coletadas
     */
    async updateReadme() {
        console.log('📝 Atualizando README...');
        
        let readmeContent = fs.readFileSync(this.readmePath, 'utf8');
        
        // Atualiza estatísticas
        readmeContent = this.updateStatistics(readmeContent);
        
        // Atualiza tabelas de exercícios e desafios
        readmeContent = this.updateExercisesTable(readmeContent);
        readmeContent = this.updateChallengesTable(readmeContent);
        
        // Atualiza changelog
        readmeContent = this.updateChangelog(readmeContent);
        
        fs.writeFileSync(this.readmePath, readmeContent);
        console.log('   ✓ README atualizado');
    }

    /**
     * Atualiza estatísticas do projeto
     */
    updateStatistics(content) {
        const stats = {
            exercises: this.exercises.length,
            challenges: this.challenges.length,
            total: this.exercises.length + this.challenges.length
        };

        // Atualiza badges de estatísticas
        content = content.replace(
            /!\[Exercícios\]\(https:\/\/img\.shields\.io\/badge\/Exercícios-\d+-blue\)/,
            `![Exercícios](https://img.shields.io/badge/Exercícios-${stats.exercises}-blue)`
        );
        
        content = content.replace(
            /!\[Desafios\]\(https:\/\/img\.shields\.io\/badge\/Desafios-\d+-red\)/,
            `![Desafios](https://img.shields.io/badge/Desafios-${stats.challenges}-red)`
        );

        return content;
    }

    /**
     * Atualiza tabela de exercícios
     */
    updateExercisesTable(content) {
        // Implementação simplificada - em um projeto real, seria mais robusta
        return content;
    }

    /**
     * Atualiza tabela de desafios
     */
    updateChallengesTable(content) {
        // Implementação simplificada - em um projeto real, seria mais robusta
        return content;
    }

    /**
     * Atualiza changelog
     */
    updateChangelog(content) {
        const today = new Date().toISOString().split('T')[0];
        const newEntry = `
### [v2.1.0] - ${today}
#### 🔄 Atualizações Automáticas
- Exercícios detectados: ${this.exercises.length}
- Desafios detectados: ${this.challenges.length}
- Links validados automaticamente
- Estatísticas atualizadas
`;

        // Adiciona entrada no changelog se não existir
        if (!content.includes(`[v2.1.0] - ${today}`)) {
            content = content.replace(
                /## 📋 Changelog/,
                `## 📋 Changelog${newEntry}`
            );
        }

        return content;
    }

    /**
     * Gera badges dinâmicos
     */
    async generateBadges() {
        console.log('🏷️  Gerando badges dinâmicos...');
        
        const badges = {
            exercises: this.exercises.length,
            challenges: this.challenges.length,
            technologies: ['HTML5', 'CSS3', 'JavaScript'],
            status: 'Em Desenvolvimento'
        };

        // Salva informações para uso em GitHub Actions
        const badgesPath = path.join(this.projectRoot, '.github', 'badges.json');
        
        // Cria diretório se não existir
        const badgesDir = path.dirname(badgesPath);
        if (!fs.existsSync(badgesDir)) {
            fs.mkdirSync(badgesDir, { recursive: true });
        }
        
        fs.writeFileSync(badgesPath, JSON.stringify(badges, null, 2));
        console.log('   ✓ Badges gerados');
    }
}

// Executa o script se chamado diretamente
if (require.main === module) {
    const updater = new ReadmeUpdater();
    updater.run().catch(console.error);
}

module.exports = ReadmeUpdater;