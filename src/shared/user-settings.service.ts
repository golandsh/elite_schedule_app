import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, Platform } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { SqlStorage } from './shared';

@Injectable()
export class UserSettings {
    public db: SQLite;
    public sql: SqlStorage;
    constructor(public storage: Storage, private events: Events, private platform: Platform) {
        if (this.platform.is('cordova')) {
            this.db = new SQLite();
            this.sql = new SqlStorage(this.db);
        } else {
            console.warn('SQLite plugin not installed. Falling back to regular Ionic Storage.');
        }
    }

    favouriteTeam(team, tournamentId, tournamentName) {
        let item = { team: team, tournamentId: tournamentId, tournamentName: tournamentName };

        if (this.sql) {
            this.sql.set(team.id.toString(), JSON.stringify(item)).then(data => {
                if (data) this.events.publish('favourites:changed');
            })
        } else {
            return new Promise(resolve => {
                this.storage.set(team.id.toString(), JSON.stringify(item)).then(() => {
                    this.events.publish('favourites:changed');
                    resolve();
                });
            });
        }
    }

    unfavouriteTeam(team) {
        if (this.sql){
            this.sql.remove(team.id.toString()).then(data => {
                this.events.publish('favorites:changed');
            });
        } else {
            return new Promise(resolve => {
                this.storage.remove(team.id.toString()).then(() => {
                    this.events.publish('favorites:changed');
                    resolve();
                });
            });
        }
    }

    isFavouriteTeam(teamId) {
        if (this.sql){
            return this.sql.get(teamId.toString()).then(value => value ? true : false);
        } else {
            return new Promise(resolve => resolve(this.storage.get(teamId.toString()).then(value => value ? true : false)));
        }
    }

    getAllFavourites() {
        if (this.sql){
            return this.sql.getAll();
        } else {
            return new Promise(resolve => {
                let results = [];
                this.storage.forEach(data => {
                    results.push(JSON.parse(data));
                });
                return resolve(results);
            });
        }
    }

    initStorage() {
        if (this.sql){
            return this.sql.initializeDatabase();
        } else {
            return new Promise(resolve => resolve());
        }
    }
}