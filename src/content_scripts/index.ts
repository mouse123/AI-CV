import { setupConnection, MESSAGE_PORT_NAME, EVENT_TYPE } from '../messaging/index.ts';

const { port } = setupConnection(MESSAGE_PORT_NAME.CONTENT_SCRIPT);

const getJobSecText = () => {
    const content = document.querySelector('.job-sec-text')?.textContent
    return content
}

port.onMessage.addListener((message) => {
    if (message.type === EVENT_TYPE.JOB_CONTENT) {
        console.log("recive job content get~~~~~~~~~")
        port.postMessage({ data: getJobSecText() });
    }
});