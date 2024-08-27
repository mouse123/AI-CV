import './modules/pdfjs/build/pdf.mjs';
import './modules/pdfjs/build/pdf.worker.mjs';
import './modules/pdf-lib.min.js';

const EMPLOYMENT = {
    BOSS: 'https://www.zhipin.com'
}
const EMPLOYMENT_PLATFORMS = [EMPLOYMENT.BOSS];

const {sidePanel,runtime,tabs} = chrome

let document;

// Allows users to open the side panel by clicking on the action toolbar icon
sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

tabs.onActivated.addListener(async ({tabId,windowId}) => {

  const {url}= await tabs.get(tabId)
  if (!url) return;

  const { origin } = new URL(url);

  if (EMPLOYMENT_PLATFORMS.includes(origin)) {
    await sidePanel.setOptions({  tabId,  path: 'sidepanel/index.html',  enabled: true});
  } else {
    await sidePanel.setOptions({  tabId,  enabled: false});
  }
});

runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("service-worker onMessage~~~~~~~~~")
    console.log(message)
    console.log(sender)
    console.log(sendResponse)
    if (message.from === "sidepanel" && message.type === "init") {
        sendResponse({document})
        return true; // 保持 sendResponse 异步
    } else if (message.from === "content_script" && message.type === "DOM_DATA") {
        // 处理来自 content script 的 DOM 数据，或者转发给 sidePanel
        console.log("Received DOM data:", message.data);
    }

})


const loadPdf = async ()=>{
    const pdfUrl = new URL('https://pdf-lib.js.org/assets/with_update_sections.pdf')
    try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise
        const numPages = pdf.numPages;
        const promises = [];

        // 遍历每一页并提取文本
        for (let i = 1; i <= numPages; i++) {
            promises.push(pdf.getPage(i).then(page => {
                return page.getTextContent().then(textContent => {
                    console.log("textContent.items",textContent.items)
                    return textContent.items.map(item => item.str).join(' ');
                });
            }));
        }

        // 等待所有文本提取完成
        const pagesText = await Promise.all(promises)
        const fullText = pagesText.join('\n');
        console.log('Full text:', fullText);

    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}  

self.loadPdf = loadPdf