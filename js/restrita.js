// Área Restrita
class AreaRestrita {
    constructor() {
        this.isAuthenticated = false;
        this.password = '0716';
        this.currentView = 'dashboard';
        this.currentFilter = 'all';
    }

    createLoginForm() {
        const container = createElement('div', 'login-container min-h-screen flex items-center justify-center p-4');
        
        const formContainer = createElement('div', 'login-form-container w-full max-w-md p-8 rounded-xl');
        
        // Header com ícone
        const header = createElement('div', 'text-center mb-8');
        const iconContainer = createElement('div', 'login-icon-container w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4');
        iconContainer.appendChild(createIcon('shield-check', 'w-10 h-10 text-white'));
        
        const title = createElement('h2', 'text-3xl font-bold mb-2', 'Área Restrita');
        const subtitle = createElement('p', 'text-lg', 'Acesso aos relatórios e controles');
        
        header.appendChild(iconContainer);
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Formulário
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
            setTimeout(() => initializeLucideIcons(), 0);
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
        
        // Botão voltar
        const backButton = createElement('a', 'back-to-launches-btn mt-6 inline-block');
        backButton.href = '#';
        backButton.onclick = (e) => {
            e.preventDefault();
            app.showLancamentos();
        };
        backButton.appendChild(createIcon('arrow-left', 'w-4 h-4'));
        backButton.appendChild(document.createTextNode('Voltar aos Lançamentos'));
        
        formContainer.appendChild(header);
        formContainer.appendChild(form);
        formContainer.appendChild(backButton);
        container.appendChild(formContainer);
        
        setTimeout(() => initializeLucideIcons(), 100);
        
        return container;
    }

    handleLogin(password) {
        if (password === this.password) {
            this.isAuthenticated = true;
            toast.success('Login realizado com sucesso!');
            app.showRestrita();
        } else {
            toast.error('Senha incorreta!');
        }
    }

    createRestritaContent() {
        const container = createElement('div', 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100');
        container.classList.add('page-enter');
        
        const mainContainer = createElement('div', 'container mx-auto px-4 py-8');
        
        // Header
        const header = this.createHeader();
        mainContainer.appendChild(header);
        
        // Navigation
        const navigation = this.createNavigation();
        mainContainer.appendChild(navigation);
        
        // Content Area
        const contentArea = createElement('div', 'content-area mt-8');
        this.updateContentArea(contentArea);
        mainContainer.appendChild(contentArea);
        
        container.appendChild(mainContainer);
        
        return container;
    }

    createHeader() {
        const header = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-8');
        header.classList.add('card-enter');
        
        const headerContent = createElement('div', 'flex items-center justify-between');
        
        const titleSection = createElement('div', 'flex items-center');
        titleSection.appendChild(createIcon('bar-chart-3', 'w-8 h-8 text-yellow-600 mr-3'));
        
        const titleContainer = createElement('div');
        const title = createElement('h1', 'text-3xl font-bold text-gray-800', 'Área Restrita');
        const subtitle = createElement('p', 'text-gray-600', 'Relatórios e controles administrativos');
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(subtitle);
        titleSection.appendChild(titleContainer);
        
        const actionsSection = createElement('div', 'flex gap-3');
        
        const logoutButton = createElement('button', 'btn btn-secondary');
        logoutButton.appendChild(createIcon('log-out', 'w-4 h-4 mr-2'));
        logoutButton.appendChild(document.createTextNode('Sair'));
        logoutButton.onclick = () => {
            this.isAuthenticated = false;
            app.showLancamentos();
            toast.success('Logout realizado com sucesso!');
        };
        
        const backButton = createElement('button', 'btn bg-gray-100 text-gray-700 hover:bg-gray-200');
        backButton.appendChild(createIcon('arrow-left', 'w-4 h-4 mr-2'));
        backButton.appendChild(document.createTextNode('Lançamentos'));
        backButton.onclick = () => app.showLancamentos();
        
        actionsSection.appendChild(backButton);
        actionsSection.appendChild(logoutButton);
        
        headerContent.appendChild(titleSection);
        headerContent.appendChild(actionsSection);
        header.appendChild(headerContent);
        
        return header;
    }

    createNavigation() {
        const nav = createElement('div', 'bg-white rounded-xl shadow-lg p-4 mb-8');
        nav.classList.add('card-enter');
        
        const navContainer = createElement('div', 'flex flex-wrap gap-2');
        
        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
            { id: 'lancamentos-list', label: 'Todos os Lançamentos', icon: 'list' },
            { id: 'perdas-sobras', label: 'Perdas e Sobras', icon: 'trending-down' },
            { id: 'lanches-funcionarios', label: 'Lanches por Funcionário', icon: 'users' },
            { id: 'transferencias', label: 'Transferências', icon: 'arrow-right-left' },
            { id: 'estoque', label: 'Controle de Estoque', icon: 'warehouse' }
        ];
        
        navItems.forEach(item => {
            const button = createElement('button', `btn ${this.currentView === item.id ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`);
            button.appendChild(createIcon(item.icon, 'w-4 h-4 mr-2'));
            button.appendChild(document.createTextNode(item.label));
            button.onclick = () => {
                this.currentView = item.id;
                this.updateNavigation(navContainer);
                this.updateContentArea(document.querySelector('.content-area'));
            };
            navContainer.appendChild(button);
        });
        
        nav.appendChild(navContainer);
        
        return nav;
    }

    updateNavigation(navContainer) {
        const buttons = navContainer.querySelectorAll('button');
        const navItems = [
            { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
            { id: 'lancamentos-list', label: 'Todos os Lançamentos', icon: 'list' },
            { id: 'perdas-sobras', label: 'Perdas e Sobras', icon: 'trending-down' },
            { id: 'lanches-funcionarios', label: 'Lanches por Funcionário', icon: 'users' },
            { id: 'transferencias', label: 'Transferências', icon: 'arrow-right-left' },
            { id: 'estoque', label: 'Controle de Estoque', icon: 'warehouse' }
        ];
        
        buttons.forEach((button, index) => {
            const item = navItems[index];
            if (this.currentView === item.id) {
                button.className = 'btn btn-primary';
            } else {
                button.className = 'btn bg-gray-100 text-gray-700 hover:bg-gray-200';
            }
        });
    }

    updateContentArea(contentArea) {
        contentArea.innerHTML = '';
        
        switch (this.currentView) {
            case 'dashboard':
                contentArea.appendChild(this.createDashboard());
                break;
            case 'lancamentos-list':
                contentArea.appendChild(this.createLancamentosList());
                break;
            case 'perdas-sobras':
                contentArea.appendChild(this.createPerdasSobrasReport());
                break;
            case 'lanches-funcionarios':
                contentArea.appendChild(this.createLanchesFuncionariosReport());
                break;
            case 'transferencias':
                contentArea.appendChild(this.createTransferenciasReport());
                break;
            case 'estoque':
                contentArea.appendChild(this.createEstoqueReport());
                break;
        }
        
        setTimeout(() => initializeLucideIcons(), 100);
    }

    createDashboard() {
        const container = createElement('div', 'space-y-8');
        
        // Filtro de datas
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateAllContent();
        });
        container.appendChild(filterComponent);
        
        // Cards de estatísticas
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6');
        
        const filteredData = this.getFilteredData();
        
        const stats = [
            {
                title: 'Total de Lançamentos',
                value: filteredData.length,
                icon: 'clipboard-list',
                color: 'blue'
            },
            {
                title: 'Lanches de Funcionários',
                value: filteredData.filter(l => l.tipo === 'lanche').length,
                icon: 'users',
                color: 'green'
            },
            {
                title: 'Perdas e Sobras',
                value: filteredData.filter(l => l.tipo === 'perda' || l.tipo === 'sobra').length,
                icon: 'trending-down',
                color: 'red'
            },
            {
                title: 'Transferências',
                value: filteredData.filter(l => l.tipo === 'transferencia').length,
                icon: 'arrow-right-left',
                color: 'purple'
            }
        ];
        
        stats.forEach(stat => {
            const card = this.createStatCard(stat);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(statsGrid);
        
        // Gráfico de atividades recentes
        const recentActivity = this.createRecentActivity(filteredData);
        container.appendChild(recentActivity);
        
        return container;
    }

    createStatCard(stat) {
        const card = createElement('div', 'bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300');
        
        const header = createElement('div', 'flex items-center justify-between mb-4');
        const iconContainer = createElement('div', `w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`);
        iconContainer.appendChild(createIcon(stat.icon, `w-6 h-6 text-${stat.color}-600`));
        
        const value = createElement('div', `text-2xl font-bold text-${stat.color}-600`, stat.value.toString());
        
        header.appendChild(iconContainer);
        header.appendChild(value);
        
        const title = createElement('h3', 'text-gray-700 font-medium', stat.title);
        
        card.appendChild(header);
        card.appendChild(title);
        
        return card;
    }

    createRecentActivity(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('activity', 'w-6 h-6 text-gray-600 mr-3'));
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Atividades Recentes');
        header.appendChild(title);
        
        const recentData = data
            .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
            .slice(0, 10);
        
        if (recentData.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhuma atividade encontrada no período selecionado';
            container.appendChild(header);
            container.appendChild(emptyMessage);
            return container;
        }
        
        const activityList = createElement('div', 'space-y-3');
        
        recentData.forEach(lancamento => {
            const item = createElement('div', 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors');
            
            const info = createElement('div', 'flex items-center');
            const typeIcon = this.getTypeIcon(lancamento.tipo);
            info.appendChild(createIcon(typeIcon, 'w-5 h-5 text-gray-600 mr-3'));
            
            const details = createElement('div');
            const name = createElement('div', 'font-medium text-gray-800');
            name.textContent = lancamento.funcionario || lancamento.nome || 'N/A';
            
            const type = createElement('div', 'text-sm text-gray-600');
            type.textContent = this.getTypeLabel(lancamento.tipo);
            
            details.appendChild(name);
            details.appendChild(type);
            info.appendChild(details);
            
            const timestamp = createElement('div', 'text-sm text-gray-500');
            const { date, time } = formatDateTime(lancamento.data_hora);
            timestamp.textContent = `${date} ${time}`;
            
            item.appendChild(info);
            item.appendChild(timestamp);
            activityList.appendChild(item);
        });
        
        container.appendChild(header);
        container.appendChild(activityList);
        
        return container;
    }

    createLancamentosList() {
        const container = createElement('div', 'space-y-6');
        
        // Filtro de datas
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateContentArea(document.querySelector('.content-area'));
        });
        container.appendChild(filterComponent);
        
        // Tabela de lançamentos
        const tableContainer = createElement('div', 'bg-white rounded-xl shadow-lg overflow-hidden');
        
        const header = createElement('div', 'p-6 border-b border-gray-200');
        const headerContent = createElement('div', 'flex items-center justify-between');
        
        const titleSection = createElement('div', 'flex items-center');
        titleSection.appendChild(createIcon('list', 'w-6 h-6 text-gray-600 mr-3'));
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Todos os Lançamentos');
        titleSection.appendChild(title);
        
        headerContent.appendChild(titleSection);
        header.appendChild(headerContent);
        
        const tableWrapper = createElement('div', 'overflow-x-auto');
        const table = createElement('table', 'table w-full');
        
        // Cabeçalho da tabela
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        
        const headers = ['Data/Hora', 'Tipo', 'Nome/Funcionário', 'Itens', 'Visto', 'Ações'];
        headers.forEach(headerText => {
            const th = createElement('th', 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Corpo da tabela
        const tbody = createElement('tbody', 'bg-white divide-y divide-gray-200');
        
        const filteredData = this.getFilteredData();
        
        if (filteredData.length === 0) {
            const emptyRow = createElement('tr');
            const emptyCell = createElement('td', 'px-6 py-8 text-center text-gray-500 italic');
            emptyCell.colSpan = headers.length;
            emptyCell.textContent = 'Nenhum lançamento encontrado no período selecionado';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            filteredData
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
                .forEach(lancamento => {
                    const row = this.createLancamentoRow(lancamento);
                    tbody.appendChild(row);
                });
        }
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        
        tableContainer.appendChild(header);
        tableContainer.appendChild(tableWrapper);
        container.appendChild(tableContainer);
        
        return container;
    }

    createLancamentoRow(lancamento) {
        const row = createElement('tr', `hover:bg-gray-50 transition-colors ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
        
        // Data/Hora
        const dateCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
        const { date, time } = formatDateTime(lancamento.data_hora);
        const dateDiv = createElement('div', 'text-sm font-medium text-gray-900', date);
        const timeDiv = createElement('div', 'text-sm text-gray-500', time);
        dateCell.appendChild(dateDiv);
        dateCell.appendChild(timeDiv);
        
        // Tipo
        const typeCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
        const typeBadge = createElement('span', `badge ${this.getTypeBadgeClass(lancamento.tipo)}`);
        typeBadge.textContent = this.getTypeLabel(lancamento.tipo);
        typeCell.appendChild(typeBadge);
        
        // Nome/Funcionário
        const nameCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900');
        nameCell.textContent = lancamento.funcionario || lancamento.nome || 'N/A';
        
        // Itens
        const itemsCell = createElement('td', 'px-6 py-4');
        const itemsDiv = this.createItemsDisplay(lancamento);
        itemsCell.appendChild(itemsDiv);
        
        // Visto
        const vistoCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
        const vistoIndicator = createElement('div', 'status-indicator');
        const vistoDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
        const vistoText = createElement('span', 'text-sm text-gray-600', lancamento.visto ? 'Visto' : 'Pendente');
        vistoIndicator.appendChild(vistoDot);
        vistoIndicator.appendChild(vistoText);
        vistoCell.appendChild(vistoIndicator);
        
        // Ações
        const actionsCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium');
        const actionsDiv = createElement('div', 'flex gap-2');
        
        const vistoButton = createElement('button', `btn btn-sm ${lancamento.visto ? 'btn-warning' : 'btn-success'}`);
        vistoButton.textContent = lancamento.visto ? 'Remover Visto' : 'Marcar Visto';
        vistoButton.onclick = async () => {
            const success = await lancamentosManager.toggleVisto(lancamento.id);
            if (success) {
                this.updateAllContent();
            }
        };
        
        const editButton = createElement('button', 'btn btn-sm btn-info');
        editButton.textContent = 'Editar';
        editButton.onclick = () => {
            lancamentosManager.editLancamento(lancamento);
            app.showLancamentoModal(lancamento.tipo);
        };
        
        const deleteButton = createElement('button', 'btn btn-sm btn-danger');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => {
            const confirmModal = modal.createConfirmationModal(
                'Confirmar Exclusão',
                `Tem certeza que deseja excluir este lançamento de ${this.getTypeLabel(lancamento.tipo).toLowerCase()}?`,
                async () => {
                    const success = await lancamentosManager.deleteLancamento(lancamento.id);
                    if (success) {
                        this.updateAllContent();
                    }
                    return success;
                }
            );
            modal.show(confirmModal);
        };
        
        actionsDiv.appendChild(vistoButton);
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        actionsCell.appendChild(actionsDiv);
        
        row.appendChild(dateCell);
        row.appendChild(typeCell);
        row.appendChild(nameCell);
        row.appendChild(itemsCell);
        row.appendChild(vistoCell);
        row.appendChild(actionsCell);
        
        return row;
    }

    createItemsDisplay(lancamento) {
        const container = createElement('div', 'text-sm');
        
        if (!lancamento.itens || Object.keys(lancamento.itens).length === 0) {
            container.textContent = 'Nenhum item';
            container.className += ' text-gray-500 italic';
            return container;
        }
        
        // Verificar se é o novo formato (com tamanhos separados)
        const hasNewFormat = Object.keys(lancamento.itens).some(key => key.includes('_'));
        
        if (hasNewFormat) {
            // Novo formato - separar por tamanho
            const items35g = {};
            const items20g = {};
            
            Object.entries(lancamento.itens).forEach(([itemKey, quantity]) => {
                const [item, tamanho] = itemKey.split('_');
                if (tamanho === '35g') {
                    items35g[item] = quantity;
                } else if (tamanho === '20g') {
                    items20g[item] = quantity;
                }
            });
            
            // Mostrar itens 35g
            if (Object.keys(items35g).length > 0) {
                const section35g = createElement('div', 'mb-2');
                const title35g = createElement('div', 'font-semibold text-gray-700 text-xs mb-1', 'Salgados 35g:');
                section35g.appendChild(title35g);
                
                Object.entries(items35g).forEach(([item, quantity]) => {
                    const itemDiv = createElement('div', 'text-gray-600');
                    itemDiv.textContent = `${item}: ${quantity}`;
                    section35g.appendChild(itemDiv);
                });
                
                container.appendChild(section35g);
            }
            
            // Mostrar itens 20g
            if (Object.keys(items20g).length > 0) {
                const section20g = createElement('div');
                const title20g = createElement('div', 'font-semibold text-gray-700 text-xs mb-1', 'Mini Salgados 20g:');
                section20g.appendChild(title20g);
                
                Object.entries(items20g).forEach(([item, quantity]) => {
                    const itemDiv = createElement('div', 'text-gray-600');
                    itemDiv.textContent = `MINI ${item}: ${quantity}`;
                    section20g.appendChild(itemDiv);
                });
                
                container.appendChild(section20g);
            }
        } else {
            // Formato antigo - mostrar normalmente
            Object.entries(lancamento.itens).forEach(([item, quantity]) => {
                const itemDiv = createElement('div', 'text-gray-600');
                const displayName = lancamento.tamanho === '20g' ? `MINI ${item}` : item;
                itemDiv.textContent = `${displayName}: ${quantity}`;
                container.appendChild(itemDiv);
            });
        }
        
        // Mostrar suco se houver
        if (lancamento.suco && lancamento.quantidade_suco > 0) {
            const sucoDiv = createElement('div', 'text-blue-600 mt-1');
            sucoDiv.textContent = `${lancamento.suco}: ${lancamento.quantidade_suco}`;
            container.appendChild(sucoDiv);
        }
        
        return container;
    }

    createPerdasSobrasReport() {
        const container = createElement('div', 'space-y-6');
        
        // Filtro de datas
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateContentArea(document.querySelector('.content-area'));
        });
        container.appendChild(filterComponent);
        
        // Filtro específico
        const specificFilter = this.createSpecificFilter(['perda', 'sobra'], 'Filtrar por tipo:');
        container.appendChild(specificFilter);
        
        const filteredData = this.getFilteredData().filter(l => 
            (l.tipo === 'perda' || l.tipo === 'sobra') && 
            (this.currentFilter === 'all' || l.tipo === this.currentFilter)
        );
        
        // Estatísticas
        const statsContainer = this.createPerdasSobrasStats(filteredData);
        container.appendChild(statsContainer);
        
        // Tabela detalhada
        const tableContainer = this.createPerdasSobrasTable(filteredData);
        container.appendChild(tableContainer);
        
        return container;
    }

    createLanchesFuncionariosReport() {
        const container = createElement('div', 'space-y-6');
        
        // Filtro de datas
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateContentArea(document.querySelector('.content-area'));
        });
        container.appendChild(filterComponent);
        
        const filteredData = this.getFilteredData().filter(l => l.tipo === 'lanche');
        
        // Estatísticas por funcionário
        const funcionariosStats = this.createFuncionariosStats(filteredData);
        container.appendChild(funcionariosStats);
        
        // Tabela detalhada
        const tableContainer = this.createLanchesTable(filteredData);
        container.appendChild(tableContainer);
        
        return container;
    }

    createTransferenciasReport() {
        const container = createElement('div', 'space-y-6');
        
        // Filtro de datas
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateContentArea(document.querySelector('.content-area'));
        });
        container.appendChild(filterComponent);
        
        const filteredData = this.getFilteredData().filter(l => l.tipo === 'transferencia');
        
        // Estatísticas de transferências
        const transferenciasStats = this.createTransferenciasStats(filteredData);
        container.appendChild(transferenciasStats);
        
        // Tabela detalhada
        const tableContainer = this.createTransferenciasTable(filteredData);
        container.appendChild(tableContainer);
        
        return container;
    }

    createEstoqueReport() {
        const container = createElement('div', 'space-y-6');
        
        // Filtro de datas
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateContentArea(document.querySelector('.content-area'));
        });
        container.appendChild(filterComponent);
        
        const filteredData = this.getFilteredData().filter(l => l.tipo === 'estoque');
        
        // Estatísticas de estoque
        const estoqueStats = this.createEstoqueStats(filteredData);
        container.appendChild(estoqueStats);
        
        // Tabela detalhada
        const tableContainer = this.createEstoqueTable(filteredData);
        container.appendChild(tableContainer);
        
        return container;
    }

    createSpecificFilter(types, label) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-4');
        header.appendChild(createIcon('filter', 'w-5 h-5 text-gray-600 mr-2'));
        const title = createElement('h3', 'text-lg font-semibold text-gray-800', label);
        header.appendChild(title);
        
        const buttonsContainer = createElement('div', 'flex gap-3');
        
        const allButton = createElement('button', `btn ${this.currentFilter === 'all' ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`);
        allButton.textContent = 'Todos';
        allButton.onclick = () => {
            this.currentFilter = 'all';
            this.updateContentArea(document.querySelector('.content-area'));
        };
        buttonsContainer.appendChild(allButton);
        
        types.forEach(type => {
            const button = createElement('button', `btn ${this.currentFilter === type ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`);
            button.textContent = this.getTypeLabel(type);
            button.onclick = () => {
                this.currentFilter = type;
                this.updateContentArea(document.querySelector('.content-area'));
            };
            buttonsContainer.appendChild(button);
        });
        
        container.appendChild(header);
        container.appendChild(buttonsContainer);
        
        return container;
    }

    createPerdasSobrasStats(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('pie-chart', 'w-6 h-6 text-gray-600 mr-3'));
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Estatísticas de Perdas e Sobras');
        header.appendChild(title);
        
        // Calcular estatísticas por produto
        const productStats = {};
        
        data.forEach(lancamento => {
            Object.entries(lancamento.itens).forEach(([itemKey, quantity]) => {
                let displayName;
                
                // Verificar se é novo formato
                if (itemKey.includes('_')) {
                    const [item, tamanho] = itemKey.split('_');
                    displayName = tamanho === '20g' ? `MINI ${item}` : item;
                } else {
                    displayName = lancamento.tamanho === '20g' ? `MINI ${itemKey}` : itemKey;
                }
                
                if (!productStats[displayName]) {
                    productStats[displayName] = { perdas: 0, sobras: 0, total: 0 };
                }
                
                if (lancamento.tipo === 'perda') {
                    productStats[displayName].perdas += quantity;
                } else {
                    productStats[displayName].sobras += quantity;
                }
                productStats[displayName].total += quantity;
            });
        });
        
        const sortedProducts = Object.entries(productStats)
            .sort(([, a], [, b]) => b.total - a.total)
            .slice(0, 10);
        
        if (sortedProducts.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhum dado encontrado no período selecionado';
            container.appendChild(header);
            container.appendChild(emptyMessage);
            return container;
        }
        
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
        
        sortedProducts.forEach(([produto, stats]) => {
            const card = createElement('div', 'bg-gray-50 rounded-lg p-4');
            
            const productName = createElement('h4', 'font-semibold text-gray-800 mb-2', produto);
            
            const statsDiv = createElement('div', 'space-y-1 text-sm');
            const perdasDiv = createElement('div', 'text-red-600', `Perdas: ${stats.perdas}`);
            const sobrasDiv = createElement('div', 'text-orange-600', `Sobras: ${stats.sobras}`);
            const totalDiv = createElement('div', 'font-semibold text-gray-800', `Total: ${stats.total}`);
            
            statsDiv.appendChild(perdasDiv);
            statsDiv.appendChild(sobrasDiv);
            statsDiv.appendChild(totalDiv);
            
            card.appendChild(productName);
            card.appendChild(statsDiv);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(header);
        container.appendChild(statsGrid);
        
        return container;
    }

    createPerdasSobrasTable(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg overflow-hidden');
        
        const header = createElement('div', 'p-6 border-b border-gray-200');
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Detalhamento de Perdas e Sobras');
        header.appendChild(title);
        
        const tableWrapper = createElement('div', 'overflow-x-auto');
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        
        const headers = ['Data/Hora', 'Tipo', 'Responsável', 'Itens', 'Visto'];
        headers.forEach(headerText => {
            const th = createElement('th', 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody', 'bg-white divide-y divide-gray-200');
        
        if (data.length === 0) {
            const emptyRow = createElement('tr');
            const emptyCell = createElement('td', 'px-6 py-8 text-center text-gray-500 italic');
            emptyCell.colSpan = headers.length;
            emptyCell.textContent = 'Nenhum registro encontrado no período selecionado';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            data
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
                .forEach(lancamento => {
                    const row = createElement('tr', `hover:bg-gray-50 transition-colors ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
                    
                    // Data/Hora
                    const dateCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const { date, time } = formatDateTime(lancamento.data_hora);
                    const dateDiv = createElement('div', 'text-sm font-medium text-gray-900', date);
                    const timeDiv = createElement('div', 'text-sm text-gray-500', time);
                    dateCell.appendChild(dateDiv);
                    dateCell.appendChild(timeDiv);
                    
                    // Tipo
                    const typeCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const typeBadge = createElement('span', `badge ${this.getTypeBadgeClass(lancamento.tipo)}`);
                    typeBadge.textContent = this.getTypeLabel(lancamento.tipo);
                    typeCell.appendChild(typeBadge);
                    
                    // Responsável
                    const nameCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900');
                    nameCell.textContent = lancamento.nome || 'N/A';
                    
                    // Itens
                    const itemsCell = createElement('td', 'px-6 py-4');
                    const itemsDiv = this.createItemsDisplay(lancamento);
                    itemsCell.appendChild(itemsDiv);
                    
                    // Visto
                    const vistoCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const vistoIndicator = createElement('div', 'status-indicator');
                    const vistoDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
                    const vistoText = createElement('span', 'text-sm text-gray-600', lancamento.visto ? 'Visto' : 'Pendente');
                    vistoIndicator.appendChild(vistoDot);
                    vistoIndicator.appendChild(vistoText);
                    vistoCell.appendChild(vistoIndicator);
                    
                    row.appendChild(dateCell);
                    row.appendChild(typeCell);
                    row.appendChild(nameCell);
                    row.appendChild(itemsCell);
                    row.appendChild(vistoCell);
                    
                    tbody.appendChild(row);
                });
        }
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        
        container.appendChild(header);
        container.appendChild(tableWrapper);
        
        return container;
    }

    createFuncionariosStats(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('users', 'w-6 h-6 text-gray-600 mr-3'));
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Estatísticas por Funcionário');
        header.appendChild(title);
        
        // Calcular estatísticas por funcionário
        const funcionarioStats = {};
        
        data.forEach(lancamento => {
            const funcionario = lancamento.funcionario || 'N/A';
            
            if (!funcionarioStats[funcionario]) {
                funcionarioStats[funcionario] = {
                    totalLanches: 0,
                    totalItens: 0,
                    produtosMaisConsumidos: {},
                    sucosMaisConsumidos: {}
                };
            }
            
            funcionarioStats[funcionario].totalLanches++;
            
            // Contar itens
            Object.entries(lancamento.itens).forEach(([item, quantity]) => {
                funcionarioStats[funcionario].totalItens += quantity;
                
                if (!funcionarioStats[funcionario].produtosMaisConsumidos[item]) {
                    funcionarioStats[funcionario].produtosMaisConsumidos[item] = 0;
                }
                funcionarioStats[funcionario].produtosMaisConsumidos[item] += quantity;
            });
            
            // Contar sucos
            if (lancamento.suco && lancamento.quantidade_suco > 0) {
                funcionarioStats[funcionario].totalItens += lancamento.quantidade_suco;
                
                if (!funcionarioStats[funcionario].sucosMaisConsumidos[lancamento.suco]) {
                    funcionarioStats[funcionario].sucosMaisConsumidos[lancamento.suco] = 0;
                }
                funcionarioStats[funcionario].sucosMaisConsumidos[lancamento.suco] += lancamento.quantidade_suco;
            }
        });
        
        const sortedFuncionarios = Object.entries(funcionarioStats)
            .sort(([, a], [, b]) => b.totalLanches - a.totalLanches);
        
        if (sortedFuncionarios.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhum dado encontrado no período selecionado';
            container.appendChild(header);
            container.appendChild(emptyMessage);
            return container;
        }
        
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');
        
        sortedFuncionarios.forEach(([funcionario, stats]) => {
            const card = createElement('div', 'bg-gray-50 rounded-lg p-4');
            
            const funcionarioName = createElement('h4', 'font-semibold text-gray-800 mb-3', funcionario);
            
            const statsDiv = createElement('div', 'space-y-2 text-sm');
            
            const totalLanchesDiv = createElement('div', 'text-blue-600 font-medium', `Total de lanches: ${stats.totalLanches}`);
            const totalItensDiv = createElement('div', 'text-green-600 font-medium', `Total de itens: ${stats.totalItens}`);
            
            statsDiv.appendChild(totalLanchesDiv);
            statsDiv.appendChild(totalItensDiv);
            
            // Produtos mais consumidos
            const topProdutos = Object.entries(stats.produtosMaisConsumidos)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3);
            
            if (topProdutos.length > 0) {
                const produtosTitle = createElement('div', 'font-medium text-gray-700 mt-3 mb-1', 'Mais consumidos:');
                statsDiv.appendChild(produtosTitle);
                
                topProdutos.forEach(([produto, quantidade]) => {
                    const produtoDiv = createElement('div', 'text-gray-600 text-xs');
                    const displayName = produto.includes('_') ? 
                        (produto.split('_')[1] === '20g' ? `MINI ${produto.split('_')[0]}` : produto.split('_')[0]) : 
                        produto;
                    produtoDiv.textContent = `${displayName}: ${quantidade}`;
                    statsDiv.appendChild(produtoDiv);
                });
            }
            
            // Sucos mais consumidos
            const topSucos = Object.entries(stats.sucosMaisConsumidos)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 2);
            
            if (topSucos.length > 0) {
                const sucosTitle = createElement('div', 'font-medium text-gray-700 mt-2 mb-1', 'Sucos:');
                statsDiv.appendChild(sucosTitle);
                
                topSucos.forEach(([suco, quantidade]) => {
                    const sucoDiv = createElement('div', 'text-blue-600 text-xs');
                    sucoDiv.textContent = `${suco}: ${quantidade}`;
                    statsDiv.appendChild(sucoDiv);
                });
            }
            
            card.appendChild(funcionarioName);
            card.appendChild(statsDiv);
            statsGrid.appendChild(card);
        });
        
        container.appendChild(header);
        container.appendChild(statsGrid);
        
        return container;
    }

    createLanchesTable(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg overflow-hidden');
        
        const header = createElement('div', 'p-6 border-b border-gray-200');
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Detalhamento de Lanches');
        header.appendChild(title);
        
        const tableWrapper = createElement('div', 'overflow-x-auto');
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        
        const headers = ['Data/Hora', 'Funcionário', 'Itens', 'Suco', 'Visto'];
        headers.forEach(headerText => {
            const th = createElement('th', 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody', 'bg-white divide-y divide-gray-200');
        
        if (data.length === 0) {
            const emptyRow = createElement('tr');
            const emptyCell = createElement('td', 'px-6 py-8 text-center text-gray-500 italic');
            emptyCell.colSpan = headers.length;
            emptyCell.textContent = 'Nenhum lanche encontrado no período selecionado';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            data
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
                .forEach(lancamento => {
                    const row = createElement('tr', `hover:bg-gray-50 transition-colors ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
                    
                    // Data/Hora
                    const dateCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const { date, time } = formatDateTime(lancamento.data_hora);
                    const dateDiv = createElement('div', 'text-sm font-medium text-gray-900', date);
                    const timeDiv = createElement('div', 'text-sm text-gray-500', time);
                    dateCell.appendChild(dateDiv);
                    dateCell.appendChild(timeDiv);
                    
                    // Funcionário
                    const funcionarioCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900');
                    funcionarioCell.textContent = lancamento.funcionario || 'N/A';
                    
                    // Itens
                    const itemsCell = createElement('td', 'px-6 py-4');
                    const itemsDiv = this.createItemsDisplay(lancamento);
                    itemsCell.appendChild(itemsDiv);
                    
                    // Suco
                    const sucoCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm text-gray-600');
                    if (lancamento.suco && lancamento.quantidade_suco > 0) {
                        sucoCell.textContent = `${lancamento.suco} (${lancamento.quantidade_suco})`;
                    } else {
                        sucoCell.textContent = '-';
                        sucoCell.className += ' text-gray-400 italic';
                    }
                    
                    // Visto
                    const vistoCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const vistoIndicator = createElement('div', 'status-indicator');
                    const vistoDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
                    const vistoText = createElement('span', 'text-sm text-gray-600', lancamento.visto ? 'Visto' : 'Pendente');
                    vistoIndicator.appendChild(vistoDot);
                    vistoIndicator.appendChild(vistoText);
                    vistoCell.appendChild(vistoIndicator);
                    
                    row.appendChild(dateCell);
                    row.appendChild(funcionarioCell);
                    row.appendChild(itemsCell);
                    row.appendChild(sucoCell);
                    row.appendChild(vistoCell);
                    
                    tbody.appendChild(row);
                });
        }
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        
        container.appendChild(header);
        container.appendChild(tableWrapper);
        
        return container;
    }

    createTransferenciasStats(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('arrow-right-left', 'w-6 h-6 text-gray-600 mr-3'));
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Estatísticas de Transferências');
        header.appendChild(title);
        
        // Calcular estatísticas
        const productStats = {};
        let totalTransferencias = data.length;
        let totalItens = 0;
        
        // Calcular últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const last30DaysData = data.filter(l => new Date(l.data_hora) >= thirtyDaysAgo);
        let totalLast30Days = 0;
        
        data.forEach(lancamento => {
            Object.entries(lancamento.itens).forEach(([itemKey, quantity]) => {
                totalItens += quantity;
                
                let displayName;
                if (itemKey.includes('_')) {
                    const [item, tamanho] = itemKey.split('_');
                    displayName = tamanho === '20g' ? `MINI ${item}` : item;
                } else {
                    displayName = lancamento.tamanho === '20g' ? `MINI ${itemKey}` : itemKey;
                }
                
                if (!productStats[displayName]) {
                    productStats[displayName] = 0;
                }
                productStats[displayName] += quantity;
            });
        });
        
        last30DaysData.forEach(lancamento => {
            Object.entries(lancamento.itens).forEach(([itemKey, quantity]) => {
                totalLast30Days += quantity;
            });
        });
        
        const topProducts = Object.entries(productStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);
        
        // Cards de resumo
        const summaryGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-6');
        
        const summaryCards = [
            { title: 'Total de Transferências', value: totalTransferencias, color: 'blue' },
            { title: 'Total de Itens', value: totalItens, color: 'green' },
            { title: 'Últimos 30 dias', value: totalLast30Days, color: 'purple' },
            { title: 'Média por Transferência', value: totalTransferencias > 0 ? Math.round(totalItens / totalTransferencias) : 0, color: 'orange' }
        ];
        
        summaryCards.forEach(card => {
            const cardElement = createElement('div', `bg-${card.color}-50 border border-${card.color}-200 rounded-lg p-4`);
            const valueElement = createElement('div', `text-2xl font-bold text-${card.color}-600`, card.value.toString());
            const titleElement = createElement('div', 'text-sm text-gray-600', card.title);
            cardElement.appendChild(valueElement);
            cardElement.appendChild(titleElement);
            summaryGrid.appendChild(cardElement);
        });
        
        container.appendChild(header);
        container.appendChild(summaryGrid);
        
        if (topProducts.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhum dado encontrado no período selecionado';
            container.appendChild(emptyMessage);
            return container;
        }
        
        // Produtos mais transferidos
        const productsTitle = createElement('h3', 'text-lg font-semibold text-gray-800 mb-4', 'Produtos Mais Transferidos');
        container.appendChild(productsTitle);
        
        const productsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
        
        topProducts.forEach(([produto, quantidade]) => {
            const card = createElement('div', 'bg-gray-50 rounded-lg p-4');
            const productName = createElement('h4', 'font-semibold text-gray-800 mb-2', produto);
            const quantityDiv = createElement('div', 'text-blue-600 font-medium', `${quantidade} unidades`);
            
            card.appendChild(productName);
            card.appendChild(quantityDiv);
            productsGrid.appendChild(card);
        });
        
        container.appendChild(productsGrid);
        
        return container;
    }

    createTransferenciasTable(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg overflow-hidden');
        
        const header = createElement('div', 'p-6 border-b border-gray-200');
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Detalhamento de Transferências');
        header.appendChild(title);
        
        const tableWrapper = createElement('div', 'overflow-x-auto');
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        
        const headers = ['Data/Hora', 'Responsável', 'Itens', 'Total de Itens', 'Visto'];
        headers.forEach(headerText => {
            const th = createElement('th', 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody', 'bg-white divide-y divide-gray-200');
        
        if (data.length === 0) {
            const emptyRow = createElement('tr');
            const emptyCell = createElement('td', 'px-6 py-8 text-center text-gray-500 italic');
            emptyCell.colSpan = headers.length;
            emptyCell.textContent = 'Nenhuma transferência encontrada no período selecionado';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            data
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
                .forEach(lancamento => {
                    const row = createElement('tr', `hover:bg-gray-50 transition-colors ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
                    
                    // Data/Hora
                    const dateCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const { date, time } = formatDateTime(lancamento.data_hora);
                    const dateDiv = createElement('div', 'text-sm font-medium text-gray-900', date);
                    const timeDiv = createElement('div', 'text-sm text-gray-500', time);
                    dateCell.appendChild(dateDiv);
                    dateCell.appendChild(timeDiv);
                    
                    // Responsável
                    const nameCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900');
                    nameCell.textContent = lancamento.nome || 'N/A';
                    
                    // Itens
                    const itemsCell = createElement('td', 'px-6 py-4');
                    const itemsDiv = this.createItemsDisplay(lancamento);
                    itemsCell.appendChild(itemsDiv);
                    
                    // Total de Itens
                    const totalCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600');
                    const totalItens = Object.values(lancamento.itens).reduce((sum, qty) => sum + qty, 0);
                    totalCell.textContent = totalItens.toString();
                    
                    // Visto
                    const vistoCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const vistoIndicator = createElement('div', 'status-indicator');
                    const vistoDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
                    const vistoText = createElement('span', 'text-sm text-gray-600', lancamento.visto ? 'Visto' : 'Pendente');
                    vistoIndicator.appendChild(vistoDot);
                    vistoIndicator.appendChild(vistoText);
                    vistoCell.appendChild(vistoIndicator);
                    
                    row.appendChild(dateCell);
                    row.appendChild(nameCell);
                    row.appendChild(itemsCell);
                    row.appendChild(totalCell);
                    row.appendChild(vistoCell);
                    
                    tbody.appendChild(row);
                });
        }
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        
        container.appendChild(header);
        container.appendChild(tableWrapper);
        
        return container;
    }

    createEstoqueStats(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center mb-6');
        header.appendChild(createIcon('warehouse', 'w-6 h-6 text-gray-600 mr-3'));
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Estatísticas de Controle de Estoque');
        header.appendChild(title);
        
        // Calcular estatísticas por produto
        const productStats = {};
        let totalMovimentacoes = data.length;
        let totalItens = 0;
        
        // Calcular uso diário médio
        const dailyUsage = {};
        
        data.forEach(lancamento => {
            const date = new Date(lancamento.data_hora).toDateString();
            
            Object.entries(lancamento.itens).forEach(([item, quantity]) => {
                totalItens += quantity;
                
                if (!productStats[item]) {
                    productStats[item] = { total: 0, movimentacoes: 0 };
                }
                productStats[item].total += quantity;
                productStats[item].movimentacoes++;
                
                // Uso diário
                if (!dailyUsage[date]) {
                    dailyUsage[date] = {};
                }
                if (!dailyUsage[date][item]) {
                    dailyUsage[date][item] = 0;
                }
                dailyUsage[date][item] += quantity;
            });
        });
        
        // Calcular médias diárias
        const dailyAverages = {};
        const totalDays = Object.keys(dailyUsage).length;
        
        Object.entries(productStats).forEach(([item, stats]) => {
            dailyAverages[item] = totalDays > 0 ? (stats.total / totalDays).toFixed(1) : 0;
        });
        
        const topProducts = Object.entries(productStats)
            .sort(([, a], [, b]) => b.total - a.total);
        
        // Cards de resumo
        const summaryGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-6');
        
        const summaryCards = [
            { title: 'Total de Movimentações', value: totalMovimentacoes, color: 'blue' },
            { title: 'Total de Itens Utilizados', value: totalItens, color: 'green' },
            { title: 'Produtos Diferentes', value: Object.keys(productStats).length, color: 'purple' }
        ];
        
        summaryCards.forEach(card => {
            const cardElement = createElement('div', `bg-${card.color}-50 border border-${card.color}-200 rounded-lg p-4`);
            const valueElement = createElement('div', `text-2xl font-bold text-${card.color}-600`, card.value.toString());
            const titleElement = createElement('div', 'text-sm text-gray-600', card.title);
            cardElement.appendChild(valueElement);
            cardElement.appendChild(titleElement);
            summaryGrid.appendChild(cardElement);
        });
        
        container.appendChild(header);
        container.appendChild(summaryGrid);
        
        if (topProducts.length === 0) {
            const emptyMessage = createElement('div', 'text-center py-8 text-gray-500');
            emptyMessage.textContent = 'Nenhum dado encontrado no período selecionado';
            container.appendChild(emptyMessage);
            return container;
        }
        
        // Produtos mais utilizados
        const productsTitle = createElement('h3', 'text-lg font-semibold text-gray-800 mb-4', 'Produtos Mais Utilizados');
        container.appendChild(productsTitle);
        
        const productsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
        
        topProducts.forEach(([produto, stats]) => {
            const card = createElement('div', 'bg-gray-50 rounded-lg p-4');
            
            const productName = createElement('h4', 'font-semibold text-gray-800 mb-2', produto);
            
            const statsDiv = createElement('div', 'space-y-1 text-sm');
            const totalDiv = createElement('div', 'text-blue-600 font-medium', `Total: ${stats.total} unidades`);
            const movimentacoesDiv = createElement('div', 'text-green-600', `Movimentações: ${stats.movimentacoes}`);
            const mediaDiv = createElement('div', 'text-purple-600', `Média diária: ${dailyAverages[produto]} unidades`);
            
            statsDiv.appendChild(totalDiv);
            statsDiv.appendChild(movimentacoesDiv);
            statsDiv.appendChild(mediaDiv);
            
            card.appendChild(productName);
            card.appendChild(statsDiv);
            productsGrid.appendChild(card);
        });
        
        container.appendChild(productsGrid);
        
        return container;
    }

    createEstoqueTable(data) {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg overflow-hidden');
        
        const header = createElement('div', 'p-6 border-b border-gray-200');
        const title = createElement('h2', 'text-xl font-bold text-gray-800', 'Detalhamento de Controle de Estoque');
        header.appendChild(title);
        
        const tableWrapper = createElement('div', 'overflow-x-auto');
        const table = createElement('table', 'table w-full');
        
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        
        const headers = ['Data/Hora', 'Responsável', 'Itens', 'Total de Itens', 'Visto'];
        headers.forEach(headerText => {
            const th = createElement('th', 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = createElement('tbody', 'bg-white divide-y divide-gray-200');
        
        if (data.length === 0) {
            const emptyRow = createElement('tr');
            const emptyCell = createElement('td', 'px-6 py-8 text-center text-gray-500 italic');
            emptyCell.colSpan = headers.length;
            emptyCell.textContent = 'Nenhuma movimentação de estoque encontrada no período selecionado';
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            data
                .sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora))
                .forEach(lancamento => {
                    const row = createElement('tr', `hover:bg-gray-50 transition-colors ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
                    
                    // Data/Hora
                    const dateCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const { date, time } = formatDateTime(lancamento.data_hora);
                    const dateDiv = createElement('div', 'text-sm font-medium text-gray-900', date);
                    const timeDiv = createElement('div', 'text-sm text-gray-500', time);
                    dateCell.appendChild(dateDiv);
                    dateCell.appendChild(timeDiv);
                    
                    // Responsável
                    const nameCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900');
                    nameCell.textContent = lancamento.nome || 'N/A';
                    
                    // Itens
                    const itemsCell = createElement('td', 'px-6 py-4');
                    const itemsDiv = this.createItemsDisplay(lancamento);
                    itemsCell.appendChild(itemsDiv);
                    
                    // Total de Itens
                    const totalCell = createElement('td', 'px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600');
                    const totalItens = Object.values(lancamento.itens).reduce((sum, qty) => sum + qty, 0);
                    totalCell.textContent = totalItens.toString();
                    
                    // Visto
                    const vistoCell = createElement('td', 'px-6 py-4 whitespace-nowrap');
                    const vistoIndicator = createElement('div', 'status-indicator');
                    const vistoDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
                    const vistoText = createElement('span', 'text-sm text-gray-600', lancamento.visto ? 'Visto' : 'Pendente');
                    vistoIndicator.appendChild(vistoDot);
                    vistoIndicator.appendChild(vistoText);
                    vistoCell.appendChild(vistoIndicator);
                    
                    row.appendChild(dateCell);
                    row.appendChild(nameCell);
                    row.appendChild(itemsCell);
                    row.appendChild(totalCell);
                    row.appendChild(vistoCell);
                    
                    tbody.appendChild(row);
                });
        }
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        
        container.appendChild(header);
        container.appendChild(tableWrapper);
        
        return container;
    }

    getFilteredData() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Se não há filtros aplicados, mostrar apenas dados do mês atual
        if (!filterManager.filters.startDate && !filterManager.filters.endDate) {
            return lancamentosManager.lancamentos.filter(lancamento => {
                const lancamentoDate = new Date(lancamento.data_hora);
                return lancamentoDate.getMonth() === currentMonth && 
                       lancamentoDate.getFullYear() === currentYear;
            });
        }
        
        // Se há filtros, aplicar normalmente
        return filterManager.filterData(lancamentosManager.lancamentos);
    }

    updateAllContent() {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            this.updateContentArea(contentArea);
        }
    }

    getTypeIcon(tipo) {
        const icons = {
            'lanche': 'users',
            'perda': 'trending-down',
            'sobra': 'package',
            'transferencia': 'arrow-right-left',
            'estoque': 'warehouse'
        };
        return icons[tipo] || 'circle';
    }

    getTypeLabel(tipo) {
        const labels = {
            'lanche': 'Lanche',
            'perda': 'Perda',
            'sobra': 'Sobra',
            'transferencia': 'Transferência',
            'estoque': 'Estoque'
        };
        return labels[tipo] || tipo;
    }

    getTypeBadgeClass(tipo) {
        const classes = {
            'lanche': 'badge-success',
            'perda': 'badge-warning',
            'sobra': 'badge-info',
            'transferencia': 'badge-info',
            'estoque': 'badge-info'
        };
        return classes[tipo] || 'badge-info';
    }
}

// Instância global da área restrita
const areaRestrita = new AreaRestrita();

// Tornar disponível globalmente para outros módulos
window.areaRestrita = areaRestrita;
