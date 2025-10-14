document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar la búsqueda
        function handleSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        
        // Mapeo de términos de búsqueda a páginas
        const searchMappings = {
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

        // Buscar coincidencia
        let destination = 'faq.html'; // página por defecto
        
        for (const [key, url] of Object.entries(searchMappings)) {
            if (searchTerm.includes(key)) {
                destination = url;
                break;
            }
        }

        // Redirigir
        window.location.href = destination;
    }

    // Agregar event listeners
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) {
        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                e.preventDefault();
                handleSearch(searchInput.value);
            }
        });

        // Búsqueda al hacer clic en el botón
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput.value.trim() !== '') {
                handleSearch(searchInput.value);
            }
        });
    }
});

// Función para buscar coincidencias
function searchContent(query) {
    query = query.toLowerCase().trim();
    
    // Si la búsqueda está vacía o es muy corta
    if (!query || query.length < 2) {
        return 'faq.html';
    }
    
    // Buscar coincidencia exacta
    if (searchIndex[query]) {
        return searchIndex[query];
    }
    
    // Buscar coincidencias parciales
    for (const key in searchIndex) {
        if (key.includes(query) || query.includes(key)) {
            return searchIndex[key];
        }
    }
    
    // Si no hay coincidencias, redirigir a la página de FAQ
    return 'faq.html';
}

// Inicializar la búsqueda
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Manejar la búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const result = searchContent(searchInput.value);
                if (result) {
                    window.location.href = result;
                }
            }
        });
        
        // Manejar la búsqueda al hacer clic en el botón
        searchBtn.addEventListener('click', () => {
            const result = searchContent(searchInput.value);
            if (result) {
                window.location.href = result;
            }
        });
    }
});