import wepy from 'wepy'
import '../utils'
import v from '../utils/Validate'
import Lang from '../utils/Lang'

/**
 * input mixin类
 * 用法：
 * @input="input"
 * 获取input值
 * this.input.foo
 * rule Array
 * {
 *      value: this.input.foo,
 *      method: 'required|number|....' // 具体规则参照Lang
 *      message: '不得为空|格式不正确'
 * }
 */
export default class Input extends wepy.mixin {
    data = {
        input: {
            isValid: false
        }
    }

    // 卸载页面后重置当前表单
    onUnload() {
        this.init()
    }

    init() {
        this.input = {
            isValid: false
        }
    }

    // 判断是否为空
    isEmpty(str) {
        return Lang.isEmpty(str)
    }

    // 错误提示
    tips(message) {
        this.$Tip.modal(message)
    }

    check(rules) {
        for (const rule of rules) {
            const value = rule.value
            const methods = rule.method.split('|')
            for (const key in methods) {
                if (methods[key] !== 'noDuplicate' && Lang.isArray(value)) {
                    for (const innerValue of value) {
                        const isValid = this.execCheck(rule, innerValue, key)
                        if (!isValid) {
                            return false
                        }
                    }
                } else {
                    const isValid = this.execCheck(rule, value, key)
                    if (!isValid) {
                        return false
                    }
                }
            }
        }
        return true
    }

    execCheck(rule, value, index) {
        let params = ''
        let methodName = ''
        if (rule.method.split('|')[index].indexOf(':') >= 0) {
            methodName = rule.method.split('|')[index].split(':')[0]
            params = rule.method.split('|')[index].split(':')[1].split(',')
        } else {
            methodName = rule.method.split('|')[index]
        }
        const method = v[methodName].bind(v)
        const isValid = method(value, params)
        if (!isValid) {
            this.tips(rule.message.split('|')[index])
            return false
        }
        return true
    }

    methods = {
        // mixin input绑定方法,若重写可覆盖
        input(e) {
            const fieldName = e.currentTarget.id
            this.input[fieldName] = e.detail.value
        }
    }
}
