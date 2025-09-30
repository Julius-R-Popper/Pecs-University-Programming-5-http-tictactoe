import { Routes } from '@angular/router';
import { MainMenu } from './routes/main-menu/main-menu';
import { Lobby } from './routes/lobby/lobby';
import { Game } from './routes/game/game';
import {EndGame} from './routes/end-game/end-game';

export const routes: Routes = [
  { path: "", component: MainMenu},
  { path: "lobby", component: Lobby},
  { path: "game", component: Game},
  { path: "endGame", component: EndGame}
];
