const selectedClassName = "current";

//<p id="log"></p>
//const log = document.getElementById('log');
//input.addEventListener('change', updateValue);
//log.textContent = e.target.value;

function clickAlertOnOption(event) {
  console.log("click AlertOnOption !!!");

  alert("Alert On Option !!!");
}

function clickGetUserName(event) {
//  console.log(event.target.dataset);
  console.log("click GetUserName !!!");

  chrome.storage.sync.get("user_name", ({ user_name }) => {
    let inputSetUserName = document.getElementById("optionInputSetUserName");
    inputSetUserName.value = user_name;
  });
}

function clickSetUserName(event) {
//  console.log(event.target.dataset);
  console.log("click SetUserName !!!");

  let inputSetUserName = document.getElementById("optionInputSetUserName");
  chrome.storage.sync.set({"user_name" : inputSetUserName.value});
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

function clickColorButton(event) {
//  console.log(event.target.dataset);
  console.log("click ColorButton !!!");

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
//  console.log(event.target.dataset);
  console.log("click clickDynamic !!!");

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

function loadDataset() {
  chrome.storage.sync.get("user_name", ({ user_name }) => {
    let lbUserName = document.getElementById("optionInputSetUserName");

    lbUserName.value = user_name;
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

  let btnAlertOnOption = document.getElementById("optionBtnAlertOnOption");
  btnAlertOnOption.addEventListener("click", clickAlertOnOption);

  let btnGetUserName = document.getElementById("optionBtnGetUserName");
  btnGetUserName.addEventListener("click", clickGetUserName);

  let btnSetUserName = document.getElementById("optionBtnSetUserName");
  btnSetUserName.addEventListener("click", clickSetUserName);

  let btnDynamic = document.getElementById("optionBtnDynamic");
  btnDynamic.addEventListener("click", clickDynamic);

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
}

function main() {
  console.log("options.js loaded on Options panel !!!");
  
  loadDataset();
  setEventHandlers();
}

main();