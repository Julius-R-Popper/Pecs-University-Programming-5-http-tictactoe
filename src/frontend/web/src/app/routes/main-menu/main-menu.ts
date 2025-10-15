import {Component, signal} from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-main-menu',
  imports: [
    FormsModule
  ],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.css'
})
export class MainMenu {
  loading = signal(false);                  // loading indicator
  availableRooms = signal<any[]>([]);
  roomIdInput = '';
  roomIpInput = '';
  roomPortInput = '';

  inRoom = false;

  constructor(private state: StateService, private router: Router) {}

  async hostRoom() {
    try {
      const res = await fetch('http://localhost:4000/host', { method: 'POST' });
      const data = await res.json();

      console.log('Room hosted:', data);
      this.inRoom = true;
      this.state.setRoomRole('HOST');
      this.state.setGameAddress(`${data.roomIp}:${data.roomPort}`);

      await this.router.navigate(['/lobby']);
    } catch (err: any) {
      console.error('Error hosting room:', err.message);
    }
  }

  async searchRoom() {
    try {
      console.log('searchRoom() called');
      this.loading.set(true);
      this.availableRooms.set([]); // clear previous rooms

      const res = await fetch('http://localhost:4000/search', { method: 'GET' });
      const data = await res.json();

      console.log('Room search result:', data);

      this.availableRooms.set(data);
    } catch (err: any) {
      console.error('Error searching room:', err.message);
    } finally {
      this.loading.set(false);
    }
  }


  async joinRoomManually() {
    const roomId = this.roomIdInput?.trim();
    const roomIp = this.roomIpInput?.trim();
    const roomPort = this.roomPortInput;

    if (!roomId || !roomIp || !roomPort) {
      alert('All fields (Room ID, IP, Port) are required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          roomIp,
          roomPort: Number(roomPort),
        }),
      });

      const data = await res.json();

      console.log('Joined room:', data);
      this.inRoom = true;
      this.state.setRoomRole('GUEST');
      this.state.setGameAddress(`${data.roomIp}:${data.roomPort}`);

      // Navigate to game
      await this.router.navigate(['/lobby']);
    } catch (err: any) {
      console.error('Error joining room:', err.message);
    }
  }

}
