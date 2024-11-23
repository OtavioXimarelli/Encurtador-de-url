// Gerenciamento do armazenamento local
export const StorageManager = {
    KEY: 'shortened_urls',
    
    getAllUrls() {
        try {
            const urls = localStorage.getItem(this.KEY);
            return urls ? JSON.parse(urls) : [];
        } catch (error) {
            console.error('Erro ao ler histórico:', error);
            return [];
        }
    },
    
    saveUrl(originalUrl, shortUrl) {
        try {
            const urls = this.getAllUrls();
            urls.unshift({
                originalUrl,
                shortUrl,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(this.KEY, JSON.stringify(urls.slice(0, 10)));
        } catch (error) {
            console.error('Erro ao salvar URL:', error);
        }
    },
    
    clearHistory() {
        try {
            localStorage.removeItem(this.KEY);
        } catch (error) {
            console.error('Erro ao limpar histórico:', error);
        }
    }
};
