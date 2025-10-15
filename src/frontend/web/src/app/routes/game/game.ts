import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})
export class Game implements OnInit {
  private state = inject(StateService);
  private router = inject(Router);

  board = signal<(string | null)[]>(Array(9).fill(null));
  statusMessage = signal('Connecting to game server...');
  isMyTurn = signal(false);
  gameOver = signal(false);

  private role = this.state.getRoomRole();

  async ngOnInit() {
    try {
      // await this.gameSocket.connect();
      console.log('[GameComponent] Socket connect() resolved');
      this.initGameLoop();
    } catch (err: any) {
      console.error('[GameComponent] Failed to connect to game server:', err);
      this.statusMessage.set('Failed to connect: ' + err);
    }
  }


  initGameLoop() {
    let socket = this.state.getSocketConnection();

    if(!socket) {
      console.error('[GameSocketService] Missing socket');
      return;
    }

    if (this.role === 'HOST') {
      this.statusMessage.set('Your turn! Click a square to place your piece.');
      this.isMyTurn.set(true);
    } else {
      this.statusMessage.set('Waiting for opponent...');
      this.isMyTurn.set(false);
    }

    socket.on('move-success', async (gameStatus: any) => {
      console.log('[GameComponent] Received move-success:', gameStatus);

      this.board.set(gameStatus.board);

      if (gameStatus.isGameOver) {
        if (gameStatus.winner) {
          this.statusMessage.set(`Winner: ${gameStatus.winner}`);
        } else if (gameStatus.isDraw) {
          this.statusMessage.set('Draw!');
        } else {
          this.statusMessage.set('Game over!');
        }

        this.gameOver.set(true);

        setTimeout(() => {
          this.router.navigate(['/endGame']);
        }, 3000);

        return;
      }

      if (this.role === gameStatus.nextTurn) {
        this.statusMessage.set('Your turn! Click a square to place your piece.');
        this.isMyTurn.set(true);
      } else {
        this.statusMessage.set('Waiting for opponent...');
        this.isMyTurn.set(false);
      }
    });
  }

  makeMove(index: number) {
    if (!this.isMyTurn() || this.board()[index] !== null || this.gameOver()) return;

    this.state.getSocketConnection()!.emit('player-move', { move: index + 1 });
    this.isMyTurn.set(false);
    this.statusMessage.set('Waiting for opponent...');
  }

}
