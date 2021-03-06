import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { PlayersService } from '../../providers/players.service';
import { Player } from '../../player';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  public players: Array<Player> = [];
  private maxPlayers: number = 4;
  public selectedPlayers: number = 2;
  public characters: Array<string> = ["elephant", "pig", "chicken", "lion"];
  optionSelected: any;
  
  constructor(private router: Router, private playersService: PlayersService) { 
    
  }

  ngOnInit() {
    for (let i = 0; i < this.maxPlayers; i++) {
      this.players[i] = {
        player: i,
        name: 'Player ' + (i + 1),
        character: this.characters[i],
        progress: 0,
        wheel_radius: 22,
        rpm: 0,
      };
    }

    this.playersService.persist(this.players.slice(0, this.selectedPlayers));
  }

  public navigate(url: string) {
    this.router.navigate([url]);
  }

  public selectNumberOfPlayers(players: number) {
    this.selectedPlayers = players;
    this.playersService.persist(this.players.slice(0, this.selectedPlayers));
  }

  public getMaxPlayers() {
    return new Array(this.maxPlayers);
  }

  public getSelectedPlayers() {
    let players = this.players.slice(0, this.selectedPlayers);
    return players;
  }

  public updatePlayerCharacter(player: number, character: string) {
    this.players[player].character = character;
    this.playersService.persist(this.getSelectedPlayers());    
  }

  public updatePlayerName(event: any, player: number) {
    this.players[player].name = event.target.value;
    this.playersService.persist(this.getSelectedPlayers());
  }

  public getImgPath(character: string) {
    return "assets/characters/" + character + ".svg";
  }

  public onOptionsSelected(event, player){
    this.players[player].wheel_radius = event;
    this.playersService.persist(this.getSelectedPlayers());    
  }
 
  public scrollThroughCharacters(playerIndex: number, direction: boolean) {
    let player = this.players[playerIndex];
    let currentIndex = this.characters.indexOf(player.character);
console.log(currentIndex);
    if (direction) { // forward
      let nextIndex =  ((currentIndex++) > this.characters.length) ? 0 : currentIndex++;
      console.log('nextIndex: ' + currentIndex + 1);
      player.character = this.characters[nextIndex];
    }
    else { // backwards
      let prevIndex =  ((currentIndex--) < 0) ? currentIndex = this.characters.length : currentIndex--;
      console.log('prevIndex: ' + prevIndex);
      player.character = this.characters[prevIndex];
    }

    //this.playersService.persist(this.getSelectedPlayers());    
  }
}
