import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from 'app/player';

@Component({
  templateUrl: './on-change.component.html',
  styleUrls: ['./on-change.component.scss'],
  selector: "on-change",
  inputs: [
      "percent",
      "color",
      "player"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnChangeComponent implements OnInit {
  public color: string;
  public dashArray: string;
  public percent: number;
  public y: number;
  public player: Player;

  public xTestPos: number = 100;
  public xy: any = {x: 0, y: 0};
  public xFirst: number = 600;

  public containerWidth: number = 0;

  @ViewChild('container')
  container: ElementRef;

  constructor() {
    this.color = "currentColor"; // Will inherit the current color context.
    this.dashArray = "0,100";
    this.percent = 0;
    this.y = 0;
  }

  ngOnInit() {
    this.containerWidth = this.container.nativeElement.offsetWidth;
      console.log(this.player);
    console.log('width: ' );
     console.log(this.containerWidth);
  }

  public ngOnChanges( changes: SimpleChanges ) : void {
      // Validate and constrain the percentage.
      if ( isNaN( this.percent ) || ( this.percent < 0 ) ) {
          this.percent = 0;
      } else if ( this.percent > 100 ) {
          this.percent = 100;
      }

      var radius = 9;
      //var totalLength = ( Math.PI * 2 * radius );
      var totalLength = 1000;
      var pathLength = ( totalLength * this.percent / 100 );

      // console.log(this.percent);

      this.dashArray = `${ pathLength },100`;

      var xy;
      // console.log(this.xy);

      var percent = this.percent;
      // console.log('first');
      xy = this.getLineXYatPercent({x: 0, y: 0}, {x: this.containerWidth, y: 0}, percent);

      this.xy = xy;
  }

  private getLineXYatPercent(startPt,endPt,percent) {
      var dx = endPt.x-startPt.x;
      var dy = endPt.y-startPt.y;
      var X = (startPt.x + dx*percent) / 100;
      var Y = (startPt.y + dy*percent) / 100;
      return( {x:X,y:Y} );
  }
  public getImgPath(character) {
      return "assets/characters/" + character + ".svg";
  }
}
