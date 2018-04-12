import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ElectronService } from '../../providers/electron.service';
import { ReplaySubject } from 'rxjs';
import { PlayersService } from '../../providers/players.service';
import { Player } from '../../player';
import { setInterval } from 'timers';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public speed = '';
  public players: Array<Player> = [];
  public percent: number = 0.0;

  private interval: any;

  constructor(private router: Router, private electronService: ElectronService, private playersService: PlayersService) {
    this.electronService.ipcRenderer.send('RequestRpm');

    this.electronService.ipcRenderer.on('SendRpm', (event, args) => {
      console.log(args);
      //this.speed = args;
    })
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {
    this.players = this.playersService.getPlayers();
    console.log('players ' + this.players.length);
    if (this.players.length <= 0) {
      this.navigate('/setup');
    }

    this.interval = setInterval(() => {
        
        if (this.players.length > 0) {
          this.players[0].progress += 1;
          this.players[1].progress += 2;
        }

        this.percent += 1;    


        if (this.percent >= 100) {
          clearInterval(this.interval);
          return;
        }
    }, 100);
  }

  private updatePlayerProgress(playerId, progress) {
    console.log(playerId);
    this.players[playerId].progress += progress;
  }

  private playerHasWon(player) {
    return player.progress === 100;
  }
}
//https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path
// canvas - https://jsfiddle.net/epistemex/up85cm5a/