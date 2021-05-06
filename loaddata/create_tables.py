sql_Movies = 'drop table if exists Movies cascade;\
    create table Movies (\
	MovieId integer,\
	language text,\
	title text,\
	releaseDate date,\
	popularity float,\
	duration float,\
	avgRating float,\
    primary key (MovieId)\
	) ;\
    create index MovieId on Movies (MovieId);'

sql_Users = 'drop table if exists Users cascade;\
    create table Users (\
    username text,\
    name text,\
    password text,\
    email_id text unique,\
    last_watched integer,\
    login boolean,\
    language_pref1 text,\
    language_pref2 text,\
    admin boolean,\
    primary key (username),\
    foreign key (last_watched) references Movies(movieId)\
    on delete set null\
    ) ;\
    create index username on Users (username);'

sql_Genre = 'drop table if exists Genre cascade;\
    create table Genre (\
    GenreId integer,\
    GenreName text,\
    primary key (GenreId)\
    );'

sql_Actor = 'drop table if exists Actor cascade;\
    create table Actor (\
    Id integer,\
    Name text,\
    primary key (Id)\
    );'

sql_Director = 'drop table if exists Director cascade;\
    create table Director (\
    Id integer,\
    Name text,\
    primary key (Id)\
    );'

sql_Rating = 'drop table if exists Rating cascade;\
    create table Rating (\
    MovieId integer,\
    username text,\
    Num_Rating float not NULL check (Num_Rating >= 0 and Num_Rating <= 5),\
    Verbal_Rating text,\
    primary key (MovieId, username),\
    foreign key (MovieId) references Movies (MovieId),\
    foreign key (username) references Users (username)\
    );'

sql_Movie_Genre = 'drop table if exists Movie_Genre cascade;\
    create table Movie_Genre (\
    MovieId integer,\
    GenreId integer,\
    primary key (MovieId, GenreId),\
    foreign key (MovieId) references Movies (MovieId),\
    foreign key (GenreId) references Genre (GenreId)\
    );'

sql_User_Genre = 'drop table if exists user_Genre cascade;\
    create table User_Genre (\
    username text,\
    GenreId integer,\
    primary key (username, GenreId),\
    foreign key (username) references Users (username),\
    foreign key (GenreId) references Genre (GenreId)\
    );'

sql_Movie_Director = 'drop table if exists Movie_Director cascade;\
    create table Movie_Director (\
    MovieId integer,\
    DirectorId integer,\
    primary key (MovieId, DirectorId),\
    foreign key (MovieId) references Movies (MovieId),\
    foreign key (DirectorId) references Director (Id)\
    );'

sql_Movie_Actor = 'drop table if exists Movie_Actor cascade;\
    create table Movie_Actor (\
    MovieId integer,\
    ActorId integer,\
    primary key (MovieId, ActorId),\
    foreign key (MovieId) references Movies (MovieId),\
    foreign key (ActorId) references Actor (Id)\
    );'

sql_Friends = 'drop table if exists Friends cascade;\
    create table Friends (\
    username1 text,\
    username2 text,\
    primary key (username1, username2),\
    foreign key (username1) references Users (username),\
    foreign key (username2) references Users (username)\
    );'