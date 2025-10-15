import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-end-game',
  standalone: true,
  templateUrl: './end-game.html',
  styleUrls: ['./end-game.css'],
})
export class EndGame implements OnInit {
  private state = inject(StateService);
  private router = inject(Router);

  message = signal('Cleaning up game...');

  async ngOnInit() {
    await this.endGame();
  }

  private async endGame() {
    try {
      const socket = this.state.getSocketConnection();
      const role = this.state.getRoomRole();

      if (!socket) {
        console.warn('[GameComponent] No socket connection found.');
        this.state.clearAll();
        await this.router.navigate(['/']);
        return;
      }

      this.message.set('Disconnecting from game server...');


      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn('[GameComponent] No disconnect-success received, forcing cleanup.');
          resolve();
        }, 2000);

        socket.once('disconnect-success', () => {
          console.log('[GameComponent] Received disconnect-success from server.');
          clearTimeout(timeout);
          resolve();
        });

        socket.emit('player-disconnect');
      });

      socket.off();
      socket.disconnect();

      if (role === 'HOST') {
        this.message.set('Cleaning up backend room...');
        await this.cleanupBackendRoom();
      }

      this.state.clearAll();
      this.message.set('Redirecting to main menu...');
    } catch (err: any) {
      console.error('Error ending game:', err);
      this.message.set('Error ending game: ' + (err?.message ?? err));
    } finally {
      setTimeout(() => this.router.navigate(['/']), 2000);
    }
  }

  private async cleanupBackendRoom(): Promise<void> {
    const role = this.state.getRoomRole();

    try {
      if (role === 'GUEST') {
        const res = await fetch('http://localhost:4000/leave', { method: 'POST' });
        if (!res.ok) throw new Error(`Failed to leave room: ${res.status}`);
        console.log('Left the room successfully.');
      } else if (role === 'HOST') {
        const res = await fetch('http://localhost:4000/close', { method: 'POST' });
        if (!res.ok) throw new Error(`Failed to close room: ${res.status}`);
        console.log('Closed the room and stopped the game server.');
      } else {
        console.log('No valid role found — nothing to clean up on backend.');
      }
    } catch (err: any) {
      console.error('Error cleaning up backend room:', err.message);
      throw err;
    }
  }
}
