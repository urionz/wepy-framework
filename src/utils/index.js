/**
 * 工具入口
 */
import Http from './Http'
import Tips from './Tips'
import Event from './Event'
import { findIndex } from 'lodash'
import wepy from 'wepy'

// 注册全局工具
Object.assign(wepy.component.prototype, {
    $Tip: Tips,
    $Http: Http,
    $Tool: {
        findIndex
    },
    $Event: Event
})
