// @ts-nocheck
declare var pdfjsLib: any;

import '../modules/pdfjs/build/pdf.mjs';
import '../modules/pdfjs/build/pdf.worker.mjs';

import { setupConnection, MESSAGE_PORT_NAME, EVENT_TYPE } from '../messaging/index';

const { send } = setupConnection(MESSAGE_PORT_NAME.SIDEPANEL);

const getJobContent = async () => {
    const { data } = await send({ type: EVENT_TYPE.JOB_CONTENT });
    console.log("data~~~~~~~", data)
    const jobContent = document.querySelector('#job-content')
    if (jobContent) jobContent.innerHTML = data
}
const fileInput = document.getElementById('fileInput');

if (fileInput) {
    fileInput.addEventListener('change', (event) => {
        console.log("change", event)
        const file = event?.target?.files[0];
        if (file && file.type === 'application/pdf') {
            // const fileURL = URL.createObjectURL(file);
            // console.log('File URL:', fileURL);
            // document.getElementById('pdfPreview').src = fileURL;
            const reader = new FileReader();
            reader.onload = async (e) => {
                const pdfData = new Uint8Array(e.target.result);

                const loadingTask = pdfjsLib.getDocument({ data: pdfData });
                const pdf = await loadingTask.promise;

                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.getElementById('pdfCanvas');
                const ctx = canvas.getContext('2d');

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                page.render(renderContext);
            };
            reader.readAsArrayBuffer(file);

        } else {
            alert('Please select a PDF file.');
        }
    });
}


(async () => {
    getJobContent()
})();