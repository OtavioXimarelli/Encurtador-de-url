const config = {
    baseUrl:'https://otavioshort.duckdns.org/api/urls',
    createPath: '/shorten',
    expirationDays: 30
};

export const ApiService = {
    async shortenUrl(originalUrl) {
        if (!originalUrl) {
            throw new Error('URL é obrigatória');
        }

        const urlData = {
            url: originalUrl // Alterado para corresponder ao formato esperado pelo backend
        };

        try {
            const response = await fetch(`${config.baseUrl}${config.createPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(urlData)
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Resposta inválida do servidor: ${text}`);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao encurtar URL');
            }

            const data = await response.json();
            
            if (!data.shortUrl) {
                throw new Error('Código de URL curta não encontrado na resposta');
            }
            
            return `${config.baseUrl}/${data.shortUrl}`;
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error instanceof SyntaxError) {
                throw new Error('Erro ao processar resposta do servidor');
            }
            throw error;
        }
    }
};