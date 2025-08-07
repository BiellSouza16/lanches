// Sistema de Modais
class ModalManager {
    constructor() {
        this.container = document.getElementById('modal-container');
        this.activeModal = null;
        this.modalStack = []; // Stack para gerenciar modais aninhados
    }

    show(content, options = {}) {
        // Se já existe um modal ativo, adicionar ao stack
        if (this.activeModal) {
            this.modalStack.push(this.activeModal);
            this.activeModal.style.display = 'none';
        }

        const backdrop = createElement('div', 'modal-backdrop');
        const modal = createElement('div', 'modal');
        
        if (options.size === 'large') {
            modal.style.maxWidth = '80vw';
        } else if (options.size === 'small') {
            modal.style.maxWidth = '28rem';
        } else {
            modal.style.maxWidth = '42rem';
        }

        modal.appendChild(content);
        backdrop.appendChild(modal);
        
        // Fechar ao clicar no backdrop
        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                this.hide();
            }
        };

        // Fechar com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        };
        
        // Store the escape handler to remove it later
        backdrop.escapeHandler = handleEsc;
        document.addEventListener('keydown', handleEsc);

        this.container.appendChild(backdrop);
        this.activeModal = backdrop;

        // Inicializar ícones após adicionar ao DOM
        setTimeout(() => initializeLucideIcons(), 0);

        return backdrop;
    }

    hide() {
        if (this.activeModal) {
            // Prevent multiple hide calls
            if (this.activeModal.classList.contains('modal-closing')) return;
            
            // Remove escape handler
            if (this.activeModal.escapeHandler) {
                document.removeEventListener('keydown', this.activeModal.escapeHandler);
            }
            
            this.activeModal.classList.add('modal-closing');
            this.activeModal.style.animation = 'fadeIn 0.2s ease-out reverse';
            
            setTimeout(() => {
                if (this.activeModal && this.activeModal.parentNode) {
                    this.activeModal.parentNode.removeChild(this.activeModal);
                }
                
                // Restaurar modal anterior do stack se existir
                if (this.modalStack.length > 0) {
                    this.activeModal = this.modalStack.pop();
                    this.activeModal.style.display = 'flex';
                } else {
                    this.activeModal = null;
                }
            }, 200);
        }
    }

    createModal(title, body, footer = null) {
        const modalContent = createElement('div');
        
        // Header
        const header = createElement('div', 'modal-header');
        const titleElement = createElement('h2', 'modal-title', title);
        const closeButton = createElement('button', 'modal-close');
        closeButton.appendChild(createIcon('x', 'w-6 h-6'));
        closeButton.onclick = () => this.hide();
        
        header.appendChild(titleElement);
        header.appendChild(closeButton);
        
        // Body
        const bodyElement = createElement('div', 'modal-body');
        if (typeof body === 'string') {
            bodyElement.innerHTML = body;
        } else {
            bodyElement.appendChild(body);
        }
        
        modalContent.appendChild(header);
        modalContent.appendChild(bodyElement);
        
        // Footer
        if (footer) {
            const footerElement = createElement('div', 'modal-footer');
            if (typeof footer === 'string') {
                footerElement.innerHTML = footer;
            } else {
                footerElement.appendChild(footer);
            }
            modalContent.appendChild(footerElement);
        }
        
        return modalContent;
    }

    // Method to force close modal (for emergency situations)
    forceClose() {
        // Remove all escape handlers
        if (this.activeModal && this.activeModal.escapeHandler) {
            document.removeEventListener('keydown', this.activeModal.escapeHandler);
        }
        
        this.modalStack.forEach(modal => {
            if (modal.escapeHandler) {
                document.removeEventListener('keydown', modal.escapeHandler);
            }
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
        
        if (this.activeModal) {
            if (this.activeModal.parentNode) {
                this.activeModal.parentNode.removeChild(this.activeModal);
            }
        }
        
        this.activeModal = null;
        this.modalStack = [];
    }
    
    // Method to close all modals
    hideAll() {
        this.forceClose();
    }
}

// Instância global do modal
const modal = new ModalManager();
