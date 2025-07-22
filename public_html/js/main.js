/**
 * MAIN.JS - Sistema principal
 */

class HelpdeskPortal {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.navigationHistory = [];
        this.pageLoadTime = performance.now();
        this.isPageLoaded = false;
        this.animationObserver = null;
        
        this.init();
    }

    // =================
    // INICIALIZACIÓN
    // =================

    init() {
        console.log('🚀 IT Helpdesk Portal iniciado');
        
        // Configuración principal
        this.setupPageTransitions();
        this.setupBreadcrumbs();
        this.setupSearchFunctionality();
        this.setupAnimations();
        this.setupNotifications();
        this.setupUserPreferences();
        this.setupAccessibility();
        this.setupSmoothScrolling();
        this.setupCounterAnimations();
        this.trackPageVisit();
        this.setupErrorHandling();
        
        // Marcar como cargado
        this.isPageLoaded = true;
        document.body.classList.add('app-loaded');
        
        console.log('✅ Portal completamente inicializado');
        this.showNotification('Portal cargado correctamente', 'success', 2000);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    // ===========================
    // NAVEGACIÓN Y TRANSICIONES
    // ===========================

    setupPageTransitions() {
        // Interceptar clicks en enlaces internos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link)) {
                this.handleInternalNavigation(e, link);
            }
        });

        // Manejar navegación con botones del navegador
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.handlePopState(e.state);
            }
        });

        // Animación de carga de página
        document.addEventListener('DOMContentLoaded', () => {
            this.animatePageLoad();
        });
    }

    isInternalLink(link) {
        const href = link.getAttribute('href');
        if (!href) return false;
        
        return href.startsWith('./') || 
               href.startsWith('../') ||
               href.includes('.html') ||
               (href.startsWith('/') && !href.startsWith('//')) ||
               href.startsWith(window.location.origin);
    }

    handleInternalNavigation(e, link) {
        const href = link.getAttribute('href');
        
        if (this.shouldSkipTransition(link)) return;
        
        e.preventDefault();
        this.navigateToPage(href, link.textContent);
    }

    shouldSkipTransition(link) {
        const href = link.getAttribute('href');
        const download = link.getAttribute('download');
        const target = link.getAttribute('target');
        
        return download || target === '_blank' || 
               href.startsWith('mailto:') || 
               href.startsWith('tel:') ||
               href.startsWith('#');
    }

    async navigateToPage(url, title = '') {
        try {
            this.showLoadingIndicator();
            this.addToHistory(url, title);
            await this.animatePageExit();
            window.location.href = url;
        } catch (error) {
            console.error('Error en navegación:', error);
            this.hideLoadingIndicator();
        }
    }

    animatePageLoad() {
        const main = document.querySelector('main') || document.querySelector('.container');
        
        if (main) {
            main.style.opacity = '0';
            main.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                main.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                main.style.opacity = '1';
                main.style.transform = 'translateY(0)';
            }, 100);
        }
        
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }

    animatePageExit() {
        return new Promise((resolve) => {
            const main = document.querySelector('main') || document.querySelector('.container');
            
            if (main) {
                main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                main.style.opacity = '0';
                main.style.transform = 'translateY(-10px)';
                setTimeout(resolve, 300);
            } else {
                resolve();
            }
        });
    }

    showLoadingIndicator() {
        let loader = document.getElementById('page-loader');
        
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p>Cargando...</p>
                </div>
            `;
            document.body.appendChild(loader);
            this.addLoaderStyles();
        }
        
        loader.classList.add('show');
    }

    hideLoadingIndicator() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.remove('show');
        }
    }

    addLoaderStyles() {
        if (document.getElementById('loader-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'loader-styles';
        styles.textContent = `
            #page-loader {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(248, 250, 252, 0.9); backdrop-filter: blur(5px);
                z-index: 10000; display: flex; align-items: center; justify-content: center;
                opacity: 0; visibility: hidden; transition: all 0.3s ease;
            }
            #page-loader.show { opacity: 1; visibility: visible; }
            .loader-content { text-align: center; color: #64748b; }
            .loader-spinner {
                width: 40px; height: 40px; border: 3px solid #e2e8f0;
                border-top: 3px solid #2563eb; border-radius: 50%;
                animation: spin 1s linear infinite; margin: 0 auto 1rem;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(styles);
    }

    // ============
    // BREADCRUMBS //
    // =============

    setupBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (!breadcrumbs) return;
        
        this.updateBreadcrumbs();
        
        breadcrumbs.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link)) {
                this.handleInternalNavigation(e, link);
            }
        });
    }

    updateBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs .container');
        if (!breadcrumbs) return;
        
        const pageNames = {
            'index': 'Inicio',
            'mesa-de-ayuda': 'Mesa de Ayuda',
            'indicadores': 'Indicadores de Gestión',
            'tutoriales': 'Tutoriales',
            'alcances-exclusiones': 'Alcances y Exclusiones',
            'autoatencion': 'Autoatención',
            'activacion-seguro': 'Activación de Seguro'
        };
        
        const currentPageName = pageNames[this.currentPage] || 'Página';
        
        if (!breadcrumbs.querySelector('.current')) {
            breadcrumbs.innerHTML = `
                <a href="index.html"><i class="bi bi-house"></i> Inicio</a>
                <span class="separator">›</span>
                <span class="current">${currentPageName}</span>
            `;
        }
    }

    // ===================
    // BÚSQUEDA AVANZADA //
    // ===================

    setupSearchFunctionality() {
        const searchInputs = document.querySelectorAll('.search-box, #messageInput, #smartSearch');
        
        searchInputs.forEach(input => {
            // Efectos visuales
            input.addEventListener('focus', () => {
                if (input.parentElement) {
                    input.parentElement.style.transform = 'scale(1.02)';
                    input.parentElement.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }
            });
            
            input.addEventListener('blur', () => {
                if (input.parentElement) {
                    input.parentElement.style.transform = 'scale(1)';
                    input.parentElement.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                }
            });
            
            // Funcionalidad de búsqueda
            input.addEventListener('input', (e) => {
                this.handleSearchInput(e.target);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        });
        
        // Botones de búsqueda
        const searchButtons = document.querySelectorAll('.search-btn, .search-icon');
        searchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.closest('.search-container')?.querySelector('input') ||
                             document.querySelector('.search-box');
                if (input) {
                    this.performSearch(input.value);
                }
            });
        });
    }

    handleSearchInput(input) {
        const value = input.value.toLowerCase();
        
        if (value.length < 2) {
            this.hideSearchSuggestions();
            return;
        }
        
        console.log('Búsqueda en tiempo real:', value);
        
        // Sugerencias de búsqueda
        const suggestions = this.getSearchSuggestions(value);
        this.showSearchSuggestions(input, suggestions);
    }

    getSearchSuggestions(query) {
        const commonQueries = [
            'resetear contraseña',
            'problemas de impresión',
            'configurar email',
            'conexión VPN',
            'computadora lenta',
            'no puedo conectarme a WiFi',
            'instalar software',
            'solicitar acceso',
            'problemas de red',
            'backup de archivos'
        ];
        
        return commonQueries.filter(suggestion => 
            suggestion.toLowerCase().includes(query)
        ).slice(0, 5);
    }

    showSearchSuggestions(input, suggestions) {
        this.hideSearchSuggestions();
        
        if (suggestions.length === 0) return;
        
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.style.cssText = `
            position: absolute; top: 100%; left: 0; right: 0; z-index: 1000;
            background: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0; margin-top: 5px; overflow: hidden;
        `;
        
        suggestionsDiv.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" style="
                padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f1f5f9;
                transition: background 0.2s ease;
            " onmouseover="this.style.background='#f8fafc'" 
               onmouseout="this.style.background='white'"
               onclick="portal.selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');
        
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(suggestionsDiv);
        
        // Remover al hacer click fuera
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-container')) {
                    this.hideSearchSuggestions();
                }
            }, { once: true });
        }, 100);
    }

    hideSearchSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.remove();
        }
    }

    selectSuggestion(suggestion) {
        const searchInput = document.querySelector('.search-box') || 
                          document.querySelector('#messageInput');
        if (searchInput) {
            searchInput.value = suggestion;
            this.performSearch(suggestion);
        }
        this.hideSearchSuggestions();
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        console.log('Búsqueda realizada:', query);
        
        // Redirigir según tipo de consulta
        if (this.isPasswordQuery(query)) {
            this.redirectToPage('autoatencion.html', `Necesito ayuda con: ${query}`);
        } else if (this.isTechnicalQuery(query)) {
            this.redirectToPage('autoatencion.html', query);
        } else if (this.isDocumentQuery(query)) {
            this.redirectToPage('tutoriales.html');
        } else {
            this.redirectToPage('autoatencion.html', query);
        }
    }

    isPasswordQuery(query) {
        return ['contraseña', 'password', 'resetear'].some(keyword => 
            query.toLowerCase().includes(keyword)
        );
    }

    isTechnicalQuery(query) {
        return ['computadora', 'internet', 'email', 'impresora', 'software'].some(keyword => 
            query.toLowerCase().includes(keyword)
        );
    }

    isDocumentQuery(query) {
        return ['manual', 'tutorial', 'guía', 'documentación'].some(keyword => 
            query.toLowerCase().includes(keyword)
        );
    }

    redirectToPage(page, message = '') {
        const url = message ? `${page}?q=${encodeURIComponent(message)}` : page;
        this.navigateToPage(url);
    }

    // ==============
    // ANIMACIONES //
    // ==============

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    setTimeout(() => {
                        this.animateElement(entry.target);
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Observar elementos animables
        const animatableElements = document.querySelectorAll(`
            .service-card, .additional-card, .feature-item, .mission-card, 
            .stat-item, .tutorial-card, .faq-card, .category-card, 
            .plan-card, .coverage-item, .video-feature
        `);
        
        animatableElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.animationObserver.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.classList.add('animated');
        
        // Micro-bounce effect
        setTimeout(() => {
            element.style.transform = 'translateY(0) scale(1.02)';
            setTimeout(() => {
                element.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }, 300);
    }

    setupCounterAnimations() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const counters = entry.target.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        this.animateCounter(counter);
                    });
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }

    animateCounter(element) {
        const target = element.textContent;
        const duration = 2000;
        
        if (target.includes('%')) {
            this.animateNumber(element, 0, 99.9, duration, '%', 1);
        } else if (target.includes('min')) {
            this.animateTime(element, 0, 5, duration);
        } else if (target.includes('+')) {
            this.animateNumber(element, 0, 1000, duration, '+');
        } else if (target.includes('/')) {
            this.animateRating(element, target, duration);
        } else {
            this.animateUptime(element, target, duration);
        }
    }

    animateNumber(element, start, end, duration, suffix = '', decimals = 0) {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * this.easeOutQuart(progress);
            
            element.textContent = decimals > 0 ? 
                current.toFixed(decimals) + suffix : 
                Math.floor(current) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

    animateTime(element, start, end, duration) {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = start + (end - start) * this.easeOutQuart(progress);
            
            element.textContent = '< ' + Math.ceil(current) + 'min';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }

    animateRating(element, target, duration) {
        const rating = parseFloat(target);
        this.animateNumber(element, 0, rating, duration, '/5', 1);
    }

    animateUptime(element, target, duration) {
        element.textContent = target;
        element.style.transform = 'scale(1.2)';
        setTimeout(() => {
            element.style.transition = 'transform 0.3s ease';
            element.style.transform = 'scale(1)';
        }, 200);
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    // ================
    // NOTIFICACIONES
    // =================

    setupNotifications() {
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;
        
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        `;
        
        document.body.appendChild(container);
    }

    showNotification(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#2563eb'
        };
        
        notification.style.cssText = `
            background: white; padding: 1rem 1.5rem; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${colors[type] || colors.info};
            max-width: 350px; font-size: 0.9rem; line-height: 1.4;
            transform: translateX(100%); transition: transform 0.3s ease;
            pointer-events: auto; cursor: pointer;
        `;
        
        notification.textContent = message;
        container.appendChild(notification);
        
        // Animaciones
        setTimeout(() => notification.style.transform = 'translateX(0)', 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // ===============
    // SCROLL SUAVE 
    // ================

    setupSmoothScrolling() {
        // Scroll para anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, anchor.getAttribute('href'));
                }
            });
        });
        
        this.createScrollToTopButton();
    }

    createScrollToTopButton() {
        const scrollButton = document.createElement('button');
        scrollButton.id = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
        scrollButton.className = 'scroll-to-top-btn';
        scrollButton.setAttribute('aria-label', 'Volver arriba');
        
        scrollButton.style.cssText = `
            position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;
            background: #2563eb; color: white; border: none; border-radius: 50%;
            width: 50px; height: 50px; font-size: 1.2rem; cursor: pointer;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            transition: all 0.3s ease; opacity: 0; visibility: hidden; transform: translateY(20px);
        `;
        
        document.body.appendChild(scrollButton);
        
        // Mostrar/ocultar según scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
                scrollButton.style.transform = 'translateY(0)';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
                scrollButton.style.transform = 'translateY(20px)';
            }
        });
        
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Hover effects
        scrollButton.addEventListener('mouseenter', () => {
            scrollButton.style.transform = 'translateY(-5px) scale(1.1)';
            scrollButton.style.background = '#1d4ed8';
        });
        
        scrollButton.addEventListener('mouseleave', () => {
            scrollButton.style.transform = 'translateY(0) scale(1)';
            scrollButton.style.background = '#2563eb';
        });
    }

    setupFontSizeControls() {
        // Controles UI
        const fontSizeControls = document.querySelectorAll('[data-font-size]');
        fontSizeControls.forEach(control => {
            control.addEventListener('click', () => {
                const size = control.dataset.fontSize;
                this.setFontSize(size);
            });
        });
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    this.increaseFontSize();
                } else if (e.key === '-') {
                    e.preventDefault();
                    this.decreaseFontSize();
                } else if (e.key === '0') {
                    e.preventDefault();
                    this.resetFontSize();
                }
            }
        });
    }

    setFontSize(size) {
        const body = document.body;
        body.classList.remove('font-small', 'font-medium', 'font-large');
        body.classList.add(`font-${size}`);
        this.savePreference('fontSize', size);
        this.showNotification(`Tamaño de fuente: ${size}`, 'info');
    }

    increaseFontSize() {
        const currentSize = parseInt(getComputedStyle(document.body).fontSize);
        const newSize = Math.min(currentSize + 2, 24);
        document.body.style.fontSize = newSize + 'px';
        this.savePreference('fontSize', newSize);
        this.showNotification('Tamaño de fuente aumentado', 'info');
    }

    decreaseFontSize() {
        const currentSize = parseInt(getComputedStyle(document.body).fontSize);
        const newSize = Math.max(currentSize - 2, 12);
        document.body.style.fontSize = newSize + 'px';
        this.savePreference('fontSize', newSize);
        this.showNotification('Tamaño de fuente reducido', 'info');
    }

    resetFontSize() {
        document.body.style.fontSize = '';
        localStorage.removeItem('helpdesk_fontSize');
        this.showNotification('Tamaño de fuente restaurado', 'info');
    }

    setupLanguageSelector() {
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    setLanguage(lang) {
        document.documentElement.lang = lang;
        this.savePreference('language', lang);
        this.showNotification(`Idioma cambiado a: ${lang}`, 'info');
    }

    savePreference(key, value) {
        try {
            localStorage.setItem(`helpdesk_${key}`, value);
        } catch (error) {
            console.warn('No se pudo guardar preferencia:', error);
        }
    }

    loadUserPreferences() {
        try {
            const theme = localStorage.getItem('helpdesk_theme');
            const fontSize = localStorage.getItem('helpdesk_fontSize');
            const language = localStorage.getItem('helpdesk_language');
            
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
            }
            
            if (fontSize && !isNaN(fontSize)) {
                document.body.style.fontSize = fontSize + 'px';
            }
            
            if (language) {
                document.documentElement.lang = language;
            }
        } catch (error) {
            console.warn('No se pudieron cargar preferencias:', error);
        }
    }

    // =================
    // ACCESIBILIDAD
    // =================

    setupAccessibility() {
        this.setupKeyboardNavigation();
        this.setupHighContrastMode();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            if (e.key === 'Enter' && e.target.classList.contains('clickable')) {
                e.target.click();
            }
        });
    }

    setupHighContrastMode() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'c') {
                this.toggleHighContrast();
            }
        });
    }

    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        this.savePreference('contrast', isHighContrast ? 'high' : 'normal');
        this.showNotification(
            `Contraste ${isHighContrast ? 'alto' : 'normal'} activado`,
            'info'
        );
    }

    setupFocusManagement() {
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible { outline: 2px solid #2563eb !important; outline-offset: 2px !important; }
            .high-contrast { filter: contrast(150%); }
            .high-contrast .service-card, .high-contrast .btn { border: 2px solid #000 !important; }
        `;
        document.head.appendChild(style);
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal, .video-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    // =====================
    // ANALYTICS Y TRACKING
    // =====================

    trackPageVisit() {
        const pageData = {
            page: this.currentPage,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            loadTime: this.pageLoadTime
        };
        
        this.sendAnalytics('page_view', pageData);
    }

    sendAnalytics(event, data) {
        console.log('Analytics:', event, data);
        // Aquí se puede enviar a un servidor o servicio de analytics
    }

    // ====================
    // MANEJO DE ERRORES
    // ====================

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            this.handleError(e.error, 'JavaScript Error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason, 'Unhandled Promise Rejection');
        });
    }

    handleError(error, type) {
        console.error(`${type}:`, error);
        
        this.sendAnalytics('error', {
            type: type,
            message: error.message || error,
            page: this.currentPage,
            timestamp: new Date().toISOString()
        });
    }

    // =========================
    // HISTORIAL DE NAVEGACIÓN
    // =========================

    addToHistory(url, title) {
        this.navigationHistory.push({
            url: url,
            title: title,
            timestamp: new Date().toISOString()
        });
        
        if (this.navigationHistory.length > 50) {
            this.navigationHistory = this.navigationHistory.slice(-50);
        }
    }

    getNavigationHistory() {
        return this.navigationHistory;
    }

    // ==============
    // UTILIDADES
    // ===============

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

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    handlePopState(state) {
        console.log('Navegación con botones del navegador:', state);
    }

    // ============
    // CLEANUP
    // =============

    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        console.log('🗑️ Portal cleanup completed');
    }
}

// ================
// INICIALIZACIÓN
// ===============

let portal;

document.addEventListener('DOMContentLoaded', () => {
    portal = new HelpdeskPortal();
    
    // Hacer disponible globalmente
    window.portal = portal;
    window.showNotification = (msg, type, duration) => portal.showNotification(msg, type, duration);
    window.performSearch = (query) => portal.performSearch(query);
});

// Cleanup al cerrar página
window.addEventListener('beforeunload', () => {
    if (portal) {
        portal.destroy();
    }
});

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpdeskPortal;
}