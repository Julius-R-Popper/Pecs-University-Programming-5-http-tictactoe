import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private roomRole: 'HOST' | 'GUEST' | null = null;
  private userIdentifierIp: string | null = null;
  private gameAddress: string | null = null;

  // Room Role
  getRoomRole(): 'HOST' | 'GUEST' | null {
    return this.roomRole;
  }

  setRoomRole(role: 'HOST' | 'GUEST') {
    this.roomRole = role;
  }

  // User Identifier IP
  getUserIdentifierIp(): string | null {
    return this.userIdentifierIp;
  }

  setUserIdentifierIp(ip: string) {
    this.userIdentifierIp = ip;
  }

  // Game Address
  getGameAddress(): string | null {
    return this.gameAddress;
  }

  setGameAddress(address: string) {
    this.gameAddress = address;
  }

  // Clear all state
  clearAll() {
    this.roomRole = null;
    this.userIdentifierIp = null;
    this.gameAddress = null;
  }
}
