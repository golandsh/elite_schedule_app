import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TeamsPage } from '../pages'

/**
 * Generated class for the Tournaments page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-tournaments',
  templateUrl: 'tournaments.page.html',
})
export class TournamentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Tournaments');
  }

  itemTapped() {
    this.navCtrl.push(TeamsPage);
  }
}
