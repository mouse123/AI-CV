import { setupConnection, MESSAGE_PORT_NAME, EVENT_TYPE } from '../messaging/index';

const {send} = setupConnection(MESSAGE_PORT_NAME.SIDEPANEL);

const getJobContent = async () => {
    const { data } = await send({type: EVENT_TYPE.JOB_CONTENT});
    console.log("data~~~~~~~",data)
    const jobContent = document.querySelector('#job-content')
    if(jobContent)jobContent.innerHTML = data
}

(async () => {
    getJobContent()
})();