// Sistema de Modais
class ModalManager {
    constructor() {
        this.container = document.getElementById('modal-container');
        this.activeModal = null;
        this.modalStack = []; // Stack para gerenciar modais aninhados
        this.isTransitioning = false; // Flag para controlar transições
    }

    show(content, options = {}) {
        // Prevenir múltiplas transições simultâneas
        if (this.isTransitioning) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.show(content, options));
                }, 100);
            });
        }

        // Se já existe um modal ativo, adicionar ao stack
        if (this.activeModal) {
            this.modalStack.push(this.activeModal);
            // Reduzir opacidade do modal anterior em vez de esconder
            this.activeModal.style.opacity = '0.3';
            this.activeModal.style.pointerEvents = 'none';
        }

        this.isTransitioning = true;
        const backdrop = createElement('div', 'modal-backdrop');
        const modal = createElement('div', 'modal');
        
        if (options.size === 'large') {
            modal.style.maxWidth = '80vw';
        } else if (options.size === 'small') {
            modal.style.maxWidth = '28rem';
        } else {
            modal.style.maxWidth = '42rem';
        }

        // Aumentar z-index para modais empilhados
        const baseZIndex = 1000;
        const currentZIndex = baseZIndex + this.modalStack.length * 10;
        backdrop.style.zIndex = currentZIndex;
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
        setTimeout(() => {
            initializeLucideIcons();
            this.isTransitioning = false;
        }, 100);

        return backdrop;
    }

    hide() {
        // Prevenir múltiplas chamadas de hide simultâneas
        if (this.isTransitioning || !this.activeModal) return;
        
        if (this.activeModal) {
            // Prevent multiple hide calls
            if (this.activeModal.classList.contains('modal-closing')) return;
            
            this.isTransitioning = true;
            
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
                    this.activeModal.style.opacity = '1';
                    this.activeModal.style.pointerEvents = 'auto';
                    
                    // Reativar escape handler do modal anterior
                    if (this.activeModal.escapeHandler) {
                        document.addEventListener('keydown', this.activeModal.escapeHandler);
                    }
                } else {
                    this.activeModal = null;
                }
                
                this.isTransitioning = false;
            }, 250);
        }
    }

    // Método para fechar modal específico (útil para confirmações)
    hideSpecific(modalElement) {
        if (!modalElement || this.isTransitioning) return;
        
        // Se é o modal ativo
        if (modalElement === this.activeModal) {
            this.hide();
            return;
        }
        
        // Se está no stack, remover do stack
        const stackIndex = this.modalStack.indexOf(modalElement);
        if (stackIndex !== -1) {
            this.modalStack.splice(stackIndex, 1);
            
            // Remove escape handler
            if (modalElement.escapeHandler) {
                document.removeEventListener('keydown', modalElement.escapeHandler);
            }
            
            modalElement.style.animation = 'fadeIn 0.2s ease-out reverse';
            setTimeout(() => {
                if (modalElement.parentNode) {
                    modalElement.parentNode.removeChild(modalElement);
                }
            }, 250);
        }
    }

    // Método para aguardar que as transições terminem
    async waitForTransition() {
        return new Promise(resolve => {
            const checkTransition = () => {
                if (!this.isTransitioning) {
                    resolve();
                } else {
                    setTimeout(checkTransition, 50);
                }
            };
            checkTransition();
        });
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

    // Método para criar modal de confirmação com melhor gerenciamento
    createConfirmationModal(title, message, onConfirm, onCancel = null) {
        const body = createElement('div', 'text-center py-4');
        const messageElement = createElement('p', 'text-gray-600 mb-6', message);
        body.appendChild(messageElement);
        
        const footer = createElement('div', 'flex gap-3');
        
        const cancelButton = createElement('button', 'btn bg-gray-300 text-gray-700 hover:bg-gray-400 flex-1');
        cancelButton.textContent = 'Cancelar';
        cancelButton.onclick = () => {
            this.hide();
            if (onCancel) onCancel();
        };
        
        const confirmButton = createElement('button', 'btn btn-danger flex-1');
        confirmButton.textContent = 'Confirmar';
        confirmButton.onclick = async () => {
            confirmButton.disabled = true;
            confirmButton.textContent = 'Processando...';
            
            try {
                const result = await onConfirm();
                if (result !== false) {
                    this.hide();
                }
            } catch (error) {
                console.error('Erro na confirmação:', error);
            } finally {
                confirmButton.disabled = false;
                confirmButton.textContent = 'Confirmar';
            }
        };
        
        footer.appendChild(cancelButton);
        footer.appendChild(confirmButton);
        
        const modalContent = this.createModal(title, body, footer);
        return modalContent;
    }

    // Method to force close modal (for emergency situations)
    forceClose() {
        this.isTransitioning = false;
        
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
