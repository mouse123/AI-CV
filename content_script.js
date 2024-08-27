chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('contentjs onMessage~~~~~~~~~~')
    console.log(message)
    console.log(sender)
    console.log(sendResponse)
    if (message.from === "service-worker" && message.type === "GET_DOM") {
        sendResponse({from: "content_script", type: "DOM_DATA", data: document});
    }
})