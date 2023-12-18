import { Server } from 'socket.io';

class SocketService {
  private _io: Server;

  // Initialize socket server
  constructor() {
    console.log('Initializing server...');
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: '*',
      },
    });
  }

  public initListener() {
    const io = this._io;

    console.log('Initialize socket listener...');

    io.on('connect', (socket) => {
      console.log('New socket connected: ', socket.id);

      socket.on('event:join', ({ roomId }: { roomId: string }) => {
        console.log('New user joined the room: ', roomId);
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
