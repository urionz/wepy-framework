import wepy from 'wepy'

const guard = {
    blackList: [
        'pages/passport/index', // 商户id入口
        'pages/passport/login' // 登录入口
    ],
    whiteList: []
}

export default class Auth extends wepy.page {
    constructor() {
        super()
        this.wepy = wepy
    }

    async onLoad() {
        const token = wepy.$instance.state.token
        const currentPage = this.$wxpage.route
        if (guard.blackList.indexOf(currentPage) >= 0) {
            if (token) {
                this.$route('reLaunch', '/pages/home/index')
            }
        } else {
            if (!token) {
                this.$route('reLaunch', '/pages/passport/index')
            }
        }
    }
}
