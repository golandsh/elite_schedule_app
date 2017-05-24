import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class SqlStorage {
    DB_NAME: string = 'data.db';

    constructor(public platform: Platform, private sqlite: SQLite) {
        this.platform.ready().then(() => {
            this.initializeDatabase();
        });
    }

    query(query: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.sqlite.create({
                    name: this.DB_NAME,
                    location: 'default'
                })
                    .then((db: SQLiteObject) => {
                        db.transaction((tx: any) => {
                            tx.executeSql(query, params,
                                (tx: any, res: any) => resolve({ tx: tx, res: res }),
                                (tx: any, err: any) => reject({ tx: tx, err: err }));
                        })
                    })
                    .catch(e => console.log(e));
            } catch (err) {
                reject({ err: err });
            }
        });
    }

    // Should be called after deviceready event is fired
    initializeDatabase() {
        this.query('CREATE TABLE IF NOT EXISTS elite_app (key text primary key, value text)')
        .catch(err => console.error('Unable to create initial storage tables', err.tx, err.err));
    }

    getAll(): Promise<any> {
        return this.query('SELECT key, value FROM kv')
        .then(data => {
            let results = [];
            if (data.res.rows.length > 0) {
                for (let i = 0; i < data.res.rows.length; i++) {
                    results.push(JSON.parse(data.res.rows.item(i).value));
                }

                return results;
            }
            return null;
        });
    }

    get(key: string): Promise<any> {
        return this.query('SELECT key, value FROM kv WHERE key = ? limit 1', [key])
        .then(data => {
            if (data.res.rows.length > 0) {
                return JSON.parse(data.res.rows.item(0).value);
            }
        });
    }

    remove(key: string): Promise<any> {
        return this.query('DELETE FROM kv WHERE key = ?', [key]);
    }

    set(key: string, value: string): Promise<any> {
        return this.query('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)', [key, value]);
    }
}