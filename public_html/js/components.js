// components.js - Cargador de componentes reutilizables

class ComponentLoader {
    constructor() {
        this.searchMappings = {
            'computador': 'faq.html#computador',
            'pc': 'faq.html#computador',
            'impresora': 'faq.html#impresora',
            'internet': 'faq.html#internet',
            'wifi': 'faq.html#internet',
            'contraseña': 'faq.html#contrasena',
            'seguro': 'activacion-seguro.html',
            'alcances': 'alcances-exclusiones.html',
            'ticket': 'https://itsm.serviciosmds.cl/marketplace/formcreator/front/formdisplay.php?id=1',
            'soporte': 'index.html',
            'ayuda': 'faq.html',
            'tutorial': 'tutoriales.html'
        };
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.initializeSearchFunctionality();
    }

    async loadComponents() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
    }

    async loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            try {
                const response = await fetch('header.html');
                if (response.ok) {
                    headerPlaceholder.innerHTML = await response.text();
                }
            } catch (error) {
                console.error('Error loading header:', error);
            }
        }
    }

    async loadFooter() {
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            try {
                const response = await fetch('footer.html');
                if (response.ok) {
                    footerPlaceholder.innerHTML = await response.text();
                }
            } catch (error) {
                console.error('Error loading footer:', error);
            }
        }
    }

    initializeSearchFunctionality() {
        setTimeout(() => {
            const searchInput = document.querySelector('.search-input');
            const searchBtn = document.querySelector('.search-btn');

            if (searchInput && searchBtn) {
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && searchInput.value.trim()) {
                        e.preventDefault();
                        this.handleSearch(searchInput.value);
                    }
                });

                searchBtn.addEventListener('click', () => {
                    if (searchInput.value.trim()) {
                        this.handleSearch(searchInput.value);
                    }
                });
            }
        }, 1000);
    }

    handleSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        let destination = 'faq.html';

        for (const [key, url] of Object.entries(this.searchMappings)) {
            if (searchTerm.includes(key)) {
                destination = url;
                break;
            }
        }

        window.location.href = destination;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});