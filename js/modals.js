// Sistema de Modais
class ModalManager {
    constructor() {
        this.container = document.getElementById('modal-container');
        this.activeModal = null;
    }

    show(content, options = {}) {
        this.hide(); // Fechar modal anterior se existir

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
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        this.container.appendChild(backdrop);
        this.activeModal = backdrop;

        // Inicializar ícones após adicionar ao DOM
        setTimeout(() => initializeLucideIcons(), 0);

        return backdrop;
    }

    hide() {
        if (this.activeModal) {
            this.activeModal.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (this.activeModal && this.activeModal.parentNode) {
                    this.activeModal.parentNode.removeChild(this.activeModal);
                }
                this.activeModal = null;
            }, 300);
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
}

// Instância global do modal
const modal = new ModalManager();