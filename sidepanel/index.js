const {runtime} = chrome
const init = async ()=>{
    runtime.sendMessage({from: "sidepanel", type: "init"}, (response) => {
        console.log("Document from content script:", response.document);
    });
}
init()
