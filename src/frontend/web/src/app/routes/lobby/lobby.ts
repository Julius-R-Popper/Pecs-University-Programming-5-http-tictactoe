import {Component, inject, OnInit, signal} from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-lobby',
  standalone: true,
  templateUrl: './lobby.html',
  styleUrls: ['./lobby.css'],
  imports: [
    JsonPipe
  ]
})
export class Lobby implements OnInit {
  private state = inject(StateService);
  private router = inject(Router);

  // Reactive state for the template
  waitingMessage = signal('Connecting to the game server...');
  opponentConnected = signal(false);
  lobbyData = signal<any>(null);

  async ngOnInit() {
    await this.connectRoom();
  }

  private async connectRoom() {
    const type = this.state.getRoomRole();
    const ip = this.state.getUserIdentifierIp();
    const gameServerBase = `http://${this.state.getGameAddress()}`;
    let waitPrompt = true;

    try {
      // Initial registration with game server
      const connectRes = await fetch(`${gameServerBase}/session/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ip }),
      });

      if (!connectRes.ok) throw new Error(`Connection failed with status ${connectRes.status}`);

      console.log('Registered with game server');

      let isReady = false;

      while (!isReady) {
        const sessionRes = await fetch(`${gameServerBase}/session/isReady`);
        if (!sessionRes.ok) throw new Error(`Failed to get session status: ${sessionRes.status}`);

        const data = await sessionRes.json();
        this.lobbyData.set(data);

        if (data.isReady) {
          isReady = true;
        } else {
          if (waitPrompt) {
            this.waitingMessage.set('Waiting for opponent to join the game server...');
            waitPrompt = false;
          }
          // Wait 2 seconds before checking again
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Opponent connected
      this.waitingMessage.set('Opponent connected. Starting game...');
      this.opponentConnected.set(true);
      console.log('Opponent connected. Ready to start game:', this.lobbyData());

      // Navigate to game after short delay
      setTimeout(() => {
        this.router.navigate(['/game']);
      }, 1000);

    } catch (err: any) {
      console.error('Failed during room connection:', err.message);
      this.waitingMessage.set('Failed to connect: ' + err.message);
    }
  }
}
