import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';

@Injectable()
export class UserSettings {
    constructor(public storage: Storage) {}

    favouriteTeam(team, tournamentId, tournamentName) {
        let item = { team: team, tournamentId: tournamentId, tournamentName: tournamentName };
        this.storage.set(team.id.toString(), JSON.stringify(item));
    }

    unfavouriteTeam(team) {
        this.storage.remove(team.id.toString());
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