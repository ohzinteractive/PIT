// import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

class Logger
{
  socket: any;
  
  constructor()
  {
    // this.socket = io('ws://10.0.0.31:3000');

    const self = this;
    this.socket.on('connect', () =>
    {
      console.log('CONNECTED TO WEBSOCKET CONSOLE');
      self.socket.send('####################################');
      self.socket.send('############# DONE #################');
      self.socket.send('####################################');
    });
  }

  log(msg: any)
  {
    if (this.socket)
    {
      this.socket.send(JSON.stringify(msg));
    }
    else
    {
      console.log(JSON.stringify(msg));
    }
  }
}

const logger = new Logger();
export { logger as Logger };
