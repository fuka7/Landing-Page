// ============================================
// TUTORIAL VIDEO MANAGER - Sistema de Gestión
// ============================================

// Función para actualizar el badge de tipo de archivo
function updateTypeBadge(type, source) {
    const badge = document.getElementById('tutorialTypeBadge');
    if (!badge) return;
    
    // Limpiar clases previas
    badge.className = 'tutorial-type-badge';
    
    let icon = 'bi-file-earmark';
    let text = 'ARCHIVO';
    let badgeClass = 'document';
    
    if (source === 'youtube' || type === 'youtube') {
        icon = 'bi-youtube';
        text = 'YOUTUBE';
        badgeClass = 'youtube';
    } else if (type === 'video') {
        icon = 'bi-camera-video';
        text = 'VIDEO';
        badgeClass = 'video';
    } else if (type === 'document') {
        icon = 'bi-file-earmark-text';
        text = 'DOCUMENTO';
        badgeClass = 'document';
    } else if (type === 'image') {
        icon = 'bi-image';
        text = 'IMAGEN';
        badgeClass = 'image';
    }
    
    badge.classList.add(badgeClass);
    badge.innerHTML = `
        <i class="${icon}"></i>
        <span>${text}</span>
    `;
}

// Función para actualizar el badge del documento según su tipo
function updateDocumentBadge(fileName) {
    const documentBadge = document.querySelector('#documentContainer .featured-badge');
    const documentIcon = document.getElementById('documentIcon');
    const badgeIcon = document.getElementById('documentBadgeIcon');
    const badgeText = document.getElementById('documentBadgeText');
    
    if (!fileName) return;
    
    let icon = 'bi-file-earmark-text';
    let text = 'Documento';
    let badgeClass = 'document';
    
    const extension = fileName.toLowerCase().split('.').pop();
    
    if (extension === 'pdf') {
        icon = 'bi-file-earmark-pdf';
        text = 'PDF';
    } else if (extension === 'doc' || extension === 'docx') {
        icon = 'bi-file-earmark-word';
        text = 'Word';
    } else if (extension === 'xls' || extension === 'xlsx') {
        icon = 'bi-file-earmark-excel';
        text = 'Excel';
    } else if (extension === 'ppt' || extension === 'pptx') {
        icon = 'bi-file-earmark-ppt';
        text = 'PowerPoint';
    } else if (extension === 'zip' || extension === 'rar') {
        icon = 'bi-file-earmark-zip';
        text = 'Comprimido';
    }
    
    if (documentIcon) {
        documentIcon.className = `bi ${icon}`;
    }
    
    if (badgeIcon) {
        badgeIcon.className = `bi ${icon}`;
    }
    
    if (badgeText) {
        badgeText.textContent = text;
    }
    
    if (documentBadge) {
        documentBadge.className = `featured-badge ${badgeClass}`;
    }
}

// ============================================
// CLASE PRINCIPAL: TutorialVideoManager
// ============================================
class TutorialVideoManager {
    constructor() {
        this.currentVideoData = null;
        this.isYouTubeVideo = false;
        this.videoPlayer = null;
        this.lastVideoId = null;
        this.checkInterval = null;
        
        // Elementos del DOM
        this.elements = {
            featuredTutorial: document.getElementById('featuredTutorial'),
            emptyState: document.getElementById('emptyTutorialState'),
            loadingState: document.getElementById('loadingTutorialState'),
            errorState: document.getElementById('errorTutorialState'),
            tutorialTitle: document.getElementById('tutorialTitle'),
            tutorialDescription: document.getElementById('tutorialDescription'),
            youtubeContainer: document.getElementById('youtubeContainer'),
            youtubePlayer: document.getElementById('youtubePlayer'),
            documentContainer: document.getElementById('documentContainer'),
            documentTitle: document.getElementById('documentTitle'),
            documentDownload: document.getElementById('documentDownload'),
            videoWrapper: document.getElementById('videoWrapper'),
            localVideo: document.getElementById('localVideo'),
            imageWrapper: document.getElementById('imageWrapper'),
            tutorialImage: document.getElementById('tutorialImage')
        };

        this.init();
    }

    init() {
        console.log('🎥 Inicializando Tutorial Video Manager...');
        this.loadLatestTutorial();
        this.setupEventListeners();
        this.startPeriodicCheck();
    }

    // Cargar el tutorial más reciente desde localStorage
    loadLatestTutorial = () => {
        try {
            const uploadedFiles = localStorage.getItem('mdshp_uploaded_files');
            
            if (!uploadedFiles) {
                console.log('📂 No hay archivos subidos');
                this.showEmpty();
                return;
            }

            const files = JSON.parse(uploadedFiles);
            
            // Filtrar archivos soportados
            const supportedFiles = files.filter(file => 
                file.type === 'video' || 
                file.type === 'youtube' || 
                file.type === 'document' ||
                file.source === 'youtube'
            ).sort((a, b) => b.id - a.id);

            if (supportedFiles.length === 0) {
                console.log('📂 No hay archivos disponibles');
                this.showEmpty();
                return;
            }

            const latestFile = supportedFiles[0];
            const previousFileId = this.lastVideoId;
            
            // Solo actualizar si es un archivo diferente
            if (this.lastVideoId !== latestFile.id) {
                console.log('✅ Cargando nuevo tutorial:', latestFile.title);
                this.lastVideoId = latestFile.id;
                this.loadFile(latestFile);
                
                // Mostrar notificación si había un archivo anterior
                if (previousFileId !== null && latestFile.id > previousFileId) {
                    this.showNewTutorialNotification(latestFile.title);
                }
            }

        } catch (error) {
            console.error('❌ Error cargando tutorial:', error);
            this.showError();
        }
    }

    // Cargar archivo específico
    loadFile = (fileData) => {
        this.currentVideoData = fileData;
        this.hideAllContainers();
        this.updateTutorialInfo(fileData);
        
        // Actualizar badge de tipo
        updateTypeBadge(fileData.type, fileData.source);

        console.log('📄 Tipo de archivo:', fileData.type);

        if (fileData.source === 'youtube' && fileData.youtubeData?.id) {
            this.loadYouTubeVideo(fileData);
        } else if (fileData.type === 'video') {
            this.loadLocalVideo(fileData);
        } else if (fileData.type === 'document') {
            this.loadDocument(fileData);
        } else if (fileData.type === 'image') {
            this.loadImage(fileData);
        } else {
            console.warn('⚠️ Tipo de archivo no reconocido:', fileData);
            this.showEmpty();
        }
    }

    // Cargar video de YouTube
    loadYouTubeVideo = (videoData) => {
        console.log('📺 Cargando video de YouTube:', videoData.youtubeData.id);
        
        this.elements.featuredTutorial.style.display = 'block';
        this.elements.youtubeContainer.style.display = 'block';
        
        const videoId = videoData.youtubeData.id;
        this.elements.youtubePlayer.src = 
            `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`;
    }

    // Cargar video local
    loadLocalVideo = (videoData) => {
        console.log('🎞️ Cargando video local:', videoData.fileName);
        
        this.elements.featuredTutorial.style.display = 'block';
        this.elements.videoWrapper.style.display = 'block';
        
        if (videoData.filePath) {
            this.elements.localVideo.src = videoData.filePath;
        } else if (videoData.videoUrl) {
            this.elements.localVideo.src = videoData.videoUrl;
        }
    }

    // Cargar documento
    loadDocument = (fileData) => {
        console.log('📄 Cargando documento:', fileData.fileName);
        
        this.elements.featuredTutorial.style.display = 'block';
        this.elements.documentContainer.style.display = 'block';
        
        // Actualizar título
        if (this.elements.documentTitle) {
            this.elements.documentTitle.textContent = fileData.title || fileData.fileName;
        }
        
        // Actualizar enlace de descarga
        if (this.elements.documentDownload) {
            if (fileData.fileContent) {
                this.elements.documentDownload.href = fileData.fileContent;
                this.elements.documentDownload.download = fileData.fileName;
            } else if (fileData.filePath) {
                this.elements.documentDownload.href = fileData.filePath;
                this.elements.documentDownload.download = fileData.fileName;
            }
        }
        
        // Actualizar badge del documento
        updateDocumentBadge(fileData.fileName);
        
        console.log('📄 Documento cargado correctamente');
    }

    // Cargar imagen
    loadImage = (imageData) => {
        console.log('🖼️ Cargando imagen:', imageData.fileName);
        
        this.elements.featuredTutorial.style.display = 'block';
        this.elements.imageWrapper.style.display = 'block';
        
        if (this.elements.tutorialImage) {
            if (imageData.filePath) {
                this.elements.tutorialImage.src = imageData.filePath;
            } else if (imageData.imageUrl) {
                this.elements.tutorialImage.src = imageData.imageUrl;
            }
        }
    }

    // Actualizar información del tutorial
    updateTutorialInfo = (fileData) => {
        if (this.elements.tutorialTitle) {
            this.elements.tutorialTitle.textContent = fileData.title || 'Tutorial';
        }
        if (this.elements.tutorialDescription) {
            this.elements.tutorialDescription.textContent = fileData.description || 'Nuevo tutorial disponible';
        }
    }

    // Ocultar todos los contenedores
    hideAllContainers = () => {
        if (this.elements.youtubeContainer) this.elements.youtubeContainer.style.display = 'none';
        if (this.elements.documentContainer) this.elements.documentContainer.style.display = 'none';
        if (this.elements.videoWrapper) this.elements.videoWrapper.style.display = 'none';
        if (this.elements.imageWrapper) this.elements.imageWrapper.style.display = 'none';
        if (this.elements.emptyState) this.elements.emptyState.style.display = 'none';
        if (this.elements.loadingState) this.elements.loadingState.style.display = 'none';
        if (this.elements.errorState) this.elements.errorState.style.display = 'none';
    }

    // Mostrar estado vacío
    showEmpty = () => {
        console.log('📄 Mostrando estado vacío');
        this.hideAllContainers();
        if (this.elements.featuredTutorial) this.elements.featuredTutorial.style.display = 'none';
        if (this.elements.emptyState) this.elements.emptyState.style.display = 'flex';
        this.lastVideoId = null;
    }

    // Mostrar estado de error
    showError = () => {
        console.log('❌ Mostrando estado de error');
        this.hideAllContainers();
        if (this.elements.featuredTutorial) this.elements.featuredTutorial.style.display = 'none';
        if (this.elements.errorState) this.elements.errorState.style.display = 'flex';
    }

    // Configurar event listeners
    setupEventListeners = () => {
        // Escuchar cambios en localStorage (para otras pestañas)
        window.addEventListener('storage', (e) => {
            if (e.key === 'mdshp_uploaded_files') {
                console.log('🔄 Detectado cambio en localStorage, recargando...');
                setTimeout(() => this.loadLatestTutorial(), 500);
            }
            
            // Escuchar notificaciones específicas del panel de administración
            if (e.key === 'mdshp_tutorial_notification') {
                try {
                    const notificationData = JSON.parse(e.newValue);
                    
                    if (notificationData.type === 'NEW_TUTORIAL') {
                        console.log('📺 Notificación de nuevo tutorial desde panel');
                        setTimeout(() => this.loadLatestTutorial(), 200);
                    } else if (notificationData.type === 'TUTORIAL_DELETED') {
                        console.log('🗑️ Tutorial eliminado, actualizando...');
                        if (this.currentVideoData && this.currentVideoData.id === notificationData.deletedTutorial.id) {
                            setTimeout(() => {
                                this.loadLatestTutorial();
                            }, 200);
                        }
                    }
                } catch (error) {
                    console.error('Error procesando notificación:', error);
                }
            }
        });

        // Escuchar eventos personalizados (para la misma pestaña)
        window.addEventListener('tutorialUploaded', (e) => {
            console.log('📤 Nuevo tutorial subido, actualizando...');
            setTimeout(() => this.loadLatestTutorial(), 1000);
        });

        // Función global para recargar manualmente
        window.reloadTutorialVideo = () => this.loadLatestTutorial();
        
        // Botón de reintentar en caso de error
        window.retryLoadTutorial = () => this.loadLatestTutorial();
    }

    // Verificación periódica para asegurar sincronización
    startPeriodicCheck = () => {
        this.checkInterval = setInterval(() => {
            // Solo verificar si la página está visible
            if (!document.hidden) {
                this.loadLatestTutorial();
            }
        }, 5000); // Verificar cada 5 segundos
    }

    // Limpiar recursos al cerrar
    destroy = () => {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    }
}

// ============================================
// FUNCIÓN AUXILIAR: updateFeaturedTutorial
// ============================================
function updateFeaturedTutorial() {
    const uploadedFiles = JSON.parse(localStorage.getItem('mdshp_uploaded_files') || '[]');
    const featuredTutorial = document.getElementById('featuredTutorial');
    const emptyState = document.getElementById('emptyTutorialState');
    const youtubeContainer = document.getElementById('youtubeContainer');
    const documentContainer = document.getElementById('documentContainer');
    const videoWrapper = document.getElementById('videoWrapper');
    
    // Obtener el último tutorial
    const lastTutorial = uploadedFiles.filter(file => 
        file.type === 'video' || 
        file.type === 'youtube' || 
        file.type === 'document' ||
        file.source === 'youtube'
    ).sort((a, b) => b.id - a.id)[0];
    
    if (!lastTutorial) {
        featuredTutorial.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    featuredTutorial.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Actualizar información
    document.getElementById('tutorialTitle').textContent = lastTutorial.title;
    document.getElementById('tutorialDescription').textContent = lastTutorial.description || 'Tutorial disponible';
    
    // Actualizar badge de tipo
    updateTypeBadge(lastTutorial.type, lastTutorial.source);
    
    // Limpiar contenedores
    youtubeContainer.style.display = 'none';
    documentContainer.style.display = 'none';
    videoWrapper.style.display = 'none';
    
    if (lastTutorial.source === 'youtube' || lastTutorial.type === 'youtube') {
        youtubeContainer.style.display = 'block';
        const iframe = document.getElementById('youtubePlayer');
        if (lastTutorial.youtubeData && lastTutorial.youtubeData.id) {
            iframe.src = `https://www.youtube.com/embed/${lastTutorial.youtubeData.id}`;
        }
    }
    else if (lastTutorial.type === 'document') {
        documentContainer.style.display = 'block';
        document.getElementById('documentTitle').textContent = lastTutorial.title;
        const downloadBtn = document.getElementById('documentDownload');
        if (lastTutorial.fileContent) {
            downloadBtn.href = lastTutorial.fileContent;
            downloadBtn.download = lastTutorial.fileName;
        } else if (lastTutorial.filePath) {
            downloadBtn.href = lastTutorial.filePath;
            downloadBtn.download = lastTutorial.fileName;
        }
        // Actualizar badge del documento
        updateDocumentBadge(lastTutorial.fileName);
    }
    else if (lastTutorial.type === 'video') {
        videoWrapper.style.display = 'block';
        const video = document.getElementById('localVideo');
        if (lastTutorial.videoUrl) {
            video.src = lastTutorial.videoUrl;
        } else if (lastTutorial.filePath) {
            video.src = lastTutorial.filePath;
        }
    }
}

// ============================================
// ANIMATIONS - Cards de servicios
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

// ============================================
// INICIALIZACIÓN
// ============================================
let tutorialManager;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando sistema de video tutorial...');
    
    // Inicializar el manager
    tutorialManager = new TutorialVideoManager();
    
    // Aplicar animaciones a las cards
    document.querySelectorAll('.service-card, .additional-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Actualizar tutorial destacado (función auxiliar)
    updateFeaturedTutorial();
});

// Escuchar cambios en los tutoriales
window.addEventListener('storage', function(e) {
    if (e.key === 'mdshp_tutorial_notification') {
        try {
            const notification = JSON.parse(e.newValue);
            if (notification && (notification.type === 'NEW_TUTORIAL' || notification.type === 'TUTORIAL_DELETED')) {
                updateFeaturedTutorial();
            }
        } catch (error) {
            console.error('Error procesando notificación:', error);
        }
    }
});

// Función global para notificación de actualización
window.notifyTutorialUpdate = function() {
    updateFeaturedTutorial();
    window.dispatchEvent(new CustomEvent('tutorialUploaded'));
};

// Limpiar recursos al cerrar la página
window.addEventListener('beforeunload', () => {
    if (tutorialManager) {
        tutorialManager.destroy();
    }
});