import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ElectronService } from '../../providers/electron.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public speed = '';

  constructor(private router: Router, private electronService: ElectronService) {
    this.electronService.ipcRenderer.send('RequestRpm');

    this.electronService.ipcRenderer.on('SendRpm', (event, args) => {
      this.speed = args;
    })
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {
  }

}
