/* ============================================
   CONTROLADOR DEL CHATBOT FLOTANTE
   Sistema de gestión para abrir/cerrar el chatbot
   ============================================ */

class ChatbotController {
    constructor() {
        this.button = document.getElementById('virtualAssistantBtn');
        this.popup = document.getElementById('chatbotPopup');
        this.closeBtn = document.getElementById('chatbotClose');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        console.log('🤖 Inicializando controlador del chatbot...');
        
        // Verificar que los elementos existan
        if (!this.button || !this.popup || !this.closeBtn) {
            console.error('❌ Error: No se encontraron los elementos del chatbot');
            return;
        }

        // Event listeners
        this.setupEventListeners();
        
        // Restaurar estado si estaba abierto
        this.restoreState();
    }

    setupEventListeners() {
        // Abrir chatbot al hacer click en el botón
        this.button.addEventListener('click', () => {
            this.openChatbot();
        });
        
        // Cerrar chatbot con el botón X
        this.closeBtn.addEventListener('click', () => {
            this.closeChatbot();
        });
        
        // Cerrar con la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });

        // Prevenir que clicks dentro del popup lo cierren
        this.popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    openChatbot() {
        console.log('📂 Abriendo chatbot...');
        
        // Ocultar el botón con animación
        this.button.classList.add('hidden');
        
        // Mostrar el popup con un pequeño delay para mejor animación
        setTimeout(() => {
            this.popup.classList.add('show');
            this.isOpen = true;
            
            // Reiniciar el chat cuando se abre
            this.resetChat();
            
            // Guardar estado
            this.saveState(true);
        }, 100);
    }

    closeChatbot() {
        console.log('📁 Cerrando chatbot...');
        
        // Ocultar el popup
        this.popup.classList.remove('show');
        this.isOpen = false;
        
        // Mostrar el botón después de que termine la animación del popup
        setTimeout(() => {
            this.button.classList.remove('hidden');
            
            // Reiniciar el chat cuando se cierra
            this.resetChat();
            
            // Guardar estado
            this.saveState(false);
        }, 400);

        // Asegurarse de que el chat se reinicie después de que se cierre
        setTimeout(() => {
            this.resetChat();
        }, 500);
    }

    resetChat() {
        // Obtener el iframe del chatbot
        const chatbotIframe = document.querySelector('.chatbot-iframe');
        if (chatbotIframe) {
            // Recargar el iframe para reiniciar el chat
            chatbotIframe.src = chatbotIframe.src;
        }
    }

    saveState(isOpen) {
        // Guardar el estado en sessionStorage
        // (se mantiene durante la sesión de navegación)
        try {
            sessionStorage.setItem('chatbotOpen', isOpen ? 'true' : 'false');
        } catch (error) {
            console.warn('⚠️ No se pudo guardar el estado del chatbot:', error);
        }
    }

    restoreState() {
        // Restaurar estado si la página se recarga
        // (opcional - comentar si no se desea este comportamiento)
        try {
            const wasOpen = sessionStorage.getItem('chatbotOpen') === 'true';
            if (wasOpen) {
                console.log('🔄 Restaurando estado del chatbot...');
                this.openChatbot();
            }
        } catch (error) {
            console.warn('⚠️ No se pudo restaurar el estado del chatbot:', error);
        }
    }

    // Método público para abrir desde fuera
    static open() {
        if (window.chatbotInstance) {
            window.chatbotInstance.openChatbot();
        }
    }

    // Método público para cerrar desde fuera
    static close() {
        if (window.chatbotInstance) {
            window.chatbotInstance.closeChatbot();
        }
    }

    // Método para verificar estado
    getState() {
        return {
            isOpen: this.isOpen,
            buttonVisible: !this.button.classList.contains('hidden'),
            popupVisible: this.popup.classList.contains('show')
        };
    }
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, inicializando chatbot...');
    
    // Crear instancia global del chatbot
    window.chatbotInstance = new ChatbotController();
    
    // Exponer métodos globales para uso externo (opcional)
    window.openChatbot = () => ChatbotController.open();
    window.closeChatbot = () => ChatbotController.close();
});

// Exportar para uso con módulos (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotController;
}