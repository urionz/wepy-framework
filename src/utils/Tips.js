/**
 * Tips工具类
 */
export default class Tips {
    static isLoading = false
    static pause = false
    static duration = `GLOBAL_DURATION`

    static success(title, duration = parseInt(this.duration)) {
        title = title || '操作成功'
        wx.showLoading({
            title,
            icon: 'success',
            mask: true,
            duration
        })
        if (duration > 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, this.duration)
            })
        }
    }

    static modal(content, title) {
        title = title || '提示'
        content = content || '网络错误'
        return new Promise((resolve, reject) => {
            wx.showModal({
                title,
                content,
                showCancel: false,
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    }

    static confirm(content, payload = {}, title) {
        title = title || '提示'
        content = content || ''
        return new Promise((resolve, reject) => {
            wx.showModal({
                title,
                content,
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        resolve(payload)
                    } else if (res.cancel) {
                        reject(payload)
                    }
                },
                fail: () => {
                    reject(payload)
                }
            })
        })
    }

    static toast(title, hideCallback, icon = 'success') {
        wx.showToast({
            title,
            icon,
            mask: true,
            duration: parseInt(this.duration)
        })

        if (hideCallback) {
            setTimeout(() => {
                hideCallback()
            }, parseInt(this.duration))
        }
    }

    static loading(title = '加载中...', force = false) {
        if (this.isLoading && !force) {
            return
        }
        this.isLoading = true
        if (wx.showLoading) {
            wx.showNavigationBarLoading()
        }
    }

    static loaded() {
        if (this.isLoading) {
            this.isLoading = false
            if (wx.hideLoading) {
                wx.hideNavigationBarLoading()
            }
        }
    }

    static alert(title) {
        wx.showToast({
            title,
            image: '/images/alert.png',
            mask: true,
            duration: parseInt(this.duration)
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, parseInt(this.duration))
        })
    }

    static error(title, hideCallback) {
        wx.showToast({
            title,
            image: '/images/error.png',
            mask: true,
            duration: parseInt(this.duration)
        })

        if (hideCallback) {
            setTimeout(() => {
                hideCallback()
            }, parseInt(this.duration))
        }
    }

    static setLoading() {
        this.isLoading = true
    }
}
