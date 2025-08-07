// Área Restrita - Sistema de Autenticação e Relatórios
class AreaRestrita {
    constructor() {
        this.isAuthenticated = false;
        this.password = '0716'; // Em produção, isso deveria ser mais seguro
        this.currentView = 'dashboard';
    }

    createLoginForm() {
        const container = createElement('div', 'min-h-screen login-container flex items-center justify-center p-4');
        
        const formContainer = createElement('div', 'login-form-container w-full max-w-md p-8 rounded-xl');
        
        // Header
        const header = createElement('div', 'text-center mb-8');
        const iconContainer = createElement('div', 'login-icon-container w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4');
        iconContainer.appendChild(createIcon('lock', 'w-10 h-10 text-white'));
        
        const title = createElement('h2', 'text-2xl font-bold mb-2', 'Área Restrita');
        const subtitle = createElement('p', 'text-sm opacity-90', 'Acesso apenas para administradores');
        
        header.appendChild(iconContainer);
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Form
        const form = createElement('form', 'space-y-6');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleLogin();
        };
        
        const passwordGroup = createElement('div');
        const passwordLabel = createElement('label', 'form-label', 'Senha');
        const passwordContainer = createElement('div', 'password-input-container');
        const passwordInput = createElement('input', 'form-input pr-12');
        passwordInput.type = 'password';
        passwordInput.id = 'admin-password';
        passwordInput.placeholder = 'Digite a senha de administrador';
        passwordInput.required = true;
        
        const toggleButton = createElement('button', 'password-toggle-btn');
        toggleButton.type = 'button';
        toggleButton.appendChild(createIcon('eye', 'w-5 h-5'));
        toggleButton.onclick = () => this.togglePasswordVisibility();
        
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
        backButton.appendChild(document.createTextNode('Voltar aos Lançamentos'));
        
        formContainer.appendChild(header);
        formContainer.appendChild(form);
        formContainer.appendChild(backButton);
        container.appendChild(formContainer);
        
        setTimeout(() => initializeLucideIcons(), 0);
        
        return container;
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('admin-password');
        const toggleButton = document.querySelector('.password-toggle-btn');
        const icon = toggleButton.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    handleLogin() {
        const passwordInput = document.getElementById('admin-password');
        const password = passwordInput.value;
        
        if (password === this.password) {
            this.isAuthenticated = true;
            toast.success('Login realizado com sucesso!');
            app.showRestrita();
        } else {
            toast.error('Senha incorreta!');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    createRestritaContent() {
        const container = createElement('div', 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100');
        container.classList.add('page-enter');
        
        const mainContainer = createElement('div', 'container mx-auto px-4 py-8');
        
        // Header
        const header = createElement('div', 'flex items-center justify-between mb-8');
        header.classList.add('card-enter');
        
        const headerLeft = createElement('div', 'flex items-center');
        headerLeft.appendChild(createIcon('bar-chart-3', 'w-8 h-8 text-gray-700 mr-3'));
        const title = createElement('h1', 'text-3xl font-bold text-gray-800', 'Área Restrita');
        headerLeft.appendChild(title);
        
        const headerRight = createElement('div', 'flex gap-3');
        const logoutButton = createElement('button', 'btn btn-secondary');
        logoutButton.textContent = 'Sair';
        logoutButton.onclick = () => this.logout();
        
        const backButton = createElement('button', 'btn bg-gray-800 text-white hover:bg-gray-900');
        backButton.textContent = 'Voltar aos Lançamentos';
        backButton.onclick = () => app.showLancamentos();
        
        headerRight.appendChild(logoutButton);
        headerRight.appendChild(backButton);
        header.appendChild(headerLeft);
        header.appendChild(headerRight);
        
        // Navigation
        const nav = this.createNavigation();
        
        // Content
        const content = createElement('div', 'mt-8');
        this.updateContent(content);
        
        mainContainer.appendChild(header);
        mainContainer.appendChild(nav);
        mainContainer.appendChild(content);
        container.appendChild(mainContainer);
        
        setTimeout(() => initializeLucideIcons(), 0);
        
        return container;
    }

    createNavigation() {
        const nav = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-8');
        nav.classList.add('card-enter');
        
        const navButtons = createElement('div', 'flex gap-4 flex-wrap');
        
        const buttons = [
            { id: 'dashboard', label: 'Dashboard', icon: 'home' },
            { id: 'lancamentos', label: 'Todos os Lançamentos', icon: 'list' },
            { id: 'relatorios', label: 'Relatórios', icon: 'bar-chart' }
        ];
        
        buttons.forEach(button => {
            const btn = createElement('button', `btn ${this.currentView === button.id ? 'btn-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`);
            btn.appendChild(createIcon(button.icon, 'icon'));
            btn.appendChild(document.createTextNode(button.label));
            btn.onclick = () => this.switchView(button.id);
            navButtons.appendChild(btn);
        });
        
        nav.appendChild(navButtons);
        return nav;
    }

    switchView(view) {
        this.currentView = view;
        const content = document.querySelector('.min-h-screen .container > div:last-child');
        if (content) {
            this.updateContent(content);
        }
        
        // Update navigation buttons
        const navButtons = document.querySelectorAll('.bg-white.rounded-xl button');
        navButtons.forEach((btn, index) => {
            const views = ['dashboard', 'lancamentos', 'relatorios'];
            if (views[index] === view) {
                btn.className = 'btn btn-primary';
            } else {
                btn.className = 'btn bg-gray-100 text-gray-700 hover:bg-gray-200';
            }
        });
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    updateContent(container) {
        container.innerHTML = '';
        
        switch (this.currentView) {
            case 'dashboard':
                container.appendChild(this.createDashboard());
                break;
            case 'lancamentos':
                container.appendChild(this.createLancamentosView());
                break;
            case 'relatorios':
                container.appendChild(this.createRelatoriosView());
                break;
        }
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    createDashboard() {
        const container = createElement('div', 'space-y-8');
        
        // Stats cards
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6');
        
        const hoje = new Date().toDateString();
        const lancamentosHoje = lancamentosManager.lancamentos.filter(l => {
            return new Date(l.data_hora).toDateString() === hoje;
        });
        
        const stats = [
            { label: 'Lançamentos Hoje', value: lancamentosHoje.length, icon: 'calendar', color: 'blue' },
            { label: 'Total de Lançamentos', value: lancamentosManager.lancamentos.length, icon: 'database', color: 'green' },
            { label: 'Lanches Hoje', value: lancamentosHoje.filter(l => l.tipo === 'lanche').length, icon: 'users', color: 'yellow' },
            { label: 'Pendentes', value: lancamentosManager.lancamentos.filter(l => !l.visto).length, icon: 'clock', color: 'red' }
        ];
        
        stats.forEach(stat => {
            const card = createElement('div', `card card-body text-center border-l-4 border-${stat.color}-500`);
            
            const iconContainer = createElement('div', `w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center mb-3 mx-auto`);
            iconContainer.appendChild(createIcon(stat.icon, `w-6 h-6 text-${stat.color}-600`));
            
            const value = createElement('div', 'text-2xl font-bold text-gray-800 mb-1', stat.value.toString());
            const label = createElement('div', 'text-sm text-gray-600', stat.label);
            
            card.appendChild(iconContainer);
            card.appendChild(value);
            card.appendChild(label);
            statsGrid.appendChild(card);
            // Adicionar funcionalidade de clique para cada card
            card.onclick = () => this.handleDashboardCardClick(stat.label, stat.color);
            
        });
        
        container.appendChild(statsGrid);
        
        // Recent launches section
        const recentSection = this.createRecentLaunchesSection();
        container.appendChild(recentSection);
        
        return container;
    }

    handleDashboardCardClick(cardType, color) {
        switch (cardType) {
            case 'Pendentes':
                this.showPendentesModal();
                break;
            case 'Lançamentos Hoje':
                this.showLancamentosHojeModal();
                break;
            case 'Total de Lançamentos':
                this.showTotalLancamentosModal();
                break;
            case 'Lanches Hoje':
                this.showLanchesHojeModal();
                break;
        }
    }

    showPendentesModal() {
        const pendentes = lancamentosManager.lancamentos.filter(l => !l.visto);
        
        const modalBody = createElement('div', 'space-y-4');
        
        if (pendentes.length === 0) {
            const emptyState = createElement('div', 'text-center py-8');
            const icon = createElement('div', 'w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4');
            icon.appendChild(createIcon('check-circle', 'w-8 h-8 text-green-600'));
            const title = createElement('h3', 'text-lg font-semibold text-gray-800 mb-2', 'Tudo em dia!');
            const description = createElement('p', 'text-gray-600', 'Não há lançamentos pendentes no momento.');
            
            emptyState.appendChild(icon);
            emptyState.appendChild(title);
            emptyState.appendChild(description);
            modalBody.appendChild(emptyState);
        } else {
            const header = createElement('div', 'flex items-center justify-between mb-4 pb-4 border-b border-gray-200');
            const title = createElement('h3', 'text-lg font-semibold text-gray-800 flex items-center');
            title.appendChild(createIcon('clock', 'w-5 h-5 text-red-600 mr-2'));
            title.appendChild(document.createTextNode(`${pendentes.length} Lançamentos Pendentes`));
            
            const markAllButton = createElement('button', 'btn btn-sm btn-success');
            markAllButton.textContent = 'Marcar Todos como Visto';
            markAllButton.onclick = () => this.markAllAsVisto(pendentes);
            
            header.appendChild(title);
            header.appendChild(markAllButton);
            modalBody.appendChild(header);
            
            const pendentesGrid = createElement('div', 'space-y-3 max-h-96 overflow-y-auto');
            
            pendentes.forEach(lancamento => {
                const card = createElement('div', `bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-all duration-200 cursor-pointer border-l-4 border-l-${this.getTypeColor(lancamento.tipo)}-500`);
                
                const cardHeader = createElement('div', 'flex items-center justify-between mb-2');
                const leftInfo = createElement('div', 'flex items-center gap-2');
                const typeBadge = createElement('span', `badge badge-${this.getTypeBadgeColor(lancamento.tipo)}`, this.getTypeLabel(lancamento.tipo));
                const statusDot = createElement('div', 'status-dot status-dot-pending');
                leftInfo.appendChild(typeBadge);
                leftInfo.appendChild(statusDot);
                
                const actions = createElement('div', 'flex gap-2');
                const vistoBtn = createElement('button', 'btn btn-sm btn-success');
                vistoBtn.textContent = 'Visto';
                vistoBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleVistoInModal(lancamento.id, card);
                };
                
                const editBtn = createElement('button', 'btn btn-sm btn-info');
                editBtn.textContent = 'Editar';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    modal.hide();
                    lancamentosManager.editLancamento(lancamento);
                    app.showLancamentoModal(lancamento.tipo);
                };
                
                const deleteBtn = createElement('button', 'btn btn-sm btn-danger');
                deleteBtn.textContent = 'Excluir';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    modal.hide();
                    this.confirmDelete(lancamento);
                };
                
                actions.appendChild(vistoBtn);
                actions.appendChild(editBtn);
                actions.appendChild(deleteBtn);
                cardHeader.appendChild(leftInfo);
                cardHeader.appendChild(actions);
                
                const name = createElement('div', 'font-medium text-gray-800 mb-1', lancamento.funcionario || lancamento.nome || '-');
                const dateTime = formatDateTime(lancamento.data_hora);
                const date = createElement('div', 'text-sm text-gray-600 mb-2', `${dateTime.date} às ${dateTime.time}`);
                
                const itemsPreview = createElement('div', 'text-xs text-gray-600');
                const itemsCount = Object.keys(lancamento.itens || {}).length + (lancamento.suco ? 1 : 0);
                itemsPreview.textContent = `${itemsCount} item(s)`;
                
                card.appendChild(cardHeader);
                card.appendChild(name);
                card.appendChild(date);
                card.appendChild(itemsPreview);
                
                card.onclick = () => {
                    modal.hide();
                    setTimeout(() => this.showLancamentoDetailsModal(lancamento), 100);
                };
                
                pendentesGrid.appendChild(card);
            });
            
            modalBody.appendChild(pendentesGrid);
        }
        
        const modalFooter = createElement('div', 'flex justify-end');
        const closeButton = createElement('button', 'btn bg-gray-300 text-gray-700 hover:bg-gray-400');
        closeButton.textContent = 'Fechar';
        closeButton.onclick = () => modal.hide();
        modalFooter.appendChild(closeButton);
        
        const modalContent = modal.createModal('Lançamentos Pendentes', modalBody, modalFooter);
        modal.show(modalContent, { size: 'large' });
    }

    async toggleVistoInModal(lancamentoId, cardElement) {
        const success = await lancamentosManager.toggleVisto(lancamentoId);
        if (success) {
            // Animar remoção do card
            cardElement.classList.add('item-removing');
            setTimeout(() => {
                if (cardElement.parentNode) {
                    cardElement.parentNode.removeChild(cardElement);
                }
                
                // Verificar se ainda há pendentes
                const remainingCards = cardElement.parentNode?.children.length || 0;
                if (remainingCards === 0) {
                    modal.hide();
                    setTimeout(() => this.showPendentesModal(), 100);
                }
            }, 300);
            
            // Atualizar dashboard em background
            this.updateAllContent();
        }
    }

    async markAllAsVisto(pendentes) {
        const confirmModal = createElement('div', 'text-center');
        confirmModal.innerHTML = `
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="check-circle" class="w-8 h-8 text-green-600"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Marcar Todos como Visto</h3>
            <p class="text-gray-600">Tem certeza que deseja marcar todos os ${pendentes.length} lançamentos pendentes como visto?</p>
        `;
        
        const confirmFooter = createElement('div', 'flex gap-3');
        const cancelBtn = createElement('button', 'btn bg-gray-300 text-gray-700 hover:bg-gray-400 flex-1');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => modal.hide();
        
        const confirmBtn = createElement('button', 'btn btn-success flex-1');
        confirmBtn.textContent = 'Confirmar';
        confirmBtn.onclick = async () => {
            let successCount = 0;
            for (const lancamento of pendentes) {
                const success = await lancamentosManager.toggleVisto(lancamento.id);
                if (success) successCount++;
            }
            
            modal.hide();
            if (successCount > 0) {
                toast.success(`${successCount} lançamentos marcados como visto!`);
                setTimeout(() => this.showPendentesModal(), 100);
                this.updateAllContent();
            }
        };
        
        confirmFooter.appendChild(cancelBtn);
        confirmFooter.appendChild(confirmBtn);
        
        const confirmModalContent = modal.createModal('Confirmar Ação', confirmModal, confirmFooter);
        modal.show(confirmModalContent, { size: 'small' });
    }

    showLancamentosHojeModal() {
        const hoje = new Date().toDateString();
        const lancamentosHoje = lancamentosManager.lancamentos.filter(l => {
            return new Date(l.data_hora).toDateString() === hoje;
        });
        
        this.showFilteredLancamentosModal('Lançamentos de Hoje', lancamentosHoje, 'calendar', 'blue');
    }

    showTotalLancamentosModal() {
        this.showFilteredLancamentosModal('Todos os Lançamentos', lancamentosManager.lancamentos, 'database', 'green');
    }

    showLanchesHojeModal() {
        const hoje = new Date().toDateString();
        const lanchesHoje = lancamentosManager.lancamentos.filter(l => {
            return new Date(l.data_hora).toDateString() === hoje && l.tipo === 'lanche';
        });
        
        this.showFilteredLancamentosModal('Lanches de Hoje', lanchesHoje, 'users', 'yellow');
    }

    showFilteredLancamentosModal(title, lancamentos, icon, color) {
        const modalBody = createElement('div', 'space-y-4');
        
        if (lancamentos.length === 0) {
            const emptyState = createElement('div', 'text-center py-8');
            const iconEl = createElement('div', `w-16 h-16 bg-${color}-100 rounded-full flex items-center justify-center mx-auto mb-4`);
            iconEl.appendChild(createIcon(icon, `w-8 h-8 text-${color}-600`));
            const titleEl = createElement('h3', 'text-lg font-semibold text-gray-800 mb-2', 'Nenhum lançamento encontrado');
            const description = createElement('p', 'text-gray-600', 'Não há lançamentos para exibir nesta categoria.');
            
            emptyState.appendChild(iconEl);
            emptyState.appendChild(titleEl);
            emptyState.appendChild(description);
            modalBody.appendChild(emptyState);
        } else {
            const header = createElement('div', 'flex items-center justify-between mb-4 pb-4 border-b border-gray-200');
            const titleEl = createElement('h3', 'text-lg font-semibold text-gray-800 flex items-center');
            titleEl.appendChild(createIcon(icon, `w-5 h-5 text-${color}-600 mr-2`));
            titleEl.appendChild(document.createTextNode(`${lancamentos.length} Lançamentos`));
            header.appendChild(titleEl);
            modalBody.appendChild(header);
            
            const lancamentosGrid = createElement('div', 'space-y-3 max-h-96 overflow-y-auto');
            
            lancamentos.forEach(lancamento => {
                const card = createElement('div', `card card-body cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-${this.getTypeColor(lancamento.tipo)}-500 ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
                
                const cardHeader = createElement('div', 'flex items-center justify-between mb-2');
                const leftInfo = createElement('div', 'flex items-center gap-2');
                const typeBadge = createElement('span', `badge badge-${this.getTypeBadgeColor(lancamento.tipo)}`, this.getTypeLabel(lancamento.tipo));
                const statusDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
                leftInfo.appendChild(typeBadge);
                leftInfo.appendChild(statusDot);
                
                const actions = createElement('div', 'flex gap-2');
                const vistoBtn = createElement('button', `btn btn-sm ${lancamento.visto ? 'btn-secondary' : 'btn-success'}`);
                vistoBtn.textContent = lancamento.visto ? 'Remover' : 'Visto';
                vistoBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleVistoInFilteredModal(lancamento.id, card);
                };
                
                const editBtn = createElement('button', 'btn btn-sm btn-info');
                editBtn.textContent = 'Editar';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    modal.hide();
                    lancamentosManager.editLancamento(lancamento);
                    app.showLancamentoModal(lancamento.tipo);
                };
                
                const deleteBtn = createElement('button', 'btn btn-sm btn-danger');
                deleteBtn.textContent = 'Excluir';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    modal.hide();
                    this.confirmDelete(lancamento);
                };
                
                actions.appendChild(vistoBtn);
                actions.appendChild(editBtn);
                actions.appendChild(deleteBtn);
                cardHeader.appendChild(leftInfo);
                cardHeader.appendChild(actions);
                
                const name = createElement('div', 'font-medium text-gray-800 mb-1', lancamento.funcionario || lancamento.nome || '-');
                const dateTime = formatDateTime(lancamento.data_hora);
                const date = createElement('div', 'text-sm text-gray-600 mb-2', `${dateTime.date} às ${dateTime.time}`);
                
                const itemsPreview = createElement('div', 'text-xs text-gray-600');
                const itemsCount = Object.keys(lancamento.itens || {}).length + (lancamento.suco ? 1 : 0);
                itemsPreview.textContent = `${itemsCount} item(s)`;
                
                card.appendChild(cardHeader);
                card.appendChild(name);
                card.appendChild(date);
                card.appendChild(itemsPreview);
                
                card.onclick = () => {
                    modal.hide();
                    setTimeout(() => this.showLancamentoDetailsModal(lancamento), 100);
                };
                
                lancamentosGrid.appendChild(card);
            });
            
            modalBody.appendChild(lancamentosGrid);
        }
        
        const modalFooter = createElement('div', 'flex justify-end');
        const closeButton = createElement('button', 'btn bg-gray-300 text-gray-700 hover:bg-gray-400');
        closeButton.textContent = 'Fechar';
        closeButton.onclick = () => modal.hide();
        modalFooter.appendChild(closeButton);
        
        const modalContent = modal.createModal(title, modalBody, modalFooter);
        modal.show(modalContent, { size: 'large' });
    }

    async toggleVistoInFilteredModal(lancamentoId, cardElement) {
        const success = await lancamentosManager.toggleVisto(lancamentoId);
        if (success) {
            // Encontrar o lançamento atualizado
            const updatedLancamento = lancamentosManager.lancamentos.find(l => l.id === lancamentoId);
            if (!updatedLancamento) return;
            
            // Atualizar visual do card
            if (updatedLancamento.visto) {
                cardElement.className = cardElement.className.replace('item-pending', 'item-visto');
            } else {
                cardElement.className = cardElement.className.replace('item-visto', 'item-pending');
            }
            
            // Atualizar status dot
            const statusDot = cardElement.querySelector('.status-dot');
            if (statusDot) {
                if (updatedLancamento.visto) {
                    statusDot.className = 'status-dot status-dot-success';
                } else {
                    statusDot.className = 'status-dot status-dot-pending';
                }
            }
            
            // Atualizar botão
            const vistoBtn = cardElement.querySelector('button');
            if (vistoBtn) {
                if (updatedLancamento.visto) {
                    vistoBtn.className = 'btn btn-sm btn-secondary';
                    vistoBtn.textContent = 'Remover';
                } else {
                    vistoBtn.className = 'btn btn-sm btn-success';
                    vistoBtn.textContent = 'Visto';
                }
            }
            
            // Adicionar animação de atualização
            cardElement.classList.add('item-updated');
            setTimeout(() => {
                cardElement.classList.remove('item-updated');
            }, 600);
            
            // Atualizar dashboard em background
            this.updateAllContent();
        }
    }
    createLancamentosView() {
        const container = createElement('div', 'space-y-6');
        
        // Filter component
        const filterComponent = filterManager.createFilterComponent(() => {
            this.updateCategoryTabs(container);
        });
        container.appendChild(filterComponent);
        
        // Category tabs
        const categoryTabs = this.createCategoryTabs();
        container.appendChild(categoryTabs);
        
        // Listen for filter changes
        filterManager.addCallback(() => {
            this.updateCategoryTabs(container);
        });
        
        return container;
    }

    updateLancamentosTable(container) {
        // Clear existing table
        const existingTable = container.querySelector('table');
        if (existingTable) {
            existingTable.remove();
        }
        
        const filteredData = filterManager.filterData(lancamentosManager.lancamentos);
        
        if (filteredData.length === 0) {
            const emptyState = createElement('div', 'p-8 text-center text-gray-500');
            emptyState.textContent = 'Nenhum lançamento encontrado';
            container.appendChild(emptyState);
            return;
        }
        
        const table = createElement('table', 'table w-full');
        
        // Header
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        const headers = ['Data/Hora', 'Tipo', 'Nome/Funcionário', 'Itens', 'Status', 'Ações'];
        
        headers.forEach(header => {
            const th = createElement('th', '', header);
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body
        const tbody = createElement('tbody');
        
        filteredData.forEach(lancamento => {
            const row = createElement('tr', lancamento.visto ? 'item-visto' : 'item-pending');
            
            // Data/Hora
            const dateTime = formatDateTime(lancamento.data_hora);
            const dateCell = createElement('td');
            dateCell.innerHTML = `<div class="text-sm">${dateTime.date}</div><div class="text-xs text-gray-500">${dateTime.time}</div>`;
            
            // Tipo
            const typeCell = createElement('td');
            const typeBadge = createElement('span', `badge badge-${this.getTypeBadgeColor(lancamento.tipo)}`, this.getTypeLabel(lancamento.tipo));
            typeCell.appendChild(typeBadge);
            
            // Nome/Funcionário
            const nameCell = createElement('td', 'text-sm', lancamento.funcionario || lancamento.nome || '-');
            
            // Itens
            const itemsCell = createElement('td', 'text-sm');
            const itemsList = this.formatItemsList(lancamento);
            itemsCell.innerHTML = itemsList;
            
            // Status
            const statusCell = createElement('td');
            const statusIndicator = createElement('div', 'status-indicator');
            const statusDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
            const statusText = createElement('span', 'text-sm', lancamento.visto ? 'Visto' : 'Pendente');
            statusIndicator.appendChild(statusDot);
            statusIndicator.appendChild(statusText);
            statusCell.appendChild(statusIndicator);
            
            // Ações
            const actionsCell = createElement('td');
            const actionsContainer = createElement('div', 'flex gap-2');
            
            // Toggle visto button
            const vistoButton = createElement('button', `btn btn-sm ${lancamento.visto ? 'btn-secondary' : 'btn-success'}`);
            vistoButton.textContent = lancamento.visto ? 'Remover' : 'Visto';
            vistoButton.onclick = async () => {
                const success = await lancamentosManager.toggleVisto(lancamento.id);
                if (success) {
                    this.updateAllContent();
                }
            };
            
            // Edit button
            const editButton = createElement('button', 'btn btn-sm btn-info');
            editButton.textContent = 'Editar';
            editButton.onclick = () => {
                lancamentosManager.editLancamento(lancamento);
                app.showLancamentoModal(lancamento.tipo);
            };
            
            // Delete button
            const deleteButton = createElement('button', 'btn btn-sm btn-danger');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => this.confirmDelete(lancamento);
            
            actionsContainer.appendChild(vistoButton);
            actionsContainer.appendChild(editButton);
            actionsContainer.appendChild(deleteButton);
            actionsCell.appendChild(actionsContainer);
            
            row.appendChild(dateCell);
            row.appendChild(typeCell);
            row.appendChild(nameCell);
            row.appendChild(itemsCell);
            row.appendChild(statusCell);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        container.appendChild(table);
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    confirmDelete(lancamento) {
        const modalBody = createElement('div', 'text-center');
        modalBody.innerHTML = `
            <div class="mb-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="trash-2" class="w-8 h-8 text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Confirmar Exclusão</h3>
                <p class="text-gray-600">Tem certeza que deseja excluir este lançamento?</p>
                <p class="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
            </div>
        `;
        
        const modalFooter = createElement('div', 'flex gap-3');
        
        const cancelButton = createElement('button', 'btn bg-gray-300 text-gray-700 hover:bg-gray-400 flex-1');
        cancelButton.textContent = 'Cancelar';
        cancelButton.onclick = () => modal.hide();
        
        const confirmButton = createElement('button', 'btn btn-danger flex-1');
        confirmButton.textContent = 'Excluir';
        confirmButton.onclick = async () => {
            const success = await lancamentosManager.deleteLancamento(lancamento.id);
            if (success) {
                modal.hide();
                this.updateAllContent();
            }
        };
        
        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(confirmButton);
        
        const modalContent = modal.createModal('Confirmar Exclusão', modalBody, modalFooter);
        modal.show(modalContent, { size: 'small' });
    }

    createRelatoriosView() {
        const container = createElement('div', 'space-y-6');
        
        // Filter component for reports
        const reportFilterComponent = this.createReportFilterComponent();
        container.appendChild(reportFilterComponent);
        
        const card = createElement('div', 'card card-body');
        const title = createElement('h2', 'text-xl font-bold text-gray-800 mb-4', 'Relatórios Estatísticos');
        
        // Get filtered data for reports
        const filteredData = filterManager.filterData(lancamentosManager.lancamentos);
        const stats = this.getStatisticsByProductFiltered(filteredData);
        
        if (stats.length === 0) {
            const emptyState = createElement('p', 'text-gray-500 text-center py-8', 'Nenhum dado disponível para relatórios');
            card.appendChild(title);
            card.appendChild(emptyState);
        } else {
            const table = createElement('table', 'table w-full mt-4');
            
            // Header
            const thead = createElement('thead');
            const headerRow = createElement('tr');
            ['Produto', 'Perdas', 'Sobras', 'Total'].forEach(header => {
                const th = createElement('th', '', header);
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Body
            const tbody = createElement('tbody');
            let totalPerdas = 0;
            let totalSobras = 0;
            let totalGeral = 0;
            
            stats.forEach(([produto, data]) => {
                const row = createElement('tr');
                
                const produtoCell = createElement('td', 'font-medium', produto);
                const perdasCell = createElement('td', 'text-red-600', data.perdas.toString());
                const sobrasCell = createElement('td', 'text-orange-600', data.sobras.toString());
                const totalCell = createElement('td', 'font-semibold', data.total.toString());
                
                totalPerdas += data.perdas;
                totalSobras += data.sobras;
                totalGeral += data.total;
                
                row.appendChild(produtoCell);
                row.appendChild(perdasCell);
                row.appendChild(sobrasCell);
                row.appendChild(totalCell);
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            card.appendChild(title);
            card.appendChild(table);
            
            // Total summary card
            const totalCard = this.createTotalSummaryCard(totalPerdas, totalSobras, totalGeral);
            container.appendChild(totalCard);
        }
        
        container.appendChild(card);
        return container;
    }

    updateAllContent() {
        if (this.currentView === 'lancamentos') {
            const tableContainer = document.querySelector('.bg-white.rounded-xl.shadow-lg.overflow-hidden');
            if (tableContainer) {
                this.updateLancamentosTable(tableContainer);
            }
        } else if (this.currentView === 'dashboard') {
            const content = document.querySelector('.min-h-screen .container > div:last-child');
            if (content) {
                this.updateContent(content);
            }
        }
    }

    getTypeBadgeColor(tipo) {
        const colors = {
            'lanche': 'success',
            'perda': 'warning',
            'sobra': 'info',
            'transferencia': 'info',
            'estoque': 'info'
        };
        return colors[tipo] || 'info';
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

    formatItemsList(lancamento) {
        const items = [];
        
        // Adicionar itens
        if (lancamento.itens && Object.keys(lancamento.itens).length > 0) {
            Object.entries(lancamento.itens).forEach(([item, quantidade]) => {
                const itemName = lancamento.tamanho && lancamento.tipo !== 'estoque' ? 
                    formatSalgadoName(item, lancamento.tamanho) : item;
                items.push(`${itemName}: ${quantidade}`);
            });
        }
        
        // Adicionar suco
        if (lancamento.suco && lancamento.quantidade_suco > 0) {
            items.push(`${lancamento.suco}: ${lancamento.quantidade_suco}`);
        }
        
        return items.length > 0 ? items.join('<br>') : '-';
    }

    createRecentLaunchesSection() {
        const section = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center justify-between mb-4');
        const title = createElement('h2', 'text-xl font-bold text-gray-800 flex items-center');
        title.appendChild(createIcon('clock', 'w-6 h-6 mr-2 text-blue-600'));
        title.appendChild(document.createTextNode('Últimos 5 Lançamentos'));
        header.appendChild(title);
        
        const recentLaunches = lancamentosManager.lancamentos.slice(0, 5);
        
        if (recentLaunches.length === 0) {
            const emptyState = createElement('p', 'text-gray-500 text-center py-8', 'Nenhum lançamento encontrado');
            section.appendChild(header);
            section.appendChild(emptyState);
            return section;
        }
        
        const launchesGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
        
        recentLaunches.forEach(lancamento => {
            const card = createElement('div', `card card-body cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-${this.getTypeColor(lancamento.tipo)}-500`);
            
            const cardHeader = createElement('div', 'flex items-center justify-between mb-2');
            const typeBadge = createElement('span', `badge badge-${this.getTypeBadgeColor(lancamento.tipo)}`, this.getTypeLabel(lancamento.tipo));
            const statusDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
            cardHeader.appendChild(typeBadge);
            cardHeader.appendChild(statusDot);
            
            const name = createElement('div', 'font-medium text-gray-800 mb-1', lancamento.funcionario || lancamento.nome || '-');
            const dateTime = formatDateTime(lancamento.data_hora);
            const date = createElement('div', 'text-sm text-gray-500', `${dateTime.date} ${dateTime.time}`);
            
            const itemsPreview = createElement('div', 'text-xs text-gray-600 mt-2');
            const itemsCount = Object.keys(lancamento.itens || {}).length + (lancamento.suco ? 1 : 0);
            itemsPreview.textContent = `${itemsCount} item(s)`;
            
            card.appendChild(cardHeader);
            card.appendChild(name);
            card.appendChild(date);
            card.appendChild(itemsPreview);
            
            card.onclick = () => this.showLancamentoDetailsModal(lancamento);
            
            launchesGrid.appendChild(card);
        });
        
        section.appendChild(header);
        section.appendChild(launchesGrid);
        
        return section;
    }

    createCategoryTabs() {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg overflow-hidden');
        
        const tabsHeader = createElement('div', 'flex border-b border-gray-200');
        const categories = [
            { id: 'todos', label: 'Todos', icon: 'list' },
            { id: 'lanche', label: 'Lanches', icon: 'users' },
            { id: 'perda', label: 'Perdas', icon: 'trending-down' },
            { id: 'sobra', label: 'Sobras', icon: 'package' },
            { id: 'transferencia', label: 'Transferências', icon: 'arrow-right-left' },
            { id: 'estoque', label: 'Estoque', icon: 'warehouse' }
        ];
        
        categories.forEach((category, index) => {
            const tab = createElement('button', `px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${index === 0 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`);
            tab.appendChild(createIcon(category.icon, 'w-4 h-4'));
            tab.appendChild(document.createTextNode(category.label));
            
            tab.onclick = () => this.switchCategoryTab(category.id, tabsHeader, container);
            tabsHeader.appendChild(tab);
        });
        
        const contentContainer = createElement('div', 'category-content');
        this.updateCategoryContent('todos', contentContainer);
        
        container.appendChild(tabsHeader);
        container.appendChild(contentContainer);
        
        return container;
    }

    switchCategoryTab(categoryId, tabsHeader, container) {
        // Update tab styles
        const tabs = tabsHeader.querySelectorAll('button');
        tabs.forEach((tab, index) => {
            const categories = ['todos', 'lanche', 'perda', 'sobra', 'transferencia', 'estoque'];
            if (categories[index] === categoryId) {
                tab.className = 'px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center gap-2 bg-blue-50 text-blue-600 border-b-2 border-blue-600';
            } else {
                tab.className = 'px-6 py-3 text-sm font-medium transition-colors duration-200 flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50';
            }
        });
        
        // Update content
        const contentContainer = container.querySelector('.category-content');
        this.updateCategoryContent(categoryId, contentContainer);
        
        setTimeout(() => initializeLucideIcons(), 0);
    }

    updateCategoryContent(categoryId, container) {
        container.innerHTML = '';
        
        let filteredData = filterManager.filterData(lancamentosManager.lancamentos);
        
        if (categoryId !== 'todos') {
            filteredData = filteredData.filter(l => l.tipo === categoryId);
        }
        
        if (filteredData.length === 0) {
            const emptyState = createElement('div', 'p-8 text-center text-gray-500');
            emptyState.textContent = 'Nenhum lançamento encontrado nesta categoria';
            container.appendChild(emptyState);
            return;
        }
        
        const grid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6');
        
        filteredData.forEach(lancamento => {
            const card = createElement('div', `card card-body cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-${this.getTypeColor(lancamento.tipo)}-500 ${lancamento.visto ? 'item-visto' : 'item-pending'}`);
            
            const cardHeader = createElement('div', 'flex items-center justify-between mb-2');
            const typeBadge = createElement('span', `badge badge-${this.getTypeBadgeColor(lancamento.tipo)}`, this.getTypeLabel(lancamento.tipo));
            const statusIndicator = createElement('div', 'status-indicator');
            const statusDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
            statusIndicator.appendChild(statusDot);
            cardHeader.appendChild(typeBadge);
            cardHeader.appendChild(statusIndicator);
            
            const name = createElement('div', 'font-medium text-gray-800 mb-1', lancamento.funcionario || lancamento.nome || '-');
            const dateTime = formatDateTime(lancamento.data_hora);
            const date = createElement('div', 'text-sm text-gray-500 mb-2', `${dateTime.date} ${dateTime.time}`);
            
            const itemsPreview = createElement('div', 'text-xs text-gray-600');
            const itemsCount = Object.keys(lancamento.itens || {}).length + (lancamento.suco ? 1 : 0);
            itemsPreview.textContent = `${itemsCount} item(s)`;
            
            card.appendChild(cardHeader);
            card.appendChild(name);
            card.appendChild(date);
            card.appendChild(itemsPreview);
            
            card.onclick = () => this.showLancamentoDetailsModal(lancamento);
            
            grid.appendChild(card);
        });
        
        container.appendChild(grid);
    }

    updateCategoryTabs(container) {
        const categoryContainer = container.querySelector('.bg-white.rounded-xl.shadow-lg.overflow-hidden');
        if (categoryContainer) {
            const contentContainer = categoryContainer.querySelector('.category-content');
            const activeTab = categoryContainer.querySelector('.bg-blue-50');
            
            if (contentContainer && activeTab) {
                const categories = ['todos', 'lanche', 'perda', 'sobra', 'transferencia', 'estoque'];
                const activeIndex = Array.from(activeTab.parentNode.children).indexOf(activeTab);
                const activeCategoryId = categories[activeIndex] || 'todos';
                
                this.updateCategoryContent(activeCategoryId, contentContainer);
            }
        }
    }

    showLancamentoDetailsModal(lancamento) {
        const modalBody = createElement('div', 'space-y-4');
        
        // Header info
        const headerInfo = createElement('div', 'bg-gray-50 rounded-lg p-4');
        const typeInfo = createElement('div', 'flex items-center justify-between mb-2');
        const typeBadge = createElement('span', `badge badge-${this.getTypeBadgeColor(lancamento.tipo)}`, this.getTypeLabel(lancamento.tipo));
        const statusIndicator = createElement('div', 'status-indicator');
        const statusDot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
        const statusText = createElement('span', 'text-sm ml-2', lancamento.visto ? 'Visto' : 'Pendente');
        statusIndicator.appendChild(statusDot);
        statusIndicator.appendChild(statusText);
        typeInfo.appendChild(typeBadge);
        typeInfo.appendChild(statusIndicator);
        
        const nameInfo = createElement('div', 'text-lg font-semibold text-gray-800', lancamento.funcionario || lancamento.nome || '-');
        const dateTime = formatDateTime(lancamento.data_hora);
        const dateInfo = createElement('div', 'text-sm text-gray-600', `${dateTime.date} às ${dateTime.time}`);
        
        headerInfo.appendChild(typeInfo);
        headerInfo.appendChild(nameInfo);
        headerInfo.appendChild(dateInfo);
        
        // Items details
        const itemsSection = createElement('div');
        const itemsTitle = createElement('h4', 'font-semibold text-gray-800 mb-2', 'Itens:');
        const itemsList = createElement('div', 'bg-gray-50 rounded-lg p-4');
        
        if (lancamento.itens && Object.keys(lancamento.itens).length > 0) {
            Object.entries(lancamento.itens).forEach(([item, quantidade]) => {
                const itemRow = createElement('div', 'flex justify-between items-center py-1');
                const itemName = lancamento.tamanho && lancamento.tipo !== 'estoque' ? 
                    formatSalgadoName(item, lancamento.tamanho) : item;
                const itemNameSpan = createElement('span', 'text-gray-700', itemName);
                const itemQuantity = createElement('span', 'font-medium text-gray-800', quantidade.toString());
                itemRow.appendChild(itemNameSpan);
                itemRow.appendChild(itemQuantity);
                itemsList.appendChild(itemRow);
            });
        }
        
        if (lancamento.suco && lancamento.quantidade_suco > 0) {
            const sucoRow = createElement('div', 'flex justify-between items-center py-1 border-t border-gray-200 mt-2 pt-2');
            const sucoName = createElement('span', 'text-gray-700', lancamento.suco);
            const sucoQuantity = createElement('span', 'font-medium text-gray-800', lancamento.quantidade_suco.toString());
            sucoRow.appendChild(sucoName);
            sucoRow.appendChild(sucoQuantity);
            itemsList.appendChild(sucoRow);
        }
        
        itemsSection.appendChild(itemsTitle);
        itemsSection.appendChild(itemsList);
        
        modalBody.appendChild(headerInfo);
        modalBody.appendChild(itemsSection);
        
        // Modal footer with actions
        const modalFooter = createElement('div', 'flex gap-3');
        
        const vistoButton = createElement('button', `btn btn-sm ${lancamento.visto ? 'btn-secondary' : 'btn-success'} flex-1`);
        vistoButton.textContent = lancamento.visto ? 'Remover Visto' : 'Marcar Visto';
        vistoButton.onclick = async () => {
            const success = await lancamentosManager.toggleVisto(lancamento.id);
            if (success) {
                // Atualizar o modal em tempo real
                this.updateModalContent(lancamento.id, modalBody, modalFooter);
                // Atualizar o conteúdo da área restrita em background
                this.updateAllContent();
            }
        };
        
        const editButton = createElement('button', 'btn btn-sm btn-info flex-1');
        editButton.textContent = 'Editar';
        editButton.onclick = () => {
            modal.hide();
            lancamentosManager.editLancamento(lancamento);
            app.showLancamentoModal(lancamento.tipo);
        };
        
        const deleteButton = createElement('button', 'btn btn-sm btn-danger flex-1');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => {
            modal.hide();
            this.confirmDelete(lancamento);
        };
        
        const closeButton = createElement('button', 'btn btn-sm bg-gray-300 text-gray-700 hover:bg-gray-400');
        closeButton.textContent = 'Fechar';
        closeButton.onclick = () => modal.hide();
        
        modalFooter.appendChild(vistoButton);
        modalFooter.appendChild(editButton);
        modalFooter.appendChild(deleteButton);
        modalFooter.appendChild(closeButton);
        
        const modalContent = modal.createModal('Detalhes do Lançamento', modalBody, modalFooter);
        modal.show(modalContent, { size: 'large' });
    }

    async updateModalContent(lancamentoId, modalBody, modalFooter) {
        // Encontrar o lançamento atualizado
        const updatedLancamento = lancamentosManager.lancamentos.find(l => l.id === lancamentoId);
        if (!updatedLancamento) return;
        
        // Atualizar status indicator no modal
        const statusIndicator = modalBody.querySelector('.status-indicator');
        if (statusIndicator) {
            const statusDot = statusIndicator.querySelector('.status-dot');
            const statusText = statusIndicator.querySelector('span');
            
            if (updatedLancamento.visto) {
                statusDot.className = 'status-dot status-dot-success';
                statusText.textContent = 'Visto';
            } else {
                statusDot.className = 'status-dot status-dot-pending';
                statusText.textContent = 'Pendente';
            }
        }
        
        // Atualizar botão de visto no footer
        const vistoButton = modalFooter.querySelector('button');
        if (vistoButton) {
            if (updatedLancamento.visto) {
                vistoButton.className = 'btn btn-sm btn-secondary flex-1';
                vistoButton.textContent = 'Remover Visto';
            } else {
                vistoButton.className = 'btn btn-sm btn-success flex-1';
                vistoButton.textContent = 'Marcar Visto';
            }
            
            // Atualizar o onclick com o lançamento atualizado
            vistoButton.onclick = async () => {
                const success = await lancamentosManager.toggleVisto(updatedLancamento.id);
                if (success) {
                    this.updateModalContent(updatedLancamento.id, modalBody, modalFooter);
                    this.updateAllContent();
                }
            };
        }
        
        // Adicionar animação de atualização
        modalBody.classList.add('item-updated');
        setTimeout(() => {
            modalBody.classList.remove('item-updated');
        }, 600);
    }
    createReportFilterComponent() {
        const container = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-6');
        
        const header = createElement('div', 'flex items-center justify-between mb-4');
        const title = createElement('h2', 'text-xl font-bold text-gray-800 flex items-center');
        title.appendChild(createIcon('filter', 'w-6 h-6 mr-2 text-purple-600'));
        title.appendChild(document.createTextNode('Filtros do Relatório'));
        header.appendChild(title);
        
        const inputsContainer = createElement('div', 'grid grid-cols-1 md:grid-cols-2 gap-4');
        
        // Data inicial
        const startDateGroup = createElement('div');
        const startDateLabel = createElement('label', 'form-label', 'Data Inicial');
        const startDateInput = createElement('input', 'form-input');
        startDateInput.type = 'date';
        startDateInput.value = filterManager.filters.startDate;
        startDateInput.onchange = (e) => {
            filterManager.filters.startDate = e.target.value;
            this.updateReportContent();
        };
        
        startDateGroup.appendChild(startDateLabel);
        startDateGroup.appendChild(startDateInput);
        
        // Data final
        const endDateGroup = createElement('div');
        const endDateLabel = createElement('label', 'form-label', 'Data Final');
        const endDateInput = createElement('input', 'form-input');
        endDateInput.type = 'date';
        endDateInput.value = filterManager.filters.endDate;
        endDateInput.onchange = (e) => {
            filterManager.filters.endDate = e.target.value;
            this.updateReportContent();
        };
        
        endDateGroup.appendChild(endDateLabel);
        endDateGroup.appendChild(endDateInput);
        
        inputsContainer.appendChild(startDateGroup);
        inputsContainer.appendChild(endDateGroup);
        
        // Botão limpar
        const clearButton = createElement('button', 'btn btn-secondary mt-4');
        clearButton.textContent = 'Limpar Filtros';
        clearButton.onclick = () => {
            filterManager.clearFilters();
            startDateInput.value = '';
            endDateInput.value = '';
            this.updateReportContent();
        };
        
        container.appendChild(header);
        container.appendChild(inputsContainer);
        container.appendChild(clearButton);
        
        return container;
    }

    updateReportContent() {
        if (this.currentView === 'relatorios') {
            const content = document.querySelector('.min-h-screen .container > div:last-child');
            if (content) {
                // Find and update the report cards
                const reportCards = content.querySelectorAll('.card.card-body');
                if (reportCards.length > 0) {
                    const filteredData = filterManager.filterData(lancamentosManager.lancamentos);
                    const stats = this.getStatisticsByProductFiltered(filteredData);
                    
                    // Update the main report table
                    const mainCard = reportCards[0];
                    const existingTable = mainCard.querySelector('table');
                    if (existingTable) {
                        existingTable.remove();
                    }
                    
                    if (stats.length === 0) {
                        const emptyState = createElement('p', 'text-gray-500 text-center py-8', 'Nenhum dado disponível para relatórios');
                        mainCard.appendChild(emptyState);
                    } else {
                        const table = createElement('table', 'table w-full mt-4');
                        
                        // Header
                        const thead = createElement('thead');
                        const headerRow = createElement('tr');
                        ['Produto', 'Perdas', 'Sobras', 'Total'].forEach(header => {
                            const th = createElement('th', '', header);
                            headerRow.appendChild(th);
                        });
                        thead.appendChild(headerRow);
                        table.appendChild(thead);
                        
                        // Body
                        const tbody = createElement('tbody');
                        let totalPerdas = 0;
                        let totalSobras = 0;
                        let totalGeral = 0;
                        
                        stats.forEach(([produto, data]) => {
                            const row = createElement('tr');
                            
                            const produtoCell = createElement('td', 'font-medium', produto);
                            const perdasCell = createElement('td', 'text-red-600', data.perdas.toString());
                            const sobrasCell = createElement('td', 'text-orange-600', data.sobras.toString());
                            const totalCell = createElement('td', 'font-semibold', data.total.toString());
                            
                            totalPerdas += data.perdas;
                            totalSobras += data.sobras;
                            totalGeral += data.total;
                            
                            row.appendChild(produtoCell);
                            row.appendChild(perdasCell);
                            row.appendChild(sobrasCell);
                            row.appendChild(totalCell);
                            tbody.appendChild(row);
                        });
                        
                        table.appendChild(tbody);
                        mainCard.appendChild(table);
                        
                        // Update total summary
                        const existingTotalCard = content.querySelector('.bg-gradient-to-r');
                        if (existingTotalCard) {
                            existingTotalCard.remove();
                        }
                        const totalCard = this.createTotalSummaryCard(totalPerdas, totalSobras, totalGeral);
                        content.appendChild(totalCard);
                    }
                }
            }
        }
    }

    createTotalSummaryCard(totalPerdas, totalSobras, totalGeral) {
        const card = createElement('div', 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mt-6');
        
        const header = createElement('div', 'flex items-center mb-4');
        header.appendChild(createIcon('calculator', 'w-6 h-6 text-red-600 mr-2'));
        const title = createElement('h3', 'text-xl font-bold text-gray-800', 'Resumo Total');
        header.appendChild(title);
        
        const statsGrid = createElement('div', 'grid grid-cols-1 md:grid-cols-3 gap-4');
        
        const perdasCard = createElement('div', 'bg-white rounded-lg p-4 text-center border-l-4 border-red-500');
        perdasCard.innerHTML = `
            <div class="text-2xl font-bold text-red-600">${totalPerdas}</div>
            <div class="text-sm text-gray-600">Total de Perdas</div>
        `;
        
        const sobrasCard = createElement('div', 'bg-white rounded-lg p-4 text-center border-l-4 border-orange-500');
        sobrasCard.innerHTML = `
            <div class="text-2xl font-bold text-orange-600">${totalSobras}</div>
            <div class="text-sm text-gray-600">Total de Sobras</div>
        `;
        
        const totalCard = createElement('div', 'bg-white rounded-lg p-4 text-center border-l-4 border-gray-500');
        totalCard.innerHTML = `
            <div class="text-2xl font-bold text-gray-800">${totalGeral}</div>
            <div class="text-sm text-gray-600">Total Geral</div>
        `;
        
        statsGrid.appendChild(perdasCard);
        statsGrid.appendChild(sobrasCard);
        statsGrid.appendChild(totalCard);
        
        card.appendChild(header);
        card.appendChild(statsGrid);
        
        return card;
    }

    getStatisticsByProductFiltered(filteredData) {
        const stats = {};
        
        filteredData
            .filter(l => l.tipo === 'perda' || l.tipo === 'sobra')
            .forEach(lancamento => {
                Object.entries(lancamento.itens).forEach(([produto, quantidade]) => {
                    const produtoFormatado = formatSalgadoName(produto, lancamento.tamanho);
                    
                    if (!stats[produtoFormatado]) {
                        stats[produtoFormatado] = { perdas: 0, sobras: 0, total: 0 };
                    }
                    
                    if (lancamento.tipo === 'perda') {
                        stats[produtoFormatado].perdas += quantidade;
                    } else {
                        stats[produtoFormatado].sobras += quantidade;
                    }
                    stats[produtoFormatado].total += quantidade;
                });
            });
        
        return Object.entries(stats)
            .sort(([, a], [, b]) => b.total - a.total)
            .slice(0, 10);
    }

    getTypeColor(tipo) {
        const colors = {
            'lanche': 'green',
            'perda': 'red',
            'sobra': 'orange',
            'transferencia': 'blue',
            'estoque': 'purple'
        };
        return colors[tipo] || 'gray';
    }

    logout() {
        this.isAuthenticated = false;
        this.currentView = 'dashboard';
        toast.success('Logout realizado com sucesso!');
        app.showLancamentos();
    }
}

// Instância global da área restrita
const areaRestrita = new AreaRestrita();
