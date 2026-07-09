import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Connects once per session using the current access token. Safe to call
 * multiple times — returns the existing connection if already open.
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "";

  socket = io(socketUrl, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}