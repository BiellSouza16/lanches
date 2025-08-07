// Gerenciamento de Lançamentos
class LancamentosManager {
    constructor() {
        this.lancamentos = [];
        this.loading = false;
        this.selectedItems = {};
        this.selectedSuco = '';
        this.quantidadeSuco = 0;
        this.selectedTamanho = '35g';
        this.funcionario = '';
        this.nome = '';
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
        this.selectedSuco = '';
        this.quantidadeSuco = 0;
        this.funcionario = '';
        this.nome = '';
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

    async submitLancamento(tipo) {
        if (this.editingLancamento) {
            return this.updateLancamento();
        }

        // Filtrar itens com quantidade zero antes de salvar
        const filteredItems = {};
        Object.entries(this.selectedItems).forEach(([item, quantity]) => {
            if (quantity > 0) {
                filteredItems[item] = quantity;
            }
        });
        this.selectedItems = filteredItems;

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
            
            const totalItems = Object.values(this.selectedItems).reduce((sum, qty) => sum + qty, 0);
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
                itens: this.selectedItems,
                suco: this.selectedSuco || undefined,
                quantidade_suco: this.quantidadeSuco > 0 ? this.quantidadeSuco : undefined,
                tamanho: tipo !== 'estoque' ? this.selectedTamanho : undefined,
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

        // Filtrar itens com quantidade zero antes de atualizar
        const filteredItems = {};
        Object.entries(this.selectedItems).forEach(([item, quantity]) => {
            if (quantity > 0) {
                filteredItems[item] = quantity;
            }
        });
        this.selectedItems = filteredItems;

        this.loading = true;

        try {
            const updatedLancamento = {
                funcionario: this.editingLancamento.tipo === 'lanche' ? this.funcionario : undefined,
                nome: this.editingLancamento.tipo !== 'lanche' ? this.nome : undefined,
                itens: this.selectedItems,
                suco: this.selectedSuco || undefined,
                quantidade_suco: this.quantidadeSuco > 0 ? this.quantidadeSuco : undefined,
                tamanho: this.editingLancamento.tipo !== 'estoque' ? this.selectedTamanho : undefined,
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
            return true;
        } catch (error) {
            console.error('Erro ao excluir lançamento:', error);
            toast.error('Erro ao excluir lançamento!');
            return false;
        }
    }

    async toggleVisto(id) {
        try {
            // Find current lancamento
            const lancamento = this.lancamentos.find(l => l.id === id);
            if (!lancamento) return false;

            const newVistoState = !lancamento.visto;

            const { error } = await supabase
                .from('Lanches')
                .update({ visto: newVistoState })
                .eq('id', id);

            if (error) throw error;

            // Update local data immediately
            lancamento.visto = newVistoState;

            // Show toast with better feedback
            if (newVistoState) {
                toast.success('✓ Visto adicionado com sucesso!');
            } else {
                toast.warning('Visto removido!');
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
        this.selectedItems = { ...lancamento.itens };
        this.selectedSuco = lancamento.suco || '';
        this.quantidadeSuco = lancamento.quantidade_suco || 0;
        this.selectedTamanho = lancamento.tamanho || '35g';
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
