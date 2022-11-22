module.exports = {
    devServer: {
        headers: {
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        proxy: {
            '/api/catalog': {
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true,
                pathRewrite: {'^/api/catalog': ''}
            },
            '/api/auth': {
                target: 'http://localhost:8081',
                ws: true,
                changeOrigin: true,
                pathRewrite: {'^/api/auth': ''}
            }
        }
    },
    transpileDependencies: ["vuetify"],
    outputDir: "target/dist",
    assetsDir: "static"
};
