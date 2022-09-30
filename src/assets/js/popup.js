
function clickChangePopupColor(event) {
//  console.log(event.target.dataset);
  console.log("click ChangePopupColor !!!");
}

function clickSetDataset(event) {
//  console.log(event.target.dataset);
  console.log("click SetDataset !!!");

  let current = event.target.parentElement.querySelector(`.${selectedClassName}`);
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({"color" : color});
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
//  setEventHandlers();
  console.log("popup.js loaded !!!");
}

main();

/*
// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  console.log("popup::Event::color");
  changeColor.style.backgroundColor = color;
});

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