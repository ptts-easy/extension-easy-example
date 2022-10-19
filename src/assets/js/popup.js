//https://developer.mozilla.org/en-US/docs/Web/Events

document.addEventListener('DOMContentLoaded', function (){
  console.log("popup::document.DOMContentLoaded()");
});

//=============================== events ===============================

function messageProc(message, sender, sendResponse) {
  console.log("popup::messageProc::", message, sender);

  if (message) {
    switch (message.type) {
      case "all":
        console.log(message.type, "::", message.value);
        return true;
      case 'webpage-popup-message':
        console.log(message.type, "::", message.value);
        sendResponse({"type": "webpage-popup-message-resp", "value": "Hello Webpage! This is Popup Response."});
        return true;
    }
  }
  return false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("popup::chrome.runtime.onMessage()");
  messageProc(message, sender, sendResponse);
});

//=============================== popup ===============================
function clickAlertOnPopup(event) {
  console.log("popup::clickAlertOnPopup() !!!");

  alert("Alert On Popup !!!");
}
//=============================== storage ===============================
function changeUserName(event) {
  console.log("popup::changeUserName() !!!");
  console.log(event.target.value);

  chrome.storage.sync.set({"user_name" : event.target.value});
}

function clickCheck(event) {
  console.log("popup::clickCheck() !!!");
  console.log(event.target);
  
  let check = JSON.parse(`{"${event.target.dataset.check}":"${event.target.checked}"}`);

  console.log(check);

  chrome.storage.sync.set(check);
}

function clickOptions(event) {
  console.log("popup::clickOptions() !!!");
  console.log(event.target);

  chrome.storage.sync.set({"option" : event.target.value});
}

function clickChangePopupColor(event) {
  console.log("popup::clickChangePopupColor() !!!");
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.background = color;
  });
}

//=============================== content ===============================

function alertMessage(msg) {
//  console.log("popup::alertMessage() !!!");
  return alert(msg);
}

async function clickAlertOnWebpage(event) {
  console.log("popup::clickAlertOnWebpage() !!!");

  chrome.windows.getCurrent(function (currentWindow) {
      chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
          activeTabs.map(function (tab) {
            if (tab.url?.startsWith("chrome://")) return undefined;
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: alertMessage,
              args: ["Hello Hompepage"]
            });
          });
      });
  });
}

function setWebpageBackgroundColor(backgroundColor) {
//  consoel.log("popup::setWebpageBackgroundColor backgroundColor=", backgroundColor);
  document.body.style.backgroundColor = backgroundColor;
}

async function clickChangeWebpageColor(event) {
  console.log("popup::clickChangeWebpageColor() !!!");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.storage.sync.get("color", ({ color }) => {
    console.log(color);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: setWebpageBackgroundColor,
      args: [color],
    });
  });
}

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

async function clickInjectJavascript(event) {
  console.log("popup::clickInjectJavascript !!!");

  chrome.windows.getCurrent(function (currentWindow) {
      chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
          activeTabs.map(function (tab) {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: injectScript,
                args: [chrome.runtime.getURL("./assets/js/injected.js"), "body"]
              });
          });
      });
  });
}

//=============================== util ===============================

function clickTextOnBadge(event) {
  console.log("popup::clickTextOnBadge() !!!");

  chrome.action.setBadgeText({text: 'ON'});
}

function clickNotification(event) {
  console.log("popup::clickNotification() !!!");

  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/assets/icons/png_file256.png',
    title: 'Extension Easy Example',
    message: 'Hello !',
    buttons: [
      { title: 'Ok.' }
    ],
    priority: 0
  });
}

function clickAlarm(event) {
  console.log("popup::clickAlarm() !!!");

  chrome.storage.sync.get("periodInMinutes", ({ periodInMinutes }) => {
    console.log(periodInMinutes);

    if (periodInMinutes !== undefined) {
      chrome.action.setBadgeText({text: ''});
      chrome.alarms.clearAll();
      chrome.storage.sync.remove("periodInMinutes");
    } else {
      periodInMinutes = 1;
      chrome.action.setBadgeText({text: 'Alarm'});
      chrome.alarms.create("myAlarm", {delayInMinutes: 1, periodInMinutes: periodInMinutes});
      chrome.storage.sync.set({periodInMinutes: periodInMinutes});
    }
  });

//  window.close();
}

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

function clickMsgToBackground(event) {
  console.log("popup::clickMsgToBackground() !!!");
  rtm({
      "type": "background-message",
      "value": "Hello Background! This is Popup Messag.",
    }, function (response) {
      console.log(response.type, "::", response.value);
    });
}

function clickMsgToWebpage(event) {
  console.log("popup::clickMsgToWebpage() !!!");

  tabm({
      "type": "webpage-message",
      "value": "Hello Webpage! This is Popup Messag.",
    }
    , function (response) {
      console.log(response.type, "::", response.value);
    });
}

//=============================== init ===============================

function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    document.getElementById("popupInputUserName").value = user_name;
  });

  chrome.storage.sync.get("color", ({ color }) => {
    document.getElementById("popupBtnChangePopupColor").style.background = color;
  });

  chrome.storage.sync.get("check1", ({ check1 }) => {
    document.getElementById("popupIsCheck1").checked = (check1 == "true");
  });

  chrome.storage.sync.get("check2", ({ check2 }) => {
    document.getElementById("popupIsCheck2").checked = (check2 == "true");
  });

  chrome.storage.sync.get("check3", ({ check3 }) => {
    document.getElementById("popupIsCheck3").checked = (check3 == "true");
  });

  chrome.storage.sync.get("option", ({ option }) => {
    document.getElementById('popupOptions').value = option;
  });
}

function setEventHandlers() {

  document.getElementById("popupBtnAlertOnPopup").addEventListener("click", clickAlertOnPopup);
  
  document.getElementById("popupInputUserName").addEventListener("change", changeUserName);

  let check1 = document.getElementById("popupIsCheck1");
  check1.dataset.check = "check1";
  check1.addEventListener("click", clickCheck);

  let check2 = document.getElementById("popupIsCheck2");
  check2.dataset.check = "check2";
  check2.addEventListener("click", clickCheck);

  let check3 = document.getElementById("popupIsCheck3");
  check3.dataset.check = "check3";
  check3.addEventListener("click", clickCheck);

  let options = document.getElementById("popupOptions");
  options.addEventListener("click", clickOptions);

  document.getElementById("popupBtnChangePopupColor").addEventListener("click", clickChangePopupColor);

//================================================================================

  document.getElementById("popupBtnAlertOnWebpage").addEventListener("click", clickAlertOnWebpage);
  document.getElementById("popupBtnChangeWebpageColor").addEventListener("click", clickChangeWebpageColor);
  document.getElementById("popupBtnInjectJavascript").addEventListener("click", clickInjectJavascript);

//================================================================================

  document.getElementById("popupBtnTextOnBadge").addEventListener("click", clickTextOnBadge);
  document.getElementById("popupBtnNotification").addEventListener("click", clickNotification);
  document.getElementById("popupBtnAlarm").addEventListener("click", clickAlarm);

//================================================================================

  document.getElementById("popupBtnMsgToBackground").addEventListener("click", clickMsgToBackground);
  document.getElementById("popupBtnMsgToWebpage").addEventListener("click", clickMsgToWebpage);
}

function main() {
  console.log("popup.js loaded on Popup panel !!!");
  
  loadDataset();
  setEventHandlers();
}

main();