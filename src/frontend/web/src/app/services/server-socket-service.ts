import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { StateService } from './state';

@Injectable({
  providedIn: 'root'
})
export class ServerSocketService {
  private socket: Socket | null = null;

  constructor(private state: StateService) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const role = this.state.getRoomRole();
      const gameAddress = this.state.getGameAddress();

      if (!role || !gameAddress) return reject('Missing role or game address');

      this.socket = io(`http://${gameAddress}`);
      this.state.setSocketConnection(this.socket);

      this.socket.emit('player-join', { role });

      this.socket.on('join-success', (data) => {
        console.log(`Successfully joined as ${data.role} (${data.id})`);
      });

      this.socket.on('game-start', (data) => {
        console.log(data.message);
        resolve();
      });

      this.socket.on('error-message', (err) => {
        console.error('Server error:', err.error);
        reject(err.error);
      });
    });
  }


}
