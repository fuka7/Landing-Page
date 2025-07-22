/**
 * FILE-UPLOAD.JS - Sistema de subida de archivos
 * Maneja la carga de videos, documentos y validaciones
 */

class FileUploadManager {
    constructor() {
        this.maxSizes = {
            video: 500 * 1024 * 1024, // 500MB
            document: 50 * 1024 * 1024, // 50MB
            image: 10 * 1024 * 1024 // 10MB
        };
        
        this.allowedTypes = {
            video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
            document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
            image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
        };
        
        this.uploadQueue = [];
        this.currentUploads = 0;
        this.maxConcurrentUploads = 3;
        
        this.initializeUploadHandlers();
    }

    // Inicializar manejadores de eventos
    initializeUploadHandlers() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupDropZones();
            this.setupFileInputs();
            this.setupProgressBars();
        });
    }

    // Configurar zonas de drop
    setupDropZones() {
        const dropZones = document.querySelectorAll('.file-upload-area');
        
        dropZones.forEach(zone => {
            // Prevenir comportamientos por defecto
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, this.preventDefaults, false);
            });

            // Efectos visuales
            ['dragenter', 'dragover'].forEach(eventName => {
                zone.addEventListener(eventName, () => this.highlight(zone), false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                zone.addEventListener(eventName, () => this.unhighlight(zone), false);
            });

            // Manejo del drop
            zone.addEventListener('drop', (e) => this.handleDrop(e, zone), false);
            
            // Click para seleccionar archivo
            zone.addEventListener('click', () => {
                const input = zone.querySelector('input[type="file"]');
                if (input) input.click();
            });
        });
    }

    // Configurar inputs de archivo
    setupFileInputs() {
        const fileInputs = document.querySelectorAll('input[type="file"]');
        
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                const uploadArea = input.closest('.file-upload-area');
                this.handleFiles(files, uploadArea);
            });
        });
    }

    // Configurar barras de progreso
    setupProgressBars() {
        // Crear contenedor para barras de progreso si no existe
        if (!document.getElementById('upload-progress-container')) {
            const container = document.createElement('div');
            container.id = 'upload-progress-container';
            container.className = 'upload-progress-container';
            document.body.appendChild(container);
        }
    }

    // Prevenir comportamientos por defecto del navegador
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Resaltar zona de drop
    highlight(element) {
        element.classList.add('dragover');
    }

    // Quitar resaltado
    unhighlight(element) {
        element.classList.remove('dragover');
    }

    // Manejar evento drop
    handleDrop(e, dropZone) {
        const dt = e.dataTransfer;
        const files = Array.from(dt.files);
        this.handleFiles(files, dropZone);
    }

    // Procesar archivos seleccionados
    handleFiles(files, uploadArea) {
        if (files.length === 0) return;

        // Determinar tipo de archivo esperado
        const fileType = this.getExpectedFileType(uploadArea);
        
        files.forEach(file => {
            if (this.validateFile(file, fileType)) {
                this.addToUploadQueue(file, uploadArea, fileType);
            }
        });

        this.processUploadQueue();
    }

    // Determinar tipo de archivo esperado
    getExpectedFileType(uploadArea) {
        const videoTypes = ['mp4', 'avi', 'mov'];
        const accept = uploadArea.querySelector('input[type="file"]')?.accept;
        
        if (accept) {
            if (accept.includes('video')) return 'video';
            if (accept.includes('.pdf') || accept.includes('.doc')) return 'document';
            if (accept.includes('image')) return 'image';
        }
        
        // Determinar por contexto
        if (uploadArea.id.includes('video')) return 'video';
        if (uploadArea.id.includes('document')) return 'document';
        
        return 'document'; // por defecto
    }

    // Validar archivo
    validateFile(file, expectedType) {
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();
        const fileSize = file.size;

        // Validar extensión
        if (!this.allowedTypes[expectedType].includes(fileExtension)) {
            this.showError(`Tipo de archivo no permitido: .${fileExtension}`, file.name);
            return false;
        }

        // Validar tamaño
        if (fileSize > this.maxSizes[expectedType]) {
            const maxSizeMB = this.maxSizes[expectedType] / (1024 * 1024);
            this.showError(`Archivo muy grande. Máximo permitido: ${maxSizeMB}MB`, file.name);
            return false;
        }

        // Validar nombre de archivo
        if (fileName.length > 100) {
            this.showError('Nombre de archivo muy largo (máx. 100 caracteres)', file.name);
            return false;
        }

        return true;
    }

    // Agregar archivo a cola de subida
    addToUploadQueue(file, uploadArea, fileType) {
        const uploadItem = {
            id: this.generateUploadId(),
            file: file,
            uploadArea: uploadArea,
            fileType: fileType,
            status: 'pending',
            progress: 0,
            startTime: null,
            endTime: null
        };

        this.uploadQueue.push(uploadItem);
        this.showFilePreview(uploadItem);
    }

    // Mostrar vista previa del archivo
    showFilePreview(uploadItem) {
        const { file, uploadArea, fileType } = uploadItem;
        
        // Actualizar UI del área de upload
        uploadArea.classList.add('file-selected');
        uploadArea.innerHTML = this.generatePreviewHTML(file, fileType, uploadItem.id);
        
        // Agregar botones de acción
        this.addActionButtons(uploadArea, uploadItem);
    }

    // Generar HTML de vista previa
    generatePreviewHTML(file, fileType, uploadId) {
        const fileSize = this.formatFileSize(file.size);
        const fileName = file.name;
        
        let iconClass = 'bi-file-earmark';
        let iconColor = '#64748b';
        
        switch (fileType) {
            case 'video':
                iconClass = 'bi-camera-video';
                iconColor = '#dc2626';
                break;
            case 'document':
                if (fileName.toLowerCase().includes('.pdf')) {
                    iconClass = 'bi-file-pdf';
                    iconColor = '#dc2626';
                } else {
                    iconClass = 'bi-file-word';
                    iconColor = '#2563eb';
                }
                break;
            case 'image':
                iconClass = 'bi-image';
                iconColor = '#059669';
                break;
        }

        return `
            <div class="file-preview" data-upload-id="${uploadId}">
                <div class="file-icon">
                    <i class="bi ${iconClass}" style="color: ${iconColor}; font-size: 3rem;"></i>
                </div>
                <div class="file-info">
                    <h4>${fileName}</h4>
                    <p>Tamaño: ${fileSize}</p>
                    <p>Tipo: ${fileType.toUpperCase()}</p>
                </div>
                <div class="upload-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <span class="progress-text">Listo para subir</span>
                </div>
            </div>
        `;
    }

    // Agregar botones de acción
    addActionButtons(uploadArea, uploadItem) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'upload-actions';
        actionsDiv.innerHTML = `
            <button class="action-btn upload-btn" onclick="fileUploader.startUpload('${uploadItem.id}')">
                <i class="bi bi-upload"></i> Subir
            </button>
            <button class="action-btn cancel-btn" onclick="fileUploader.cancelUpload('${uploadItem.id}')">
                <i class="bi bi-x-lg"></i> Cancelar
            </button>
        `;
        
        uploadArea.appendChild(actionsDiv);
    }

    // Procesar cola de subidas
    processUploadQueue() {
        while (this.currentUploads < this.maxConcurrentUploads && this.uploadQueue.length > 0) {
            const uploadItem = this.uploadQueue.find(item => item.status === 'pending');
            if (uploadItem) {
                this.startUpload(uploadItem.id);
            } else {
                break;
            }
        }
    }

    // Iniciar subida de archivo
    startUpload(uploadId) {
        const uploadItem = this.uploadQueue.find(item => item.id === uploadId);
        if (!uploadItem || uploadItem.status !== 'pending') return;

        uploadItem.status = 'uploading';
        uploadItem.startTime = new Date();
        this.currentUploads++;

        this.updateUploadProgress(uploadId, 0, 'Iniciando subida...');

        // Simular proceso de subida
        this.simulateFileUpload(uploadItem);
    }

    // Simular subida de archivo (en producción, usar API real)
    async simulateFileUpload(uploadItem) {
        const { id, file } = uploadItem;
        const chunks = 100;
        const chunkDelay = 50;

        try {
            for (let i = 0; i <= chunks; i++) {
                const progress = (i / chunks) * 100;
                const status = i === chunks ? 'Subida completada' : `Subiendo... ${Math.round(progress)}%`;
                
                this.updateUploadProgress(id, progress, status);
                
                if (i < chunks) {
                    await new Promise(resolve => setTimeout(resolve, chunkDelay));
                }
            }

            this.completeUpload(id);
            
        } catch (error) {
            this.failUpload(id, error.message);
        }
    }

    // Actualizar progreso de subida
    updateUploadProgress(uploadId, progress, status) {
        const preview = document.querySelector(`[data-upload-id="${uploadId}"]`);
        if (!preview) return;

        const progressFill = preview.querySelector('.progress-fill');
        const progressText = preview.querySelector('.progress-text');

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = status;

        // Actualizar color de la barra según progreso
        if (progressFill) {
            if (progress === 100) {
                progressFill.style.background = '#10b981';
            } else if (progress > 0) {
                progressFill.style.background = '#2563eb';
            }
        }
    }

    // Completar subida
    completeUpload(uploadId) {
        const uploadItem = this.uploadQueue.find(item => item.id === uploadId);
        if (!uploadItem) return;

        uploadItem.status = 'completed';
        uploadItem.endTime = new Date();
        this.currentUploads--;

        this.updateUploadProgress(uploadId, 100, '✅ Subida completada');
        this.showUploadSuccess(uploadItem);
        
        // Procesar siguiente en cola
        setTimeout(() => this.processUploadQueue(), 500);
    }

    // Fallar subida
    failUpload(uploadId, errorMessage) {
        const uploadItem = this.uploadQueue.find(item => item.id === uploadId);
        if (!uploadItem) return;

        uploadItem.status = 'failed';
        uploadItem.error = errorMessage;
        this.currentUploads--;

        this.updateUploadProgress(uploadId, 0, '❌ Error en subida');
        this.showError(`Error al subir archivo: ${errorMessage}`, uploadItem.file.name);
        
        // Procesar siguiente en cola
        setTimeout(() => this.processUploadQueue(), 500);
    }

    // Cancelar subida
    cancelUpload(uploadId) {
        const uploadItem = this.uploadQueue.find(item => item.id === uploadId);
        if (!uploadItem) return;

        if (uploadItem.status === 'uploading') {
            this.currentUploads--;
        }

        // Remover de cola y UI
        this.uploadQueue = this.uploadQueue.filter(item => item.id !== uploadId);
        
        const preview = document.querySelector(`[data-upload-id="${uploadId}"]`);
        if (preview) {
            preview.closest('.file-upload-area').classList.remove('file-selected');
            this.resetUploadArea(preview.closest('.file-upload-area'));
        }

        this.showNotification('Subida cancelada', 'info');
    }

    // Resetear área de subida
    resetUploadArea(uploadArea) {
        const originalContent = this.getOriginalUploadContent(uploadArea);
        uploadArea.innerHTML = originalContent;
        uploadArea.classList.remove('file-selected', 'dragover');
    }

    // Obtener contenido original del área de subida
    getOriginalUploadContent(uploadArea) {
        const isVideo = uploadArea.id.includes('video');
        const icon = isVideo ? 'bi-cloud-upload' : 'bi-file-earmark-pdf';
        const text = isVideo ? 'video' : 'documento';
        const formats = isVideo ? 'MP4, AVI, MOV (máx. 500MB)' : 'PDF, DOC, DOCX (máx. 50MB)';

        return `
            <i class="bi ${icon}"></i>
            <p>Arrastra tu ${text} aquí o <span class="upload-link">haz clic para seleccionar</span></p>
            <small>Formatos soportados: ${formats}</small>
            <input type="file" hidden>
        `;
    }

    // Mostrar éxito de subida
    showUploadSuccess(uploadItem) {
        this.showNotification(
            `✅ ${uploadItem.file.name} subido exitosamente`,
            'success'
        );

        // Agregar a lista de archivos subidos
        this.addToUploadedFilesList(uploadItem);
    }

    // Agregar a lista de archivos subidos
    addToUploadedFilesList(uploadItem) {
        // Aquí se podría actualizar una lista de archivos subidos
        // O enviar notificación al servidor, etc.
        console.log('Archivo subido:', uploadItem);
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;

        // Agregar estilos si no existen
        this.ensureNotificationStyles();
        
        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);

        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 10);
    }

    // Mostrar error
    showError(message, fileName = '') {
        const fullMessage = fileName ? `${fileName}: ${message}` : message;
        this.showNotification(`❌ ${fullMessage}`, 'error');
    }

    // Asegurar estilos de notificación
    ensureNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: #d1fae5;
                border-left: 4px solid #10b981;
                color: #064e3b;
            }
            
            .notification-error {
                background: #fee2e2;
                border-left: 4px solid #ef4444;
                color: #7f1d1d;
            }
            
            .notification-info {
                background: #dbeafe;
                border-left: 4px solid #2563eb;
                color: #1e3a8a;
            }
            
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            .upload-actions {
                margin-top: 1rem;
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .action-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .upload-btn {
                background: #2563eb;
                color: white;
            }
            
            .upload-btn:hover {
                background: #1d4ed8;
            }
            
            .cancel-btn {
                background: #ef4444;
                color: white;
            }
            
            .cancel-btn:hover {
                background: #dc2626;
            }
            
            .file-preview {
                text-align: center;
                padding: 1rem;
            }
            
            .file-info h4 {
                margin: 0.5rem 0;
                color: #1e293b;
                font-size: 1rem;
            }
            
            .file-info p {
                margin: 0.25rem 0;
                color: #64748b;
                font-size: 0.9rem;
            }
            
            .upload-progress {
                margin-top: 1rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: #2563eb;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 0.8rem;
                color: #64748b;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Utilidades
    generateUploadId() {
        return 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Obtener estadísticas de subidas
    getUploadStats() {
        const completed = this.uploadQueue.filter(item => item.status === 'completed').length;
        const failed = this.uploadQueue.filter(item => item.status === 'failed').length;
        const pending = this.uploadQueue.filter(item => item.status === 'pending').length;
        const uploading = this.uploadQueue.filter(item => item.status === 'uploading').length;

        return {
            total: this.uploadQueue.length,
            completed,
            failed,
            pending,
            uploading,
            currentUploads: this.currentUploads
        };
    }

    // Limpiar cola de archivos completados
    clearCompletedUploads() {
        this.uploadQueue = this.uploadQueue.filter(item => 
            item.status !== 'completed' && item.status !== 'failed'
        );
    }
}

// Instancia global del manejador de archivos
const fileUploader = new FileUploadManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileUploadManager;
}