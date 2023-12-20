import { Server } from 'socket.io';

class SocketService {
  private _io: Server;

  // initialize socket server
  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      },
    });
  }

  public initListener() {
    const io = this._io;

    io.on('connect', (socket) => {
      socket.on('event:join', ({ roomId }: { roomId: string }) => {
        socket.join(roomId);

        // when admin emit question event then we have to broadcast the question to all clients who joined the room
        socket.on(
          'event:question',
          ({
            id,
            question,
            options,
          }: {
            id: string;
            question: string;
            options: string[];
          }) => {
            // broadcast
            socket.broadcast
              .to(roomId)
              .emit(
                'event:question',
                JSON.stringify({ id, question, options })
              );
          }
        );
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
