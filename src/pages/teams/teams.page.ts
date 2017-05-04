import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { TeamHomePage } from '../pages';
import { EliteApi } from '../../shared/shared';

import * as _ from 'lodash';

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.page.html',
})
export class TeamsPage {
  private allTeams: any;
  private allTeamDivisions: any;
  teams = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private eliteApi: EliteApi, private loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    let selectedTournament = this.navParams.data;

    let loader = this.loadingController.create({
      content: 'Getting data...'
    });
    loader.present().then(() => {
      this.eliteApi.getTournamentData(selectedTournament.id).subscribe(data => {
        this.allTeams = data.teams;
        this.allTeamDivisions =
          _.chain(data.teams)
          .groupBy('division')
          .toPairs()
          .map(item => _.zipObject(['divisionName', 'divisionTeams'], item))
          .value();

        this.teams = this.allTeamDivisions;

        console.log('division teams', this.teams);
        loader.dismiss();
      });
    });
  }

  itemTapped($event, team) {
    this.navCtrl.push(TeamHomePage, team);
  }
}
