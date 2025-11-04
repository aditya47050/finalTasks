"use client"

import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Monitor, MonitorOff, Circle } from "lucide-react"
import NotificationToast from "./notification-toast"

export default function VideoConsultationRoom({
  localVideoRef,
  remoteVideoRef,
  connected,
  callStarted,
  micOn,
  camOn,
  isRecording,
  screenSharing,
  notifications,
  userRole,
  roomId,
  onStartCall,
  onToggleMic,
  onToggleCam,
  onLeaveCall,
  onStartRecording,
  onStopRecording,
  onToggleScreenShare,
  onSetUserRole,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HealthConsult</h1>
              <p className="text-xs text-gray-500">Room: {roomId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <select
                value={userRole}
                onChange={(e) => onSetUserRole(e.target.value)}
                className="bg-transparent text-sm font-semibold text-blue-600 border-none outline-none cursor-pointer"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {connected && (
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 fill-green-500 text-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-4 sm:p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
            {/* Remote Video (Main) */}
            <div className="lg:col-span-2 bg-black rounded-2xl overflow-hidden shadow-2xl relative group">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {!callStarted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white text-lg font-semibold">Waiting for connection...</p>
                  </div>
                </div>
              )}
              {screenSharing && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                  <Monitor className="w-3 h-3" />
                  Screen Sharing
                </div>
              )}
            </div>

            {/* Local Video (PiP) */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg relative">
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
                {userRole === "doctor" ? "👨‍⚕️ You (Doctor)" : "👤 You (Patient)"}
              </div>
              {!camOn && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col gap-4">
              {/* Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm text-gray-600">{micOn ? "Mic On" : "Mic Off"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${camOn ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm text-gray-600">{camOn ? "Camera On" : "Camera Off"}</span>
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full">
                      <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                      <span className="text-sm font-semibold text-red-600">Recording</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {/* Microphone */}
                <button
                  onClick={onToggleMic}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                    micOn ? "bg-blue-50 hover:bg-blue-100 text-blue-600" : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                  title={micOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  <span className="text-xs font-semibold">{micOn ? "Mute" : "Unmute"}</span>
                </button>

                {/* Camera */}
                <button
                  onClick={onToggleCam}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                    camOn ? "bg-blue-50 hover:bg-blue-100 text-blue-600" : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                  title={camOn ? "Turn off camera" : "Turn on camera"}
                >
                  {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  <span className="text-xs font-semibold">{camOn ? "Camera" : "Off"}</span>
                </button>

                {/* Screen Share */}
                <button
                  onClick={onToggleScreenShare}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                    screenSharing
                      ? "bg-purple-50 hover:bg-purple-100 text-purple-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                  }`}
                  title={screenSharing ? "Stop screen sharing" : "Share screen"}
                >
                  {screenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
                  <span className="text-xs font-semibold">{screenSharing ? "Stop" : "Share"}</span>
                </button>

                {/* Recording */}
                <button
                  onClick={isRecording ? onStopRecording : onStartRecording}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                    isRecording
                      ? "bg-red-50 hover:bg-red-100 text-red-600"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                  }`}
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Circle className={`w-6 h-6 ${isRecording ? "fill-current" : ""}`} />
                  <span className="text-xs font-semibold">{isRecording ? "Stop" : "Record"}</span>
                </button>

                {/* Start Call */}
                {!callStarted && (
                  <button
                    onClick={onStartCall}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-all duration-200"
                    title="Start call"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-xs font-semibold">Call</span>
                  </button>
                )}

                {/* End Call */}
                <button
                  onClick={onLeaveCall}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200"
                  title="End call"
                >
                  <PhoneOff className="w-6 h-6" />
                  <span className="text-xs font-semibold">End</span>
                </button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-gray-500 text-center mt-2">💾 Recordings are saved locally to your device</p>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50 pointer-events-none">
        {notifications.map((notification) => (
          <NotificationToast key={notification.id} message={notification.msg} />
        ))}
      </div>
    </div>
  )
}
