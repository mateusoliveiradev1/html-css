// Sistema de Performance e Otimizações
class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.loadTimes = new Map();
        this.init();
    }

    init() {
        this.setupPerformanceMonitoring();
        this.optimizeImages();
        this.setupResourceHints();
        this.implementCriticalCSS();
        this.setupIntersectionObservers();
    }

    // Monitoramento de performance
    setupPerformanceMonitoring() {
        // Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Otimização de imagens
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading nativo
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }

            // Responsive images
            if (!img.sizes && img.srcset) {
                img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
            }

            // Placeholder enquanto carrega
            if (!img.complete) {
                img.style.backgroundColor = '#f0f0f0';
                img.addEventListener('load', () => {
                    img.style.backgroundColor = 'transparent';
                });
            }
        });
    }

    // Resource hints dinâmicos
    setupResourceHints() {
        // Prefetch de próximas páginas prováveis
        const exerciseLinks = document.querySelectorAll('a[href*="ex0"], a[href*="d00"]');
        
        exerciseLinks.forEach((link, index) => {
            if (index < 3) { // Apenas os primeiros 3
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }
        });

        // Preload de recursos críticos baseado na interação
        document.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.dataset.preloaded) {
                this.preloadPage(link.href);
                link.dataset.preloaded = 'true';
            }
        });
    }

    // Preload de página
    preloadPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    // CSS crítico inline
    implementCriticalCSS() {
        // Detectar CSS não utilizado
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.removeUnusedCSS();
            });
        }
    }

    // Remover CSS não utilizado
    removeUnusedCSS() {
        const stylesheets = Array.from(document.styleSheets);
        
        stylesheets.forEach(stylesheet => {
            try {
                const rules = Array.from(stylesheet.cssRules || []);
                const unusedRules = [];

                rules.forEach((rule, index) => {
                    if (rule.type === CSSRule.STYLE_RULE) {
                        try {
                            if (!document.querySelector(rule.selectorText)) {
                                unusedRules.push(index);
                            }
                        } catch (e) {
                            // Selector inválido, ignorar
                        }
                    }
                });

                // Remover regras não utilizadas (apenas em desenvolvimento)
                if (window.location.hostname === 'localhost') {
                    console.log(`Found ${unusedRules.length} unused CSS rules`);
                }
            } catch (e) {
                // Cross-origin stylesheet, ignorar
            }
        });
    }

    // Intersection Observers otimizados
    setupIntersectionObservers() {
        // Observer para elementos que entram na viewport
        const viewportObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                    
                    // Trigger de animações apenas quando visível
                    if (entry.target.dataset.animate) {
                        entry.target.style.animationPlayState = 'running';
                    }
                }
            });
        }, {
            rootMargin: '10px',
            threshold: 0.1
        });

        // Observar elementos animados
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.style.animationPlayState = 'paused';
            viewportObserver.observe(el);
        });
    }

    // Debounce para eventos frequentes
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle para scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Cleanup de observers
    cleanup() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }

    // Métricas de performance
    getPerformanceMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
                firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
                totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
            };
        }
        return null;
    }
}

// Inicializar otimizador de performance
const performanceOptimizer = new PerformanceOptimizer();

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    performanceOptimizer.cleanup();
});

// Exportar para uso global
window.PerformanceOptimizer = PerformanceOptimizer;

// Log de métricas após carregamento completo
window.addEventListener('load', () => {
    setTimeout(() => {
        const metrics = performanceOptimizer.getPerformanceMetrics();
        if (metrics && window.location.hostname === 'localhost') {
            console.table(metrics);
        }
    }, 1000);
});