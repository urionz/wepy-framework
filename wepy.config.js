const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const env = process.env.NODE_ENV || 'development'
const conf = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'))
const runtimeServer = process.env.server || ''

console.log(`当前api运行环境:${runtimeServer}...`)

const replacer = []

Object.keys(conf[env]).map(index => {
    replacer.push({
        find: index.toUpperCase(),
        replace: String(conf[env][index]).replace(/\$/, runtimeServer)
    })
})

module.exports = {
    wpyExt: '.wpy',
    build: {
        web: {
            htmlTemplate: path.join('src', 'index.template.html'),
            htmlOutput: path.join('web', 'index.html'),
            jsOutput: path.join('web', 'index.js')
        }
    },
    resolve: {
        modules: ['node_modules']
    },
    eslint: true,
    compilers: {
        less: {
            compress: true
        },
        /* sass: {
          outputStyle: 'compressed'
        }, */
        babel: {
            sourceMap: true,
            presets: [
                'env',
                'es2015',
                'stage-1'
            ],
            plugins: [
                'babel-plugin-transform-class-properties',
                'transform-decorators-legacy',
                'transform-export-extensions',
                'syntax-export-extensions'
            ]
        }
    },
    plugins: {
        replace: {
            // 全局配置文件，只对.js后缀文件生效
            filter: /\.js|app\.wpy$/,
            config: replacer
        }
    }
}
if ('trial|production|testing'.indexOf(env) !== -1) {
    delete module.exports.compilers.babel.sourcesMap
    // 压缩sass
    // module.exports.compilers['sass'] = {outputStyle: 'compressed'}

    // 压缩less
    module.exports.compilers['less'] = { compress: true }

    // 压缩js
    module.exports.plugins = {
        uglifyjs: {
            filter: /\.js$/,
            config: {
            }
        },
        imagemin: {
            filter: /\.(jpg|png|jpeg)$/,
            config: {
                jpg: {
                    quality: 80
                },
                png: {
                    quality: 80
                }
            }
        },
        replace: {
            // 全局配置文件，只对.js后缀文件生效
            filter: /\.js$/,
            config: replacer
        }
    }
}
