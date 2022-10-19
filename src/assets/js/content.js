document.addEventListener('DOMContentLoaded', function (){
  console.log("content::document.DOMContentLoaded()");
});

function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    console.log("content::user_name = ", user_name);
  });

  chrome.storage.sync.get("color", ({ color }) => {
    console.log("content::color = ", color);
  });
}

function messageProc(message, sender, sendResponse) {
  console.log("content::messageProc::", message, sender);

  if (message) {
    switch (message.type) {
      case "all":
        console.log(message.type, "::", message.value);
      case 'webpage-message':
        console.log(message.type, "::", message.value);
        sendResponse(
          {
            "type": "webpage-message-response",
            "value": "Hello Popup! This is Webpage Response.",
          });
        return true;
      case "webpage-background-message":
        console.log(message.type, "::", message.value);
        return true;
    }
  }
  return false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("content::chrome.runtime.onMessage()");
  messageProc(message, sender, sendResponse);
});

function setEventHandlers() {
  
}

function main() {
  console.log("contents.js loaded on Webpage !!!");

  loadDataset();
  setEventHandlers();
}

main();