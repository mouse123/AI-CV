export const MESSAGE_PORT_NAME = {
    SIDEPANEL: 'sidepanel',
    CONTENT_SCRIPT: 'content-script'
}

export const MESSAGE_TYPE = {
    REQUEST: 'REQUEST',
    RESPONSE: 'RESPONSE',
    ERROR: 'ERROR'
}

export const EVENT_TYPE = {
    JOB_CONTENT: 'JOB_CONTENT'
}

export function setupConnection(name:string) {
    const port = chrome.runtime.connect({name});

    return {
        port,
        send:(message: any): Promise<any> => {
            // 返回一个异步发送消息的函数
            return new Promise((resolve) => {
                port.onMessage.addListener(resolve);
                port.postMessage(message);
            });
        }
    }
}