import Http from '../utils/Http'
import wepy from 'wepy'
import Tips from '../utils/Tips'

/**
 * API基类
 */
export default class Base {
    static schema = 'HTTP_SCHEMA'
    static api_host = 'API_HOST'
    static api_version = 'API_VERSION'

    /**
     * 进一步封装GET请求
     * @param {String} url 请求地址
     * @param {Object} params 请求参数
     * @param {Object} header 请求头
     * @param {Boolean} loadingTip 是否开启自动loading
     * @param {Integer} maxRecursive 认证递归最大次数 默认3
     * @returns {Object}
     */
    static async get(url, params, header, loadingTip = true, maxRecursive = 3) {
        const defaultHeader = header || this.createAuthHeader()
        loadingTip && Tips.loading()
        try {
            const data = await Http.get(url, params, defaultHeader)
            return data
        } catch (err) {
            if (err.serverCode == 10011) {
                console.log('Token 过期，开始重新拉取')
                const refreshData = await this.refreshToken()
                if (refreshData.token) {
                    await this.setConfig('token', refreshData.token)
                    // 开始递归授权
                    const newData = maxRecursive > 0 && await this.get(url, params, header, maxRecursive--)
                    return newData
                }
            } else if (err.serverCode == 10010) {
                console.error('token缺失')
                throw err
            } else {
                Tips.modal(err.message)
                throw err
            }
        } finally {
            loadingTip && Tips.loaded()
        }
    }

    /**
     * 进一步封装POST请求
     * @param {String} url
     * @param {Object} params
     * @param {Object} header
     * @param {Boolean} loadingTip 是否开启自动loading
     * @param {Integer} maxRecursive 认证递归最大次数 默认3
     * @returns {Object|Promise|Exception}
     */
    static async post(url, params, header, loadingTip = true, maxRecursive = 3) {
        const defaultHeader = header || this.createAuthHeader()
        loadingTip && Tips.loading()
        try {
            const data = await Http.post(url, params, defaultHeader)
            return data
        } catch (err) {
            // token过期重新拉取
            if (err.serverCode == 10011) {
                console.log('Token 过期，开始重新拉取')
                const refreshData = await this.refreshToken()
                if (refreshData.token) {
                    await this.setConfig('token', refreshData.token)
                    // 开始递归授权
                    const newData = maxRecursive > 0 && await this.post(url, params, header, maxRecursive--)
                    return newData
                }
            } else if (err.serverCode == 10010) {
                console.error('token缺失')
                throw err
            } else {
                // 全局错误自动提示
                Tips.modal(err.message)
                throw err
            }
        } finally {
            loadingTip && Tips.loaded()
        }
    }

    /**
     * 刷新Token
     */
    static async refreshToken() {
        const data = await this.get(this._buildURL('refresh', 'V2Login'), {
            domain: this.getConfig('domain')
        })
        return data
    }

    /**
     * 构造请求头部
     * @returns {Object}
     */
    static createAuthHeader() {
        const token = wepy.$instance.state.token
        const header = {}
        if (token) {
            header['Authorization'] = token
        }
        return header
    }

    /**
     * 构建请求地址
     * @param {String} action 接口动作名
     * @returns {String} 地址构建结果
     */
    static _buildURL(action, controller) {
        const controllerName = controller || this.controller
        return `${this.schema}://${this.api_host}/?c=${controllerName}&a=${action}`
    }

    /**
     * 获取本地存储到全局data中
     * @param {String} cacheName 缓存名称
     * @param {String} key 键名
     * @returns {Object}
     */
    static getConfig(key) {
        return wepy.$instance.state[key]
    }

    /**
     * 设置本地存储，并存储到全局data
     * @param {String} cacheName 缓存名称
     * @param {String} key 键名
     * @param {Object|String} data 值
     * @returns {noop}
     */
    static async setConfig(key, data) {
        await wepy.setStorage({
            key,
            data
        })
        wepy.$instance.state[key] = data
    }

    /**
     * 移除本地存储的某个key-value
     * @param {String} cacheName 缓存名称
     * @param {String} key 键名
     * @returns {noop}
     */
    static async removeConfig(key) {
        wepy.$instance.state[key] = null
        await wepy.removeStorage({
            key
        })
    }
}
