import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-end-game',
  standalone: true,
  templateUrl: './end-game.html',
  styleUrls: ['./end-game.css'],
})
export class EndGame {
  private state = inject(StateService);
  private router = inject(Router);

  message = signal('Cleaning up game...');

  async ngOnInit() {
    await this.endGame();
  }

  private async endGame() {
    try {
      await this.endGameServer();
    } catch (err: any) {
      console.error('Error ending game:', err.message);
      this.message.set('Error ending game: ' + err.message);
    } finally {
      this.clearGameData();
      this.message.set('Redirecting to main menu...');
      setTimeout(() => this.router.navigate(['/']), 2000);
    }
  }

  private async endGameServer() {
    const role = this.state.getRoomRole();

    try {
      if (role === 'GUEST') {
        const res = await fetch('http://localhost:4000/leave', { method: 'POST' });
        if (!res.ok) throw new Error(`Failed to leave room: ${res.status}`);
        console.log('You left the room successfully.');
      } else if (role === 'HOST') {
        const res = await fetch('http://localhost:4000/close', { method: 'POST' });
        if (!res.ok) throw new Error(`Failed to close room: ${res.status}`);
        console.log('You closed the room and stopped the game server.');
      } else {
        console.log('No valid role found — nothing to end.');
      }
    } catch (err: any) {
      console.error('Error ending game:', err.message);
      throw err;
    }
  }

  private clearGameData() {
    try {
      this.state.clearAll();
      console.log('Local game data cleared.');
    } catch (err: any) {
      console.error('Error clearing game data:', err.message);
    }
  }
}
