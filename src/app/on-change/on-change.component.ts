import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  templateUrl: './on-change.component.html',
  styleUrls: ['./on-change.component.scss'],
  selector: "on-change",
  inputs: [
      "percent",
      "color"
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnChangeComponent implements OnInit {
  public color: string;
  public dashArray: string;
  public percent: number;
  public y: number;

  public xTestPos: number = 100;
  public xy: any = {x: 0, y: 0};
  public xFirst: number = 600;

  @ViewChild('line1')
  line1: ElementRef;

  constructor() {
    this.color = "currentColor"; // Will inherit the current color context.
    this.dashArray = "0,100";
    this.percent = 0;
    this.y = 0;
  }

  ngOnInit() {
    console.log('width: ' );
    console.log(this.line1.nativeElement.offsetWidth);
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

      console.log(this.percent);

      this.dashArray = `${ pathLength },100`;
      
      var xy;
      console.log(this.xy);

      var percent = this.percent;
      console.log('first');
      xy = this.getLineXYatPercent({x: 0, y: 0}, {x: 1493, y: 0}, percent);            

      this.xy = xy;
      console.log('xy: ');
      console.log(xy);
  }

  private getLineXYatPercent(startPt,endPt,percent) {
      var dx = endPt.x-startPt.x;
      var dy = endPt.y-startPt.y;
      var X = (startPt.x + dx*percent) / 100;
      var Y = (startPt.y + dy*percent) / 100;
      return( {x:X,y:Y} );
  }

}
