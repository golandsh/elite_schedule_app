import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TeamHomePage, MapPage } from '../pages';
import { EliteApi } from '../../shared/shared';
declare var window: any;

@Component({
  selector: 'page-game',
  templateUrl: 'game.page.html',
})
export class GamePage {
  game: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private eliteApi: EliteApi) {
    
  }

  ionViewDidLoad() {
    this.game = this.navParams.data;
    this.game.gameTime = Date.parse(this.game.time);
  }

  teamTapped(teamId) {
    let tourneyData = this.eliteApi.getCurrentTourney();
    let team = tourneyData.teams.find(t => t.id === teamId);
    this.navCtrl.push(TeamHomePage, team);
  }

  goToDirections() {
    let tourneyData = this.eliteApi.getCurrentTourney();
    let location = tourneyData.locations[this.game.locationId];
    window.location = `geo:${location.latitude},${location.longitude};u=35`;
  }

  goToMap() {
    this.navCtrl.push(MapPage, this.game);
  }

  isWinner(score1, score2) {
    return Number(score1) > Number(score2) ? 'secondary' : '';
  }
}
