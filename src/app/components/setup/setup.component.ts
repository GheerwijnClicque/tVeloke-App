import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }
}
