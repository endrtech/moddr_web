import { io, Socket } from "socket.io-client";

// @ts-ignore
const globalAny = typeof global !== "undefined" ? global : window;

let socket: Socket;

if (process.env.NODE_ENV === "development") {
  if (!globalAny._moddrSocket) {
    globalAny._moddrSocket = io("https://ws.moddr.endr.com.au", {
      transports: ["websocket"],
      secure: true,
    });
  }
  socket = globalAny._moddrSocket;
} else {
  socket = io("https://ws.moddr.endr.com.au", {
    transports: ["websocket"],
    secure: true,
  });
}

export default socket; 
