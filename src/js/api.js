const config = {
    baseUrl: '/api',
    expirationDays: parseInt(import.meta.env.PUBLIC_URL_EXPIRATION_DAYS) || 2
};

export const ApiService = {
    async shortenUrl(originalUrl) {
        const urlData = {
            originalUrl,
            expirationTime: (Math.floor(Date.now() / 1000) + 
                (config.expirationDays * 24 * 60 * 60)).toString()
        };

        try {
            const response = await fetch(`${config.baseUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body: JSON.stringify(urlData) })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao encurtar URL');
            }

            const data = await response.json();
            if (!data.code) throw new Error('Resposta inválida do servidor');
            
            return `${import.meta.env.PUBLIC_API_BASE_URL}/${data.code}`;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }
}; 