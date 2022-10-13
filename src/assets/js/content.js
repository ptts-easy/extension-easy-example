
function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    console.log("contents::user_name = ", user_name);
  });

  chrome.storage.sync.get("color", ({ color }) => {
    console.log("contents::color = ", color);
  });
}

function messageProc(message, sender, sendResponse) {
  console.log("contents::messageProc::", message, sender);
/*  
  if (message) {
    switch (message.type) {
      case 'homepage-message':
        console.log(message.type, "::", message.value);
//        alert(message.type + "::" + message.value);
//        sendResponse(
//          {
//            "type": "homepage-message",
//            "value": "Hello Popup! This is Webpage Response.",
///          });
 
        return true;
        break;
    }
  }
  return false;
*/
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("contents::chrome.runtime.onMessage()");
  messageProc(message, sender, sendResponse);
});

function main() {
  console.log("contents.js loaded on Webpage !!!");

  loadDataset();
}

main();