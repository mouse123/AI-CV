import { setupConnection, MESSAGE_PORT_NAME, MESSAGE_TYPE } from '../messaging/index';


const sendMessage = setupConnection(MESSAGE_PORT_NAME.SIDEPANEL);

(async () => {
    const response = await sendMessage({type: MESSAGE_TYPE.REQUEST, data: 'Hello from sidePanel'});
    console.log('Sidepanel Received:', response);
})();