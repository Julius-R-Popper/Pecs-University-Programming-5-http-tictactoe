import { Injectable, signal } from '@angular/core';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  readonly roomRole = signal<'HOST' | 'GUEST' | null>(null);
  readonly gameAddress = signal<string | null>(null);
  readonly socketConnection = signal<Socket | null>(null);

  setRoomRole(role: 'HOST' | 'GUEST') {
    this.roomRole.set(role);
  }

  getRoomRole() {
    return this.roomRole();
  }

  setGameAddress(address: string) {
    this.gameAddress.set(address);
  }

  getGameAddress() {
    return this.gameAddress();
  }

  setSocketConnection(socket: Socket) {
    this.socketConnection.set(socket);
  }

  getSocketConnection() {
    return this.socketConnection();
  }

  clearAll() {
    this.roomRole.set(null);
    this.gameAddress.set(null);
    this.socketConnection.set(null);
  }
}
