"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import io from "socket.io-client"
import VideoConsultationRoom from "../components/videoconsultation-room"
let socket

export default function VideoConsultationPage() {
  const { roomId } = useParams()
  const localVideo = useRef(null)
  const remoteVideo = useRef(null)
  const pcRef = useRef(null)
  const localStreamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  const [connected, setConnected] = useState(false)
  const [callStarted, setCallStarted] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [userRole, setUserRole] = useState("patient") // 'doctor' or 'patient'

  useEffect(() => {
    if (!roomId) return

    socket = io(process.env.NEXT_PUBLIC_SIGNALING_URL)

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })
        localStreamRef.current = stream
        if (localVideo.current) localVideo.current.srcObject = stream

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        })
        pcRef.current = pc

        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        pc.ontrack = (event) => {
          if (remoteVideo.current) remoteVideo.current.srcObject = event.streams[0]
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("signal", {
              roomId,
              data: { type: "candidate", candidate: event.candidate },
            })
          }
        }

        socket.emit("join-room", { roomId, userId: "user-" + Math.random() })
        addNotification("Connected to consultation room")

        socket.on("signal", async (data) => {
          if (!data) return
          const pc = pcRef.current
          if (!pc) return

          if (data.type === "offer") {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            socket.emit("signal", {
              roomId,
              data: { type: "answer", sdp: pc.localDescription },
            })
            setCallStarted(true)
            addNotification("Call connected")
          } else if (data.type === "answer") {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
            setCallStarted(true)
            addNotification("Call connected")
          } else if (data.type === "candidate") {
            await pc.addIceCandidate(data.candidate)
          } else if (data.type === "user-left") {
            addNotification("Other user left the call")
          } else if (data.type === "user-joined") {
            addNotification("User joined the call")
          }
        })

        setConnected(true)
      } catch (error) {
        addNotification("Error accessing camera/microphone")
        console.error("Error:", error)
      }
    }

    start()

    return () => leaveCall()
  }, [roomId])

  const addNotification = (msg) => {
    setNotifications((prev) => [...prev, { id: Date.now(), msg }])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
    }, 5000)
  }

  const startCall = async () => {
    const pc = pcRef.current
    if (!pc) return

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit("signal", {
      roomId,
      data: { type: "offer", sdp: pc.localDescription },
    })

    setCallStarted(true)
    addNotification("Initiating call...")
  }

  const leaveCall = () => {
    if (isRecording) {
      stopRecording()
    }

    if (socket) {
      socket.emit("signal", { type: "user-left" })
      socket.disconnect()
    }

    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    setConnected(false)
    setCallStarted(false)
    addNotification("Call ended")
  }

  const toggleMic = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
    setMicOn(!micOn)
    addNotification(micOn ? "Microphone muted" : "Microphone unmuted")
  }

  const toggleCam = () => {
    if (!localStreamRef.current) return
    localStreamRef.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
    setCamOn(!camOn)
    addNotification(camOn ? "Camera turned off" : "Camera turned on")
  }

  const startRecording = () => {
    if (!localStreamRef.current || !remoteVideo.current?.srcObject) {
      addNotification("Cannot start recording - no active streams")
      return
    }

    recordedChunksRef.current = []

    const canvas = document.createElement("canvas")
    canvas.width = 1280
    canvas.height = 720
    const ctx = canvas.getContext("2d")

    const localVideoElement = localVideo.current
    const remoteVideoElement = remoteVideo.current

    const drawFrame = () => {
      // Draw remote video (main)
      if (remoteVideoElement?.readyState === remoteVideoElement?.HAVE_ENOUGH_DATA) {
        ctx.drawImage(remoteVideoElement, 0, 0, 960, 720)
      }

      // Draw local video (PiP)
      if (localVideoElement?.readyState === localVideoElement?.HAVE_ENOUGH_DATA) {
        ctx.drawImage(localVideoElement, 960, 480, 320, 240)
      }

      requestAnimationFrame(drawFrame)
    }

    drawFrame()

    const canvasStream = canvas.captureStream(30)
    const audioTracks = localStreamRef.current.getAudioTracks()
    if (audioTracks.length > 0) {
      canvasStream.addTrack(audioTracks[0])
    }

    const mediaRecorder = new MediaRecorder(canvasStream, {
      mimeType: "video/webm;codecs=vp9",
    })

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `consultation-${new Date().getTime()}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addNotification("Recording saved")
    }

    mediaRecorder.start()
    mediaRecorderRef.current = mediaRecorder
    setIsRecording(true)
    addNotification("Recording started")
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      setIsRecording(false)
      addNotification("Recording stopped")
    }
  }

  const toggleScreenShare = async () => {
    if (screenSharing) {
      // Stop screen sharing
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop())
      }

      // Resume camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })
        localStreamRef.current = stream
        if (localVideo.current) localVideo.current.srcObject = stream

        const pc = pcRef.current
        if (pc) {
          const videoTrack = stream.getVideoTracks()[0]
          const sender = pc.getSenders().find((s) => s.track?.kind === "video")
          if (sender) {
            await sender.replaceTrack(videoTrack)
          }
        }
      } catch (error) {
        addNotification("Error resuming camera")
      }

      setScreenSharing(false)
      addNotification("Screen sharing stopped")
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false,
        })

        const screenTrack = screenStream.getVideoTracks()[0]
        const pc = pcRef.current

        if (pc) {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video")
          if (sender) {
            await sender.replaceTrack(screenTrack)
          }
        }

        screenTrack.onended = () => {
          toggleScreenShare()
        }

        setScreenSharing(true)
        addNotification("Screen sharing started")
      } catch (error) {
        addNotification("Screen sharing cancelled")
      }
    }
  }

  return (
    <VideoConsultationRoom
      localVideoRef={localVideo}
      remoteVideoRef={remoteVideo}
      connected={connected}
      callStarted={callStarted}
      micOn={micOn}
      camOn={camOn}
      isRecording={isRecording}
      screenSharing={screenSharing}
      notifications={notifications}
      userRole={userRole}
      roomId={roomId}
      onStartCall={startCall}
      onToggleMic={toggleMic}
      onToggleCam={toggleCam}
      onLeaveCall={leaveCall}
      onStartRecording={startRecording}
      onStopRecording={stopRecording}
      onToggleScreenShare={toggleScreenShare}
      onSetUserRole={setUserRole}
    />
  )
}
