import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { TeamHomePage, TournamentsPage } from '../pages';
import { EliteApi, UserSettings } from '../../shared/shared';

@Component({
    selector: 'page-my-teams',
    templateUrl: './my-teams.page.html'
})
export class MyTeamsPage {
    favourites = [];
        /*{
            team: {id: 6182, name: 'HC Elite 7th', coach: 'Michelottie' },
            tournamentId: '89e13aa2-ba6d-4f55-9cc2-61eba6172c63',
            tournamentName: 'March Madness Tournament'
        },
        {
            team: {id: 805, name: 'HC Elite', coach: 'Michelottie' },
            tournamentId: '98c6857e-b0d1-4295-b89e-2d95a45437f2',
            tournamentName: 'Holiday Hoops Challenge'
        }
    ];*/

    constructor(
        private loadingController: LoadingController,
        private nav: NavController,
        private eliteApi: EliteApi,
        private userSettings: UserSettings){}

    goToTournaments() {
        this.nav.push(TournamentsPage);
    }

    favouriteTapped($event, favourite) {
        let loader = this.loadingController.create({
            content: 'Getting data...',
            dismissOnPageChange: true
        });
        loader.present();
        this.eliteApi.getTournamentData(favourite.tournamentId)
        .subscribe(t => this.nav.push(TeamHomePage, favourite.team));
    }

    ionViewDidEnter() {
        this.userSettings.getAllFavourites().then(favs => this.favourites = favs );
    }
}