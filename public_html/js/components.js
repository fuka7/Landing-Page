// components.js - Cargador de componentes reutilizables

class ComponentLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.initializeSearchFunctionality();
    }

    async loadComponents() {
        // Cargar header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            try {
                const headerResponse = await fetch('header.html');
                if (headerResponse.ok) {
                    const headerHTML = await headerResponse.text();
                    headerPlaceholder.innerHTML = headerHTML;
                } else {
                    console.error('Error cargando header:', headerResponse.status);
                }
            } catch (error) {
                console.error('Error cargando header:', error);
            }
        }

        // Cargar footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            try {
                const footerResponse = await fetch('footer.html');
                if (footerResponse.ok) {
                    const footerHTML = await footerResponse.text();
                    footerPlaceholder.innerHTML = footerHTML;
                } else {
                    console.error('Error cargando footer:', footerResponse.status);
                }
            } catch (error) {
                console.error('Error cargando footer:', error);
            }
        }
    }

    initializeSearchFunctionality() {
        // Esperar un poco para que el DOM se actualice
        setTimeout(() => {
            const searchInput = document.querySelector('.search-input');
            const searchBtn = document.querySelector('.search-btn');
            
            if (searchInput && searchBtn) {
                const handleSearch = () => {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `autoatencion.html?q=${encodeURIComponent(query)}`;
                    }
                };
                
                searchBtn.addEventListener('click', handleSearch);
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                });
            }
        }, 100);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});