import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
var ipc = require('electron').ipcRenderer;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public speed = '';
  
  constructor(private router: Router) { 
    ipc.on('update', (event, args) => {
      console.log('Received update: ');
      console.log(args);
      this.speed = args['msg'];
    });
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }

  ngOnInit() {
  }

}
