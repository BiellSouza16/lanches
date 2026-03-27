class RealtimeSync {
    constructor() {
        this.channel = null;
        this.syncCallbacks = [];
        this.lastUpdateIds = new Set();
        this.maxCacheSize = 1000;
    }

    async initialize() {
    try {
        const supabase = window.supabaseClient || window.getSupabase?.();
        
        if (!supabase) {
            console.error('Supabase não inicializado - tentando novamente em 2s');
            setTimeout(() => this.initialize(), 2000);
            return;
        }

        if (this.channel) {
            this.channel.unsubscribe();
        }

        this.channel = supabase
            .channel('public:Lanches')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Lanches' },
                (payload) => this.handleDatabaseChange(payload)
            )
            .subscribe();

        console.log('Realtime sync inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar Realtime:', error);
        setTimeout(() => this.initialize(), 2000);
    }
}

    handleDatabaseChange(payload) {
        const changeId = `${payload.eventType}_${payload.new?.id || payload.old?.id}_${Date.now()}`;

        if (this.lastUpdateIds.has(changeId)) {
            return;
        }

        this.lastUpdateIds.add(changeId);

        if (this.lastUpdateIds.size > this.maxCacheSize) {
            const ids = Array.from(this.lastUpdateIds);
            ids.slice(0, ids.length - this.maxCacheSize).forEach(id =>
                this.lastUpdateIds.delete(id)
            );
        }

        if (payload.eventType === 'INSERT') {
            this.handleInsert(payload.new);
        } else if (payload.eventType === 'UPDATE') {
            this.handleUpdate(payload.new, payload.old);
        } else if (payload.eventType === 'DELETE') {
            this.handleDelete(payload.old);
        }
    }

    handleInsert(newRecord) {
        const existingIndex = lancamentosManager.lancamentos.findIndex(l => l.id === newRecord.id);

        if (existingIndex === -1) {
            lancamentosManager.lancamentos.unshift(newRecord);
        }

        this.notifyCallbacks();
        this.updateRestritaIfActive();
    }

    handleUpdate(newRecord, oldRecord) {
        const index = lancamentosManager.lancamentos.findIndex(l => l.id === newRecord.id);

        if (index !== -1) {
            lancamentosManager.lancamentos[index] = newRecord;
        } else {
            lancamentosManager.lancamentos.unshift(newRecord);
        }

        this.removeDuplicates();
        this.notifyCallbacks();
        this.updateRestritaIfActive();
    }

    handleDelete(oldRecord) {
        lancamentosManager.lancamentos = lancamentosManager.lancamentos.filter(
            l => l.id !== oldRecord.id
        );

        this.notifyCallbacks();
        this.updateRestritaIfActive();
    }

    removeDuplicates() {
        const seen = new Set();
        lancamentosManager.lancamentos = lancamentosManager.lancamentos.filter(lancamento => {
            if (seen.has(lancamento.id)) {
                return false;
            }
            seen.add(lancamento.id);
            return true;
        });
    }

    addCallback(callback) {
        this.syncCallbacks.push(callback);
    }

    removeCallback(callback) {
        this.syncCallbacks = this.syncCallbacks.filter(cb => cb !== callback);
    }

    notifyCallbacks() {
        this.syncCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Erro em callback de sincronização:', error);
            }
        });
    }

    updateRestritaIfActive() {
        if (areaRestrita && areaRestrita.isAuthenticated) {
            areaRestrita.updateAllContent();
        }
    }

    destroy() {
        if (this.channel) {
            this.channel.unsubscribe();
            this.channel = null;
        }
        this.syncCallbacks = [];
        this.lastUpdateIds.clear();
    }
}

const realtimeSync = new RealtimeSync();
