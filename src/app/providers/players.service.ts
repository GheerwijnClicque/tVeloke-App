import { Injectable } from '@angular/core';
import { Player } from '../player';

@Injectable()
export class PlayersService {
  public players: Array<Player> = [];

  constructor() {

  }

  public persist(players: Array<Player>) {
      this.players = players;
  }

  public getPlayers() {
    return this.players;
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }
}
