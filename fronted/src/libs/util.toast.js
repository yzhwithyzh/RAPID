import {Modal, message, notification} from 'ant-design-vue';

export const ZyConfirm = function (content, title = '提示') {
    return new Promise((resolve) => {
        Modal.confirm({
            title: title,
            content: content,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                resolve(true)
            },
            onCancel() {
                resolve(false)
            },
        });
    })
}

class Message {
    info(content = '提示信息', duration) {
        return this.showMessage('info', content, duration);
    }

    success(content = '成功信息', duration) {
        return this.showMessage('success', content, duration);
    }

    warning(content = '警告信息', duration) {
        return this.showMessage('warning', content, duration);
    }

    error(content = '错误信息', duration) {
        return this.showMessage('error', content, duration);
    }

    showMessage(type, content, duration) {
        return message[type](content, duration);
    }
}

class Notification {
    info(description, message = 'Info') {
        return this.showNotification('info', description, message);
    }

    success(description, message = 'Success') {
        return this.showNotification('success', description, message);
    }

    warning(description, message = 'Warning') {
        return this.showNotification('warning', description, message);
    }

    error(description, message = 'Error') {
        return this.showNotification('error', description, message);
    }

    showNotification(type, description, message) {
        return notification[type]({
            message,
            description,
        });
    }
}

export const ZyMessage = new Message();
export const ZyNotification = new Notification();
