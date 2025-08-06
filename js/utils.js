// Utilitários gerais
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return {
        date: date.toLocaleDateString('pt-BR'),
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function formatDateFromInput(inputDate) {
    if (!inputDate) return '';
    return new Date(inputDate + 'T00:00:00').toISOString();
}

function isDateInRange(dateTime, startDate, endDate) {
    if (!startDate && !endDate) return true;
    
    // Converter para data local para comparação precisa
    const itemDate = new Date(dateTime);
    const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
    
    if (startDate && endDate) {
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T23:59:59.999');
        return itemDate >= start && itemDate <= end;
    } else if (startDate) {
        const start = new Date(startDate + 'T00:00:00');
        return itemDate >= start;
    } else if (endDate) {
        const end = new Date(endDate + 'T23:59:59.999');
        return itemDate <= end;
    }
    
    return true;
}

function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function createIcon(iconName, className = 'icon') {
    const icon = createElement('i');
    icon.className = className;
    icon.setAttribute('data-lucide', iconName);
    return icon;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para inicializar ícones Lucide
function initializeLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Função para criar elementos com ícones
function createButtonWithIcon(iconName, text, className = 'btn btn-primary') {
    const button = createElement('button', className);
    const icon = createIcon(iconName, 'icon');
    button.appendChild(icon);
    if (text) {
        button.appendChild(document.createTextNode(text));
    }
    return button;
}