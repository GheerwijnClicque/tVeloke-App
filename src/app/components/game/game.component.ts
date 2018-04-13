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
  public done: boolean = false;
  public winners: string[] = [];

  private interval: any;

  constructor(private router: Router, private electronService: ElectronService, private playersService: PlayersService) {
    this.winners = [];
    this.electronService.ipcRenderer.send('RequestRpm');

    this.electronService.ipcRenderer.on('SendRpm', (event, args) => {
      if (this.players && this.players[args.sensor - 1]) {
        this.players[args.sensor - 1].progress =Math.min(100, this.players[args.sensor - 1].progress + args.value / 1000);
      }

      // check if someone has won
      if (this.winners.length === 0) {
        this.winners = this.players.reduce((prev: any, next: any, index: number) => {
          if (next.progress >= 100) {
            prev.push(`Player ${index + 1} has wone`);
          }
          return prev;
        }, []);

        if (this.winners.length > 0) {
          console.log(this.winners);
        }
      }

    })
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {
    this.players = this.playersService.getPlayers();
    this.winners = [];
    // console.log('players ' + this.players.length);
    if (this.players.length <= 0) {
      this.navigate('/setup');
    }
  }

  private playerHasWon(player) {
    return player.progress === 100;
  }
}
//https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path
// canvas - https://jsfiddle.net/epistemex/up85cm5a/
