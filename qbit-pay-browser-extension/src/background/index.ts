import { sendToContentScript } from "@plasmohq/messaging"

export {}

let isScannerEnabled = false
chrome.action.onClicked.addListener(() => {
  isScannerEnabled = !isScannerEnabled
  chrome.action.setBadgeText({ text: isScannerEnabled ? "ON" : "" })
  sendToContentScript({
    name: "toggle-scan",
    body: {
      state: isScannerEnabled,
      type: "QBIT_SCAN_TOGGLE"
    }
  })
})

// chrome.scripting.executeScript(
//   {
//     target: {
//       tabId // the tab you want to inject into
//     },
//     world: "MAIN", // MAIN to access the window object
//     func: windowChanger // function to inject
//   },
//   () => {
//     console.log("Background script got callback after injection")
//   }
// )
