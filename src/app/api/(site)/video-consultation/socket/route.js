import { Server } from "socket.io";

let io;

export const GET = (req) => new Response("Socket server running"); // Optional health check

export const POST = async (req) => {
  if (!io) {
    // Create new Socket.IO server
    const { Server: IOServer } = await import("socket.io");
    io = new IOServer({
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("user connected");

      socket.on("join-room", ({ roomId, userId }) => {
        socket.join(roomId);
        socket.to(roomId).emit("signal", { type: "new-user", userId });

        socket.on("signal", (data) => {
          socket.to(roomId).emit("signal", data);
        });
      });

      socket.on("disconnect", () => console.log("user disconnected"));
    });
  }

  return new Response("Socket initialized");
};
