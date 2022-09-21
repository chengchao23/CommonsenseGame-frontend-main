module.exports = {
    // options...
    devServer: {
        port: 80,
        host:'0.0.0.0'
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'ICA众包平台游戏'
            return args
        })
    }
}
