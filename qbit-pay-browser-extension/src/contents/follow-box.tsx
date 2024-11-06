import ScanAngle from "data-base64:~assets/scan-angle.svg"
import cssText from "data-text:~style.css"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"
import jsQR from "jsqr"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoCSUIProps,
  PlasmoRender
} from "plasmo"
import { useEffect, useRef, useState, type FC } from "react"
import { createRoot } from "react-dom/client"
import SVG from "react-inlinesvg"

import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  matches: ["file://*/*", "http://*/*", "https://*/*"]
}

const styleElement = document.createElement("style")

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(`body`)
      const head = document.querySelector(`head`)
      if (rootContainerParent && head) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
        rootContainer.id = "follow-box"

        head.appendChild(getStyle())
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

export const getStyle = () => {
  styleElement.id = "qbit-styles"
  styleElement.textContent = cssText

  return styleElement
}

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {
  const { data } = useMessage<{ state: boolean }, string>((_, res) => {
    return res.send("test")
  })
  const [isEnabled, setIsEnabled] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hasCapturedQbit, setHasCapturedQbit] = useState("")

  const ref = useRef<HTMLDivElement>(null)
  const [boxSize, setBoxSize] = useState(200) // Initial size of the box
  // console.log("Wallet: ", window.arweaveWallet)
  useEffect(() => {
    // Event listener to update position based on mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.pageX, y: event.pageY })
    }
    // Listen for messages from the background script

    document.addEventListener("mousemove", handleMouseMove)

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const html = document.querySelector("html")
    if (isEnabled) {
      //
      if (!html) return
      html.style.cursor = "none"
      html.style.overflow = "hidden"
    } else {
      if (!html) return
      html.style.cursor = "default"
      html.style.overflow = "auto"
    }
  }, [isEnabled])

  useEffect(() => {
    if (data && data.state !== undefined && data.state !== isEnabled) {
      setIsEnabled(data.state)
    }
  }, [data])

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      setBoxSize((prevSize) => {
        const newSize = prevSize + (event.deltaY > 0 ? -10 : 10) // Increase or decrease size based on scroll direction
        return Math.max(200, Math.min(newSize, 800)) // Restrict size between 50 and 500
      })
    }

    if (isEnabled) {
      window.addEventListener("wheel", handleScroll)
    } else {
      window.removeEventListener("wheel", handleScroll)
    }

    return () => {
      window.removeEventListener("wheel", handleScroll)
    }
  }, [isEnabled])

  const scanForQRCode = async () => {
    try {
      if (!ref.current) return
      const { x, y } = ref.current.getBoundingClientRect()
      const canvas = await html2canvas(document.body, {
        x: x,
        y: y,
        width: boxSize,
        height: boxSize,
        scale: 1,
        ignoreElements: (element) => {
          return element.id === "follow-box-1"
        }
      })
      const context = canvas.getContext("2d")

      if (context) {
        const imageData = context.getImageData(0, 0, boxSize, boxSize)

        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (hasCapturedQbit && hasCapturedQbit === code.data) return

        if (code && code.data) {
          setHasCapturedQbit(code.data)

          window.postMessage(
            {
              type: "QR_CODE_DATA",
              data: code.data
            },
            "*"
          )
          setTimeout(() => {
            setHasCapturedQbit("")
          }, 2000)
          console.log("QR Code detected:", code.data)
        }
      }
    } catch (error) {
      console.error("Error scanning for QR code:", error)
    }
  }

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data
      if (data && data.type === "QBIT_SCAN_TOGGLE") {
        setIsEnabled(data.state)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useEffect(() => {
    if (!isEnabled) return
    if (hasCapturedQbit) return

    // Set up a timer to scan for QR codes every second
    const interval = setInterval(scanForQRCode, 1000)

    return () => clearInterval(interval)
  }, [position, isEnabled, boxSize, hasCapturedQbit])

  if (!isEnabled) return null

  return (
    <div className="plasmo-fixed plasmo-z-[99999999999] flex gap-4 plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-0 plasmo-pointer-events-none">
      <div
        className="plasmo-p-4 plasmo-absolute plasmo-transform plasmo--translate-x-1/2 plasmo--translate-y-1/2 plasmo-bg-transparent plasmo-rounded-md plasmo-shadow-[0_0_0_10000px_rgba(0,0,0,0.5)]"
        ref={ref}
        id="follow-box-1"
        style={{
          left: position.x || "50%",
          top: position.y || "50%",
          width: `${boxSize}px`,
          height: `${boxSize}px`
        }}>
        <div className="plasmo-relative plasmo-w-full plasmo-h-full plasmo-flex plasmo-items-center plasmo-justify-center">
          <SVG
            className="plasmo-absolute plasmo-top-0 plasmo-right-0"
            src={ScanAngle}
          />
          <SVG
            className="plasmo-absolute plasmo-top-0 plasmo-left-0 plasmo-rotate-[-0.25turn]"
            src={ScanAngle}
          />
          <SVG
            className="plasmo-absolute plasmo-bottom-0 plasmo-right-0 plasmo-rotate-[0.25turn]"
            src={ScanAngle}
          />
          <SVG
            className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-rotate-[0.50turn]"
            src={ScanAngle}
          />
          <motion.div
            id="follow-box-line"
            className="plasmo-w-full plasmo-h-1 plasmo-bg-green-500 plasmo-shadow-[0_4px_10px_rgba(0,255,0,0.6)] after:content-[''] after:plasmo-w-full after:plasmo-h-1 after:plasmo-bg-green-500 after:plasmo-absolute after:plasmo-bottom-0 after:plasmo-left-0 after:plasmo-shadow-[0_10px_20px_rgba(0,255,0,0.8)]"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeIn"
            }}
            style={{
              position: "absolute"
            }}
          />
          {/* <div
            id="follow-box-line"
            className="plasmo-w-full plasmo-h-1 plasmo-bg-green-500 plasmo-relative plasmo-shadow-[0_4px_10px_rgba(0,255,0,0.6)] after:content-[''] after:plasmo-w-full after:plasmo-h-1 after:plasmo-bg-green-500 after:plasmo-absolute after:plasmo-bottom-0 after:plasmo-left-0 after:plasmo-shadow-[0_10px_20px_rgba(0,255,0,0.8)]"></div> */}
        </div>
      </div>
    </div>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<PlasmoOverlay />)
}

export default PlasmoOverlay
