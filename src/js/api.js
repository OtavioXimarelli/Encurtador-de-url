const config = {
    createUrl: import.meta.env.VITE_API_CREATE_URL,
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    apiKey: import.meta.env.VITE_API_KEY,
    expirationDays: parseInt(import.meta.env.VITE_URL_EXPIRATION_DAYS) || 2
};

export const ApiService = {
    async shortenUrl(originalUrl) {
        const urlData = {
            originalUrl,
            expirationTime: (Math.floor(Date.now() / 1000) + 
                (config.expirationDays * 24 * 60 * 60)).toString()
        };

        try {
            const response = await fetch(config.createUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(config.apiKey && { 'x-api-key': config.apiKey })
                },
                body: JSON.stringify({ body: JSON.stringify(urlData) })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao encurtar URL');
            }

            const data = await response.json();
            if (!data.code) throw new Error('Resposta inválida do servidor');
            
            return `${config.baseUrl}/${data.code}`;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }
}; 