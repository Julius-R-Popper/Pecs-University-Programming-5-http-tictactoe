import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})
export class Game {
  private state = inject(StateService);
  private router = inject(Router);

  board = signal<(string | null)[]>(Array(9).fill(null));
  statusMessage = signal('Loading game...');
  isMyTurn = signal(false);
  gameOver = signal(false);

  private role = this.state.getRoomRole();
  private ip = this.state.getUserIdentifierIp();

  async ngOnInit() {
    await this.gameLoop();
  }

  private sleep(ms = 2000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchBoard() {
    const res = await fetch(`http://${this.state.getGameAddress()}/actions/board`);
    const data = await res.json();
    this.board.set(data.board);
  }

  private async checkGameStatus() {
    const res = await fetch(`http://${this.state.getGameAddress()}/actions/status`);
    const { status } = await res.json();
    return status;
  }

  private async getTurn() {
    const res = await fetch(`http://${this.state.getGameAddress()}/actions/turn`);
    const { turn } = await res.json();
    return turn;
  }

  async makeMove(index: number) {
    if (!this.isMyTurn() || this.board()[index] !== null || this.gameOver()) return;

    try {
      await fetch(`http://${this.state.getGameAddress()}/actions/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ move: index + 1, ip: this.ip }),
      });
      await this.fetchBoard();
      this.statusMessage.set('Move sent. Waiting for opponent...');
      this.isMyTurn.set(false);
    } catch (err: any) {
      this.statusMessage.set('Error making move: ' + err.message);
    }
  }

  private async gameLoop() {
    let waitPrompt = true;

    while (!this.gameOver()) {
      try {
        const turn = await this.getTurn();

        const over = await this.checkGameStatus();
        if (over) {
          await this.fetchBoard();
          this.statusMessage.set('Game over!');
          this.gameOver.set(true);

          // Redirect to /endGame after short delay
          setTimeout(() => {
            this.router.navigate(['/endGame']);
          }, 3000);

          break;
        }

        await this.fetchBoard();

        if (turn === this.role) {
          this.statusMessage.set('Your turn! Click a square to place your piece.');
          this.isMyTurn.set(true);
          waitPrompt = true;
          while (this.isMyTurn()) {
            await this.sleep(500);
          }
        } else {
          if (waitPrompt) {
            this.statusMessage.set('Waiting for opponent...');
            waitPrompt = false;
          }
          await this.sleep(2000);
        }
      } catch (err: any) {
        console.error('Error during game loop:', err.message);
        this.statusMessage.set('Error: ' + err.message);
        await this.sleep(2000);
      }
    }
  }
}
