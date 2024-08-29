// @ts-nocheck
import { setupConnection, MESSAGE_PORT_NAME, EVENT_TYPE } from '../messaging/index';

const {send} = setupConnection(MESSAGE_PORT_NAME.SIDEPANEL);

const getJobContent = async () => {
    const { data } = await send({type: EVENT_TYPE.JOB_CONTENT});
    console.log("data~~~~~~~",data)
    const jobContent = document.querySelector('#job-content')
    if(jobContent)jobContent.innerHTML = data
}
const fileInput = document.getElementById('fileInput');

if(fileInput){
    fileInput.addEventListener('change', (event)=> {
        console.log("change",event)
        const file = event?.target?.files[0];
        if (file && file.type === 'application/pdf') {
            const fileURL = URL.createObjectURL(file);
            console.log('File URL:', fileURL);
            document.getElementById('pdfPreview').src = fileURL;
        } else {
            alert('Please select a PDF file.');
        }
    });
}


(async () => {
    getJobContent()
})();