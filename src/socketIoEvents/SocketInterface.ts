import { Socket } from "socket.io";
export default interface SocketInterface extends Socket {
    role: string
}