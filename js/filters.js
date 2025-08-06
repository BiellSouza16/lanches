// Sistema de Filtros
class FilterManager {
    constructor() {
        this.filters = {
            startDate: '',
            endDate: '',
            showFilter: false
        };
        this.callbacks = [];
    }

    setDateRange(startDate, endDate) {
        this.filters.startDate = startDate;
        this.filters.endDate = endDate;
        this.notifyCallbacks();
    }

    clearFilters() {
        this.filters.startDate = '';
        this.filters.endDate = '';
        this.notifyCallbacks();
    }

    toggleFilterVisibility() {
        this.filters.showFilter = !this.filters.showFilter;
        this.notifyCallbacks();
    }

    getFilters() {
        return { ...this.filters };
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }

    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    notifyCallbacks() {
        this.callbacks.forEach(callback => callback(this.filters));
    }

    filterData(data, dateField = 'data_hora') {
        if (!this.filters.startDate && !this.filters.endDate) {
            return data;
        }

        return data.filter(item => {
            return isDateInRange(item[dateField], this.filters.startDate, this.filters.endDate);
        });
    }

    createFilterComponent(onApply) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-8');
        
        const header = createElement('div', 'flex items-center justify-between mb-4');
        const title = createElement('h2', 'text-xl font-bold text-gray-800 flex items-center');
        title.appendChild(createIcon('calendar', 'w-6 h-6 mr-2 text-yellow-600'));
        title.appendChild(document.createTextNode('Filtro de Datas'));
        
        const toggleButton = createElement('button', 'btn btn-primary');
        toggleButton.textContent = this.filters.showFilter ? 'Ocultar Filtro' : 'Mostrar Filtro';
        toggleButton.onclick = () => {
            this.toggleFilterVisibility();
            this.updateFilterComponent(container, onApply);
        };
        
        header.appendChild(title);
        header.appendChild(toggleButton);
        container.appendChild(header);
        
        if (this.filters.showFilter) {
            this.addFilterControls(container, onApply);
        }
        
        return container;
    }

    addFilterControls(container, onApply) {
        const controlsContainer = createElement('div', 'space-y-4');
        
        const inputsContainer = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-4');
        
        // Data inicial
        const startDateGroup = createElement('div');
        const startDateLabel = createElement('label', 'form-label', 'Data Inicial');
        const startDateInput = createElement('input', 'form-input');
        startDateInput.type = 'date';
        startDateInput.value = this.filters.startDate;
        startDateInput.onchange = (e) => {
            this.filters.startDate = e.target.value;
            this.notifyCallbacks();
        };
        
        startDateGroup.appendChild(startDateLabel);
        startDateGroup.appendChild(startDateInput);
        
        // Data final
        const endDateGroup = createElement('div');
        const endDateLabel = createElement('label', 'form-label', 'Data Final');
        const endDateInput = createElement('input', 'form-input');
        endDateInput.type = 'date';
        endDateInput.value = this.filters.endDate;
        endDateInput.onchange = (e) => {
            this.filters.endDate = e.target.value;
            this.notifyCallbacks();
        };
        
        endDateGroup.appendChild(endDateLabel);
        endDateGroup.appendChild(endDateInput);
        
        inputsContainer.appendChild(startDateGroup);
        inputsContainer.appendChild(endDateGroup);
        
        // Botões de ação
        const actionsContainer = createElement('div', 'flex gap-3');
        
        const clearButton = createElement('button', 'btn btn-secondary');
        clearButton.textContent = 'Limpar Filtro';
        clearButton.onclick = () => {
            this.clearFilters();
            startDateInput.value = '';
            endDateInput.value = '';
            statusText.textContent = 'Nenhum filtro aplicado';
        };
        
        const statusText = createElement('div', 'flex-1 text-sm text-gray-600 flex items-center');
        this.updateStatusText(statusText);
        
        actionsContainer.appendChild(clearButton);
        actionsContainer.appendChild(statusText);
        
        controlsContainer.appendChild(inputsContainer);
        controlsContainer.appendChild(actionsContainer);
        container.appendChild(controlsContainer);
        
        // Atualizar texto de status quando os filtros mudarem
        this.addCallback(() => this.updateStatusText(statusText));
    }

    updateStatusText(statusElement) {
        if (this.filters.startDate || this.filters.endDate) {
            let text = 'Filtrando: ';
            if (this.filters.startDate) {
                text += `de ${new Date(this.filters.startDate + 'T00:00:00').toLocaleDateString('pt-BR')}`;
            }
            if (this.filters.endDate) {
                text += ` até ${new Date(this.filters.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}`;
            }
            statusElement.textContent = text;
        } else {
            statusElement.textContent = 'Nenhum filtro aplicado';
        }
    }

    updateFilterComponent(container, onApply) {
        // Limpar conteúdo atual
        while (container.children.length > 1) {
            container.removeChild(container.lastChild);
        }
        
        // Atualizar botão toggle
        const toggleButton = container.querySelector('button');
        toggleButton.textContent = this.filters.showFilter ? 'Ocultar Filtro' : 'Mostrar Filtro';
        
        // Adicionar controles se visível
        if (this.filters.showFilter) {
            this.addFilterControls(container, onApply);
        }
    }
}

// Instância global do filtro
const filterManager = new FilterManager();