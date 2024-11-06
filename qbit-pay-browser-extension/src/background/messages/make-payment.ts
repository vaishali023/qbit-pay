import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.name !== "make-payment") return

  chrome.tabs.sendMessage(req.sender.tab.id, {
    type: "FORWARD_QR_CODE_DATA",
    data: req.body.data,
  })
}

export default handler
