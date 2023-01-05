import mysql from 'mysql';
/**
create database rokers;
use rokers;

create table artists (
	artistID varchar(50) primary key,
    artistName varchar(100) not null,
    artistImage varchar(1024) null,
    songCount integer default 0,
    favourite boolean default false
);

create table albums (
	albumID varchar(50) primary key,
    albumName varchar(100) not null,
    albumImage varchar(1024) null,
    songCount integer default 0,
    favourite boolean default false
);

create table playlists (
	pid varchar(50) primary key,
    playlistName varchar(100) not null,
    favourite boolean default false,
    songCount integer default 0,
    playCount integer default 0,
    spotify boolean default false
);

create table songs (
	sid varchar(50) primary key,
    vid varchar(50) null,
    name varchar(100) not null,
    albumID varchar(50)references albums(albumID),
    lastPlayed timestamp,
    albumArt varchar(1024) null,
    length integer not null,
    playCount integer default 0,
    pid varchar(50) null references playlists(pid),
    favourite boolean default false
);

create table songArtists (
	sid varchar(50) not null,
    artistID varchar(50) not null,
    primary key(sid, artistID),
    foreign key(sid) references songs(sid),
    foreign key(artistID) references artists(artistID)
);
    */

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "rokers",
    port: 3306,
    multipleStatements: true,
    insecureAuth: true,
})

const properties = {
    songs : [],
    artists : [],
    albums : [],
    playlists : [],
    songArtists : [],
}

Object.getOwnPropertyNames(properties).forEach(table => {
    connection.query(`DESCRIBE ${table}`, (err, result) => {
        if (err) throw err;
        properties[table] = result.map(item => item.Field);
    })
})

function isPropertyInTable (table, property) {
    return properties[table].includes(property);
}

/**
 * 
 * @param {string} table 
 * @param {object} data 
 */
function insert (table, data) {
    return new Promise((resolve, reject) => {
        // prepare insert query string from key value pairs
        let query = `INSERT INTO ${table} `;
        let keys = []
        let values = []
        let datas = []
        Object.getOwnPropertyNames(data).map(key => {
            if (isPropertyInTable(table, key)) {
                keys.push(key);
                values.push('?');
                datas.push(data[key]);
            }
        })
        query += `(${keys.join(', ')}) VALUES (${values.join(', ')});`;
        connection.query(query, datas,(err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function query (query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err ,result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}


export {insert, connection, query}