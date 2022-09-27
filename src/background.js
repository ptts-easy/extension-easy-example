let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  console.log("background::chrome.runtime.onInstalled()");
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
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
chrome.runtime.onMessage.addListener(() => {
  console.log("background::chrome.runtime.onMessage()");
});
chrome.runtime.onMessageExternal.addListener(() => {
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