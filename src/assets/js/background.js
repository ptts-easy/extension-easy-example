
//=============================== events ===============================

function messageProc(message, sender, sendResponse) {
  console.log("background::messageProc::", message, sender);

  if (message) {
    switch (message.type) {
      case 'background-message':
        console.log("background-message::", message.value);
        sendResponse(
          {
            "type": "background-message-response",
            "value": "Hello Popup! This is Background Response."
          });
        return true;
    }
  }
  return true;
}

//================================ chrome.runtime ==========================================
chrome.runtime.onInstalled.addListener(() => {
  console.log("background::chrome.runtime.onInstalled()");
  
  main();
});
chrome.runtime.onBrowserUpdateAvailable.addListener(() => {
  console.log("background::chrome.runtime.onBrowserUpdateAvailable()");
});
chrome.runtime.onConnect.addListener(() => {
  console.log("background::chrome.runtime.onConnect()");
});
chrome.runtime.onConnectExternal.addListener(() => {
  console.log("background::chrome.runtime.onConnectExternal()");
});
chrome.runtime.onConnectNative.addListener(() => {
  console.log("background::chrome.runtime.onConnectNative()");
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("background::chrome.runtime.onMessage()");
  messageProc(message, sender, sendResponse);
});
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  console.log("background::chrome.runtime.onMessageExternal()");
});
chrome.runtime.onRestartRequired.addListener(() => {
  console.log("background::chrome.runtime.onRestartRequired()");
});
chrome.runtime.onStartup.addListener(() => {
  console.log("background::chrome.runtime.onStartup()");
});
chrome.runtime.onSuspend.addListener(() => {
  console.log("background::chrome.runtime.onSuspend()");
});
chrome.runtime.onSuspendCanceled.addListener(() => {
  console.log("background::chrome.runtime.onSuspendCanceled()");
});
chrome.runtime.onUpdateAvailable.addListener(() => {
  console.log("background::chrome.runtime.onUpdateAvailable()");
});
//================================ chrome.tabs ==========================================
chrome.tabs.onActivated.addListener(() => {
  console.log("background::chrome.tabs.onActivated()");
});
//chrome.tabs.onActiveChanged.addListener(() => {
//  console.log("background::chrome.tabs.onActiveChanged()");
//});
chrome.tabs.onAttached.addListener(() => {
  console.log("background::chrome.tabs.onAttached()");
});
chrome.tabs.onCreated.addListener(() => {
  console.log("background::chrome.tabs.onCreated()");
});
chrome.tabs.onDetached.addListener(() => {
  console.log("background::chrome.tabs.onDetached()");
});
//chrome.tabs.onHighlightChanged.addListener(() => {
//  console.log("background::chrome.tabs.onHighlightChanged()");
//});
chrome.tabs.onHighlighted.addListener(() => {
  console.log("background::chrome.tabs.onHighlighted()");
});
chrome.tabs.onMoved.addListener(() => {
  console.log("background::chrome.tabs.onMoved()");
});
chrome.tabs.onRemoved.addListener(() => {
  console.log("background::chrome.tabs.onRemoved()");
});
chrome.tabs.onReplaced.addListener(() => {
  console.log("background::chrome.tabs.onReplaced()");
});
//chrome.tabs.onSelectionChanged.addListener(() => {
//  console.log("background::chrome.tabs.onSelectionChanged()");
//});
chrome.tabs.onUpdated.addListener(() => {
  console.log("background::chrome.tabs.onUpdated()");
});
chrome.tabs.onZoomChange.addListener(() => {
  console.log("background::chrome.tabs.onZoomChange()");
});

chrome.omnibox.onInputEntered.addListener((text) => {
  console.log("background::chrome.omnibox.onInputEntered()", text);
//  var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
//  chrome.tabs.create({ url: newURL });
});

//================================ chrome.alarms ==========================================

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("background::chrome.alarms.onAlarm()");
  
  alarmProc();
});

//================================ chrome.notifications ==========================================
chrome.notifications.onButtonClicked.addListener(async () => {
  console.log("background::chrome.notifications.onButtonClicked()");
});

//=============================== message ===============================

function rtm(message, callback) {
  if (callback) {
    chrome.runtime.sendMessage(chrome.runtime.id, message, callback);
  } else {
    chrome.runtime.sendMessage(chrome.runtime.id, message);
  }
}

async function tabm(message, callback) {
  let queryOptions = { active: true, currentWindow: true };
  let tab = await chrome.tabs.query(queryOptions);
//  let queryOptions = { active: true, lastFocusedWindow: true };
//  let [tab] = await chrome.tabs.query(queryOptions);

  console.log(tab);

  if (callback) {
    chrome.tabs.sendMessage(tab[0].id, message, callback);
  } else {
    chrome.tabs.sendMessage(tab[0].id, message);
  }
}

async function alltabm(message, callback) {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);

  for (const tab of tabs) {
    chrome.tabs
      .sendMessage(tab.id, { type: "webpage-background-message", value: "Hello Webpage! This is Popup Messag to pass Background." })
      .then((response) => {
        console.log("Message from the content script:");
      })
      .catch(onError);
  }
}

//=============================== init ===============================

function installDataset() {
  console.log("install Dataset !!!");

  chrome.storage.sync.set({ "user_name" : "UserName" });
  chrome.storage.sync.set({ "color" : "#3aa757" });
  chrome.storage.sync.set({ "check1" : "true" });
  chrome.storage.sync.set({ "check2" : "false" });
  chrome.storage.sync.set({ "check3" : "true" });
  chrome.storage.sync.set({ "option" : 5 });
}

function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    console.log('Default user name set to %s', user_name);
  });

  chrome.storage.sync.get("color", ({ color }) => {
    console.log('Default background color set to %cgreen', `color: ${color}`);
  });
}

function setEventHandlers() {
}

function openOptions() {
  chrome.tabs.create({
    url: 'html/options.html'
  });
}
function alarmProc() {

  var time = new Date().toLocaleString();

  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/assets/icons/png_file256.png',
    title: 'Time',
    message: `⏱️ :: ${time} !`,
    buttons: [
      { title: 'Ok.' }
    ],
    priority: 0
  });
}

function main() {
  console.log("background.js loaded on Popup panel !!!");
  
  installDataset();
  loadDataset();
  setEventHandlers();
//  openOptions();
}
