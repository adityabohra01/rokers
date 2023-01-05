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

-- Select all columns of most popular artist from the database based on play count from songs table and favourites
select artistName, artists.artistID, songCount, artistImage, artists.favourite, count(*) as playCount from artists join songArtists on artists.artistID = songArtists.artistID join songs on songArtists.sid = songs.sid order by playCount desc limit 1;
select artistName, count(*) as playCount from artists join songArtists on artists.artistID = songArtists.artistID join songs on songArtists.sid = songs.sid group by artistName order by playCount desc limit 1;