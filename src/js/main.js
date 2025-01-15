import { ApiService } from './api.js';
import { StorageManager } from './storage.js';

class UrlShortener {
    constructor() {
        this.urlInput = document.getElementById('urlInput');
        this.resultSection = document.getElementById('result');
        this.shortUrlDiv = document.getElementById('shortUrl');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.historyList = document.getElementById('historyList');

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
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('Por favor, insira uma URL válida');
            return;
        }

        try {
            // Validação básica de URL
            new URL(url);
        } catch (e) {
            this.showError('Por favor, insira uma URL válida (incluindo http:// ou https://)');
            return;
        }

        this.loadingOverlay.style.display = 'flex';

        try {
            const shortUrl = await ApiService.shortenUrl(url);
            this.showSuccess(shortUrl);
            StorageManager.saveUrl(url, shortUrl);
            this.loadHistory();
        } catch (error) {
            console.error('Erro ao encurtar:', error);
            this.showError(error.message);
        } finally {
            this.loadingOverlay.style.display = 'none';
        }
    }

    showSuccess(shortUrl) {
        this.shortUrlDiv.innerHTML = `
            <a href="${shortUrl}" target="_blank" class="shortened-link">
                ${shortUrl}
            </a>
        `;
        this.resultSection.style.display = 'block';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Remove mensagem de erro anterior se existir
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        this.urlInput.parentNode.insertBefore(errorDiv, this.urlInput.nextSibling);
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 15000);
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const app = new UrlShortener();
    window.shortenUrl = () => app.shortenUrl();
    window.clearHistory = () => app.clearHistory();
}); 
