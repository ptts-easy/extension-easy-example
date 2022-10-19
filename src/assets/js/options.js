const selectedClassName = "current";

document.addEventListener('DOMContentLoaded', function (){
  console.log("option::document.DOMContentLoaded()");
});

//=============================== events ===============================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("option::chrome.runtime.onMessage()");
});

//=============================== option ===============================
function clickAlertOnOption(event) {
  console.log("option::clickAlertOnOption() !!!");

  alert("Alert On Option !!!");
}
//=============================== storage ===============================
function clickGetUserName(event) {
  console.log("option::clickGetUserName() !!!");
  console.log(event.target.dataset);

  chrome.storage.sync.get("user_name", ({ user_name }) => {
    let inputSetUserName = document.getElementById("optionInputSetUserName");
    inputSetUserName.value = user_name;
  });
}

function clickSetUserName(event) {
  console.log("option::clickSetUserName() !!!");
  console.log(event.target.dataset);

  let inputSetUserName = document.getElementById("optionInputSetUserName");
  chrome.storage.sync.set({"user_name" : inputSetUserName.value});
}

function clickCheck(event) {
  console.log("option::clickCheck() !!!");
  console.log(event.target);
  
  let check = JSON.parse(`{"${event.target.dataset.check}":"${event.target.checked}"}`);

  console.log(check);

  chrome.storage.sync.set(check);
}

function clickOptions(event) {
  console.log("option::clickOptions() !!!");
  console.log(event.target);

  chrome.storage.sync.set({"option" : event.target.value});
}

function clickColorButton(event) {
  console.log("option::clickColorButton() !!!");
  console.log(event.target.dataset);

  let current = event.target.parentElement.querySelector(`.${selectedClassName}`);
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set(event.target.dataset);

  let {color} = event.target.dataset;

  document.body.style.background = color;
}

function clickDynamic(event) {
  console.log("option::clickDynamic() !!!");
  console.log(event.target.dataset);

  let divDynamic = document.getElementById("optionDivDynamic");

  divDynamic.innerHTML = '';

  const buttonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

  chrome.storage.sync.get("color", (color) => {
    let currentColor = color;

    // For each color we were provided…
    for (let buttonColor of buttonColors) {

      // …create a button with that color…
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      button.classList.add("color");

      // …mark the currently selected color…
      if (buttonColor === currentColor.color) {
        button.classList.add(selectedClassName);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", clickColorButton);
      divDynamic.appendChild(button);
    }
  });
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
  if (callback) {
    chrome.tabs.sendMessage(tabs[0].id, message, callback);
  } else {
    chrome.tabs.sendMessage(tabs[0].id, message);
  }
}

function clickMsgToBackground(event) {
  console.log("option::clickMsgToBackground() !!!");
  rtm({
      "type": "background-message",
      "value": "Hello Background! This is Option Messag.",
    }, function (response) {
      console.log(response.type, "::", response.value);
    });
}

//=============================== init ===============================

function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    document.getElementById("optionInputSetUserName").value = user_name;
  });

  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.background = color;
  });

  chrome.storage.sync.get("check1", ({ check1 }) => {
    document.getElementById("optionIsCheck1").checked = (check1 == "true");
  });

  chrome.storage.sync.get("check2", ({ check2 }) => {
    document.getElementById("optionIsCheck2").checked = (check2 == "true");
  });

  chrome.storage.sync.get("check3", ({ check3 }) => {
    document.getElementById("optionIsCheck3").checked = (check3 == "true");
  });

  chrome.storage.sync.get("option", ({ option }) => {
    document.getElementById('optionOptions').value = option;
  });
}

function setEventHandlers() {

  document.getElementById("optionBtnAlertOnOption").addEventListener("click", clickAlertOnOption);
  
  document.getElementById("optionBtnGetUserName").addEventListener("click", clickGetUserName);

  document.getElementById("optionBtnSetUserName").addEventListener("click", clickSetUserName);

  document.getElementById("optionBtnDynamic").addEventListener("click", clickDynamic);

  let check1 = document.getElementById("optionIsCheck1");
  check1.dataset.check = "check1";
  check1.addEventListener("click", clickCheck);

  let check2 = document.getElementById("optionIsCheck2");
  check2.dataset.check = "check2";
  check2.addEventListener("click", clickCheck);

  let check3 = document.getElementById("optionIsCheck3");
  check3.dataset.check = "check3";
  check3.addEventListener("click", clickCheck);

  let options = document.getElementById("optionOptions");
  options.addEventListener("click", clickOptions);

//================================================================================

  document.getElementById("optionBtnMsgToBackground").addEventListener("click", clickMsgToBackground);
}

function main() {
  console.log("options.js loaded on Options panel !!!");
  
  loadDataset();
  setEventHandlers();
}

main();