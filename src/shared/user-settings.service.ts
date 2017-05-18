import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class UserSettings {
    constructor(public storage: Storage, private events: Events) {}

    favouriteTeam(team, tournamentId, tournamentName) {
        let item = { team: team, tournamentId: tournamentId, tournamentName: tournamentName };
        this.storage.set(team.id.toString(), JSON.stringify(item));
        this.events.publish('favourites:changed');
    }

    unfavouriteTeam(team) {
        this.storage.remove(team.id.toString());
        this.events.publish('favourites:changed');
    }

    isFavouriteTeam(teamId) {
        return this.storage.get(teamId.toString()).then(value => value ? true : false);
    }

    getAllFavourites() {
        return new Promise<any>(resolve => {
            let results = [];
            this.storage.forEach(data => {
                results.push(JSON.parse(data));
            });
            return resolve(results);
        });
    }

    initStorage() {
        return new Promise<any>(resolve => resolve());
    }
}