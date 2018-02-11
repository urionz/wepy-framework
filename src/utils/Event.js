import * as Notification from './Notification'

export default class Event {

    static on(eventName, cb, observer) {
        Notification.addNotification(eventName, cb, observer)
    }

    static emit(eventName, ...params) {
        Notification.postNotificationName(eventName, params)
    }

    static remove(eventName, observer) {
        Notification.removeNotification(eventName, observer)
    }
}
