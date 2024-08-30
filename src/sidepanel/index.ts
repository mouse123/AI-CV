// @ts-nocheck
declare var pdfjsLib: any;

window.oncontextmenu = function (e) {
    //取消默认的浏览器自带右键 很重要！！
    e.preventDefault();
}

import '../modules/pdfjs/build/pdf.mjs';
import '../modules/pdfjs/build/pdf.worker.mjs';

import { setupConnection, MESSAGE_PORT_NAME, EVENT_TYPE } from '../messaging/index';

const { send } = setupConnection(MESSAGE_PORT_NAME.SIDEPANEL);

const fileInput = document.getElementById('fileInput');
const generateButton = document.getElementById('generateButton');
const jobContent = document.querySelector('#job-content')
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
if (generateButton) {
    generateButton.onclick = async () => {
        const content = await getJobContent()
        console.log("content~~~~~~~", content)
        if (jobContent) jobContent.innerText = await askAi(content)
    }
}


async function getJobContent() {
    const { data } = await send({ type: EVENT_TYPE.JOB_CONTENT });
    return data
}

async function askAi(resume) {
    // const apiKey = 'sk-jrtYhJi8IMI7N81UD46a332176E64c8d9eC50fE77e43Cc1a';
    // const apiUrl = 'https://gptapi.us/v1/chat/completions'
    const apiKey = 'sk-HXoL9WWGWLhWHPAKWB0KQ5kXpJqsC0IrZk2cYkwSL3a6XH4l';
    const apiUrl = 'https://api.chatanywhere.tech/v1/chat/completions';
    const prompt = {
        model: 'gpt-4o-mini',
        messages: [
            {
                "role": "system",
                "content": "You are a resume generation expert."
            },
            {
                "role": "user",
                "content": `"${resume}" \n Based on this job description, generate the most suitable resume by chinese. And in each item, potential interview questions should be provided, along with the most detailed and high-quality solutions."`
            },
        ],
        prompt: "You are a helpful assistant.Your responses should be informative, logical, accurate, and impersonal.",
        // stream: true,
        temperature: 0.8
    }

    const responses = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(prompt),
    });

    const { choices } = await responses.json()
    console.log("choices[0].message.content", choices[0].message.content)
    return choices[0].message.content
}