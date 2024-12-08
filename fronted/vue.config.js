const { defineConfig } = require('@vue/cli-service')
module.exports = {
  lintOnSave: false,
  //transpileDependencies: true,
  devServer: {
    //本地服务器主机名 配置后可以使用本地网络访问
    host: 'localhost',
    allowedHosts: 'all',
    //指定启动端口号
    port: 8080,
    
    hot: true, // 热更新
    //服务器启动时自动在浏览器中打开应用程序,当此值为字符串时，会被用作 URL 的路径名
    open: false,
    proxy: {
        '/api': {
            target: ' http://localhost:3001',
            changeOrigin: true,
        },
        '/v1': {
          target: ' http://localhost:3089',
          changeOrigin: true,
        },
        '/com':{
          target: ' http://localhost:8841',
          changeOrigin: true,
        }
    }
  },
}
