import http from 'http';
import SocketIO from 'socket.io';

interface IUser {
  username: string;
  datetime: Date;
}

interface IMessage {
  message: string;
  username: string;
  datetime: Date;
}

class WebSocketServer {
  public server: http.Server;
  public socketServer: SocketIO.Server;
  private _sockets: Set<SocketIO.Socket>;
  private _users: Map<SocketIO.Socket, IUser>;
  private _messages: IMessage[];

  constructor(server: http.Server) {
    this.server = server;
    this.socketServer = SocketIO(server);
    this._sockets = new Set();
    this._users = new Map();
    this._messages = [];
  }

  public init() {
    this.socketServer.on('connection', (socket) => {
      this._sockets.add(socket);
      socket.on('create-message', (message: string) => {
        const user = this._users.get(socket);
        if (!user) {
          throw new Error('user not found');
        }
        const username = user.username;
        this._messages.push({
          message,
          username,
          datetime: new Date(),
        });
        this.socketServer.emit('messages', this._messages);
      });
      socket.on('create-user', (username: string) => {
        this._users.set(socket, { username, datetime: new Date() });
        this.socketServer.emit('users', [...this._users.values()]);
      });
      socket.on('get-messages', () => {
        this.socketServer.emit('messages', this._messages);
      });
      socket.on('get-users', () => {
        this.socketServer.emit('users', [...this._users.values()]);
      });
      socket.on('disconnect', () => {
        this._users.delete(socket);
        this.socketServer.emit('users', [...this._users.values()]);
      });
    });
  }
}

export default WebSocketServer;
