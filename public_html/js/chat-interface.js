/**
 * CHAT-INTERFACE.JS - Interfaz del chat para autoatencion.html
 * Versión corregida para la nueva estructura HTML
 */

class ChatInterface {
    constructor() {
        this.bot = null; // Se inicializará si existe TechBot
        this.isInitialized = false;
        this.messagesContainer = null;
        this.inputField = null;
        this.sendButton = null;
        this.typingIndicator = null;
        this.charCounter = null;
        
        this.init();
    }

    init() {
        // Verificar que estamos en la página correcta
        if (!this.isAutoatencionPage()) {
            console.log('❌ Not on autoatencion page, skipping chat interface init');
            return;
        }

        console.log('🚀 Initializing chat interface...');
        
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupChatInterface());
        } else {
            this.setupChatInterface();
        }
    }

    isAutoatencionPage() {
        return document.querySelector('.autoatencion-hero') || 
               document.querySelector('.chat-main-section') ||
               window.location.pathname.includes('autoatencion');
    }

    setupChatInterface() {
        try {
            // Encontrar elementos del DOM
            this.findDOMElements();
            
            if (!this.messagesContainer || !this.inputField || !this.sendButton) {
                console.error('❌ Required chat elements not found');
                this.createFallbackElements();
            }

            // Configurar event listeners
            this.setupEventListeners();
            
            // Inicializar bot si existe
            this.initializeBot();
            
            // Crear indicador de escritura
            this.createTypingIndicator();
            
            // Mostrar mensaje de bienvenida
            this.showWelcomeMessage();
            
            // Procesar consulta desde URL si existe
            this.handleUrlQuery();
            
            this.isInitialized = true;
            console.log('✅ Chat interface initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing chat interface:', error);
        }
    }

    findDOMElements() {
        // Buscar contenedor de mensajes
        this.messagesContainer = document.getElementById('chatMessages') || 
                                document.querySelector('.chat-messages-area') ||
                                document.querySelector('.chat-messages');

        // Buscar campo de entrada
        this.inputField = document.getElementById('chatInput') || 
                         document.getElementById('messageInput') ||
                         document.querySelector('.chat-textarea') ||
                         document.querySelector('.chat-input-field');

        // Buscar botón de envío
        this.sendButton = document.getElementById('sendButton') ||
                         document.querySelector('.send-message-btn') ||
                         document.querySelector('.chat-send-btn');

        // Buscar contador de caracteres
        this.charCounter = document.querySelector('.char-counter') ||
                          document.querySelector('.char-count');

        console.log('🔍 DOM Elements found:', {
            messages: !!this.messagesContainer,
            input: !!this.inputField,
            button: !!this.sendButton,
            counter: !!this.charCounter
        });
    }

    createFallbackElements() {
        console.log('🔧 Creating fallback elements...');
        
        if (!this.messagesContainer) {
            this.messagesContainer = document.createElement('div');
            this.messagesContainer.className = 'chat-messages-fallback';
            this.messagesContainer.style.cssText = `
                height: 400px;
                overflow-y: auto;
                padding: 1rem;
                background: #f8f9fa;
                border: 1px solid #e5e5e5;
                margin-bottom: 1rem;
            `;
            
            // Insertar en la sección principal del chat
            const chatMain = document.querySelector('.chat-main') || 
                            document.querySelector('.chat-container-box') ||
                            document.body;
            chatMain.appendChild(this.messagesContainer);
        }
    }

    initializeBot() {
        try {
            if (typeof TechBot !== 'undefined') {
                this.bot = new TechBot();
                console.log('🤖 TechBot initialized');
            } else {
                console.warn('⚠️ TechBot not available, using fallback responses');
                this.bot = this.createFallbackBot();
            }
        } catch (error) {
            console.error('❌ Error initializing bot:', error);
            this.bot = this.createFallbackBot();
        }
    }

    createFallbackBot() {
        return {
            processMessage: async (message) => {
                // Respuestas básicas de fallback
                const responses = {
                    'impresora': 'Para problemas de impresión, verifica que la impresora esté conectada y tenga tinta/tóner. ¿Puedes ver algún mensaje de error específico?',
                    'lento': 'Si tu computadora está lenta, intenta reiniciarla y cerrar programas innecesarios. También puedes limpiar archivos temporales.',
                    'internet': 'Para problemas de conexión, verifica que el cable esté conectado o que el Wi-Fi esté activado. Intenta reiniciar el router.',
                    'contraseña': 'Para recuperar tu contraseña, usa la opción "¿Olvidaste tu contraseña?" en la pantalla de inicio de sesión.',
                    'software': 'Para instalar software, asegúrate de tener permisos de administrador y suficiente espacio en disco.',
                    'email': 'Para problemas de email, verifica tu configuración de servidor y que tengas conexión a internet.'
                };

                await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay

                const lowerMessage = message.toLowerCase();
                let response = 'Gracias por tu consulta. Te recomiendo contactar a nuestro soporte técnico para una ayuda más específica.';

                for (const [key, value] of Object.entries(responses)) {
                    if (lowerMessage.includes(key)) {
                        response = value;
                        break;
                    }
                }

                return {
                    text: response,
                    confidence: 0.8,
                    category: 'general',
                    suggestions: ['¿Necesitas más ayuda?', 'Contactar soporte técnico'],
                    followUp: null
                };
            },
            resetConversation: () => console.log('🔄 Conversation reset'),
            exportConversation: () => JSON.stringify({ messages: [], timestamp: new Date() }),
            getSessionStats: () => ({ messages: 0, session: 'active' })
        };
    }

    setupEventListeners() {
        // Botón de envío
        if (this.sendButton) {
            this.sendButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Enter en campo de entrada
        if (this.inputField) {
            this.inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            if (this.inputField.tagName === 'TEXTAREA') {
                this.inputField.addEventListener('input', () => {
                    this.autoResizeTextarea();
                    this.updateCharCounter();
                });
            } else {
                this.inputField.addEventListener('input', () => {
                    this.updateCharCounter();
                });
            }
        }

        // Contador de caracteres inicial
        this.updateCharCounter();

        console.log('🎯 Event listeners configured');
    }

    updateCharCounter() {
        if (this.charCounter && this.inputField) {
            const length = this.inputField.value.length;
            const maxLength = this.inputField.getAttribute('maxlength') || 500;
            this.charCounter.textContent = `${length}/${maxLength}`;
            
            // Habilitar/deshabilitar botón de envío
            if (this.sendButton) {
                this.sendButton.disabled = length === 0 || length > maxLength;
            }
        }
    }

    autoResizeTextarea() {
        if (this.inputField.tagName === 'TEXTAREA') {
            this.inputField.style.height = 'auto';
            this.inputField.style.height = Math.min(this.inputField.scrollHeight, 120) + 'px';
        }
    }

    createTypingIndicator() {
        this.typingIndicator = document.createElement('div');
        this.typingIndicator.className = 'typing-indicator-hp';
        this.typingIndicator.style.cssText = `
            display: none;
            padding: 12px 16px;
            background: white;
            border: 1px solid #e5e5e5;
            margin: 8px 0;
            max-width: 70%;
            align-self: flex-start;
        `;
        
        this.typingIndicator.innerHTML = `
            <div class="typing-dots-hp" style="display: flex; gap: 4px; align-items: center;">
                <span style="width: 8px; height: 8px; background: #0096D6; border-radius: 50%; animation: typing-hp 1.4s infinite ease-in-out;"></span>
                <span style="width: 8px; height: 8px; background: #0096D6; border-radius: 50%; animation: typing-hp 1.4s infinite ease-in-out; animation-delay: 0.2s;"></span>
                <span style="width: 8px; height: 8px; background: #0096D6; border-radius: 50%; animation: typing-hp 1.4s infinite ease-in-out; animation-delay: 0.4s;"></span>
            </div>
            <style>
                @keyframes typing-hp {
                    0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
                    30% { transform: scale(1.2); opacity: 1; }
                }
            </style>
        `;
    }

    showWelcomeMessage() {
        const welcomeMessage = {
            text: "¡Hola! 👋 Soy tu asistente virtual de HP. Estoy aquí para ayudarte con cualquier problema técnico que tengas. ¿En qué puedo asistirte hoy?",
            isBot: true,
            timestamp: new Date(),
            suggestions: [
                "Mi impresora no funciona",
                "Mi PC está muy lento", 
                "Problemas de conexión",
                "Recuperar contraseña"
            ]
        };

        setTimeout(() => {
            this.displayMessage(welcomeMessage);
        }, 500);
    }

    async sendMessage(messageText = null) {
        if (!this.isInitialized) {
            console.warn('⚠️ Chat interface not initialized');
            return;
        }

        const text = messageText || this.inputField?.value?.trim();
        
        if (!text) return;

        // Limpiar campo de entrada
        if (this.inputField && !messageText) {
            this.inputField.value = '';
            this.updateCharCounter();
            if (this.inputField.tagName === 'TEXTAREA') {
                this.inputField.style.height = 'auto';
            }
        }

        // Mostrar mensaje del usuario
        this.displayMessage({
            text: text,
            isBot: false,
            timestamp: new Date()
        });

        // Mostrar indicador de escritura
        this.showTyping();

        try {
            // Procesar con el bot
            const response = await this.bot.processMessage(text);
            
            // Ocultar indicador de escritura
            this.hideTyping();
            
            // Mostrar respuesta del bot
            this.displayMessage({
                text: response.text,
                isBot: true,
                timestamp: new Date(),
                confidence: response.confidence,
                category: response.category,
                suggestions: response.suggestions,
                followUp: response.followUp
            });

        } catch (error) {
            console.error('❌ Error processing message:', error);
            this.hideTyping();
            
            this.displayMessage({
                text: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo o contacta al soporte técnico.",
                isBot: true,
                timestamp: new Date(),
                isError: true
            });
        }
    }

    displayMessage(message) {
        if (!this.messagesContainer) {
            console.error('❌ Messages container not available');
            return;
        }

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message-hp ${message.isBot ? 'bot-message-hp' : 'user-message-hp'}`;
        
        // Estilo base del mensaje
        const baseStyle = `
            margin: 12px 0;
            padding: 12px 16px;
            max-width: 80%;
            word-wrap: break-word;
            animation: slideInMessage 0.3s ease-out;
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;

        if (message.isBot) {
            messageElement.style.cssText = baseStyle + `
                background: white;
                border: 1px solid #e5e5e5;
                align-self: flex-start;
                color: #333;
            `;
        } else {
            messageElement.style.cssText = baseStyle + `
                background: #0096D6;
                color: white;
                align-self: flex-end;
                border: 1px solid #007BB5;
            `;
        }

        // Contenido del mensaje
        let messageContent = `
            <div class="message-text-hp" style="font-size: 0.9rem; line-height: 1.4;">
                ${this.formatMessageText(message.text)}
            </div>
            <div class="message-time-hp" style="
                font-size: 0.75rem;
                opacity: 0.7;
                margin-top: 4px;
                ${message.isBot ? 'text-align: left' : 'text-align: right'};
            ">
                ${this.formatTime(message.timestamp)}
            </div>
        `;

        messageElement.innerHTML = messageContent;
        
        // Configurar contenedor como flexbox si no lo está
        if (!this.messagesContainer.style.display) {
            this.messagesContainer.style.display = 'flex';
            this.messagesContainer.style.flexDirection = 'column';
        }
        
        this.messagesContainer.appendChild(messageElement);

        // Agregar sugerencias si las hay
        if (message.suggestions && message.suggestions.length > 0) {
            this.addSuggestions(message.suggestions);
        }

        // Scroll al final
        this.scrollToBottom();

        // Pregunta de seguimiento
        if (message.followUp) {
            setTimeout(() => {
                this.displayMessage({
                    text: message.followUp,
                    isBot: true,
                    timestamp: new Date(),
                    isFollowUp: true
                });
            }, 1500);
        }
    }

    formatMessageText(text) {
        // Convertir saltos de línea
        text = text.replace(/\n/g, '<br>');
        
        // Convertir formateo básico
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return text;
    }

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    addSuggestions(suggestions) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'chat-suggestions-hp';
        suggestionsContainer.style.cssText = `
            margin: 8px 0 16px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            align-self: flex-start;
        `;

        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn-hp';
            button.textContent = suggestion;
            button.style.cssText = `
                background: #f8f9fa;
                border: 1px solid #e5e5e5;
                color: #333;
                padding: 6px 12px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.background = '#0096D6';
                button.style.color = 'white';
                button.style.borderColor = '#0096D6';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = '#f8f9fa';
                button.style.color = '#333';
                button.style.borderColor = '#e5e5e5';
            });

            button.addEventListener('click', () => {
                this.sendMessage(suggestion);
            });

            suggestionsContainer.appendChild(button);
        });

        this.messagesContainer.appendChild(suggestionsContainer);
        this.scrollToBottom();
    }

    showTyping() {
        if (this.typingIndicator && this.messagesContainer) {
            this.typingIndicator.style.display = 'block';
            this.messagesContainer.appendChild(this.typingIndicator);
            this.scrollToBottom();
        }
    }

    hideTyping() {
        if (this.typingIndicator && this.typingIndicator.parentNode) {
            this.typingIndicator.style.display = 'none';
            this.typingIndicator.remove();
        }
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    handleUrlQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        
        if (searchQuery) {
            // Mostrar la consulta en el campo de entrada
            if (this.inputField) {
                this.inputField.value = searchQuery;
                this.updateCharCounter();
            }
            
            // Enviar automáticamente después de un delay
            setTimeout(() => {
                this.sendMessage(searchQuery);
            }, 2000);
        }
    }

    // Métodos públicos para uso externo
    clearChat() {
        if (this.messagesContainer) {
            this.messagesContainer.innerHTML = '';
        }
        if (this.bot && this.bot.resetConversation) {
            this.bot.resetConversation();
        }
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 300);
    }

    exportChat() {
        try {
            const exportData = this.bot ? this.bot.exportConversation() : 
                JSON.stringify({ messages: [], timestamp: new Date() });
            
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('❌ Error exporting chat:', error);
        }
    }

    getSessionStats() {
        return this.bot ? this.bot.getSessionStats() : { messages: 0, session: 'active' };
    }
}

// Función global para envío desde botones externos
function sendMessage(message) {
    if (window.chatInterface && window.chatInterface.isInitialized) {
        window.chatInterface.sendMessage(message);
    } else {
        console.warn('⚠️ Chat interface not ready, message queued:', message);
        // Intentar de nuevo después de un delay
        setTimeout(() => {
            if (window.chatInterface) {
                window.chatInterface.sendMessage(message);
            }
        }, 1000);
    }
}

// CSS para animaciones
const chatAnimationsStyle = document.createElement('style');
chatAnimationsStyle.textContent = `
    @keyframes slideInMessage {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(chatAnimationsStyle);

// Inicialización mejorada
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar en la página de autoatención
    if (document.querySelector('.autoatencion-hero') || 
        document.querySelector('.chat-main-section') ||
        window.location.pathname.includes('autoatencion')) {
        
        window.chatInterface = new ChatInterface();
        console.log('✅ Chat interface ready');
    }
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatInterface;
}