const config = {
    baseUrl: import.meta.env.PUBLIC_API_BASE_URL || 'https://ik2wijh1zf.execute-api.us-east-1.amazonaws.com/deploy',
    createPath: '/create',
    expirationDays: parseInt(import.meta.env.PUBLIC_URL_EXPIRATION_DAYS) || 2
};

export const ApiService = {
    async shortenUrl(originalUrl) {
        if (!originalUrl) {
            throw new Error('URL é obrigatória');
        }

        const urlData = {
            originalUrl,
            expirationTime: (Math.floor(Date.now() / 1000) + 
                (config.expirationDays * 24 * 60 * 60)).toString()
        };

        try {
            const response = await fetch(`${config.baseUrl}${config.createPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    body: JSON.stringify(urlData)
                })
            });

            // Verifica se a resposta é JSON
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
            
            if (!data.code) {
                throw new Error('Código de URL curta não encontrado na resposta');
            }
            
            return `${config.baseUrl}/${data.code}`;
        } catch (error) {
            console.error('Erro detalhado:', error);
            if (error instanceof SyntaxError) {
                throw new Error('Erro ao processar resposta do servidor');
            }
            throw error;
        }
    }
}; 