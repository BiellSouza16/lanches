// Gerenciamento de Lançamentos
class LancamentosManager {
    constructor() {
        this.lancamentos = [];
        this.loading = false;
        this.selectedItems = {};
        this.selectedDualSizeItems = {}; // Para perda, sobra e transferência
        this.selectedSuco = '';
        this.quantidadeSuco = 0;
        this.selectedTamanho = '35g';
        this.funcionario = '';
        this.nome = '';
        this.observacao = '';
        this.editingLancamento = null;
    }

    async loadLancamentos() {
        try {
            const { data, error } = await supabase
                .from('Lanches')
                .select('*')
                .order('data_hora', { ascending: false });

            if (error) throw error;
            this.lancamentos = data || [];
            return this.lancamentos;
        } catch (error) {
            console.error('Erro ao carregar lançamentos:', error);
            toast.error('Erro ao carregar lançamentos!');
            return [];
        }
    }

    resetForm() {
        this.selectedItems = {};
        this.selectedDualSizeItems = {};
        this.selectedSuco = '';
        this.quantidadeSuco = 0;
        this.funcionario = '';
        this.nome = '';
        this.observacao = '';
        this.selectedTamanho = '35g';
        this.editingLancamento = null;
    }

    getTotalItems() {
        const totalSalgados = Object.values(this.selectedItems).reduce((sum, qty) => sum + qty, 0);
        const totalSucos = this.quantidadeSuco;
        return totalSalgados + totalSucos;
    }

    updateItemQuantity(item, change, isLanche = false) {
        if (isLanche) {
            const currentTotal = this.getTotalItems();
            const newQuantity = Math.max(0, (this.selectedItems[item] || 0) + change);
            
            if (change > 0 && currentTotal >= 5) {
                toast.warning('Máximo de 5 itens permitidos no lanche!');
                return;
            }
            
            this.selectedItems[item] = newQuantity;
        } else {
            this.selectedItems[item] = Math.max(0, (this.selectedItems[item] || 0) + change);
        }
    }

    updateSucoQuantity(change, isLanche = false) {
        if (isLanche) {
            const currentTotal = this.getTotalItems();
            const newQuantity = Math.max(0, this.quantidadeSuco + change);
            
            if (change > 0 && currentTotal >= 5) {
                toast.warning('Máximo de 5 itens permitidos no lanche!');
                return;
            }
            
            this.quantidadeSuco = newQuantity;
        } else {
            this.quantidadeSuco = Math.max(0, this.quantidadeSuco + change);
        }
    }

    updateDualSizeItemQuantity(itemKey, change) {
        this.selectedDualSizeItems[itemKey] = Math.max(0, (this.selectedDualSizeItems[itemKey] || 0) + change);
    }

    async submitLancamento(tipo) {
        if (this.editingLancamento) {
            return this.updateLancamento();
        }

        let finalItems = {};
        
        // Para lanche e estoque, usar o sistema atual
        if (tipo === 'lanche' || tipo === 'estoque') {
            // Filtrar itens com quantidade zero antes de salvar
            Object.entries(this.selectedItems).forEach(([item, quantity]) => {
                if (quantity > 0) {
                    finalItems[item] = quantity;
                }
            });
        } else {
            // Para perda, sobra e transferência, usar o novo sistema dual
            Object.entries(this.selectedDualSizeItems).forEach(([itemKey, quantity]) => {
                if (quantity > 0) {
                    finalItems[itemKey] = quantity;
                }
            });
        }

        // Validações
        if (tipo === 'lanche') {
            if (!this.funcionario.trim()) {
                toast.error('Nome do funcionário é obrigatório!');
                return false;
            }
            
            const totalItems = this.getTotalItems();
            if (totalItems === 0) {
                toast.error('Selecione pelo menos um item!');
                return false;
            }
            
            if (totalItems > 5) {
                toast.error('Máximo de 5 itens permitidos no lanche!');
                return false;
            }
        } else if (['perda', 'sobra', 'transferencia', 'estoque'].includes(tipo)) {
            if (!this.nome.trim()) {
                toast.error('Nome é obrigatório!');
                return false;
            }
            
            const totalItems = Object.values(finalItems).reduce((sum, qty) => sum + qty, 0);
            if (totalItems === 0 && this.quantidadeSuco === 0) {
                toast.error('Selecione pelo menos um item!');
                return false;
            }
        }

        this.loading = true;

        try {
            const lancamento = {
                tipo: tipo,
                funcionario: tipo === 'lanche' ? this.funcionario : undefined,
                nome: tipo !== 'lanche' ? this.nome : undefined,
                itens: finalItems,
                suco: this.selectedSuco || undefined,
                quantidade_suco: this.quantidadeSuco > 0 ? this.quantidadeSuco : undefined,
                tamanho: tipo !== 'estoque' ? this.selectedTamanho : undefined,
                observacao: (tipo === 'perda' || tipo === 'sobra') ? this.observacao : undefined,
                data_hora: new Date().toISOString(),
                visto: false
            };

            const { error } = await supabase
                .from('Lanches')
                .insert([lancamento]);

            if (error) throw error;

            toast.success('Lançamento registrado com sucesso!');
            this.resetForm();
            await this.loadLancamentos();
            return true;
        } catch (error) {
            console.error('Erro ao registrar lançamento:', error);
            toast.error('Erro ao registrar lançamento!');
            return false;
        } finally {
            this.loading = false;
        }
    }

    async updateLancamento() {
        if (!this.editingLancamento) return false;

        // Validações básicas
        if (this.editingLancamento.tipo === 'lanche') {
            if (!this.funcionario.trim()) {
                toast.error('Nome do funcionário é obrigatório!');
                return false;
            }
        } else {
            if (!this.nome.trim()) {
                toast.error('Nome é obrigatório!');
                return false;
            }
        }

        let finalItems = {};
        
        // Para lanche e estoque, usar o sistema atual
        if (this.editingLancamento.tipo === 'lanche' || this.editingLancamento.tipo === 'estoque') {
            Object.entries(this.selectedItems).forEach(([item, quantity]) => {
                if (quantity > 0) {
                    finalItems[item] = quantity;
                }
            });
        } else {
            // Para perda, sobra e transferência, usar o novo sistema dual
            Object.entries(this.selectedDualSizeItems).forEach(([itemKey, quantity]) => {
                if (quantity > 0) {
                    finalItems[itemKey] = quantity;
                }
            });
        }

        this.loading = true;

        try {
            const updatedLancamento = {
                funcionario: this.editingLancamento.tipo === 'lanche' ? this.funcionario : undefined,
                nome: this.editingLancamento.tipo !== 'lanche' ? this.nome : undefined,
                itens: finalItems,
                suco: this.selectedSuco || undefined,
                quantidade_suco: this.quantidadeSuco > 0 ? this.quantidadeSuco : undefined,
                tamanho: this.editingLancamento.tipo !== 'estoque' ? this.selectedTamanho : undefined,
                observacao: (this.editingLancamento.tipo === 'perda' || this.editingLancamento.tipo === 'sobra') ? this.observacao : undefined,
                data_hora: this.editingLancamento.data_hora // Manter a data editada
            };

            const { error } = await supabase
                .from('Lanches')
                .update(updatedLancamento)
                .eq('id', this.editingLancamento.id);

            if (error) throw error;

            toast.success('Lançamento atualizado com sucesso!');
            this.resetForm();
            await this.loadLancamentos();
            
            // Trigger real-time update for restricted area
            if (window.areaRestrita && window.areaRestrita.isAuthenticated) {
                // Small delay to ensure the update is processed
                setTimeout(() => {
                    window.areaRestrita.updateAllContent();
                }, 100);
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao atualizar lançamento:', error);
            toast.error('Erro ao atualizar lançamento!');
            return false;
        } finally {
            this.loading = false;
        }
    }

    async deleteLancamento(id) {
        try {
            const { error } = await supabase
                .from('Lanches')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Update local data immediately
            this.lancamentos = this.lancamentos.filter(l => l.id !== id);

            toast.success('Lançamento excluído com sucesso!');
            
            // Trigger real-time update for restricted area
            if (window.areaRestrita && window.areaRestrita.isAuthenticated) {
                // Small delay to ensure the update is processed
                setTimeout(() => {
                    window.areaRestrita.updateAllContent();
                }, 100);
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao excluir lançamento:', error);
            toast.error('Erro ao excluir lançamento!');
            return false;
        }
    }

    async toggleVisto(id) {
        try {
            // Find current lancamento in local data
            const lancamentoIndex = this.lancamentos.findIndex(l => l.id === id);
            if (lancamentoIndex === -1) {
                console.error('Lançamento não encontrado:', id);
                return false;
            }
            
            const lancamento = this.lancamentos[lancamentoIndex];
            const newVistoState = !lancamento.visto;

            // Make the API call
            const { error } = await supabase
                .from('Lanches')
                .update({ visto: newVistoState })
                .eq('id', id);

            if (error) throw error;

            // Update local data after successful API call
            lancamento.visto = newVistoState;
            this.lancamentos[lancamentoIndex] = lancamento;

            // Show success toast
            if (newVistoState) {
                toast.success('✓ Visto adicionado com sucesso!');
            } else {
                toast.warning('Visto removido!');
            }
            
            // Trigger real-time update for restricted area
            if (window.areaRestrita && window.areaRestrita.isAuthenticated) {
                // Small delay to ensure the update is processed
                setTimeout(() => {
                    window.areaRestrita.updateAllContent();
                }, 100);
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao alterar visto:', error);
            toast.error('Erro ao alterar visto!');
            return false;
        }
    }

    editLancamento(lancamento) {
        this.editingLancamento = lancamento;
        this.funcionario = lancamento.funcionario || '';
        this.nome = lancamento.nome || '';
        
        // Verificar se é o novo formato (com tamanhos separados) ou antigo
        if (lancamento.tipo === 'lanche' || lancamento.tipo === 'estoque') {
            this.selectedItems = { ...lancamento.itens };
        } else {
            // Para perda, sobra e transferência, verificar se já está no novo formato
            const hasNewFormat = Object.keys(lancamento.itens).some(key => key.includes('_'));
            
            if (hasNewFormat) {
                this.selectedDualSizeItems = { ...lancamento.itens };
            } else {
                // Converter formato antigo para novo (assumir 35g para compatibilidade)
                this.selectedDualSizeItems = {};
                Object.entries(lancamento.itens).forEach(([item, quantity]) => {
                    this.selectedDualSizeItems[`${item}_${lancamento.tamanho || '35g'}`] = quantity;
                });
            }
        }
        
        this.selectedSuco = lancamento.suco || '';
        this.quantidadeSuco = lancamento.quantidade_suco || 0;
        this.selectedTamanho = lancamento.tamanho || '35g';
        this.observacao = lancamento.observacao || '';
    }

    updateEditingDateTime(newDateTime) {
        if (this.editingLancamento) {
            this.editingLancamento.data_hora = newDateTime;
        }
    }

    getLancamentosByTipo(tipo) {
        return this.lancamentos.filter(l => l.tipo === tipo);
    }

    getLancamentosHoje() {
        const hoje = new Date().toDateString();
        return this.lancamentos.filter(l => {
            const dataLancamento = new Date(l.data_hora).toDateString();
            return hoje === dataLancamento;
        });
    }

    getStatisticsByProduct() {
        const stats = {};
        
        this.lancamentos
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
}

// Instância global do gerenciador de lançamentos
const lancamentosManager = new LancamentosManager();
