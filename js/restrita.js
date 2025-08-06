// Área Restrita
class AreaRestrita {
    constructor() {
        this.isAuthenticated = false;
        this.password = '';
        this.correctPassword = '0716';
    }

    authenticate(password) {
        if (password === this.correctPassword) {
            this.isAuthenticated = true;
            toast.success('Acesso liberado!');
            return true;
        } else {
            toast.error('Senha incorreta!');
            return false;
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.password = '';
    }

    createLoginForm() {
        const container = createElement('div', 'login-container min-h-screen flex items-center justify-center px-4');
        
        const formContainer = createElement('div', 'login-form-container p-8 rounded-2xl max-w-md w-full');
        
        // Header
        const header = createElement('div', 'text-center mb-6');
        const iconContainer = createElement('div', 'login-icon-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4');
        iconContainer.appendChild(createIcon('bar-chart-3', 'w-8 h-8 text-yellow-600'));
        
        const title = createElement('h2', 'text-2xl font-bold text-gray-800 mb-2', 'Área Restrita');
        const subtitle = createElement('p', 'text-gray-600', 'Digite a senha para acessar');
        
        header.appendChild(iconContainer);
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Form
        const form = createElement('form', 'space-y-4');
        form.onsubmit = (e) => {
            e.preventDefault();
            const passwordInput = form.querySelector('input[type="password"]');
            if (this.authenticate(passwordInput.value)) {
                app.showRestrita();
            }
        };
        
        const inputContainer = createElement('div', 'password-input-container');
        const passwordInput = createElement('input', 'form-input pr-12');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Digite a senha';
        passwordInput.required = true;
        
        const toggleButton = createElement('button', 'password-toggle-btn');
        toggleButton.type = 'button';
        toggleButton.appendChild(createIcon('eye', 'w-5 h-5'));
        
        toggleButton.onclick = () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleButton.innerHTML = '';
            toggleButton.appendChild(createIcon(isPassword ? 'eye-off' : 'eye', 'w-5 h-5'));
            initializeLucideIcons();
        };
        
        inputContainer.appendChild(passwordInput);
        inputContainer.appendChild(toggleButton);
        
        const submitButton = createElement('button', 'login-submit-btn w-full');
        submitButton.type = 'submit';
        submitButton.textContent = 'Acessar';
        
        form.appendChild(inputContainer);
        form.appendChild(submitButton);
        
        // Back button
        const backContainer = createElement('div', 'mt-6 text-center');
        const backButton = createElement('button', 'back-to-launches-btn');
        backButton.appendChild(createIcon('arrow-left', 'w-4 h-4'));
        backButton.appendChild(document.createTextNode('Voltar aos Lançamentos'));
        backButton.onclick = () => app.showLancamentos();
        
        backContainer.appendChild(backButton);
        
        formContainer.appendChild(header);
        formContainer.appendChild(form);
        formContainer.appendChild(backContainer);
        container.appendChild(formContainer);
        
        return container;
    }

    createRestritaContent() {
        const container = createElement('div', 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100');
        const mainContainer = createElement('div', 'container mx-auto px-4 py-8');
        
        // Header
        const header = createElement('div', 'flex items-center justify-between mb-8');
        const headerContent = createElement('div');
        const title = createElement('h1', 'text-3xl font-bold text-gray-800 mb-2', 'Área Restrita');
        const subtitle = createElement('p', 'text-gray-600', 'Estatísticas e histórico completo');
        
        headerContent.appendChild(title);
        headerContent.appendChild(subtitle);
        
        const logoutButton = createElement('button', 'btn btn-secondary');
        logoutButton.textContent = 'Sair';
        logoutButton.onclick = () => {
            this.logout();
            app.showLancamentos();
        };
        
        header.appendChild(headerContent);
        header.appendChild(logoutButton);
        
        // Filtro de Datas
        const filterComponent = filterManager.createFilterComponent();
        
        // Estatísticas Globais
        const statsSection = this.createStatsSection();
        
        // Resumo do Dia
        const resumoSection = this.createResumoSection();
        
        // Histórico por Tipo
        const historicoSection = this.createHistoricoSection();
        
        mainContainer.appendChild(header);
        mainContainer.appendChild(filterComponent);
        mainContainer.appendChild(statsSection);
        mainContainer.appendChild(resumoSection);
        mainContainer.appendChild(historicoSection);
        container.appendChild(mainContainer);
        
        // Atualizar conteúdo quando filtros mudarem
        filterManager.addCallback(() => {
            this.updateContent(statsSection, resumoSection, historicoSection);
        });
        
        return container;
    }

    createStatsSection() {
        const section = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-8');
        const header = createElement('h2', 'text-xl font-bold text-gray-800 mb-4 flex items-center');
        header.appendChild(createIcon('bar-chart-3', 'w-6 h-6 mr-2 text-yellow-600'));
        header.appendChild(document.createTextNode('Estatísticas Globais por Produto (Perdas + Sobras)'));
        
        const content = createElement('div', 'stats-content');
        
        section.appendChild(header);
        section.appendChild(content);
        
        this.updateStatsContent(content);
        
        return section;
    }

    updateStatsContent(container) {
        const filteredLancamentos = filterManager.filterData(lancamentosManager.lancamentos);
        const stats = this.getFilteredStatistics(filteredLancamentos);
        
        container.innerHTML = '';
        
        if (stats.length > 0) {
            const grid = createElement('div', 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
            
            stats.forEach(([produto, data]) => {
                const card = createElement('div', 'bg-gray-50 p-4 rounded-lg');
                
                const header = createElement('div', 'flex items-center justify-between');
                const name = createElement('span', 'font-medium text-gray-700', produto);
                const total = createElement('span', 'text-lg font-bold text-red-600', data.total.toString());
                
                header.appendChild(name);
                header.appendChild(total);
                
                const details = createElement('div', 'text-sm text-gray-600 space-y-1');
                
                const perdas = createElement('div', 'flex justify-between');
                perdas.innerHTML = `<span class="font-medium">Perdas:</span><span class="font-medium text-red-500">${data.perdas}</span>`;
                
                const sobras = createElement('div', 'flex justify-between');
                sobras.innerHTML = `<span class="font-medium">Sobras:</span><span class="font-medium text-orange-500">${data.sobras}</span>`;
                
                const totalDiv = createElement('div', 'flex justify-between border-t pt-1');
                totalDiv.innerHTML = `<span class="font-bold">Total:</span><span class="font-bold text-gray-800">${data.total}</span>`;
                
                details.appendChild(perdas);
                details.appendChild(sobras);
                details.appendChild(totalDiv);
                
                card.appendChild(header);
                card.appendChild(details);
                grid.appendChild(card);
            });
            
            container.appendChild(grid);
        } else {
            const emptyMessage = createElement('p', 'text-gray-500 text-center py-8', 'Nenhuma perda ou sobra registrada no período selecionado.');
            container.appendChild(emptyMessage);
        }
    }

    getFilteredStatistics(lancamentos) {
        const stats = {};
        
        lancamentos
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

    createResumoSection() {
        const section = createElement('div', 'bg-white rounded-xl shadow-lg p-6 mb-8');
        const header = createElement('div', 'flex items-center justify-between mb-4');
        
        const title = createElement('h2', 'text-xl font-bold text-gray-800 flex items-center');
        title.appendChild(createIcon('calendar', 'w-6 h-6 mr-2 text-yellow-600'));
        title.appendChild(document.createTextNode('Resumo do Período'));
        
        const detailsButton = createElement('button', 'btn btn-info btn-sm');
        detailsButton.textContent = 'Ver Detalhes';
        detailsButton.onclick = () => this.showResumoModal();
        
        header.appendChild(title);
        header.appendChild(detailsButton);
        
        const content = createElement('div', 'resumo-content');
        
        section.appendChild(header);
        section.appendChild(content);
        
        this.updateResumoContent(content);
        
        return section;
    }

    updateResumoContent(container) {
        const filteredLancamentos = filterManager.filterData(lancamentosManager.lancamentos);
        
        container.innerHTML = '';
        
        const grid = createElement('div', 'grid grid-cols-2 md:grid-cols-5 gap-4');
        
        const tipos = [
            { key: 'lanche', label: 'Lanches', color: 'green' },
            { key: 'perda', label: 'Perdas', color: 'red' },
            { key: 'sobra', label: 'Sobras', color: 'orange' },
            { key: 'transferencia', label: 'Transferências', color: 'blue' },
            { key: 'estoque', label: 'Estoque', color: 'purple' }
        ];
        
        tipos.forEach(tipo => {
            const count = filteredLancamentos.filter(l => l.tipo === tipo.key).length;
            
            const card = createElement('div', `text-center p-4 bg-${tipo.color}-50 rounded-lg cursor-pointer hover:shadow-md transition-all`);
            card.onclick = () => this.showTipoModal(tipo.key, tipo.label);
            
            const number = createElement('div', `text-2xl font-bold text-${tipo.color}-600`, count.toString());
            const label = createElement('div', `text-sm text-${tipo.color}-700`, tipo.label);
            
            card.appendChild(number);
            card.appendChild(label);
            grid.appendChild(card);
        });
        
        container.appendChild(grid);
    }

    createHistoricoSection() {
        const section = createElement('div', 'space-y-8');
        
        const tipos = [
            { key: 'lanche', label: 'Lanches', icon: 'users' },
            { key: 'perda', label: 'Perdas', icon: 'trending-down' },
            { key: 'sobra', label: 'Sobras', icon: 'package' },
            { key: 'transferencia', label: 'Transferências', icon: 'arrow-right-left' },
            { key: 'estoque', label: 'Estoque', icon: 'warehouse' }
        ];
        
        tipos.forEach(tipo => {
            const tipoSection = this.createTipoSection(tipo);
            section.appendChild(tipoSection);
        });
        
        return section;
    }

    createTipoSection(tipo) {
        const section = createElement('div', 'bg-white rounded-xl shadow-lg p-6');
        
        const header = createElement('div', 'flex items-center justify-between mb-4');
        const title = createElement('h2', 'text-xl font-bold text-gray-800 flex items-center capitalize');
        title.appendChild(createIcon(tipo.icon, 'w-6 h-6 mr-2 text-yellow-600'));
        title.appendChild(document.createTextNode(`Histórico - ${tipo.label}`));
        
        const viewAllButton = createElement('button', 'btn btn-info btn-sm');
        viewAllButton.textContent = 'Ver Todos';
        viewAllButton.onclick = () => this.showTipoModal(tipo.key, tipo.label);
        
        header.appendChild(title);
        header.appendChild(viewAllButton);
        
        const content = createElement('div', `${tipo.key}-content`);
        
        section.appendChild(header);
        section.appendChild(content);
        
        this.updateTipoContent(content, tipo.key);
        
        return section;
    }

    updateTipoContent(container, tipo) {
        const filteredLancamentos = filterManager.filterData(lancamentosManager.getLancamentosByTipo(tipo));
        const recentLancamentos = filteredLancamentos.slice(0, 5); // Mostrar apenas os 5 mais recentes
        
        container.innerHTML = '';
        
        if (recentLancamentos.length > 0) {
            const table = this.createLancamentosTable(recentLancamentos, tipo, true);
            container.appendChild(table);
        } else {
            const emptyMessage = createElement('p', 'text-gray-500 text-center py-8', 
                filterManager.filters.startDate || filterManager.filters.endDate ? 
                `Nenhum registro de ${tipo} encontrado no período selecionado.` :
                `Nenhum registro de ${tipo} encontrado.`
            );
            container.appendChild(emptyMessage);
        }
    }

    createLancamentosTable(lancamentos, tipo, isPreview = false) {
        const tableContainer = createElement('div', 'overflow-x-auto');
        const table = createElement('table', 'table');
        
        // Header
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        
        const headers = ['Data/Hora', tipo === 'lanche' ? 'Funcionário' : 'Nome', 'Itens'];
        if (tipo !== 'estoque') headers.push('Tamanho');
        if (tipo === 'lanche') headers.push('Suco');
        if (!isPreview) headers.push('Status', 'Ações');
        
        headers.forEach(header => {
            const th = createElement('th', '', header);
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body
        const tbody = createElement('tbody');
        
        lancamentos.forEach(lancamento => {
            const row = createElement('tr');
            
            // Adicionar classe visual baseada no status do visto
            if (lancamento.visto) {
                row.classList.add('item-visto');
            } else {
                row.classList.add('item-pending');
            }
            
            // Data/Hora
            const { date, time } = formatDateTime(lancamento.data_hora);
            const dateCell = createElement('td');
            const dateDiv = createElement('div', 'text-sm');
            const dateSpan = createElement('div', 'font-medium', date);
            const timeSpan = createElement('div', 'text-gray-500', time);
            dateDiv.appendChild(dateSpan);
            dateDiv.appendChild(timeSpan);
            dateCell.appendChild(dateDiv);
            row.appendChild(dateCell);
            
            // Nome/Funcionário
            const nameCell = createElement('td', 'font-medium', lancamento.funcionario || lancamento.nome);
            row.appendChild(nameCell);
            
            // Itens
            const itemsCell = createElement('td');
            const itemsDiv = createElement('div', 'space-y-1');
            Object.entries(lancamento.itens).forEach(([item, qty]) => {
                const itemDiv = createElement('div', 'text-sm');
                const itemName = tipo === 'estoque' ? item : formatSalgadoName(item, lancamento.tamanho);
                itemDiv.textContent = `${itemName}: ${qty}`;
                itemsDiv.appendChild(itemDiv);
            });
            itemsCell.appendChild(itemsDiv);
            row.appendChild(itemsCell);
            
            // Tamanho
            if (tipo !== 'estoque') {
                const tamanhoCell = createElement('td');
                const badge = createElement('span', 'badge badge-info', lancamento.tamanho);
                tamanhoCell.appendChild(badge);
                row.appendChild(tamanhoCell);
            }
            
            // Suco
            if (tipo === 'lanche') {
                const sucoCell = createElement('td');
                if (lancamento.suco && lancamento.quantidade_suco) {
                    const sucoDiv = createElement('div', 'text-sm', `${lancamento.suco}: ${lancamento.quantidade_suco}`);
                    sucoCell.appendChild(sucoDiv);
                } else {
                    sucoCell.innerHTML = '<span class="text-gray-400">-</span>';
                }
                row.appendChild(sucoCell);
            }
            
            // Status e Ações (apenas se não for preview)
            if (!isPreview) {
                // Status
                const statusCell = createElement('td');
                const statusIndicator = createElement('div', 'status-indicator');
                const dot = createElement('div', `status-dot ${lancamento.visto ? 'status-dot-success' : 'status-dot-pending'}`);
                const text = createElement('span', 'text-sm', lancamento.visto ? 'Visto' : 'Pendente');
                statusIndicator.appendChild(dot);
                statusIndicator.appendChild(text);
                statusCell.appendChild(statusIndicator);
                row.appendChild(statusCell);
                
                // Ações
                const actionsCell = createElement('td');
                const actionsDiv = createElement('div', 'flex gap-2');
                
                const vistoButton = createElement('button', `btn btn-sm ${lancamento.visto ? 'btn-warning' : 'btn-success'}`);
                vistoButton.textContent = lancamento.visto ? 'Remover Visto' : 'Dar Visto';
                vistoButton.onclick = () => {
                    // Add loading state
                    vistoButton.disabled = true;
                    vistoButton.textContent = 'Processando...';
                    
                    lancamentosManager.toggleVisto(lancamento.id).then((success) => {
                        if (success) {
                            // Update row immediately
                            if (lancamento.visto) {
                                row.classList.remove('item-visto');
                                row.classList.add('item-pending');
                                vistoButton.textContent = 'Dar Visto';
                                vistoButton.className = 'btn btn-sm btn-success';
                            } else {
                                row.classList.remove('item-pending');
                                row.classList.add('item-visto');
                                vistoButton.textContent = 'Remover Visto';
                                vistoButton.className = 'btn btn-sm btn-warning';
                            }
                            row.classList.add('item-updated');
                            lancamento.visto = !lancamento.visto;
                        }
                        vistoButton.disabled = false;
                    });
                };
                
                const editButton = createElement('button', 'btn btn-info btn-sm');
                editButton.textContent = 'Editar';
                editButton.onclick = () => this.editLancamento(lancamento);
                
                const deleteButton = createElement('button', 'btn btn-danger btn-sm');
                deleteButton.textContent = 'Excluir';
                deleteButton.onclick = () => {
                    deleteButton.disabled = true;
                    deleteButton.textContent = 'Excluindo...';
                    
                    lancamentosManager.deleteLancamento(lancamento.id).then((success) => {
                        if (success) {
                            // Animate row removal
                            row.classList.add('item-removing');
                            setTimeout(() => {
                                if (row.parentNode) {
                                    row.parentNode.removeChild(row);
                                }
                            }, 300);
                        } else {
                            deleteButton.disabled = false;
                            deleteButton.textContent = 'Excluir';
                        }
                    });
                };
                
                actionsDiv.appendChild(vistoButton);
                actionsDiv.appendChild(editButton);
                actionsDiv.appendChild(deleteButton);
                actionsCell.appendChild(actionsDiv);
                row.appendChild(actionsCell);
            }
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        
        return tableContainer;
    }

    addVisualIndicatorToRows(tbody, lancamentos) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            if (lancamentos[index] && lancamentos[index].visto) {
                row.classList.add('item-visto');
            }
        });
    }

    showTipoModal(tipo, label) {
        const filteredLancamentos = filterManager.filterData(lancamentosManager.getLancamentosByTipo(tipo));
        
        const modalBody = createElement('div');
        
        // Filtro específico do modal
        const modalFilter = createElement('div', 'mb-4 p-4 bg-gray-50 rounded-lg');
        const filterTitle = createElement('h3', 'font-medium mb-2', 'Filtro de Datas');
        
        const filterInputs = createElement('div', 'grid grid-cols-2 gap-4');
        
        const startInput = createElement('input', 'form-input');
        startInput.type = 'date';
        startInput.value = filterManager.filters.startDate;
        
        const endInput = createElement('input', 'form-input');
        endInput.type = 'date';
        endInput.value = filterManager.filters.endDate;
        
        const updateModalContent = () => {
            const newFiltered = lancamentosManager.getLancamentosByTipo(tipo).filter(item => {
                return isDateInRange(item.data_hora, startInput.value, endInput.value);
            });
            
            const tableContainer = modalBody.querySelector('.table-container');
            if (tableContainer) {
                tableContainer.innerHTML = '';
                if (newFiltered.length > 0) {
                    const table = this.createLancamentosTable(newFiltered, tipo, false);
                    tableContainer.appendChild(table);
                } else {
                    const emptyMessage = createElement('p', 'text-gray-500 text-center py-8', 'Nenhum registro encontrado no período selecionado.');
                    tableContainer.appendChild(emptyMessage);
                }
            }
        };
        
        startInput.onchange = updateModalContent;
        endInput.onchange = updateModalContent;
        
        filterInputs.appendChild(startInput);
        filterInputs.appendChild(endInput);
        modalFilter.appendChild(filterTitle);
        modalFilter.appendChild(filterInputs);
        
        // Tabela
        const tableContainer = createElement('div', 'table-container');
        if (filteredLancamentos.length > 0) {
            const table = this.createLancamentosTable(filteredLancamentos, tipo, false);
            tableContainer.appendChild(table);
        } else {
            const emptyMessage = createElement('p', 'text-gray-500 text-center py-8', 'Nenhum registro encontrado.');
            tableContainer.appendChild(emptyMessage);
        }
        
        modalBody.appendChild(modalFilter);
        modalBody.appendChild(tableContainer);
        
        const modalContent = modal.createModal(`${label} - Histórico Completo`, modalBody);
        modal.show(modalContent, { size: 'large' });
    }

    showResumoModal() {
        const filteredLancamentos = filterManager.filterData(lancamentosManager.lancamentos);
        
        const modalBody = createElement('div');
        
        // Estatísticas detalhadas
        const statsContainer = createElement('div', 'space-y-6');
        
        // Resumo por tipo
        const tiposContainer = createElement('div');
        const tiposTitle = createElement('h3', 'text-lg font-semibold mb-4', 'Resumo por Tipo');
        const tiposGrid = createElement('div', 'grid grid-cols-2 md:grid-cols-5 gap-4 mb-6');
        
        const tipos = [
            { key: 'lanche', label: 'Lanches', color: 'green' },
            { key: 'perda', label: 'Perdas', color: 'red' },
            { key: 'sobra', label: 'Sobras', color: 'orange' },
            { key: 'transferencia', label: 'Transferências', color: 'blue' },
            { key: 'estoque', label: 'Estoque', color: 'purple' }
        ];
        
        tipos.forEach(tipo => {
            const count = filteredLancamentos.filter(l => l.tipo === tipo.key).length;
            const card = createElement('div', `text-center p-4 bg-${tipo.color}-50 rounded-lg`);
            const number = createElement('div', `text-2xl font-bold text-${tipo.color}-600`, count.toString());
            const label = createElement('div', `text-sm text-${tipo.color}-700`, tipo.label);
            card.appendChild(number);
            card.appendChild(label);
            tiposGrid.appendChild(card);
        });
        
        tiposContainer.appendChild(tiposTitle);
        tiposContainer.appendChild(tiposGrid);
        
        // Top produtos com perdas/sobras
        const topProdutos = this.getFilteredStatistics(filteredLancamentos);
        if (topProdutos.length > 0) {
            const produtosContainer = createElement('div');
            const produtosTitle = createElement('h3', 'text-lg font-semibold mb-4', 'Top Produtos (Perdas + Sobras)');
            const produtosList = createElement('div', 'space-y-2');
            
            topProdutos.slice(0, 5).forEach(([produto, stats]) => {
                const item = createElement('div', 'flex justify-between items-center p-3 bg-gray-50 rounded-lg');
                const name = createElement('span', 'font-medium', produto);
                const total = createElement('span', 'font-bold text-red-600', stats.total.toString());
                item.appendChild(name);
                item.appendChild(total);
                produtosList.appendChild(item);
            });
            
            produtosContainer.appendChild(produtosTitle);
            produtosContainer.appendChild(produtosList);
            statsContainer.appendChild(produtosContainer);
        }
        
        statsContainer.appendChild(tiposContainer);
        modalBody.appendChild(statsContainer);
        
        const modalContent = modal.createModal('Resumo Detalhado do Período', modalBody);
        modal.show(modalContent, { size: 'large' });
    }

    editLancamento(lancamento) {
        lancamentosManager.editLancamento(lancamento);
        app.showLancamentoModal(lancamento.tipo);
    }

    updateContent(statsSection, resumoSection, historicoSection) {
        // Atualizar estatísticas
        const statsContent = statsSection.querySelector('.stats-content');
        this.updateStatsContent(statsContent);
        
        // Atualizar resumo
        const resumoContent = resumoSection.querySelector('.resumo-content');
        this.updateResumoContent(resumoContent);
        
        // Atualizar histórico
        const tipos = ['lanche', 'perda', 'sobra', 'transferencia', 'estoque'];
        tipos.forEach(tipo => {
            const content = historicoSection.querySelector(`.${tipo}-content`);
            if (content) {
                this.updateTipoContent(content, tipo);
            }
        });
    }

    updateAllContent() {
        // Recarregar dados e atualizar toda a interface
        lancamentosManager.loadLancamentos().then(() => {
            const statsSection = document.querySelector('.stats-content')?.closest('.bg-white');
            const resumoSection = document.querySelector('.resumo-content')?.closest('.bg-white');
            const historicoSection = document.querySelector('.space-y-8');
            
            if (statsSection && resumoSection && historicoSection) {
                this.updateContent(statsSection, resumoSection, historicoSection);
            }
        });
    }
}

// Instância global da área restrita
const areaRestrita = new AreaRestrita();