import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ServerSocketService } from '../../services/server-socket-service';

@Component({
  selector: 'app-lobby',
  standalone: true,
  templateUrl: './lobby.html',
  styleUrls: ['./lobby.css'],
})
export class Lobby {
  private router = inject(Router);
  private serverSocket = inject(ServerSocketService);

  waitingMessage = signal('Connecting to the game server...');
  opponentConnected = signal(false);

  constructor() {
    this.initLobby();
  }

  private async initLobby() {
    try {
      this.waitingMessage.set('Connecting to the game server...');

      await this.serverSocket.connect();
      this.waitingMessage.set('Opponent connected. Starting game...');
      this.opponentConnected.set(true);

      console.log('Ready to start game');

      setTimeout(() => this.router.navigate(['/game']), 1000);
    } catch (err: any) {
      console.error('Lobby connection failed:', err);
      this.waitingMessage.set('Failed to connect: ' + err);
    }
  }
}
