import wepy from 'wepy'

export default class Nav extends wepy.mixin {
    methods = {
        redirectTo(url) {
            this.$redirectTo(url)
        },
        navigateTo(url) {
            this.$navigate(url)
        }
    }
}
