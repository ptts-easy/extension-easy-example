//https://developer.mozilla.org/en-US/docs/Web/Events

document.addEventListener('DOMContentLoaded', function (){
  console.log("popup::document.DOMContentLoaded()");
});

//======================================= run on popup ======================

function changeUserName(event) {
  console.log(event.target.value);

  chrome.storage.sync.set({"user_name" : event.target.value});
}

function clickCheck(event) {
  console.log("click clickCheck !!!");

  let check = JSON.parse(`{"${event.target.dataset.check}":"${event.target.checked}"}`);

  console.log(check);

  chrome.storage.sync.set(check);
}

function clickOptions(event) {
  console.log(event.target);
  console.log("click clickOptions !!!");

  chrome.storage.sync.set({"option" : event.target.value});
}

function clickAlertOnPopup(event) {
  console.log("click AlertOnPopup !!!");

  alert("Alert On Popup !!!");
}

function clickChangePopupColor(event) {
  console.log("click ChangePopupColor !!!");
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.background = color;
  });
}

function rtm(message, callback) {
  if (callback) {
    chrome.runtime.sendMessage(chrome.runtime.id, message, callback);
  } else {
    chrome.runtime.sendMessage(chrome.runtime.id, message);
  }
}

function clickMsgBackground(event) {
  console.log("click MsgBackground !!!");
  rtm({
      "type": "background-message",
      "value": "Hello Background! This is Popup Messag.",
    }, function (response) {
      console.log(response.type, "::", response.value);
    });
}

//======================================= run on homepage ======================

function alertMessage(msg) {
  return alert(msg);
}

async function clickAlertOnWebpage(event) {
  console.log("click popupAlertOnWebpage !!!");

  chrome.windows.getCurrent(function (currentWindow) {
      chrome.tabs.query({ active: true, windowId: currentWindow.id }, function (activeTabs) {
          activeTabs.map(function (tab) {
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
//  consoel.log("change BackgroundColorOnWebpage backgroundColor=", backgroundColor);  //Error
  document.body.style.backgroundColor = backgroundColor;
}

async function clickChangeWebpageColor(event) {
  console.log("click popupChangeWebpageColor !!!");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  console.log(tab);

  chrome.storage.sync.get("color", ({ color }) => {
    console.log(color);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: setWebpageBackgroundColor,
      args: [color],
    });
  });
}

function clickMsgInjectedWebpage(event) {
  console.log("click MessageInjectedWebpage !!!");

  rtm({
      "type": "homepage-message",
      "value": "Hello Webpage! This is Popup Messag.",
    }
//    , function (response) {
//      console.log(response);
////      console.log(response.type, "::", response.value);
//    }
    );
}


function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

async function clickInjectJavascript(event) {
  console.log("click InjectJavascript !!!");

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

function clickTextOnBadge(event) {
  console.log("click TextOnBadge !!!");

  chrome.action.setBadgeText({text: 'ON'});
}

function clickNotification(event) {
  console.log("click Notification !!!");

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
  console.log("click Alarm !!!");

  chrome.storage.sync.get("periodInMinutes", ({ periodInMinutes }) => {
    console.log(periodInMinutes);

    if (periodInMinutes !== undefined) {
      chrome.action.setBadgeText({text: ''});
      chrome.alarms.clearAll();
      chrome.storage.sync.remove("periodInMinutes");
    } else {
      periodInMinutes = 1;
      chrome.action.setBadgeText({text: 'ON'});
      chrome.alarms.create("myAlarm", {delayInMinutes: 1, periodInMinutes: periodInMinutes});
      chrome.storage.sync.set({periodInMinutes: periodInMinutes});
    }
  });

//  window.close();
}

function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    console.log(user_name);
    let inputUserName = document.getElementById("popupInputUserName");

    inputUserName.value = user_name;
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

  let inputUserName = document.getElementById("popupInputUserName");
  inputUserName.addEventListener("change", changeUserName);

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

//================================================================================

  document.getElementById("popupBtnAlertOnPopup").addEventListener("click", clickAlertOnPopup);
  document.getElementById("popupBtnChangePopupColor").addEventListener("click", clickChangePopupColor);
  document.getElementById("popupBtnMsgBackground").addEventListener("click", clickMsgBackground);
  document.getElementById("popupBtnAlertOnWebpage").addEventListener("click", clickAlertOnWebpage);
  document.getElementById("popupBtnChangeWebpageColor").addEventListener("click", clickChangeWebpageColor);
  document.getElementById("popupBtnMsgInjectedWebpage").addEventListener("click", clickMsgInjectedWebpage);
  document.getElementById("popupBtnInjectJavascript").addEventListener("click", clickInjectJavascript);

//================================================================================

  document.getElementById("popupBtnTextOnBadge").addEventListener("click", clickTextOnBadge);
  document.getElementById("popupBtnNotification").addEventListener("click", clickNotification);
  document.getElementById("popupBtnAlarm").addEventListener("click", clickAlarm);
}

function main() {
  console.log("popup.js loaded on Popup panel !!!");
  
  loadDataset();
  setEventHandlers();
}

main();


/*
// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  console.log("popup::changeColor::click");
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
*/