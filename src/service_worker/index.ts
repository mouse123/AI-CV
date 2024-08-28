declare var pdfjsLib: any;

import '../modules/pdfjs/build/pdf.mjs';
import '../modules/pdfjs/build/pdf.worker.mjs';
// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import { MESSAGE_PORT_NAME } from '../messaging/index.js';

const EMPLOYMENT = {
    BOSS: 'https://www.zhipin.com'
}
const EMPLOYMENT_PLATFORMS = [EMPLOYMENT.BOSS];

const {sidePanel,runtime,tabs} = chrome

// Allows users to open the side panel by clicking on the action toolbar icon
sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

tabs.onActivated.addListener(async ({tabId}) => {

  const {url}= await tabs.get(tabId)
  if (!url) return;

  const { origin } = new URL(url);

  if (EMPLOYMENT_PLATFORMS.includes(origin)) {
    await sidePanel.setOptions({  tabId,  path: 'src/sidepanel/index.html',  enabled: true});
  } else {
    await sidePanel.setOptions({  tabId,  enabled: false});
  }
});

let contentPort: chrome.runtime.Port | null, sidePanelPort: chrome.runtime.Port | null;

runtime.onConnect.addListener((port) => {
    const { name } = port;

    if (port.name === MESSAGE_PORT_NAME.CONTENT_SCRIPT) contentPort = port;
    if (port.name === MESSAGE_PORT_NAME.SIDEPANEL) sidePanelPort = port;

    port.onMessage.addListener((message) => {
        if (name === MESSAGE_PORT_NAME.CONTENT_SCRIPT) {
          sidePanelPort?.postMessage(message);
        } else if (name === MESSAGE_PORT_NAME.SIDEPANEL) {
          contentPort?.postMessage(message);
        }
    });

    port.onDisconnect.addListener(() => {
      if (name === MESSAGE_PORT_NAME.CONTENT_SCRIPT) contentPort = null;
      if (name === MESSAGE_PORT_NAME.SIDEPANEL) sidePanelPort = null;
  });
});



// const loadPdf = async ()=>{
//     const pdfUrl = new URL('https://pdf-lib.js.org/assets/with_update_sections.pdf')
//     try {
//         const pdf = await pdfjsLib.getDocument(pdfUrl).promise
//         const numPages = pdf.numPages;
//         const promises = [];

//         // 遍历每一页并提取文本
//         for (let i = 1; i <= numPages; i++) {
//             promises.push(pdf.getPage(i).then((page: any) => {
//                 return page.getTextContent().then((textContent: any) => {
//                     console.log("textContent.items",textContent.items)
//                     return textContent.items.map((item:any) => item.str).join(' ');
//                 });
//             }));
//         }

//         // 等待所有文本提取完成
//         const pagesText = await Promise.all(promises)
//         const fullText = pagesText.join('\n');
//         console.log('Full text:', fullText);

//     } catch (error) {
//         console.error('Error loading PDF:', error);
//     }
// }