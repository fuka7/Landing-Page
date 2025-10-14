// ============================================
// CHATBOT MESA DE AYUDA HP-MINSAL
// Sistema optimizado para usuarios de tercera edad
// Hospitales y Centros de Salud
// ============================================

// Base de conocimientos del chatbot
const knowledgeBase = {
    // URLs y contactos
    urls: {
        sitio_web: 'https://www.mdshp.cl',
        crear_ticket: 'https://itsm.serviciosmds.cl/marketplace/formcreator/front/formdisplay.php?id=1',
        correo: 'mds@mdshp.cl'
    },
    
    // Respuestas a preguntas frecuentes
    responses: {
        greeting: [
            '¡Hola! 👋 Soy tu asistente para ayudarte con los computadores del hospital. ¿Qué problema tienes?\n\n💡 Si no sabes qué escribir, presiona el botón de abajo para ver las opciones.',
            '¡Buenos días! Estoy aquí para ayudarte con cualquier problema de tu computador o impresora. Cuéntame qué necesitas.\n\n💡 O presiona "Ver opciones" para elegir un problema común.'
        ],
        
        show_options: {
            text: '📋 Aquí están las opciones disponibles.\n\nElige el problema que tienes haciendo clic en cualquiera de las tarjetas de abajo:',
            showOptionsMenu: true
        },
        
        // ============================================
        // PROBLEMAS TÉCNICOS BÁSICOS
        // ============================================
        
        computador_no_enciende: {
            text: '🖥️ Si tu computador no enciende, prueba estos pasos SIMPLES:\n\n' +
                  '1️⃣ Revisa que el cable esté enchufado a la pared\n' +
                  '2️⃣ Verifica que el interruptor de atrás del computador esté en "ON" (I)\n' +
                  '3️⃣ Presiona el botón de encendido (el redondo con una línea)\n' +
                  '4️⃣ Si hay un estabilizador o regleta, verifica que esté encendido\n\n' +
                  '❌ Si nada funciona → Crear ticket de soporte',
            actions: ['crear_ticket']
        },
        
        pantalla_negra: {
            text: '📺 Si la pantalla está negra pero el computador hace ruido:\n\n' +
                  '1️⃣ Revisa que el cable de la pantalla esté bien conectado\n' +
                  '2️⃣ Presiona el botón de encendido de LA PANTALLA (no del computador)\n' +
                  '3️⃣ Verifica que el cable de corriente de la pantalla esté enchufado\n' +
                  '4️⃣ Mueve el mouse o presiona una tecla (puede estar en reposo)\n\n' +
                  '💡 Tip: La pantalla tiene su propio botón de encendido, generalmente abajo o al lado',
            actions: ['crear_ticket']
        },
        
        computador_lento: {
            text: '🐌 Si el computador está muy lento:\n\n' +
                  '✅ SOLUCIONES INMEDIATAS:\n' +
                  '• Cierra programas que no estés usando\n' +
                  '• Reinicia el computador (Inicio → Apagar → Reiniciar)\n' +
                  '• Espera 5 minutos después de encenderlo (se están cargando programas)\n\n' +
                  '⚠️ NO HAGAS:\n' +
                  '• No instales programas por tu cuenta\n' +
                  '• No descargues archivos desconocidos\n\n' +
                  'Si sigue lento después de reiniciar → Crear ticket',
            actions: ['crear_ticket', 'como_reiniciar']
        },
        
        olvide_contraseña: {
            text: '🔐 Si olvidaste tu contraseña de Windows:\n\n' +
                  '❗ IMPORTANTE: NO intentes adivinar muchas veces (se bloqueará)\n\n' +
                  '✅ SOLUCIÓN:\n' +
                  '1️⃣ Anota tu nombre de usuario (el que aparece en pantalla)\n' +
                  '2️⃣ Anota el nombre del computador (está en una etiqueta pegada)\n' +
                  '3️⃣ Crea un ticket con esta información\n\n' +
                  '⏱️ El técnico te llamará en el mismo día para ayudarte',
            actions: ['crear_ticket']
        },
        
        impresora_no_imprime: {
            text: '🖨️ Si la impresora no imprime:\n\n' +
                  '1️⃣ Verifica que tenga papel en la bandeja\n' +
                  '2️⃣ Revisa que la impresora esté encendida (luz verde)\n' +
                  '3️⃣ Mira si tiene mensajes de error en la pantallita\n' +
                  '4️⃣ Verifica el cable entre impresora y computador\n' +
                  '5️⃣ Intenta imprimir una página de prueba\n\n' +
                  '⚠️ Errores comunes:\n' +
                  '• "Sin toner" → Llamar a soporte\n' +
                  '• "Atasco de papel" → No forzar, llamar a soporte\n' +
                  '• Luz naranja parpadeando → Crear ticket',
            actions: ['crear_ticket', 'imprimir_prueba']
        },
        
        internet_no_funciona: {
            text: '🌐 Si no tienes internet:\n\n' +
                  '1️⃣ Mira si el ícono de red tiene una X roja (abajo a la derecha)\n' +
                  '2️⃣ Verifica el cable de red (cable azul o gris) esté bien conectado\n' +
                  '3️⃣ Pregunta a un compañero si su internet funciona\n' +
                  '4️⃣ Si solo tú no tienes → Reinicia el computador\n' +
                  '5️⃣ Si nadie tiene internet → El problema es general, ya lo están revisando\n\n' +
                  '💡 Si solo tú no tienes internet después de reiniciar → Crear ticket',
            actions: ['crear_ticket']
        },
        
        mouse_no_funciona: {
            text: '🖱️ Si el mouse no se mueve:\n\n' +
                  '✅ Para mouse CON CABLE:\n' +
                  '• Desconecta y vuelve a conectar el cable USB\n' +
                  '• Prueba en otro puerto USB (los huecos del computador)\n' +
                  '• Limpia la parte de abajo del mouse\n\n' +
                  '🔋 Para mouse INALÁMBRICO:\n' +
                  '• Cambia las pilas (2 pilas AA generalmente)\n' +
                  '• Presiona el botón ON/OFF debajo del mouse\n' +
                  '• Verifica que el receptor USB esté conectado\n\n' +
                  '💡 Mientras tanto puedes usar el teclado:\n' +
                  'TAB para moverte, ENTER para aceptar',
            actions: ['crear_ticket']
        },
        
        teclado_no_escribe: {
            text: '⌨️ Si el teclado no escribe:\n\n' +
                  '1️⃣ Desconecta y vuelve a conectar el cable\n' +
                  '2️⃣ Verifica que no tenga el cable dañado\n' +
                  '3️⃣ Prueba escribir en el Bloc de notas (para probar)\n' +
                  '4️⃣ Revisa que no tenga teclas atascadas o sucias\n\n' +
                  '🔋 Si es inalámbrico: Cambia las pilas\n\n' +
                  '⚠️ Si nada funciona → Necesitas un teclado nuevo → Crear ticket',
            actions: ['crear_ticket', 'abrir_bloc_notas']
        },
        
        mensaje_error: {
            text: '⚠️ Si aparece un mensaje de error en pantalla:\n\n' +
                  '📸 IMPORTANTE - Anota o toma foto de:\n' +
                  '• El mensaje completo (TODO el texto)\n' +
                  '• Qué estabas haciendo cuando apareció\n' +
                  '• La hora aproximada\n\n' +
                  '✅ Luego:\n' +
                  '• NO cierres el mensaje todavía\n' +
                  '• Llama a un compañero para que vea\n' +
                  '• Crea un ticket con esta información\n\n' +
                  '💡 Si dice "Comuníquese con el administrador" → Es urgente',
            actions: ['crear_ticket']
        },
        
        // ============================================
        // PROCEDIMIENTOS SIMPLES PASO A PASO
        // ============================================
        
        como_reiniciar: {
            text: '🔄 Cómo REINICIAR el computador correctamente:\n\n' +
                  '1️⃣ Haz clic en el botón de Windows (esquina inferior izquierda)\n' +
                  '2️⃣ Haz clic en el ícono de encendido ⏻\n' +
                  '3️⃣ Selecciona "Reiniciar" (NO "Apagar")\n' +
                  '4️⃣ Espera que se reinicie solo (2-3 minutos)\n\n' +
                  '⚠️ ANTES de reiniciar:\n' +
                  '• Guarda todo lo que estés trabajando\n' +
                  '• Cierra todos los programas abiertos\n\n' +
                  '❌ NO apagues desde el botón físico (excepto emergencias)',
            actions: []
        },
        
        como_apagar: {
            text: '⏻ Cómo APAGAR el computador correctamente:\n\n' +
                  '1️⃣ Guarda todo tu trabajo (Ctrl + G)\n' +
                  '2️⃣ Cierra todos los programas\n' +
                  '3️⃣ Haz clic en el botón de Windows\n' +
                  '4️⃣ Haz clic en el ícono de encendido ⏻\n' +
                  '5️⃣ Selecciona "Apagar"\n' +
                  '6️⃣ Espera que se apague completamente (las luces se apagan)\n\n' +
                  '⚠️ NUNCA apagues desde el botón de encendido\n' +
                  '(Puedes dañar archivos importantes)',
            actions: []
        },
        
        imprimir_prueba: {
            text: '🖨️ Cómo imprimir una página de prueba:\n\n' +
                  '1️⃣ Haz clic en el botón de Windows\n' +
                  '2️⃣ Escribe "impresoras" y presiona ENTER\n' +
                  '3️⃣ Busca tu impresora en la lista\n' +
                  '4️⃣ Haz clic derecho sobre ella\n' +
                  '5️⃣ Selecciona "Propiedades de impresora"\n' +
                  '6️⃣ Haz clic en "Imprimir página de prueba"\n\n' +
                  '✅ Si imprime → El problema está en tu programa\n' +
                  '❌ Si no imprime → Crear ticket',
            actions: ['crear_ticket']
        },
        
        abrir_bloc_notas: {
            text: '📝 Cómo abrir el Bloc de notas (para probar el teclado):\n\n' +
                  '1️⃣ Presiona la tecla Windows (tiene el logo de Windows)\n' +
                  '2️⃣ Escribe: bloc de notas\n' +
                  '3️⃣ Presiona ENTER\n' +
                  '4️⃣ Intenta escribir algo\n\n' +
                  '✅ Si escribe → El problema es del programa que usabas\n' +
                  '❌ Si no escribe → El teclado tiene problemas',
            actions: []
        },
        
        // ============================================
        // CREAR TICKETS Y CONTACTO
        // ============================================
        
        crear_ticket_web: {
            text: '📝 Cómo PEDIR AYUDA (Crear ticket):\n\n' +
                  '🌐 Opción 1 - Por Internet:\n' +
                  '1️⃣ Entra a: www.mdshp.cl\n' +
                  '2️⃣ Haz clic en "Crear Ticket"\n' +
                  '3️⃣ Completa el formulario\n' +
                  '4️⃣ Describe tu problema con DETALLE\n\n' +
                  '📧 Opción 2 - Por correo:\n' +
                  'Envía un correo a: mds@mdshp.cl\n\n' +
                  '📞 Te llamarán el mismo día o al día siguiente',
            actions: ['crear_ticket', 'que_datos_necesito']
        },
        
        que_datos_necesito: {
            text: '📋 Información que debes dar al crear un ticket:\n\n' +
                  '✅ OBLIGATORIO:\n' +
                  '• Tu nombre completo\n' +
                  '• Tu correo del hospital\n' +
                  '• Tu teléfono\n' +
                  '• Ubicación (Hospital, piso, servicio)\n' +
                  '• ¿Qué problema tienes? (explica con detalle)\n\n' +
                  '💡 MUY ÚTIL (si lo sabes):\n' +
                  '• Número del computador (etiqueta pegada)\n' +
                  '• ¿Cuándo empezó el problema?\n' +
                  '• ¿El problema es solo tuyo o de varias personas?\n\n' +
                  '⏱️ ¿Qué tan urgente es?\n' +
                  '• MUY URGENTE: No puedo trabajar\n' +
                  '• URGENTE: Puedo trabajar pero con dificultad\n' +
                  '• NORMAL: Puedo esperar',
            actions: ['crear_ticket']
        },
        
        cuanto_demora: {
            text: '⏱️ Tiempos de respuesta:\n\n' +
                  '🔴 URGENCIAS (computador no funciona):\n' +
                  '• Te llaman el MISMO DÍA\n' +
                  '• Técnico va en 4-8 horas\n\n' +
                  '🟡 PROBLEMAS NORMALES:\n' +
                  '• Te llaman en 1-2 días\n' +
                  '• Técnico va en 2-3 días\n\n' +
                  '🟢 CONSULTAS SIMPLES:\n' +
                  '• Respuesta por correo en 1-2 días\n\n' +
                  '📧 Recibirás un correo con:\n' +
                  '• Número de tu caso (guárdalo)\n' +
                  '• Quién lo está revisando\n' +
                  '• Estado de tu solicitud',
            actions: []
        },
        
        // ============================================
        // PREGUNTAS SOBRE EL SERVICIO
        // ============================================
        
        horario_atencion: {
            text: '🕐 Horarios de atención:\n\n' +
                  '📞 Mesa de Ayuda (tickets):\n' +
                  '• Lunes a Viernes: 8:30 - 18:00 hrs\n' +
                  '• Puedes crear tickets 24/7 por internet\n\n' +
                  '🚨 EMERGENCIAS fuera de horario:\n' +
                  '• Solo para problemas CRÍTICOS\n' +
                  '• Marca como "MUY URGENTE" en el ticket\n' +
                  '• Ejemplo: Servidor caído, sistema no funciona\n\n' +
                  '❌ NO son emergencias:\n' +
                  '• Olvidé mi contraseña\n' +
                  '• Impresora sin papel\n' +
                  '• Mouse dañado (usa el teclado mientras tanto)',
            actions: []
        },
        
        quien_puede_pedir_ayuda: {
            text: '👥 ¿Quién puede pedir ayuda?\n\n' +
                  '✅ PUEDEN crear tickets:\n' +
                  '• Todo el personal del hospital\n' +
                  '• Médicos, enfermeras, administrativos\n' +
                  '• Cualquier persona que use equipos del hospital\n\n' +
                  '📝 Solo necesitas:\n' +
                  '• Correo institucional del hospital\n' +
                  '• Nombre completo\n' +
                  '• Ubicación donde trabajas\n\n' +
                  '💡 Si eres nuevo y no tienes correo:\n' +
                  '• Pídele a tu jefe que cree el ticket\n' +
                  '• O crea el ticket con el correo de tu área',
            actions: ['crear_ticket']
        },
        
        que_problemas_resuelven: {
            text: '🔧 ¿Qué problemas podemos resolver?\n\n' +
                  '✅ SÍ ayudamos con:\n' +
                  '• Computadores que no funcionan\n' +
                  '• Problemas de Windows\n' +
                  '• Impresoras\n' +
                  '• Internet\n' +
                  '• Correo electrónico\n' +
                  '• Programas del hospital\n' +
                  '• Mouse y teclado\n' +
                  '• Contraseñas olvidadas\n\n' +
                  '❌ NO ayudamos con:\n' +
                  '• Celulares personales\n' +
                  '• WhatsApp\n' +
                  '• Facebook, Instagram\n' +
                  '• Computadores personales de la casa',
            actions: ['crear_ticket']
        },
        
        // ============================================
        // RESPUESTA POR DEFECTO
        // ============================================
        
        default: {
            text: '🤔 No estoy seguro de entender tu pregunta.\n\n' +
                  'Puedo ayudarte con:\n\n' +
                  '💻 PROBLEMAS TÉCNICOS:\n' +
                  '• "El computador no enciende"\n' +
                  '• "La pantalla está negra"\n' +
                  '• "Está muy lento"\n' +
                  '• "Olvidé mi contraseña"\n' +
                  '• "La impresora no imprime"\n' +
                  '• "No tengo internet"\n\n' +
                  '❓ DUDAS GENERALES:\n' +
                  '• "¿Cómo pido ayuda?"\n' +
                  '• "¿Cuánto demoran?"\n' +
                  '• "¿Qué datos necesito?"\n\n' +
                  '🔄 O escribe: "Reiniciar", "Apagar", "Imprimir"\n\n' +
                  'Escribe tu pregunta de otra forma o elige una de arriba 👆',
            actions: ['crear_ticket']
        }
    }
};

// Estado del chat
let chatState = {
    messages: [],
    isTyping: false
};

// ============================================
// FUNCIÓN PARA IDENTIFICAR LA INTENCIÓN
// ============================================

function identifyIntent(message) {
    const msg = message.toLowerCase().trim();
    
    // Saludos
    if (/^(hola|hi|hey|buenos|buenas|saludos|buenas\s*tardes|buenas\s*días)/i.test(msg)) {
        return 'greeting';
    }
    
    // Ver opciones / menú
    if (/(ver|mostrar|dame).*(opciones|men[uú]|lista)/i.test(msg) ||
        /^(opciones|men[uú])$/i.test(msg)) {
        return 'show_options';
    }
    
    // Computador no enciende
    if (/(computador|computadora|pc|equipo).*(no\s*enciende|no\s*prende|no\s*funciona|muerto|apagado)/i.test(msg) ||
        /(no\s*enciende|no\s*prende).*(computador|pc|equipo)/i.test(msg) ||
        /no\s*arranca/i.test(msg)) {
        return 'computador_no_enciende';
    }
    
    // Pantalla negra
    if (/(pantalla|monitor).*(negra|negro|oscura|no\s*se\s*ve|apagada)/i.test(msg) ||
        /(negra|negro|oscura).*(pantalla|monitor)/i.test(msg)) {
        return 'pantalla_negra';
    }
    
    // Computador lento
    if (/(computador|pc|equipo).*(lento|lenta|demora|tarda|se\s*pega|se\s*cuelga|se\s*traba)/i.test(msg) ||
        /(lento|lenta|demora).*(computador|pc)/i.test(msg)) {
        return 'computador_lento';
    }
    
    // Contraseña olvidada
    if (/(olvid[eé]|no\s*me\s*acuerdo|no\s*s[eé]).*(contrase[ñn]a|clave|password)/i.test(msg) ||
        /(contrase[ñn]a|clave).*(olvid|no\s*me\s*acuerdo)/i.test(msg) ||
        /no\s*puedo\s*entrar/i.test(msg)) {
        return 'olvide_contraseña';
    }
    
    // Impresora
    if (/(impresora|imprimir).*(no\s*funciona|no\s*imprime|no\s*sale|atascada|trabada|error)/i.test(msg) ||
        /no\s*puedo\s*imprimir/i.test(msg)) {
        return 'impresora_no_imprime';
    }
    
    // Internet
    if (/(internet|red|conexi[oó]n).*(no\s*funciona|no\s*hay|ca[ií]da|perdida)/i.test(msg) ||
        /no\s*tengo\s*(internet|red|conexi[oó]n)/i.test(msg) ||
        /(sin|no\s*hay)\s*internet/i.test(msg)) {
        return 'internet_no_funciona';
    }
    
    // Mouse
    if (/(mouse|rat[oó]n).*(no\s*funciona|no\s*se\s*mueve|muerto|bloqueado)/i.test(msg) ||
        /(no\s*funciona|no\s*se\s*mueve).*(mouse|rat[oó]n)/i.test(msg)) {
        return 'mouse_no_funciona';
    }
    
    // Teclado
    if (/(teclado).*(no\s*funciona|no\s*escribe|no\s*responde|muerto)/i.test(msg) ||
        /(no\s*funciona|no\s*escribe).*(teclado)/i.test(msg)) {
        return 'teclado_no_escribe';
    }
    
    // Mensajes de error
    if (/(mensaje|ventana|aviso).*(error|problema)/i.test(msg) ||
        /(aparece|sali[oó]|sale).*(error|mensaje|ventana)/i.test(msg)) {
        return 'mensaje_error';
    }
    
    // Cómo reiniciar
    if (/(c[oó]mo|como).*(reiniciar|reinicio)/i.test(msg) ||
        /reiniciar/i.test(msg)) {
        return 'como_reiniciar';
    }
    
    // Cómo apagar
    if (/(c[oó]mo|como).*(apagar|apago)/i.test(msg) ||
        /apagar/i.test(msg)) {
        return 'como_apagar';
    }
    
    // Imprimir prueba
    if (/(imprimir|impresora).*(prueba|test)/i.test(msg)) {
        return 'imprimir_prueba';
    }
    
    // Abrir bloc de notas
    if (/bloc\s*de\s*notas/i.test(msg)) {
        return 'abrir_bloc_notas';
    }
    
    // Crear ticket
    if (/(c[oó]mo|como).*(crear|hacer|pedir).*(ticket|ayuda|soporte)/i.test(msg) ||
        /(crear|hacer|pedir).*(ticket|ayuda|soporte)/i.test(msg) ||
        /(necesito|quiero|solicitar)\s*ayuda/i.test(msg)) {
        return 'crear_ticket_web';
    }
    
    // Qué datos necesito
    if (/(qu[eé]|que).*(datos|informaci[oó]n).*(necesito|debo|tengo)/i.test(msg) ||
        /(datos|informaci[oó]n).*(necesaria|necesito|debo)/i.test(msg)) {
        return 'que_datos_necesito';
    }
    
    // Cuánto demora
    if (/(cu[aá]nto|cuanto).*(demora|tarda|tiempo)/i.test(msg) ||
        /(tiempo|demora).*(respuesta|atenci[oó]n)/i.test(msg)) {
        return 'cuanto_demora';
    }
    
    // Horario
    if (/(horario|hora).*(atenci[oó]n|atienden)/i.test(msg) ||
        /(qu[eé]|a\s*qu[eé])\s*hora/i.test(msg)) {
        return 'horario_atencion';
    }
    
    // Quién puede pedir ayuda
    if (/(qui[eé]n|quienes).*(puede|pueden).*(pedir|solicitar)/i.test(msg) ||
        /puedo\s*pedir\s*ayuda/i.test(msg)) {
        return 'quien_puede_pedir_ayuda';
    }
    
    // Qué problemas resuelven
    if (/(qu[eé]|que).*(problemas|cosas).*(resuelven|arreglan|ayudan)/i.test(msg) ||
        /(en\s*qu[eé]|con\s*qu[eé]).*(ayudan|pueden)/i.test(msg)) {
        return 'que_problemas_resuelven';
    }
    
    return 'default';
}

// ============================================
// FUNCIONES DE MENSAJERÍA
// ============================================

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    // Agregar mensaje del usuario
    addMessage(message, 'user');
    input.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    // Simular tiempo de respuesta
    setTimeout(() => {
        hideTypingIndicator();
        const intent = identifyIntent(message);
        const response = knowledgeBase.responses[intent] || knowledgeBase.responses.default;
        
        // Si la respuesta es de tipo texto (string), es un saludo
        if (typeof response === 'string' || Array.isArray(response)) {
            const text = Array.isArray(response) ? response[Math.floor(Math.random() * response.length)] : response;
            addBotMessage({ 
                text, 
                actions: [{
                    text: '💡 Ver opciones',
                    action: 'show_options'
                }] 
            });
        } else if (response.showOptionsMenu) {
            // Si la respuesta pide mostrar el menú directamente
            addBotMessage({ text: response.text, actions: [] });
            setTimeout(() => showOptionsMenu(), 300);
        } else {
            // Respuesta normal
            addBotMessage(response);
        }
    }, 800 + Math.random() * 700);
}

function sendSuggestion(suggestion) {
    document.getElementById('chatInput').value = suggestion;
    sendMessage();
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Remover pantalla de bienvenida si existe
    const welcomeScreen = messagesContainer.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatState.messages.push({ text, sender, time });
}

function addBotMessage(response) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    const time = new Date().toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    let actionsHTML = '';
    if (response.actions && response.actions.length > 0) {
        actionsHTML = '<div class="quick-replies">';
        response.actions.forEach(action => {
            switch(action) {
                case 'crear_ticket':
                    actionsHTML += `<a href="${knowledgeBase.urls.crear_ticket}" target="_blank" class="link-button"><i class="bi bi-ticket-perforated"></i> Crear Ticket Ahora</a>`;
                    break;
                case 'como_reiniciar':
                    actionsHTML += `<button class="quick-reply-btn" onclick="sendSuggestion('¿Cómo reinicio el computador?')">🔄 Cómo reiniciar</button>`;
                    break;
                case 'imprimir_prueba':
                    actionsHTML += `<button class="quick-reply-btn" onclick="sendSuggestion('¿Cómo imprimo una página de prueba?')">🖨️ Imprimir prueba</button>`;
                    break;
                case 'abrir_bloc_notas':
                    actionsHTML += `<button class="quick-reply-btn" onclick="sendSuggestion('¿Cómo abro el bloc de notas?')">📝 Abrir Bloc de notas</button>`;
                    break;
                case 'que_datos_necesito':
                    actionsHTML += `<button class="quick-reply-btn" onclick="sendSuggestion('¿Qué datos necesito dar?')">📋 Qué datos necesito</button>`;
                    break;
            }
        });
        actionsHTML += '</div>';
    }
    
    // Agregar siempre el botón de "Volver a las opciones"
    const backButtonHTML = `
        <div class="back-to-options">
            <button class="back-btn" onclick="showOptionsMenu()">
                <i class="bi bi-arrow-left-circle"></i> Ver otras opciones
            </button>
        </div>
    `;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble">${response.text.replace(/\n/g, '<br>')}</div>
            ${actionsHTML}
            ${backButtonHTML}
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// MOSTRAR MENÚ DE OPCIONES
// ============================================

function showOptionsMenu() {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Eliminar la pantalla de bienvenida si existe
    const existingWelcome = messagesContainer.querySelector('.welcome-screen');
    if (existingWelcome) {
        existingWelcome.remove();
    }
    
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'message bot-message';
    
    optionsDiv.innerHTML = `
        <div class="welcome-screen" style="margin: 20px 0;">
            <div class="welcome-icon">💡</div>
            <h2>¿En qué más puedo ayudarte?</h2>
            <p>Selecciona una de las siguientes opciones o escribe tu pregunta:</p>
            <div class="suggested-questions">
                <div class="suggestion-card" onclick="sendSuggestion('El computador no enciende')">
                    <i class="bi bi-pc-display"></i>
                    El computador no enciende
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('La pantalla está negra')">
                    <i class="bi bi-display"></i>
                    La pantalla está negra
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('El computador está muy lento')">
                    <i class="bi bi-hourglass-split"></i>
                    El computador está muy lento
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('Olvidé mi contraseña')">
                    <i class="bi bi-lock"></i>
                    Olvidé mi contraseña
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('La impresora no imprime')">
                    <i class="bi bi-printer"></i>
                    La impresora no imprime
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('No tengo internet')">
                    <i class="bi bi-wifi-off"></i>
                    No tengo internet
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('El mouse no funciona')">
                    <i class="bi bi-mouse"></i>
                    Mouse no funciona
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('El teclado no escribe')">
                    <i class="bi bi-keyboard"></i>
                    Teclado no escribe
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('¿Cómo pido ayuda?')">
                    <i class="bi bi-question-circle"></i>
                    ¿Cómo pido ayuda?
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('¿Cuánto demoran?')">
                    <i class="bi bi-clock"></i>
                    ¿Cuánto demoran?
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('¿Cómo reinicio?')">
                    <i class="bi bi-arrow-clockwise"></i>
                    ¿Cómo reinicio?
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('¿Cómo apago?')">
                    <i class="bi bi-power"></i>
                    ¿Cómo apago?
                </div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(optionsDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// INDICADOR DE ESCRITURA
// ============================================

function showTypingIndicator() {
    chatState.isTyping = true;
    const messagesContainer = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    chatState.isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ============================================
// MANEJADORES DE EVENTOS
// ============================================

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Chatbot para tercera edad inicializado correctamente');
    document.getElementById('chatInput').focus();
});