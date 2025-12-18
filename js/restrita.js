import { filterManager } from './filters.js';

// Área Restrita
class AreaRestrita {
    constructor() {
        this.isAuthenticated = false;
        this.password = '0716';
        this.currentView = 'dashboard';
        this.updateCallbacks = [];
        this.filteredData = [];
        
        // Bind filter callback
        filterManager.addCallback(() => {
            this.onFilterChange();
        });
    }

    onFilterChange() {
        if (this.isAuthenticated) {
            this.filteredData = filterManager.filterData(lancamentosManager.lancamentos);
            this.updateAllContent();
        }
    }

    authenticate(inputPassword) {
        if (inputPassword === this.password) {
            this.isAuthenticated = true;
            this.filteredData = filterManager.filterData(lancamentosManager.lancamentos);
            return true;
        }
        return false;
    }

    logout() {
        this.isAuthenticated = false;
        this.currentView = 'dashboard';
        this.filteredData = [];
    }

    addUpdateCallback(callback) {
        this.updateCallbacks.push(callback);
    }

    removeUpdateCallback(callback) {
        const index = this.updateCallbacks.indexOf(callback);
        if (index > -1) {
            this.updateCallbacks.splice(index, 1);
        }
    }

    notifyUpdate() {
        this.updateCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Erro no callback de atualização:', error);
            }
        });
    }

    updateAllContent() {
        this.notifyUpdate();
    }

    createLoginForm() {
        const container = createElement('div', 'login-container min-h-screen flex items-center justify-center p-4');
        
        const formContainer = createElement('div', 'login-form-container w-full max-w-md p-8 rounded-xl');
        
        // Header
        const header = createElement('div', 'text-center mb-8');
        const iconContainer = createElement('div', 'login-icon-container w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4');
        iconContainer.appendChild(createIcon('lock', 'w-10 h-10 text-white'));
        
        const title = createElement('h2', 'text-3xl font-bold mb-2', 'Área Restrita');
        const subtitle = createElement('p', 'text-lg', 'Digite a senha para acessar');
        
        header.appendChild(iconContainer);
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Form
        const form = createElement('form', 'space-y-6');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleLogin(passwordInput.value);
        };
        
        const passwordGroup = createElement('div');
        const passwordLabel = createElement('label', 'form-label', 'Senha');
        const passwordContainer = createElement('div', 'password-input-container');
        const passwordInput = createElement('input', 'form-input pr-12');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Digite a senha';
        passwordInput.required = true;
        
        const toggleButton = createElement('button', 'password-toggle-btn');
        toggleButton.type = 'button';
        toggleButton.appendChild(createIcon('eye', 'w-5 h-5'));
        toggleButton.onclick = () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.innerHTML = '';
                toggleButton.appendChild(createIcon('eye-off', 'w-5 h-5'));
            } else {
                passwordInput.type = 'password';
                toggleButton.innerHTML = '';
                toggleButton.appendChild(createIcon('eye', 'w-5 h-5'));
            }
        };
        
        passwordContainer.appendChild(passwordInput);
        passwordContainer.appendChild(toggleButton);
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordContainer);
        
        const submitButton = createElement('button', 'login-submit-btn w-full');
        submitButton.type = 'submit';
        submitButton.textContent = 'Entrar';
        
        form.appendChild(passwordGroup);
        form.appendChild(submitButton);
        
        // Back button
        const backButton = createElement('a', 'back-to-launches-btn mt-6 inline-flex');
        backButton.href = '#';
        backButton.onclick = (e) => {
            e.preventDefault();
            app.showLancamentos();
        };
        backButton.appendChild(createIcon('arrow-left', 'w-4 h-4'));
        backButton.appendChild(document.createTextNode('Voltar para Lançamentos'));
        
        formContainer.appendChild(header);
        formContainer.appendChild(form);
        formContainer.appendChild(backButton);
        container.appendChild(formContainer);
        
        setTimeout(() => initializeLucideIcons(), 100);
        
        return container;
    }

    handleLogin(password) {
        if (this.authenticate(password)) {
            toast.success('Login realizado com sucesso!');
            app.showRestrita();
        } else {
            toast.error('Senha incorreta!');
        }
    }

    createRestritaContent() {
        const container = createElement('div', 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100');
        const mainContainer = createElement('div', 'container mx-auto px-4 py-8');
        
        // Header
        const header = this.createHeader();
        mainContainer.appendChild(header);
        
        // Navigation
        const navigation = this.createNavigation();
        mainContainer.appendChild(navigation);
        
        // Content Area
        const contentArea = createElement('div', 'content-area');
        this.updateContentArea(contentArea);
        mainContainer.appendChild(contentArea);
        
        container.appendChild(mainContainer);
        
        // Add update callback for real-time updates
        this.addUpdateCallback(() => {
            this.updateContentArea(contentArea);
        });
        
        setTimeout(() => initializeLucideIcons(), 100);
        
        return container;
    }

    createHeader() {
        const header = createElement('div', 'text-center mb-8');
        const headerTop = createElement('div', 'flex items-center justify-center mb-4');
        headerTop.appendChild(createIcon('shield-check', 'w-12 h-12 text-blue-600 mr-3'));
        
        const title = createElement('h1', 'text-4xl font-bold text-gray-800', 'Área Restrita');
        headerTop.appendChild(title);
        
        const subtitle = createElement('h2', 'text-2xl font-semibold text-blue-600 mb-2', 'Coxinha Real');
        const description = createElement('p', 'text-gray-600', 'Relatórios e controles administrativos');
        
        header.appendChild(headerTop);
        header.appendChild(subtitle);
        header.appendChild(description);
        
        return header;
    }

    createNavigation() {
        const nav = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-8');
        const navGrid = createElement('div', 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4');
        
        const navItems = [
            { id: 'dashboard', title: 'Dashboard', icon: 'bar-chart-3', color: 'blue' },
            { id: 'lanches', title: 'Lanches', icon: 'users', color: 'green' },
            { id: 'perdas-sobras', title: 'Perdas/Sobras', icon: 'trending-down', color: 'red' },
            { id: 'transferencias', title: 'Transferências', icon: 'arrow-right-left', color: 'purple' },
            { id: 'estoque', title: 'Estoque', icon: 'warehouse', color: 'orange' },
            { id: 'voltar', title: 'Voltar', icon: 'arrow-left', color: 'gray' }
        ];
        
        navItems.forEach(item => {
            const button = createElement('button', `nav-item btn text-center p-4 rounded-lg transition-all duration-300 ${this.currentView === item.id ? `bg-${item.color}-500 text-white` : `bg-${item.color}-50 text-${item.color}-700 hover:bg-${item.color}-100`}`);
            
            const iconContainer = createElement('div', 'flex justify-center mb-2');
            iconContainer.appendChild(createIcon(item.icon, 'w-6 h-6'));
            
            const titleElement = createElement('div', 'text-sm font-medium', item.title);
            
            button.appendChild(iconContainer);
            button.appendChild(titleElement);
            
            button.onclick = () => {
                if (item.id === 'voltar') {
                    app.showLancamentos();
                    return;
                }
                
                this.currentView = item.id;
                this.updateNavigation(navGrid);
                this.updateContentArea(document.querySelector('.content-area'));
            };
            
            navGrid.appendChild(button);
        });
        
        nav.appendChild(navGrid);
        return nav;
    }

    updateNavigation(navGrid) {
        const buttons = navGrid.querySelectorAll('.nav-item');
        const navItems = [
            { id: 'dashboard', color: 'blue' },
            { id: 'lanches', color: 'green' },
            { id: 'perdas-sobras', color: 'red' },
            { id: 'transferencias', color: 'purple' },
            { id: 'estoque', color: 'orange' },
            { id: 'voltar', color: 'gray' }
        ];
        
        buttons.forEach((button, index) => {
            const item = navItems[index];
            if (this.currentView === item.id) {
                button.className = `nav-item btn text-center p-4 rounded-lg transition-all duration-300 bg-${item.color}-500 text-white`;
            } else {
                button.className = `nav-item btn text-center p-4 rounded-lg transition-all duration-300 bg-${item.color}-50 text-${item.color}-700 hover:bg-${item.color}-100`;
            }
        });
    }

    updateContentArea(contentArea) {
        contentArea.innerHTML = '';
        
        // Atualizar dados filtrados
        this.filteredData = filterManager.filterData(lancamentosManager.lancamentos);
        
        switch (this.currentView) {
            case 'dashboard':
                contentArea.appendChild(this.createDashboard());
                break;
            case 'lanches':
                contentArea.appendChild(this.createLanchesView());
                break;
            case 'perdas-sobras':
                contentArea.appendChild(this.createPerdasSobrasView());
                break;
            case 'transferencias':
                contentArea.appendChild(this.createTransferenciasView());
                break;
            case 'estoque':
                contentArea.appendChild(this.createEstoqueView());
                break;
        }
        
        setTimeout(() => initializeLucideIcons(), 100);
    }

    createDashboard() {
        const container = createElement('div', 'space-y-8');
        
        // Filter component
        const filterComponent = filterManager.createFilterComponent();
        container.appendChild(filterComponent);
        
        // Stats cards
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6');
        
        const stats = [
            {
                title: 'Total de Lançamentos',
                value: this.filteredData.length,
                icon: 'clipboard-list',
                color: 'blue',
                clickable: true,
                onClick: () => this.showAllLancamentosModal(this.filteredData)
            },
            {
                title: 'Pendentes',
                value: this.filteredData.filter(l => !l.visto).length,
                icon: 'clock',
                color: 'yellow',
                clickable: true,
                onClick: () => this.showPendentesModal(this.filteredData.filter(l => !l.visto))
            },
            {
                title: 'Lanches',
                value: this.filteredData.filter(l => l.tipo === 'lanche').length,
                icon: 'users',
                color: 'green',
                clickable: true,
                onClick: () => this.showLanchesModal(this.filteredData.filter(l => l.tipo === 'lanche'))
            },
            {
                title: 'Perdas/Sobras',
                value: this.filteredData.filter(l => l.tipo === 'perda' || l.tipo === 'sobra').length,
                icon: 'trending-down',
                color: 'red',
                clickable: true,
                onClick: () => this.showPerdasSobrasModal(this.filteredData.filter(l => l.tipo === 'perda' || l.tipo === 'sobra'))
            }
        ];
        
        stats.forEach(stat => {
            const card = this.createStatCard(stat);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(statsGrid);
        
        return container;
    }

    createStatCard(stat) {
        const card = createElement('div', `card card-body text-center ${stat.clickable ? 'cursor-pointer hover:scale-105' : ''} transition-all duration-300`);
        
        if (stat.clickable) {
            card.onclick = stat.onClick;
        }
        
        const iconContainer = createElement('div', `w-16 h-16 bg-${stat.color}-100 rounded-full flex items-center justify-center mb-4 mx-auto`);
        iconContainer.appendChild(createIcon(stat.icon, `w-8 h-8 text-${stat.color}-600`));
        
        const value = createElement('div', `text-3xl font-bold text-${stat.color}-600 mb-2`, stat.value.toString());
        const title = createElement('div', 'text-gray-600 font-medium', stat.title);
        
        card.appendChild(iconContainer);
        card.appendChild(value);
        card.appendChild(title);
        
        return card;
    }

    showAllLancamentosModal(lancamentos) {
        const modalBody = this.createLancamentosGrid(lancamentos, 'Todos os Lançamentos');
        const modalContent = modal.createModal('Todos os Lançamentos', modalBody);
        modal.show(modalContent, { size: 'large' });
    }

    showPendentesModal(pendentes) {
        const modalBody = this.createLancamentosGrid(pendentes, 'Lançamentos Pendentes');
        const modalContent = modal.createModal('Lançamentos Pendentes', modalBody);
        modal.show(modalContent, { size: 'large' });
    }

    showLanchesModal(lanches) {
        const modalBody = this.createLancamentosGrid(lanches, 'Lanches');
        const modalContent = modal.createModal('Lanches', modalBody);
        modal.show(modalContent, { size: 'large' });
    }

    showPerdasSobrasModal(perdasSobras) {
        const modalBody = this.createLancamentosGrid(perdasSobras, 'Perdas e Sobras');
        const modalContent = modal.createModal('Perdas e Sobras', modalBody);
        modal.show(modalContent, { size: 'large' });
    }

    createLancamentosGrid(lancamentos, title) {
        const container = createElement('div', 'space-y-4');
        
        if (lancamentos.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhum lançamento encontrado';
            container.appendChild(emptyMessage);
            return container;
        }
        
        const grid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto');
        
        lancamentos.forEach(lancamento => {
            const card = this.createLancamentoCard(lancamento);
            grid.appendChild(card);
        });
        
        container.appendChild(grid);
        return container;
    }

    createLancamentoCard(lancamento) {
        const { date, time } = formatDateTime(lancamento.data_hora);
        const isVisto = lancamento.visto;
        
        const card = createElement('div', `card card-body cursor-pointer transition-all duration-300 hover:scale-105 ${isVisto ? 'bg-green-50 border-l-4 border-green-500' : 'bg-yellow-50 border-l-4 border-yellow-500'}`);
        
        card.onclick = () => this.showLancamentoDetailsModal(lancamento);
        
        // Header
        const header = createElement('div', 'flex items-center justify-between mb-3');
        const tipoContainer = createElement('div', 'flex items-center');
        
        const tipoIcon = this.getTipoIcon(lancamento.tipo);
        tipoContainer.appendChild(createIcon(tipoIcon, 'w-5 h-5 mr-2 text-gray-600'));
        
        const tipoText = createElement('span', 'font-semibold text-gray-800', this.getTipoDisplayName(lancamento.tipo));
        tipoContainer.appendChild(tipoText);
        
        const statusIndicator = createElement('div', `status-dot ${isVisto ? 'status-dot-success' : 'status-dot-pending'}`);
        
        header.appendChild(tipoContainer);
        header.appendChild(statusIndicator);
        
        // Content
        const content = createElement('div', 'space-y-2');
        
        const nomeText = lancamento.funcionario || lancamento.nome || 'N/A';
        const nome = createElement('div', 'text-sm text-gray-600');
        nome.textContent = `${lancamento.tipo === 'lanche' ? 'Funcionário' : 'Nome'}: ${nomeText}`;
        
        const dataHora = createElement('div', 'text-xs text-gray-500');
        dataHora.textContent = `${date} às ${time}`;
        
        content.appendChild(nome);
        content.appendChild(dataHora);
        
        card.appendChild(header);
        card.appendChild(content);
        
        return card;
    }

    showLancamentoDetailsModal(lancamento) {
        const modalBody = this.createLancamentoDetails(lancamento);
        const modalFooter = this.createLancamentoDetailsFooter(lancamento);
        const modalContent = modal.createModal(`Detalhes - ${this.getTipoDisplayName(lancamento.tipo)}`, modalBody, modalFooter);
        modal.show(modalContent);
    }

    createLancamentoDetails(lancamento) {
        const container = createElement('div', 'space-y-4');
        const { date, time } = formatDateTime(lancamento.data_hora);
        
        // Basic info
        const infoGrid = createElement('div', 'grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg');
        
        const tipoInfo = createElement('div');
        tipoInfo.innerHTML = `<strong>Tipo:</strong> ${this.getTipoDisplayName(lancamento.tipo)}`;
        
        const nomeInfo = createElement('div');
        const nomeLabel = lancamento.tipo === 'lanche' ? 'Funcionário' : 'Nome';
        const nomeValue = lancamento.funcionario || lancamento.nome || 'N/A';
        nomeInfo.innerHTML = `<strong>${nomeLabel}:</strong> ${nomeValue}`;
        
        const dataInfo = createElement('div');
        dataInfo.innerHTML = `<strong>Data:</strong> ${date}`;
        
        const horaInfo = createElement('div');
        horaInfo.innerHTML = `<strong>Hora:</strong> ${time}`;
        
        infoGrid.appendChild(tipoInfo);
        infoGrid.appendChild(nomeInfo);
        infoGrid.appendChild(dataInfo);
        infoGrid.appendChild(horaInfo);
        
        container.appendChild(infoGrid);
        
        // Status
        const statusContainer = createElement('div', 'flex items-center justify-center p-3 rounded-lg');
        const isVisto = lancamento.visto;
        statusContainer.className += isVisto ? ' bg-green-100' : ' bg-yellow-100';
        
        const statusIcon = createIcon(isVisto ? 'check-circle' : 'clock', `w-5 h-5 mr-2 ${isVisto ? 'text-green-600' : 'text-yellow-600'}`);
        const statusText = createElement('span', `font-medium ${isVisto ? 'text-green-800' : 'text-yellow-800'}`, isVisto ? 'Visto' : 'Pendente');
        
        statusContainer.appendChild(statusIcon);
        statusContainer.appendChild(statusText);
        container.appendChild(statusContainer);
        
        // Items
        if (lancamento.itens && Object.keys(lancamento.itens).length > 0) {
            const itemsSection = createElement('div');
            const itemsTitle = createElement('h4', 'font-semibold text-gray-800 mb-3', 'Itens:');
            const itemsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-2');
            
            Object.entries(lancamento.itens).forEach(([item, quantidade]) => {
                const itemCard = createElement('div', 'bg-blue-50 p-3 rounded-lg flex justify-between items-center');
                const itemName = createElement('span', 'text-sm font-medium text-gray-700', item);
                const itemQty = createElement('span', 'text-sm font-bold text-blue-600', `${quantidade}x`);
                
                itemCard.appendChild(itemName);
                itemCard.appendChild(itemQty);
                itemsGrid.appendChild(itemCard);
            });
            
            itemsSection.appendChild(itemsTitle);
            itemsSection.appendChild(itemsGrid);
            container.appendChild(itemsSection);
        }
        
        // Suco
        if (lancamento.suco && lancamento.quantidade_suco > 0) {
            const sucoSection = createElement('div', 'bg-orange-50 p-3 rounded-lg');
            const sucoTitle = createElement('h4', 'font-semibold text-gray-800 mb-2', 'Suco:');
            const sucoInfo = createElement('div', 'flex justify-between items-center');
            const sucoName = createElement('span', 'text-sm font-medium text-gray-700', lancamento.suco);
            const sucoQty = createElement('span', 'text-sm font-bold text-orange-600', `${lancamento.quantidade_suco}x`);
            
            sucoInfo.appendChild(sucoName);
            sucoInfo.appendChild(sucoQty);
            sucoSection.appendChild(sucoTitle);
            sucoSection.appendChild(sucoInfo);
            container.appendChild(sucoSection);
        }
        
        // Observação (para perdas e sobras)
        if (lancamento.observacao && (lancamento.tipo === 'perda' || lancamento.tipo === 'sobra')) {
            const observacaoSection = createElement('div', 'bg-purple-50 p-4 rounded-lg');
            const observacaoTitle = createElement('h4', 'font-semibold text-gray-800 mb-2', `Motivo da ${lancamento.tipo === 'perda' ? 'Perda' : 'Sobra'}:`);
            const observacaoText = createElement('p', 'text-sm text-gray-700', lancamento.observacao);
            
            observacaoSection.appendChild(observacaoTitle);
            observacaoSection.appendChild(observacaoText);
            container.appendChild(observacaoSection);
        }
        
        return container;
    }

    createLancamentoDetailsFooter(lancamento) {
        const footer = createElement('div', 'flex gap-3');
        
        // Visto button
        const vistoButton = createElement('button', `btn ${lancamento.visto ? 'btn-warning' : 'btn-success'} flex-1`);
        vistoButton.textContent = lancamento.visto ? 'Remover Visto' : 'Marcar como Visto';
        vistoButton.onclick = async () => {
            const success = await lancamentosManager.toggleVisto(lancamento.id);
            if (success) {
                modal.hide();
                this.updateAllContent();
            }
        };
        
        // Edit button
        const editButton = createElement('button', 'btn btn-info flex-1');
        editButton.textContent = 'Editar';
        editButton.onclick = () => {
            modal.hide();
            lancamentosManager.editLancamento(lancamento);
            app.showLancamentoModal(lancamento.tipo);
        };
        
        // Delete button
        const deleteButton = createElement('button', 'btn btn-danger flex-1');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => {
            const confirmModal = modal.createConfirmationModal(
                'Confirmar Exclusão',
                'Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita.',
                async () => {
                    const success = await lancamentosManager.deleteLancamento(lancamento.id);
                    if (success) {
                        this.updateAllContent();
                        return true;
                    }
                    return false;
                }
            );
            modal.show(confirmModal);
        };
        
        footer.appendChild(vistoButton);
        footer.appendChild(editButton);
        footer.appendChild(deleteButton);
        
        return footer;
    }

    createLanchesView() {
        const container = createElement('div', 'space-y-6');
        
        // Filter component
        const filterComponent = filterManager.createFilterComponent();
        container.appendChild(filterComponent);
        
        const lanches = this.filteredData.filter(l => l.tipo === 'lanche');
        
        // Estatísticas detalhadas
        const statsSection = this.createLanchesStatistics(lanches);
        container.appendChild(statsSection);
        
        // Estatísticas por funcionário
        const funcionarioStats = this.createFuncionarioStatistics(lanches);
        container.appendChild(funcionarioStats);
        
        // Produtos mais consumidos
        const produtoStats = this.createProdutoStatistics(lanches);
        container.appendChild(produtoStats);
        
        return container;
    }

    createLanchesStatistics(lanches) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('users', 'w-8 h-8 text-green-600 mr-3'));
        const title = createElement('h2', 'text-2xl font-bold text-gray-800', 'Estatísticas de Lanches');
        header.appendChild(title);
        container.appendChild(header);
        
        // Stats cards
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-4 gap-6');
        
        const totalLanches = lanches.length;
        const funcionariosUnicos = new Set(lanches.map(l => l.funcionario)).size;
        const totalItens = lanches.reduce((sum, l) => sum + Object.values(l.itens).reduce((s, q) => s + q, 0), 0);
        const totalSucos = lanches.reduce((sum, l) => sum + (l.quantidade_suco || 0), 0);
        
        const stats = [
            { title: 'Total de Lanches', value: totalLanches, icon: 'utensils', color: 'green' },
            { title: 'Funcionários Ativos', value: funcionariosUnicos, icon: 'users', color: 'blue' },
            { title: 'Total de Salgados', value: totalItens, icon: 'package', color: 'purple' },
            { title: 'Total de Sucos', value: totalSucos, icon: 'cup-soda', color: 'orange' }
        ];
        
        stats.forEach(stat => {
            const card = this.createStatCard(stat);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(statsGrid);
        
        // Média diária
        const dailyStats = filterManager.getDailyStats(lanches);
        const avgDaily = Object.keys(dailyStats).length > 0 ? 
            Math.round(totalLanches / Object.keys(dailyStats).length * 10) / 10 : 0;
        
        const avgSection = createElement('div', 'mt-6 p-4 bg-green-50 rounded-lg');
        const avgText = createElement('div', 'text-center');
        avgText.innerHTML = `<span class="text-2xl font-bold text-green-600">${avgDaily}</span> <span class="text-green-800">lanches por dia em média</span>`;
        avgSection.appendChild(avgText);
        container.appendChild(avgSection);
        
        return container;
    }

    createFuncionarioStatistics(lanches) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('user-check', 'w-8 h-8 text-blue-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Estatísticas por Funcionário');
        header.appendChild(title);
        container.appendChild(header);
        
        const funcionarioStats = {};
        
        lanches.forEach(lanche => {
            const funcionario = lanche.funcionario;
            if (!funcionarioStats[funcionario]) {
                funcionarioStats[funcionario] = {
                    totalLanches: 0,
                    totalItens: 0,
                    totalSucos: 0,
                    produtos: {}
                };
            }
            
            funcionarioStats[funcionario].totalLanches++;
            
            Object.entries(lanche.itens).forEach(([produto, quantidade]) => {
                funcionarioStats[funcionario].totalItens += quantidade;
                if (!funcionarioStats[funcionario].produtos[produto]) {
                    funcionarioStats[funcionario].produtos[produto] = 0;
                }
                funcionarioStats[funcionario].produtos[produto] += quantidade;
            });
            
            if (lanche.quantidade_suco) {
                funcionarioStats[funcionario].totalSucos += lanche.quantidade_suco;
            }
        });
        
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        ['Funcionário', 'Lanches', 'Salgados', 'Sucos', 'Produto Favorito'].forEach(header => {
            const th = createElement('th', 'text-left font-semibold text-gray-700', header);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody');
        Object.entries(funcionarioStats)
            .sort(([, a], [, b]) => b.totalLanches - a.totalLanches)
            .forEach(([funcionario, stats]) => {
                const row = createElement('tr', 'hover:bg-gray-50');
                
                const nomeCell = createElement('td', 'font-medium text-gray-800', funcionario);
                const lanchesCell = createElement('td', 'text-blue-600 font-medium', stats.totalLanches.toString());
                const salgadosCell = createElement('td', 'text-purple-600 font-medium', stats.totalItens.toString());
                const sucosCell = createElement('td', 'text-orange-600 font-medium', stats.totalSucos.toString());
                
                const produtoFavorito = Object.entries(stats.produtos)
                    .sort(([, a], [, b]) => b - a)[0];
                const favoritoCell = createElement('td', 'text-green-600 font-medium', 
                    produtoFavorito ? `${produtoFavorito[0]} (${produtoFavorito[1]}x)` : '-');
                
                row.appendChild(nomeCell);
                row.appendChild(lanchesCell);
                row.appendChild(salgadosCell);
                row.appendChild(sucosCell);
                row.appendChild(favoritoCell);
                tbody.appendChild(row);
            });
        table.appendChild(tbody);
        
        container.appendChild(table);
        return container;
    }

    createProdutoStatistics(lanches) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('trending-up', 'w-8 h-8 text-purple-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Produtos Mais Consumidos');
        header.appendChild(title);
        container.appendChild(header);
        
        const produtoStats = {};
        
        lanches.forEach(lanche => {
            Object.entries(lanche.itens).forEach(([produto, quantidade]) => {
                if (!produtoStats[produto]) {
                    produtoStats[produto] = 0;
                }
                produtoStats[produto] += quantidade;
            });
        });
        
        const grid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
        
        Object.entries(produtoStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 9)
            .forEach(([produto, quantidade], index) => {
                const card = createElement('div', 'bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-l-4 border-purple-500');
                
                const rank = createElement('div', 'text-xs text-purple-600 font-bold mb-1', `#${index + 1}`);
                const produtoName = createElement('div', 'font-semibold text-gray-800 mb-2', produto);
                const quantidadeText = createElement('div', 'text-2xl font-bold text-purple-600', `${quantidade}x`);
                
                card.appendChild(rank);
                card.appendChild(produtoName);
                card.appendChild(quantidadeText);
                grid.appendChild(card);
            });
        
        container.appendChild(grid);
        return container;
    }

    createTransferenciasView() {
        const container = createElement('div', 'space-y-6');
        
        // Filter component
        const filterComponent = filterManager.createFilterComponent();
        container.appendChild(filterComponent);
        
        const transferencias = this.filteredData.filter(l => l.tipo === 'transferencia');
        
        // Estatísticas detalhadas
        const statsSection = this.createTransferenciasStatistics(transferencias);
        container.appendChild(statsSection);
        
        // Estatísticas mensais
        const monthlyStats = this.createTransferenciasMonthlyStats(transferencias);
        container.appendChild(monthlyStats);
        
        // Produtos transferidos
        const produtoStats = this.createTransferenciasProdutoStats(transferencias);
        container.appendChild(produtoStats);
        
        // Responsáveis pelas transferências
        const responsavelStats = this.createTransferenciasResponsavelStats(transferencias);
        container.appendChild(responsavelStats);
        
        return container;
    }

    createTransferenciasStatistics(transferencias) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('arrow-right-left', 'w-8 h-8 text-purple-600 mr-3'));
        const title = createElement('h2', 'text-2xl font-bold text-gray-800', 'Estatísticas de Transferências');
        header.appendChild(title);
        container.appendChild(header);
        
        // Stats cards
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-4 gap-6');
        
        const totalTransferencias = transferencias.length;
        const totalItens = transferencias.reduce((sum, t) => sum + Object.values(t.itens).reduce((s, q) => s + q, 0), 0);
        const responsaveisUnicos = new Set(transferencias.map(t => t.nome)).size;
        const pendentes = transferencias.filter(t => !t.visto).length;
        
        const stats = [
            { title: 'Total de Transferências', value: totalTransferencias, icon: 'arrow-right-left', color: 'purple' },
            { title: 'Total de Itens', value: totalItens, icon: 'package', color: 'blue' },
            { title: 'Responsáveis', value: responsaveisUnicos, icon: 'users', color: 'green' },
            { title: 'Pendentes', value: pendentes, icon: 'clock', color: 'yellow' }
        ];
        
        stats.forEach(stat => {
            const card = this.createStatCard(stat);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(statsGrid);
        
        return container;
    }

    createTransferenciasMonthlyStats(transferencias) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('calendar', 'w-8 h-8 text-blue-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Estatísticas Mensais');
        header.appendChild(title);
        container.appendChild(header);
        
        const monthlyStats = filterManager.getMonthlyStats(transferencias);
        
        if (Object.keys(monthlyStats).length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhuma transferência encontrada no período';
            container.appendChild(emptyMessage);
            return container;
        }
        
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        ['Mês', 'Transferências', 'Total de Itens', 'Média Diária'].forEach(header => {
            const th = createElement('th', 'text-left font-semibold text-gray-700', header);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody');
        Object.entries(monthlyStats)
            .sort(([a], [b]) => b.localeCompare(a))
            .forEach(([month, data]) => {
                const row = createElement('tr', 'hover:bg-gray-50');
                
                const monthName = new Date(month + '-01').toLocaleDateString('pt-BR', { 
                    year: 'numeric', 
                    month: 'long' 
                });
                
                const totalItens = data.reduce((sum, t) => sum + Object.values(t.itens).reduce((s, q) => s + q, 0), 0);
                const daysInMonth = new Date(month.split('-')[0], month.split('-')[1], 0).getDate();
                const avgDaily = Math.round(data.length / daysInMonth * 10) / 10;
                
                const monthCell = createElement('td', 'font-medium text-gray-800', monthName);
                const transferenciasCell = createElement('td', 'text-purple-600 font-medium', data.length.toString());
                const itensCell = createElement('td', 'text-blue-600 font-medium', totalItens.toString());
                const avgCell = createElement('td', 'text-green-600 font-medium', avgDaily.toString());
                
                row.appendChild(monthCell);
                row.appendChild(transferenciasCell);
                row.appendChild(itensCell);
                row.appendChild(avgCell);
                tbody.appendChild(row);
            });
        table.appendChild(tbody);
        
        container.appendChild(table);
        return container;
    }

    createTransferenciasProdutoStats(transferencias) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('package', 'w-8 h-8 text-green-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Produtos Mais Transferidos');
        header.appendChild(title);
        container.appendChild(header);
        
        const produtoStats = {};
        
        transferencias.forEach(transferencia => {
            Object.entries(transferencia.itens).forEach(([produto, quantidade]) => {
                if (!produtoStats[produto]) {
                    produtoStats[produto] = 0;
                }
                produtoStats[produto] += quantidade;
            });
        });
        
        const grid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
        
        Object.entries(produtoStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 9)
            .forEach(([produto, quantidade], index) => {
                const card = createElement('div', 'bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500');
                
                const rank = createElement('div', 'text-xs text-green-600 font-bold mb-1', `#${index + 1}`);
                const produtoName = createElement('div', 'font-semibold text-gray-800 mb-2', produto);
                const quantidadeText = createElement('div', 'text-2xl font-bold text-green-600', `${quantidade}x`);
                
                card.appendChild(rank);
                card.appendChild(produtoName);
                card.appendChild(quantidadeText);
                grid.appendChild(card);
            });
        
        container.appendChild(grid);
        return container;
    }

    createTransferenciasResponsavelStats(transferencias) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('user-check', 'w-8 h-8 text-orange-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Responsáveis pelas Transferências');
        header.appendChild(title);
        container.appendChild(header);
        
        const responsavelStats = {};
        
        transferencias.forEach(transferencia => {
            const responsavel = transferencia.nome;
            if (!responsavelStats[responsavel]) {
                responsavelStats[responsavel] = {
                    totalTransferencias: 0,
                    totalItens: 0
                };
            }
            
            responsavelStats[responsavel].totalTransferencias++;
            responsavelStats[responsavel].totalItens += Object.values(transferencia.itens).reduce((sum, qty) => sum + qty, 0);
        });
        
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        ['Responsável', 'Transferências', 'Total de Itens', 'Média por Transferência'].forEach(header => {
            const th = createElement('th', 'text-left font-semibold text-gray-700', header);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody');
        Object.entries(responsavelStats)
            .sort(([, a], [, b]) => b.totalTransferencias - a.totalTransferencias)
            .forEach(([responsavel, stats]) => {
                const row = createElement('tr', 'hover:bg-gray-50');
                
                const avgItens = Math.round(stats.totalItens / stats.totalTransferencias * 10) / 10;
                
                const nomeCell = createElement('td', 'font-medium text-gray-800', responsavel);
                const transferenciasCell = createElement('td', 'text-orange-600 font-medium', stats.totalTransferencias.toString());
                const itensCell = createElement('td', 'text-blue-600 font-medium', stats.totalItens.toString());
                const avgCell = createElement('td', 'text-purple-600 font-medium', avgItens.toString());
                
                row.appendChild(nomeCell);
                row.appendChild(transferenciasCell);
                row.appendChild(itensCell);
                row.appendChild(avgCell);
                tbody.appendChild(row);
            });
        table.appendChild(tbody);
        
        container.appendChild(table);
        return container;
    }

    createEstoqueView() {
        const container = createElement('div', 'space-y-6');
        
        // Filter component
        const filterComponent = filterManager.createFilterComponent();
        container.appendChild(filterComponent);
        
        const estoque = this.filteredData.filter(l => l.tipo === 'estoque');
        
        // Estatísticas detalhadas
        const statsSection = this.createEstoqueStatistics(estoque);
        container.appendChild(statsSection);
        
        // Controle total de produtos
        const produtoStats = this.createEstoqueProdutoStats(estoque);
        container.appendChild(produtoStats);
        
        // Média diária
        const dailyStats = this.createEstoqueDailyStats(estoque);
        container.appendChild(dailyStats);
        
        return container;
    }

    createEstoqueStatistics(estoque) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('warehouse', 'w-8 h-8 text-orange-600 mr-3'));
        const title = createElement('h2', 'text-2xl font-bold text-gray-800', 'Controle de Estoque');
        header.appendChild(title);
        container.appendChild(header);
        
        // Stats cards
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-4 gap-6');
        
        const totalLancamentos = estoque.length;
        const totalItens = estoque.reduce((sum, e) => sum + Object.values(e.itens).reduce((s, q) => s + q, 0), 0);
        const responsaveisUnicos = new Set(estoque.map(e => e.nome)).size;
        const produtosUnicos = new Set(estoque.flatMap(e => Object.keys(e.itens))).size;
        
        const stats = [
            { title: 'Total de Lançamentos', value: totalLancamentos, icon: 'clipboard-list', color: 'orange' },
            { title: 'Total de Itens', value: totalItens, icon: 'package', color: 'blue' },
            { title: 'Responsáveis', value: responsaveisUnicos, icon: 'users', color: 'green' },
            { title: 'Produtos Diferentes', value: produtosUnicos, icon: 'grid-3x3', color: 'purple' }
        ];
        
        stats.forEach(stat => {
            const card = this.createStatCard(stat);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(statsGrid);
        
        return container;
    }

    createEstoqueProdutoStats(estoque) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('bar-chart', 'w-8 h-8 text-blue-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Controle Total por Produto');
        header.appendChild(title);
        container.appendChild(header);
        
        const produtoStats = {};
        
        estoque.forEach(lancamento => {
            Object.entries(lancamento.itens).forEach(([produto, quantidade]) => {
                if (!produtoStats[produto]) {
                    produtoStats[produto] = {
                        total: 0,
                        lancamentos: 0,
                        ultimaData: null
                    };
                }
                produtoStats[produto].total += quantidade;
                produtoStats[produto].lancamentos++;
                
                const dataLancamento = new Date(lancamento.data_hora);
                if (!produtoStats[produto].ultimaData || dataLancamento > produtoStats[produto].ultimaData) {
                    produtoStats[produto].ultimaData = dataLancamento;
                }
            });
        });
        
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        ['Produto', 'Quantidade Total', 'Lançamentos', 'Média por Lançamento', 'Última Movimentação'].forEach(header => {
            const th = createElement('th', 'text-left font-semibold text-gray-700', header);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody');
        Object.entries(produtoStats)
            .sort(([, a], [, b]) => b.total - a.total)
            .forEach(([produto, stats]) => {
                const row = createElement('tr', 'hover:bg-gray-50');
                
                const media = Math.round(stats.total / stats.lancamentos * 10) / 10;
                const ultimaData = stats.ultimaData ? stats.ultimaData.toLocaleDateString('pt-BR') : '-';
                
                const produtoCell = createElement('td', 'font-medium text-gray-800', produto);
                const totalCell = createElement('td', 'text-blue-600 font-bold text-lg', stats.total.toString());
                const lancamentosCell = createElement('td', 'text-purple-600 font-medium', stats.lancamentos.toString());
                const mediaCell = createElement('td', 'text-green-600 font-medium', media.toString());
                const dataCell = createElement('td', 'text-gray-600 text-sm', ultimaData);
                
                row.appendChild(produtoCell);
                row.appendChild(totalCell);
                row.appendChild(lancamentosCell);
                row.appendChild(mediaCell);
                row.appendChild(dataCell);
                tbody.appendChild(row);
            });
        table.appendChild(tbody);
        
        container.appendChild(table);
        return container;
    }

    createEstoqueDailyStats(estoque) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('calendar-days', 'w-8 h-8 text-green-600 mr-3'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Média Diária de Movimentação');
        header.appendChild(title);
        container.appendChild(header);
        
        const dailyStats = filterManager.getDailyStats(estoque);
        
        if (Object.keys(dailyStats).length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhuma movimentação de estoque encontrada no período';
            container.appendChild(emptyMessage);
            return container;
        }
        
        const totalDias = Object.keys(dailyStats).length;
        const totalLancamentos = estoque.length;
        const totalItens = estoque.reduce((sum, e) => sum + Object.values(e.itens).reduce((s, q) => s + q, 0), 0);
        
        const avgLancamentos = Math.round(totalLancamentos / totalDias * 10) / 10;
        const avgItens = Math.round(totalItens / totalDias * 10) / 10;
        
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6');
        
        const avgCards = [
            { title: 'Dias com Movimentação', value: totalDias, color: 'blue' },
            { title: 'Média de Lançamentos/Dia', value: avgLancamentos, color: 'green' },
            { title: 'Média de Itens/Dia', value: avgItens, color: 'purple' }
        ];
        
        avgCards.forEach(card => {
            const cardElement = createElement('div', `bg-${card.color}-50 p-4 rounded-lg border-l-4 border-${card.color}-500`);
            const titleElement = createElement('div', `text-${card.color}-800 font-medium mb-2`, card.title);
            const valueElement = createElement('div', `text-2xl font-bold text-${card.color}-600`, card.value.toString());
            
            cardElement.appendChild(titleElement);
            cardElement.appendChild(valueElement);
            statsGrid.appendChild(cardElement);
        });
        
        container.appendChild(statsGrid);
        
        // Gráfico de movimentação diária (simplificado)
        const chartSection = createElement('div', 'bg-gray-50 p-4 rounded-lg');
        const chartTitle = createElement('h4', 'font-semibold text-gray-800 mb-4', 'Movimentação por Dia');
        chartSection.appendChild(chartTitle);
        
        const chartContainer = createElement('div', 'space-y-2 max-h-64 overflow-y-auto');
        
        Object.entries(dailyStats)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 10)
            .forEach(([date, data]) => {
                const dayData = createElement('div', 'flex items-center justify-between p-2 bg-white rounded');
                
                const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
                const totalItensDay = data.reduce((sum, e) => sum + Object.values(e.itens).reduce((s, q) => s + q, 0), 0);
                
                const dateElement = createElement('span', 'text-sm font-medium text-gray-700', dateFormatted);
                const statsElement = createElement('div', 'flex gap-4');
                
                const lancamentosElement = createElement('span', 'text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded', `${data.length} lançamentos`);
                const itensElement = createElement('span', 'text-xs bg-green-100 text-green-800 px-2 py-1 rounded', `${totalItensDay} itens`);
                
                statsElement.appendChild(lancamentosElement);
                statsElement.appendChild(itensElement);
                
                dayData.appendChild(dateElement);
                dayData.appendChild(statsElement);
                chartContainer.appendChild(dayData);
            });
        
        chartSection.appendChild(chartContainer);
        container.appendChild(chartSection);
        
        return container;
    }

    createPerdasSobrasView() {
        const container = createElement('div', 'space-y-6');
        
        // Filter component
        const filterComponent = filterManager.createFilterComponent();
        container.appendChild(filterComponent);
        
        const perdas = this.filteredData.filter(l => l.tipo === 'perda');
        const sobras = this.filteredData.filter(l => l.tipo === 'sobra');
        const perdasSobras = [...perdas, ...sobras];
        
        // Stats cards
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-6');
        
        const totalPerdas = perdas.reduce((sum, p) => sum + Object.values(p.itens).reduce((s, q) => s + q, 0), 0);
        const totalSobras = sobras.reduce((sum, s) => sum + Object.values(s.itens).reduce((s, q) => s + q, 0), 0);
        const totalGeral = totalPerdas + totalSobras;
        
        const stats = [
            {
                title: 'Total de Perdas',
                value: totalPerdas,
                icon: 'trending-down',
                color: 'red'
            },
            {
                title: 'Total de Sobras',
                value: totalSobras,
                icon: 'package',
                color: 'orange'
            },
            {
                title: 'Total Geral',
                value: totalGeral,
                icon: 'calculator',
                color: 'purple'
            }
        ];
        
        stats.forEach(stat => {
            const card = this.createStatCard(stat);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(statsGrid);
        
        // Statistics
        const statsSection = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-6');
        const statsHeader = createElement('div', 'flex items-center mb-6');
        statsHeader.appendChild(createIcon('bar-chart', 'w-8 h-8 text-purple-600 mr-3'));
        const statsTitle = createElement('h3', 'text-xl font-bold text-gray-800', 'Estatísticas por Produto');
        statsHeader.appendChild(statsTitle);
        statsSection.appendChild(statsHeader);
        
        const productStats = lancamentosManager.getStatisticsByProduct();
        if (productStats.length > 0) {
            const statsTable = createElement('div', 'overflow-x-auto');
            const table = createElement('table', 'table w-full');
            
            const thead = createElement('thead');
            const headerRow = createElement('tr');
            ['Produto', 'Perdas', 'Sobras', 'Total'].forEach(header => {
                const th = createElement('th', 'text-left font-semibold text-gray-700', header);
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            const tbody = createElement('tbody');
            productStats.forEach(([produto, stats]) => {
                const row = createElement('tr', 'hover:bg-gray-50');
                
                const produtoCell = createElement('td', 'font-medium text-gray-800', produto);
                const perdasCell = createElement('td', 'text-red-600 font-medium', stats.perdas.toString());
                const sobrasCell = createElement('td', 'text-orange-600 font-medium', stats.sobras.toString());
                const totalCell = createElement('td', 'text-purple-600 font-bold', stats.total.toString());
                
                row.appendChild(produtoCell);
                row.appendChild(perdasCell);
                row.appendChild(sobrasCell);
                row.appendChild(totalCell);
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            statsTable.appendChild(table);
            statsSection.appendChild(statsTable);
        } else {
            const emptyStats = createElement('div', 'text-center py-8 text-gray-500');
            emptyStats.textContent = 'Nenhuma estatística disponível';
            statsSection.appendChild(emptyStats);
        }
        
        container.appendChild(statsSection);
        
        // Content
        const content = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        const contentHeader = createElement('div', 'flex items-center mb-6');
        contentHeader.appendChild(createIcon('trending-down', 'w-8 h-8 text-red-600 mr-3'));
        const contentTitle = createElement('h2', 'text-2xl font-bold text-gray-800', 'Relatório de Perdas e Sobras');
        contentHeader.appendChild(contentTitle);
        content.appendChild(contentHeader);
        
        if (perdasSobras.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-12 text-gray-500');
            emptyMessage.textContent = 'Nenhuma perda ou sobra encontrada';
            content.appendChild(emptyMessage);
        } else {
            const grid = this.createLancamentosGrid(perdasSobras, 'Perdas e Sobras');
            content.appendChild(grid);
        }
        
        container.appendChild(content);
        return container;
    }

    getTipoIcon(tipo) {
        const icons = {
            'lanche': 'users',
            'perda': 'trending-down',
            'sobra': 'package',
            'transferencia': 'arrow-right-left',
            'estoque': 'warehouse'
        };
        return icons[tipo] || 'clipboard';
    }

    getTipoDisplayName(tipo) {
        const names = {
            'lanche': 'Lanche',
            'perda': 'Perda',
            'sobra': 'Sobra',
            'transferencia': 'Transferência',
            'estoque': 'Estoque'
        };
        return names[tipo] || tipo;
    }

    isToday(dateTime) {
        const today = new Date();
        const itemDate = new Date(dateTime);
        return today.toDateString() === itemDate.toDateString();
    }
}

// Instância global da área restrita
const areaRestrita = new AreaRestrita();

// Make it globally available
window.areaRestrita = areaRestrita;
