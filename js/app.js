// Aplicação Principal
class App {
    constructor() {
        this.activeSection = 'lancamentos';
        this.mainContent = document.getElementById('main-content');
        this.init();
    }

    async init() {
        await lancamentosManager.loadLancamentos();
        this.showLancamentos();
        
        // Inicializar ícones
        setTimeout(() => initializeLucideIcons(), 100);
    }

    showLancamentos() {
        this.activeSection = 'lancamentos';
        this.mainContent.innerHTML = '';
        this.mainContent.appendChild(this.createLancamentosPage());
        setTimeout(() => initializeLucideIcons(), 0);
    }

    showRestrita() {
        this.activeSection = 'restrita';
        this.mainContent.innerHTML = '';
        
        if (areaRestrita.isAuthenticated) {
            this.mainContent.appendChild(areaRestrita.createRestritaContent());
        } else {
            this.mainContent.appendChild(areaRestrita.createLoginForm());
        }
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    createLancamentosPage() {
        const container = createElement('div', 'min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50');
        container.classList.add('page-enter');
        const mainContainer = createElement('div', 'container mx-auto px-4 py-8');
        
        // Header
        const header = createElement('div', 'text-center mb-12');
        header.classList.add('card-enter');
        const headerTop = createElement('div', 'flex items-center justify-center mb-4');
        headerTop.appendChild(createIcon('chef-hat', 'w-12 h-12 text-yellow-600 mr-3'));
        
        const title = createElement('h1', 'text-4xl font-bold text-gray-800', 'Sistema Interno');
        headerTop.appendChild(title);
        
        const subtitle = createElement('h2', 'text-2xl font-semibold text-yellow-600 mb-2', 'Coxinha Real');
        const description = createElement('p', 'text-gray-600', 'Controle de lançamentos e operações');
        
        header.appendChild(headerTop);
        header.appendChild(subtitle);
        header.appendChild(description);
        
        // Cards Grid
        const cardsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto');
        cardsGrid.classList.add('card-enter');
        
        const cards = [
            { tipo: 'lanche', title: 'Lanche', description: 'Registrar lanche de funcionário', icon: 'users', color: 'green' },
            { tipo: 'perda', title: 'Perda', description: 'Registrar perdas de produtos', icon: 'trending-down', color: 'red' },
            { tipo: 'sobra', title: 'Sobra', description: 'Registrar sobras de produtos', icon: 'package', color: 'orange' },
            { tipo: 'transferencia', title: 'Loja 2 → Loja 1', description: 'Transferência entre lojas', icon: 'arrow-right-left', color: 'blue' },
            { tipo: 'estoque', title: 'Estoque', description: 'Controle de estoque', icon: 'warehouse', color: 'purple' }
        ];
        
        cards.forEach(card => {
            const cardElement = this.createLancamentoCard(card);
            cardsGrid.appendChild(cardElement);
        });
        
        // Área Restrita Button
        const restrictedArea = createElement('div', 'mt-12 text-center');
        restrictedArea.classList.add('card-enter');
        const restrictedButton = createButtonWithIcon('bar-chart-3', 'Área Restrita', 'btn bg-gray-800 text-white hover:bg-gray-900');
        restrictedButton.onclick = () => this.showRestrita();
        restrictedArea.appendChild(restrictedButton);
        
        mainContainer.appendChild(header);
        mainContainer.appendChild(cardsGrid);
        mainContainer.appendChild(restrictedArea);
        container.appendChild(mainContainer);
        
        return container;
    }

    createLancamentoCard(card) {
        const cardElement = createElement('button', `card card-body text-center border-l-4 border-${card.color}-500 hover:-translate-y-2 hover:scale-105 transition-all duration-300`);
        
        const iconContainer = createElement('div', `w-16 h-16 bg-${card.color}-100 rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-${card.color}-200 hover:scale-110 transition-all duration-300`);
        iconContainer.appendChild(createIcon(card.icon, `w-8 h-8 text-${card.color}-600`));
        
        const title = createElement('h3', 'text-lg font-semibold text-gray-800 mb-2', card.title);
        const description = createElement('p', 'text-sm text-gray-600', card.description);
        
        cardElement.appendChild(iconContainer);
        cardElement.appendChild(title);
        cardElement.appendChild(description);
        
        cardElement.onclick = () => this.showLancamentoModal(card.tipo);
        
        return cardElement;
    }

    showLancamentoModal(tipo) {
        // Garantir que não há conflitos de modal
        if (modal.activeModal) {
            modal.hide();
            // Pequeno delay para garantir que o modal anterior foi fechado
            setTimeout(() => {
                this.createAndShowModal(tipo);
            }, 300);
        } else {
            this.createAndShowModal(tipo);
        }
    }
    
    createAndShowModal(tipo) {
        const modalBody = this.createLancamentoModalBody(tipo);
        const modalFooter = this.createLancamentoModalFooter(tipo);
        
        const title = lancamentosManager.editingLancamento ? 'Editar ' : '';
        const tipoTitle = tipo === 'transferencia' ? 'Transferência Loja 2 → Loja 1' : 
                         tipo === 'estoque' ? 'Controle de Estoque' : 
                         tipo.charAt(0).toUpperCase() + tipo.slice(1);
        
        const modalContent = modal.createModal(title + tipoTitle, modalBody, modalFooter);
        modal.show(modalContent);
    }

    createLancamentoModalBody(tipo) {
        const container = createElement('div', 'space-y-6');
        
        // Campo Data/Hora (apenas para edição)
        if (lancamentosManager.editingLancamento) {
            const dateTimeGroup = createElement('div');
            const dateTimeLabel = createElement('label', 'form-label', 'Data e Hora');
            const dateTimeInput = createElement('input', 'form-input');
            dateTimeInput.type = 'datetime-local';
            
            // Converter data atual para formato datetime-local
            const currentDate = new Date(lancamentosManager.editingLancamento.data_hora);
            const localDateTime = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            dateTimeInput.value = localDateTime;
            
            dateTimeInput.onchange = (e) => {
                const newDateTime = new Date(e.target.value).toISOString();
                lancamentosManager.updateEditingDateTime(newDateTime);
            };
            
            dateTimeGroup.appendChild(dateTimeLabel);
            dateTimeGroup.appendChild(dateTimeInput);
            container.appendChild(dateTimeGroup);
        }
        
        // Campo Nome/Funcionário
        const nameGroup = createElement('div');
        const nameLabel = createElement('label', 'form-label', tipo === 'lanche' ? 'Nome do Funcionário' : 'Nome');
        const nameInput = createElement('input', 'form-input');
        nameInput.type = 'text';
        nameInput.placeholder = tipo === 'lanche' ? 'Digite o nome do funcionário' : 'Digite seu nome';
        nameInput.value = tipo === 'lanche' ? lancamentosManager.funcionario : lancamentosManager.nome;
        nameInput.oninput = (e) => {
            if (tipo === 'lanche') {
                lancamentosManager.funcionario = e.target.value;
            } else {
                lancamentosManager.nome = e.target.value;
            }
        };
        
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        container.appendChild(nameGroup);
        
        // Para lanche, manter o sistema atual
        if (tipo === 'lanche') {
            // Seleção de Tamanho
            const tamanhoGroup = createElement('div');
            const tamanhoLabel = createElement('label', 'form-label', 'Tamanho');
            const tamanhoContainer = createElement('div', 'flex gap-4');
            
            tamanhos.forEach(tamanho => {
                const button = createElement('button', `btn ${lancamentosManager.selectedTamanho === tamanho ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`);
                button.type = 'button';
                button.textContent = tamanho;
                button.onclick = () => {
                    lancamentosManager.selectedTamanho = tamanho;
                    this.updateTamanhoButtons(tamanhoContainer);
                    this.updateItemsList(container.querySelector('.items-grid'), tipo);
                };
                tamanhoContainer.appendChild(button);
            });
            
            tamanhoGroup.appendChild(tamanhoLabel);
            tamanhoGroup.appendChild(tamanhoContainer);
            container.appendChild(tamanhoGroup);
            
            // Lista de Itens para lanche
            const itemsGroup = createElement('div');
            const itemsLabel = createElement('label', 'form-label', 'Salgados');
            const itemsGrid = createElement('div', 'items-grid grid grid-cols-1 md:grid-cols-2 gap-3');
            
            this.updateItemsList(itemsGrid, tipo);
            
            itemsGroup.appendChild(itemsLabel);
            itemsGroup.appendChild(itemsGrid);
            container.appendChild(itemsGroup);
        } else if (tipo === 'estoque') {
            // Lista de Itens de Estoque
            const itemsGroup = createElement('div');
            const itemsLabel = createElement('label', 'form-label', 'Itens de Estoque');
            const itemsGrid = createElement('div', 'items-grid grid grid-cols-1 md:grid-cols-2 gap-3');
            
            this.updateItemsList(itemsGrid, tipo);
            
            itemsGroup.appendChild(itemsLabel);
            itemsGroup.appendChild(itemsGrid);
            container.appendChild(itemsGroup);
        } else {
            // Para perda, sobra e transferência - novo sistema com ambos tamanhos
            this.createDualSizeItemsSection(container, tipo);
        }
        
        // Sucos (apenas para lanche)
        if (tipo === 'lanche') {
            const sucosGroup = this.createSucosSection();
            container.appendChild(sucosGroup);
        }
        
        // Contador de itens para lanche
        if (tipo === 'lanche') {
            const counterGroup = this.createItemCounter();
            container.appendChild(counterGroup);
        }
        
        return container;
    }

    createDualSizeItemsSection(container, tipo) {
        // Seção para salgados de 35g
        const items35Group = createElement('div', 'space-y-4');
        const items35Label = createElement('label', 'form-label text-lg font-semibold text-gray-800', 'Salgados 35g');
        const items35Grid = createElement('div', 'items-grid-35g grid grid-cols-1 md:grid-cols-2 gap-3');
        
        this.updateDualSizeItemsList(items35Grid, tipo, '35g');
        
        items35Group.appendChild(items35Label);
        items35Group.appendChild(items35Grid);
        container.appendChild(items35Group);
        
        // Seção para salgados de 20g (Mini)
        const items20Group = createElement('div', 'space-y-4');
        const items20Label = createElement('label', 'form-label text-lg font-semibold text-gray-800', 'Mini Salgados 20g');
        const items20Grid = createElement('div', 'items-grid-20g grid grid-cols-1 md:grid-cols-2 gap-3');
        
        this.updateDualSizeItemsList(items20Grid, tipo, '20g');
        
        items20Group.appendChild(items20Label);
        items20Group.appendChild(items20Grid);
        container.appendChild(items20Group);
        
        // Resumo/Contador
        if (['perda', 'sobra', 'transferencia'].includes(tipo)) {
            const resumoGroup = this.createResumoSection(tipo);
            container.appendChild(resumoGroup);
        }
    }

    updateDualSizeItemsList(container, tipo, tamanho) {
        container.innerHTML = '';
        
        salgados.forEach(item => {
            const itemKey = `${item}_${tamanho}`;
            const itemContainer = createElement('div', 'flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200');
            
            const itemName = createElement('span', 'text-sm font-medium text-gray-700');
            itemName.textContent = formatSalgadoName(item, tamanho);
            
            const controls = createElement('div', 'flex items-center gap-2');
            
            const minusButton = createElement('button', 'w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200 active:scale-95');
            minusButton.type = 'button';
            minusButton.appendChild(createIcon('minus', 'w-4 h-4'));
            minusButton.onclick = () => {
                lancamentosManager.updateDualSizeItemQuantity(itemKey, -1);
                this.updateDualSizeItemQuantity(controls, itemKey);
                this.updateResumoSection(container.closest('.modal-body'), tipo);
            };
            minusButton.disabled = !lancamentosManager.selectedDualSizeItems[itemKey];
            
            const quantityInput = createElement('input', 'w-16 text-center font-medium border border-gray-300 rounded px-1 py-1 text-sm');
            quantityInput.type = 'number';
            quantityInput.min = '0';
            quantityInput.value = (lancamentosManager.selectedDualSizeItems[itemKey] || 0).toString();
            quantityInput.onchange = (e) => {
                const newValue = Math.max(0, parseInt(e.target.value) || 0);
                lancamentosManager.selectedDualSizeItems[itemKey] = newValue;
                this.updateDualSizeItemQuantity(controls, itemKey);
                this.updateResumoSection(container.closest('.modal-body'), tipo);
            };
            
            const plusButton = createElement('button', 'w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 hover:scale-110 transition-all duration-200 active:scale-95');
            plusButton.type = 'button';
            plusButton.appendChild(createIcon('plus', 'w-4 h-4'));
            plusButton.onclick = () => {
                lancamentosManager.updateDualSizeItemQuantity(itemKey, 1);
                this.updateDualSizeItemQuantity(controls, itemKey);
                this.updateResumoSection(container.closest('.modal-body'), tipo);
            };
            
            controls.appendChild(minusButton);
            controls.appendChild(quantityInput);
            controls.appendChild(plusButton);
            
            itemContainer.appendChild(itemName);
            itemContainer.appendChild(controls);
            container.appendChild(itemContainer);
        });
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    updateDualSizeItemQuantity(controlsContainer, itemKey) {
        const quantityInput = controlsContainer.querySelector('input');
        const minusButton = controlsContainer.querySelector('button:first-child');
        
        quantityInput.value = (lancamentosManager.selectedDualSizeItems[itemKey] || 0).toString();
        minusButton.disabled = !lancamentosManager.selectedDualSizeItems[itemKey];
    }

    createResumoSection(tipo) {
        const resumoGroup = createElement('div', 'bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 animate-slideUp');
        
        const resumoHeader = createElement('div', 'flex items-center mb-3');
        resumoHeader.appendChild(createIcon('clipboard-list', 'w-5 h-5 text-blue-600 mr-2'));
        const resumoTitle = createElement('h3', 'text-lg font-semibold text-blue-800', 'Resumo do Lançamento');
        resumoHeader.appendChild(resumoTitle);
        
        const resumoContent = createElement('div', 'resumo-content space-y-2');
        
        resumoGroup.appendChild(resumoHeader);
        resumoGroup.appendChild(resumoContent);
        
        // Atualizar conteúdo inicial
        this.updateResumoContent(resumoContent, tipo);
        
        return resumoGroup;
    }

    updateResumoSection(modalBody, tipo) {
        const resumoContent = modalBody.querySelector('.resumo-content');
        if (resumoContent) {
            this.updateResumoContent(resumoContent, tipo);
        }
    }

    updateResumoContent(resumoContent, tipo) {
        resumoContent.innerHTML = '';
        
        const items35g = {};
        const items20g = {};
        let total35g = 0;
        let total20g = 0;
        
        // Separar itens por tamanho
        Object.entries(lancamentosManager.selectedDualSizeItems || {}).forEach(([itemKey, quantity]) => {
            if (quantity > 0) {
                const [item, tamanho] = itemKey.split('_');
                if (tamanho === '35g') {
                    items35g[item] = quantity;
                    total35g += quantity;
                } else if (tamanho === '20g') {
                    items20g[item] = quantity;
                    total20g += quantity;
                }
            }
        });
        
        // Mostrar resumo de 35g
        if (Object.keys(items35g).length > 0) {
            const section35g = createElement('div', 'bg-white p-3 rounded border-l-4 border-yellow-500');
            const title35g = createElement('h4', 'font-semibold text-gray-800 mb-2', `Salgados 35g (Total: ${total35g})`);
            section35g.appendChild(title35g);
            
            Object.entries(items35g).forEach(([item, quantity]) => {
                const itemRow = createElement('div', 'flex justify-between text-sm text-gray-600');
                itemRow.innerHTML = `<span>${item}</span><span>${quantity} unidades</span>`;
                section35g.appendChild(itemRow);
            });
            
            resumoContent.appendChild(section35g);
        }
        
        // Mostrar resumo de 20g
        if (Object.keys(items20g).length > 0) {
            const section20g = createElement('div', 'bg-white p-3 rounded border-l-4 border-orange-500');
            const title20g = createElement('h4', 'font-semibold text-gray-800 mb-2', `Mini Salgados 20g (Total: ${total20g})`);
            section20g.appendChild(title20g);
            
            Object.entries(items20g).forEach(([item, quantity]) => {
                const itemRow = createElement('div', 'flex justify-between text-sm text-gray-600');
                itemRow.innerHTML = `<span>MINI ${item}</span><span>${quantity} unidades</span>`;
                section20g.appendChild(itemRow);
            });
            
            resumoContent.appendChild(section20g);
        }
        
        // Mostrar total geral
        const totalGeral = total35g + total20g;
        if (totalGeral > 0) {
            const totalSection = createElement('div', 'bg-blue-100 p-3 rounded border-l-4 border-blue-500');
            const totalText = createElement('div', 'font-bold text-blue-800 text-center');
            totalText.textContent = `Total Geral: ${totalGeral} unidades`;
            totalSection.appendChild(totalText);
            resumoContent.appendChild(totalSection);
        } else {
            const emptyMessage = createElement('div', 'text-gray-500 text-center italic');
            emptyMessage.textContent = 'Nenhum item selecionado';
            resumoContent.appendChild(emptyMessage);
        }
    }
    updateTamanhoButtons(container) {
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === lancamentosManager.selectedTamanho) {
                button.className = 'btn btn-primary';
            } else {
                button.className = 'btn bg-gray-100 text-gray-700 hover:bg-gray-200';
            }
        });
    }

    updateItemsList(container, tipo) {
        container.innerHTML = '';
        
        const items = tipo === 'estoque' ? itensEstoque : 
                     tipo === 'lanche' ? salgados : salgados;
        
        items.forEach(item => {
            const itemContainer = createElement('div', 'flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200');
            
            const itemName = createElement('span', 'text-sm font-medium text-gray-700');
            itemName.textContent = tipo === 'estoque' ? item : 
                                  tipo === 'lanche' ? item : 
                                  formatSalgadoName(item, lancamentosManager.selectedTamanho);
            
            const controls = createElement('div', 'flex items-center gap-2');
            
            const minusButton = createElement('button', 'w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200 active:scale-95');
            minusButton.type = 'button';
            minusButton.appendChild(createIcon('minus', 'w-4 h-4'));
            minusButton.onclick = () => {
                lancamentosManager.updateItemQuantity(item, -1, tipo === 'lanche');
                this.updateItemQuantity(controls, item, tipo === 'lanche');
                if (tipo === 'lanche') this.updateItemCounter(container.closest('.modal-body'));
            };
            minusButton.disabled = !lancamentosManager.selectedItems[item];
            
            const quantityInput = createElement('input', 'w-16 text-center font-medium border border-gray-300 rounded px-1 py-1 text-sm');
            quantityInput.type = 'number';
            quantityInput.min = '0';
            quantityInput.value = (lancamentosManager.selectedItems[item] || 0).toString();
            quantityInput.onchange = (e) => {
                const newValue = Math.max(0, parseInt(e.target.value) || 0);
                if (tipo === 'lanche') {
                    const currentTotal = lancamentosManager.getTotalItems();
                    const currentItemQty = lancamentosManager.selectedItems[item] || 0;
                    const difference = newValue - currentItemQty;
                    
                    if (difference > 0 && (currentTotal - currentItemQty + newValue) > 5) {
                        toast.warning('Máximo de 5 itens permitidos no lanche!');
                        e.target.value = currentItemQty;
                        return;
                    }
                }
                
                lancamentosManager.selectedItems[item] = newValue;
                this.updateItemQuantity(controls, item, tipo === 'lanche');
                if (tipo === 'lanche') this.updateItemCounter(container.closest('.modal-body'));
            };
            
            const plusButton = createElement('button', 'w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 hover:scale-110 transition-all duration-200 active:scale-95');
            plusButton.type = 'button';
            plusButton.appendChild(createIcon('plus', 'w-4 h-4'));
            plusButton.onclick = () => {
                lancamentosManager.updateItemQuantity(item, 1, tipo === 'lanche');
                this.updateItemQuantity(controls, item, tipo === 'lanche');
                if (tipo === 'lanche') this.updateItemCounter(container.closest('.modal-body'));
            };
            
            controls.appendChild(minusButton);
            controls.appendChild(quantityInput);
            controls.appendChild(plusButton);
            
            itemContainer.appendChild(itemName);
            itemContainer.appendChild(controls);
            container.appendChild(itemContainer);
        });
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    updateItemQuantity(controlsContainer, item, isLanche = false) {
        const quantityInput = controlsContainer.querySelector('input');
        const minusButton = controlsContainer.querySelector('button:first-child');
        
        quantityInput.value = (lancamentosManager.selectedItems[item] || 0).toString();
        minusButton.disabled = !lancamentosManager.selectedItems[item];
    }

    createSucosSection() {
        const sucosGroup = createElement('div');
        const sucosLabel = createElement('label', 'form-label', 'Suco');
        const sucosContainer = createElement('div', 'space-y-3');
        
        // Botões de suco
        const sucosButtons = createElement('div', 'flex gap-4');
        sucos.forEach(suco => {
            const button = createElement('button', `btn ${lancamentosManager.selectedSuco === suco ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`);
            button.type = 'button';
            button.textContent = suco;
            button.onclick = () => {
                lancamentosManager.selectedSuco = lancamentosManager.selectedSuco === suco ? '' : suco;
                this.updateSucosSection(sucosContainer);
            };
            sucosButtons.appendChild(button);
        });
        
        sucosContainer.appendChild(sucosButtons);
        
        // Controle de quantidade (se suco selecionado)
        if (lancamentosManager.selectedSuco) {
            this.addSucoQuantityControl(sucosContainer);
        }
        
        sucosGroup.appendChild(sucosLabel);
        sucosGroup.appendChild(sucosContainer);
        
        return sucosGroup;
    }

    updateSucosSection(container) {
        // Atualizar botões
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === lancamentosManager.selectedSuco) {
                button.className = 'btn btn-primary';
            } else {
                button.className = 'btn bg-gray-100 text-gray-700 hover:bg-gray-200';
            }
        });
        
        // Remover controle de quantidade existente
        const existingControl = container.querySelector('.suco-quantity-control');
        if (existingControl) {
            existingControl.remove();
        }
        
        // Adicionar controle de quantidade se suco selecionado
        if (lancamentosManager.selectedSuco) {
            this.addSucoQuantityControl(container);
        }
    }

    addSucoQuantityControl(container) {
        const quantityControl = createElement('div', 'suco-quantity-control flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 animate-slideUp');
        
        const label = createElement('span', 'text-sm font-medium text-gray-700', `Quantidade de ${lancamentosManager.selectedSuco}`);
        
        const controls = createElement('div', 'flex items-center gap-2');
        
        const minusButton = createElement('button', 'w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-200 active:scale-95');
        minusButton.type = 'button';
        minusButton.appendChild(createIcon('minus', 'w-4 h-4'));
        minusButton.onclick = () => {
            lancamentosManager.updateSucoQuantity(-1, true);
            this.updateSucoQuantity(controls, true);
            this.updateItemCounter(container.closest('.modal-body'));
        };
        minusButton.disabled = lancamentosManager.quantidadeSuco === 0;
        
        const quantityInput = createElement('input', 'w-16 text-center font-medium border border-gray-300 rounded px-1 py-1 text-sm');
        quantityInput.type = 'number';
        quantityInput.min = '0';
        quantityInput.value = lancamentosManager.quantidadeSuco.toString();
        quantityInput.onchange = (e) => {
            const newValue = Math.max(0, parseInt(e.target.value) || 0);
            const currentTotal = lancamentosManager.getTotalItems();
            const currentSucoQty = lancamentosManager.quantidadeSuco;
            const difference = newValue - currentSucoQty;
            
            if (difference > 0 && (currentTotal - currentSucoQty + newValue) > 5) {
                toast.warning('Máximo de 5 itens permitidos no lanche!');
                e.target.value = currentSucoQty;
                return;
            }
            
            lancamentosManager.quantidadeSuco = newValue;
            this.updateSucoQuantity(controls, true);
            this.updateItemCounter(container.closest('.modal-body'));
        };
        
        const plusButton = createElement('button', 'w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 hover:scale-110 transition-all duration-200 active:scale-95');
        plusButton.type = 'button';
        plusButton.appendChild(createIcon('plus', 'w-4 h-4'));
        plusButton.onclick = () => {
            lancamentosManager.updateSucoQuantity(1, true);
            this.updateSucoQuantity(controls, true);
            this.updateItemCounter(container.closest('.modal-body'));
        };
        
        controls.appendChild(minusButton);
        controls.appendChild(quantityInput);
        controls.appendChild(plusButton);
        
        quantityControl.appendChild(label);
        quantityControl.appendChild(controls);
        container.appendChild(quantityControl);
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    updateSucoQuantity(controlsContainer, isLanche = false) {
        const quantityInput = controlsContainer.querySelector('input');
        const minusButton = controlsContainer.querySelector('button:first-child');
        
        quantityInput.value = lancamentosManager.quantidadeSuco.toString();
        minusButton.disabled = lancamentosManager.quantidadeSuco === 0;
    }

    createItemCounter() {
        const counterGroup = createElement('div', 'bg-yellow-50 border border-yellow-200 rounded-lg p-3 animate-slideUp');
        
        const counterContainer = createElement('div', 'flex items-center justify-between');
        const label = createElement('span', 'text-sm font-medium text-yellow-800', 'Total de itens selecionados:');
        
        const currentTotal = lancamentosManager.getTotalItems();
        const counter = createElement('span', `font-bold ${currentTotal >= 5 ? 'text-red-600' : 'text-yellow-800'}`, `${currentTotal}/5`);
        
        counterContainer.appendChild(label);
        counterContainer.appendChild(counter);
        counterGroup.appendChild(counterContainer);
        
        if (currentTotal >= 5) {
            const warning = createElement('p', 'text-xs text-red-600 mt-1', 'Limite máximo atingido!');
            counterGroup.appendChild(warning);
        }
        
        return counterGroup;
    }

    updateItemCounter(modalBody) {
        const counterGroup = modalBody.querySelector('.bg-yellow-50');
        if (counterGroup) {
            const currentTotal = lancamentosManager.getTotalItems();
            const counterContainer = counterGroup.querySelector('.flex.items-center.justify-between');
            const counter = counterContainer ? counterContainer.querySelector('span:last-child') : null;
            const warning = counterGroup.querySelector('.text-red-600');
            
            if (counter) {
                counter.textContent = `${currentTotal}/5`;
                counter.className = `font-bold ${currentTotal >= 5 ? 'text-red-600' : 'text-yellow-800'}`;
            }
            
            if (currentTotal >= 5 && !warning) {
                const warningElement = createElement('p', 'text-xs text-red-600 mt-1', 'Limite máximo atingido!');
                counterGroup.appendChild(warningElement);
            } else if (currentTotal < 5 && warning) {
                warning.remove();
            }
        }
    }

    createLancamentoModalFooter(tipo) {
        const footer = createElement('div', 'flex gap-3');
        
        const cancelButton = createElement('button', 'btn bg-gray-300 text-gray-700 hover:bg-gray-400 flex-1');
        cancelButton.textContent = 'Cancelar';
        cancelButton.onclick = () => {
            modal.hide();
            lancamentosManager.resetForm();
        };
        
        const submitButton = createElement('button', 'btn btn-primary flex-1');
        submitButton.textContent = lancamentosManager.loading ? 
            (lancamentosManager.editingLancamento ? 'Atualizando...' : 'Registrando...') : 
            (lancamentosManager.editingLancamento ? 'Atualizar' : 'Registrar');
        submitButton.disabled = lancamentosManager.loading;
        submitButton.onclick = async (e) => {
            e.preventDefault();
            if (submitButton.disabled) return;
            
            // Prevenir múltiplos cliques
            submitButton.disabled = true;
            const originalText = submitButton.textContent;
            submitButton.textContent = lancamentosManager.editingLancamento ? 'Atualizando...' : 'Registrando...';
            
            const success = await lancamentosManager.submitLancamento(tipo);
            if (success) {
                modal.hide();
                
                // Update restricted area if active
                if (this.activeSection === 'restrita' && areaRestrita.isAuthenticated) {
                    // Small delay to ensure modal is fully closed
                    setTimeout(() => {
                        areaRestrita.updateAllContent();
                    }, 100);
                }
            } else {
                // Restaurar botão em caso de erro
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        };
        
        footer.appendChild(cancelButton);
        footer.appendChild(submitButton);
        
        return footer;
    }
}

// Inicializar aplicação
const app = new App();

// Adicionar suporte para adicionar campo 'visto' na tabela se não existir
async function ensureVistoField() {
    try {
        // Tentar fazer uma query que usa o campo visto
        const { data, error } = await supabase
            .from('Lanches')
            .select('visto')
            .limit(1);
        
        // Se não der erro, o campo já existe
        if (!error) return;
        
        // Se der erro, tentar adicionar o campo
        console.log('Campo visto não encontrado, tentando adicionar...');
        
        // Nota: Em um ambiente real, isso seria feito via migration
        // Aqui estamos apenas verificando se o campo existe
        
    } catch (error) {
        console.log('Verificação do campo visto:', error);
    }
}

// Verificar campo visto ao inicializar
ensureVistoField();
