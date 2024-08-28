import { setupConnection, MESSAGE_PORT_NAME, MESSAGE_TYPE } from '../messaging/index.ts';

const sendMessage = setupConnection(MESSAGE_PORT_NAME.CONTENT_SCRIPT);

(async () => {
    const response = await sendMessage({type: MESSAGE_TYPE.REQUEST, data: 'Hello from content_script'});
    console.log('Context script received:', response);
})();