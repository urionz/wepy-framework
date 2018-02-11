import Tips from './Tips'
import wepy from 'wepy'

/**
 * Http工具类
 */
export default class Http {
    /**
     *
     * @param {String} method 请求方法
     * @param {String} url 请求地址
     * @param {Object} data 请求参数
     * @param {Object} header 请求头
     * @returns {Object|Exception}
     */
    static async request(method, url, data, header) {
        const param = {
            url,
            method,
            data,
            header
        }
        const res = await wepy.request(param)
        if (this.isSuccess(res)) {
            return res.data.data
        } else {
            throw this.requestException(res)
        }
    }

    /**
     * 请求结果验证
     * @param {Object} res 响应结果
     */
    static isSuccess(res) {
        const wxCode = res.statusCode
        if (wxCode !== 200) {
            return false
        }
        const wxData = res.data
        return wxData.errno == 0
    }

    /**
     * 异常捕获
     * @param {Object} res 响应结果
     * @returns {Object} 异常对象
     */
    static requestException(res) {
        const error = {}
        error.statusCode = res.statusCode
        const wxData = res.data
        console.log('requestException', wxData)
        if (wxData) { // 存在数据
            error.serverCode = wxData.errno
            error.message = wxData.errmsg
        }
        return error
    }

    /**
     * GET方法，支持异步
     * @param {String} url 请求地址
     * @param {Object} data 请求参数
     * @returns {Object|Promise}
     */
    static async get(url, data, header = {}) {
        return await this.request('GET', url, data, header)
    }

    /**
     * POST方法，支持异步
     * @param {String} url 请求地址
     * @param {Object} data 请求参数
     * @param {Object} header 请求头
     * @returns {Object|Promise}
     */
    static async post(url, data, header) {
        const defaultHeader = {
            'content-type': 'application/x-www-form-urlencoded'
        }
        return await this.request('POST', url, data, Object.assign(defaultHeader, header))
    }
}
