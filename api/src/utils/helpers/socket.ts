import { Server, Socket } from 'socket.io'

export default class SocketHelper {
  private static instance: SocketHelper
  public socket: Server

  private constructor() {
    this.socket = new Server(3000, {})

    this.socket.on('connection', () => console.log('Connection!'))
  }

  public static getInstance(): SocketHelper {
    if (!SocketHelper.instance) {
      SocketHelper.instance = new SocketHelper()
    }

    return SocketHelper.instance
  }

  public getServer(): Server {
    return this.socket
  }
}
