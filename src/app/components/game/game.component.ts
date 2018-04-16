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
  private distance: number = 5000;

  constructor(private router: Router, private electronService: ElectronService, private playersService: PlayersService) {
    this.winners = [];
    this.electronService.ipcRenderer.send('RequestRpm');

    this.electronService.ipcRenderer.on('SendRpm', (event, args) => {
      if (this.players && this.players[args.sensor - 1]) {
        this.players[args.sensor - 1].rpm = args.value;
        this.players[args.sensor - 1].progress = Math.min(100, this.players[args.sensor - 1].progress + args.value / this.distance);
      }

      // check if someone has won
      if (this.winners.length === 0) {
        this.winners = this.players.reduce((prev: any, next: any, index: number) => {
          if (this.playerHasWon(next.progress)) {
            prev.push(`Player ${index + 1} has won`);
          }
          return prev;
        }, []);

        if (this.winners.length > 0) {
          console.log(this.winners);
          this.showWinners();
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
    if (this.players.length <= 0) {
      this.navigate('/setup');
    }
  }

  private playerHasWon(progress) {
    return progress >= 100;
  }

  private showWinners() {
    let winners = this.winners;
    // Show div
  }

  public getKmh(player: Player) {
    let kmh = Math.round((player.wheel_radius * 0.0254) * player.rpm * 0.10472);
    return kmh;
  }
}
//https://stackoverflow.com/questions/17083580/i-want-to-do-animation-of-an-object-along-a-particular-path
// canvas - https://jsfiddle.net/epistemex/up85cm5a/
