import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class SqlStorage {
    constructor(private sqlLite: SQLite) {}

    getAll() {
        this.sqlLite.create({
            name: 'data',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('SELECT key, value FROM kv', []).then(data => {
                let results = [];
                for (let i = 0; i < data.rows.length; i++) {
                    results.push(JSON.parse(data.rows.item(i).value));
                }
                return results;
            });
        });

        return null;
    }

    get(key: string) {
        this.sqlLite.create({
            name: 'data',
            location: 'default'
        }).then((db: SQLiteObject) => {
            return db.executeSql('SELECT key, value FROM kv WHERE key = ? limit 1', [key]).then(data => {
                if (data.rows.length > 0) {
                    return JSON.parse(data.rows.item(0).value);
                }
            });
        });

        return null;
    }

    remove(key: string) {
        this.sqlLite.create({
            name: 'data',
            location: 'default'
        }).then((db: SQLiteObject) => {
            return db.executeSql('DELETE FROM kv WHERE key = ?', [key]);
        });

        return null;
    }

    set(key: string, value: string) {
        this.sqlLite.create({
            name: 'data',
            location: 'default'
        }).then((db: SQLiteObject) => {
            return db.executeSql('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)', [key, value]).then(data => {
                if (data.rows.length > 0) {
                    return JSON.parse(data.rows.item(0).value);
                }
            });
        });

        return null;
    }

    // Should be called after deviceready event is fired
    initializeDatabase() {
        this.sqlLite.create({
            name: 'data',
            location: 'default'
        }).then((db: SQLiteObject) => {
            return db.openDBs({ name: 'data.db', location: 'default' }).then((db) => {
                return db.executeSql('CREATE TABLE IF NOT EXISTS kv (key text primary key, value text', []).then(data => {
                    console.log('**after CREATE TABLE check', data);
                });
            });
        });
    }
}