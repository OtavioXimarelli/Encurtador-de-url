import { ApiService } from './api.js';
import { StorageManager } from './storage.js';

class UrlShortener {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.resultSection = document.getElementById('result');
        this.shortUrlDiv = document.getElementById('shortUrl');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.historyList = document.getElementById('historyList');
        this.expirationText = document.querySelector('.expiration');
        
        // Atualiza o texto de expiração com o valor do .env
        const days = import.meta.env.VITE_URL_EXPIRATION_DAYS || 2;
        this.expirationText.textContent = `Esta URL expirará em ${days} dias`;

        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        // Contador de caracteres
        this.urlInput.addEventListener('input', () => {
            const length = this.urlInput.value.length;
            document.querySelector('.char-count').textContent = `${length}/2000 caracteres`;
        });

        // Permitir submissão com Enter
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.shortenUrl();
            }
        });
    }

    async shortenUrl() {
        if (!this.urlInput.value) {
            alert('Por favor, insira uma URL válida');
            return;
        }

        this.loadingOverlay.style.display = 'flex';

        try {
            const shortUrl = await ApiService.shortenUrl(this.urlInput.value);
            this.shortUrlDiv.innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
            this.resultSection.style.display = 'block';
            
            // Salva no histórico
            StorageManager.saveUrl(this.urlInput.value, shortUrl);
            this.loadHistory();
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao encurtar URL: ' + error.message);
        } finally {
            this.loadingOverlay.style.display = 'none';
        }
    }

    loadHistory() {
        const urls = StorageManager.getAllUrls();
        this.historyList.innerHTML = urls.map(url => `
            <div class="history-item">
                <div>${url.shortUrl}</div>
                <div class="history-item-date">
                    Criado em: ${new Date(url.createdAt).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }

    clearHistory() {
        if (confirm('Deseja limpar todo o histórico?')) {
            StorageManager.clearHistory();
            this.loadHistory();
        }
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new UrlShortener();
    
    // Expõe funções necessárias globalmente
    window.shortenUrl = () => app.shortenUrl();
    window.clearHistory = () => app.clearHistory();
}); 