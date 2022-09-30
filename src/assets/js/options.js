const selectedClassName = "current";

function clickGetDataset(event) {
//  console.log(event.target.dataset);
  console.log("click GetDataset !!!");

  chrome.storage.sync.get("user_name", ({ user_name }) => {
    let inputSetDataset = document.getElementById("optionInputSetDataset");
    inputSetDataset.value = user_name;
  });
}

function clickSetDataset(event) {
//  console.log(event.target.dataset);
  console.log("click SetDataset !!!");

  chrome.storage.sync.set({"user_name" : inputSetDataset.value});
}

function clickColorButton(event) {
//  console.log(event.target.dataset);
  console.log("click ColorButton !!!");

  let current = event.target.parentElement.querySelector(`.${selectedClassName}`);
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ "color" : color });
}

function clickDynamic(event) {
//  console.log(event.target.dataset);
  console.log("click clickDynamic !!!");

  let divDynamic = document.getElementById("optionDivDynamic");

  //divDynamic.appendChild(button); removeAll

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
      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", clickColorButton);
      divDynamic.appendChild(button);
    }
  });
}

function setEventHandlers() {
  let btnGetDataset = document.getElementById("optionBtnGetDataset");
  btnGetDataset.addEventListener("click", clickGetDataset);

  let btnSetDataset = document.getElementById("optionBtnSetDataset");
  btnSetDataset.addEventListener("click", clickSetDataset);

  let btnDynamic = document.getElementById("optionBtnDynamic");
  btnDynamic.addEventListener("click", clickDynamic);
}

function main() {
  setEventHandlers();
  console.log("options.js loaded !!!");
}

main();