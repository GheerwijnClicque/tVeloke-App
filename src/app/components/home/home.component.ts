import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
var ipc = require('electron').ipcRenderer;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public speed = '';
  
  constructor(private router: Router) { 
    ipc.on('update', (event, args) => {
      console.log('Received update: ');
      console.log(args);
      this.speed = args['msg'];
    });
  }

  ngOnInit() {
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }
}
