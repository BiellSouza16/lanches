// Sistema de Toast
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
    }

    show(message, type = 'success', duration = 4000) {
        const id = Date.now();
        const toast = this.createToast(id, message, type);
        
        this.container.appendChild(toast);
        this.toasts.push({ id, element: toast });

        // Make toast clickable to dismiss
        toast.onclick = () => this.remove(id);
        toast.style.cursor = 'pointer';

        // Auto remove
        setTimeout(() => {
            this.remove(id);
        }, duration);

        return id;
    }

    createToast(id, message, type) {
        const toast = createElement('div', `toast toast-${type}`);
        
        const iconName = {
            success: 'check-circle',
            error: 'x',
            warning: 'alert-triangle'
        }[type] || 'check-circle';

        const icon = createIcon(iconName, 'icon');
        const messageSpan = createElement('span', 'text-sm font-medium', message);
        const closeButton = createElement('button', 'toast-close');
        closeButton.appendChild(createIcon('x', 'w-4 h-4'));
        
        closeButton.onclick = (e) => {
            e.stopPropagation(); // Prevent toast click event
            this.remove(id);
        };

        toast.appendChild(icon);
        toast.appendChild(messageSpan);
        toast.appendChild(closeButton);

        return toast;
    }

    remove(id) {
        const toastIndex = this.toasts.findIndex(t => t.id === id);
        if (toastIndex !== -1) {
            const toast = this.toasts[toastIndex];
            toast.element.style.animation = 'slideUp 0.3s ease-in reverse';
            
            setTimeout(() => {
                if (toast.element.parentNode) {
                    toast.element.parentNode.removeChild(toast.element);
                }
                this.toasts.splice(toastIndex, 1);
            }, 300);
        }
    }

    success(message) {
        return this.show(message, 'success');
    }

    error(message) {
        return this.show(message, 'error');
    }

    warning(message) {
        return this.show(message, 'warning');
    }
}

// Instância global do toast
const toast = new ToastManager();