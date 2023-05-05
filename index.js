const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const targetUrl = 'https://g-plans.com';

const proxyMiddleware = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    if (path === '/') {
      const queryStrings = req.url.split('?')[1] || '';
      return `/pages/chat${queryStrings ? '?' + queryStrings : ''}`;
    }
    return path;
  },
  preserveHeaderKeyCase: true,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  },
});

app.use('/', proxyMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
