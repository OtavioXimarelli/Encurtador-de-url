import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware para adicionar a API key de forma segura
const addApiKey = (proxyReq) => {
    proxyReq.setHeader('x-api-key', process.env.PRIVATE_API_KEY);
};

// Configuração do proxy
app.use('/api', createProxyMiddleware({
    target: process.env.PUBLIC_API_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    },
    onProxyReq: addApiKey
}));

export const handler = app; 