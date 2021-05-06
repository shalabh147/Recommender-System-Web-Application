import pandas as pd
import csv

def filter_genre(s):
    bad_chars = ["[", "]", "{", "}", ",", ":"]
    l = "".join(i for i in s if not i in bad_chars).split("'")
    genres = []
    for i in range(len(l)):
        if l[i] == "name":
            genres.append(l[i+2])
    return genres

genre_dict = {}
cnt = 0

df = pd.read_csv('ratings_small.csv')
res = df.groupby('movieId')['rating'].mean()

with open('movies_metadata.csv', 'r') as file:
    csvFile = csv.reader(file)
    lines = list(csvFile)
    header = ['movieId', 'language', 'title', 'releaseDate', 'popularity', 'duration', 'avgRating']
    id_in = lines[0].index('id')
    language_in = lines[0].index('original_language')
    title_in = lines[0].index('title')
    release_in = lines[0].index('release_date')
    popularity_in = lines[0].index('popularity')
    duration_in = lines[0].index('runtime')
    genres_in = lines[0].index('genres')
    lines_final = []
    ids = set()

    with open('Movie_Genre.csv', 'w') as wfile:
        print("Creating Movie_Genre.csv")
        csvwriter = csv.writer(wfile)
        csvwriter.writerow(["MovieId","GenreId"])
        for i in range(1,len(lines)):
            if len(lines[i]) != len(lines[0]):
                continue
            if lines[i][id_in] in ids:
                continue
            ids.add(lines[i][id_in])
            avg_r = ''
            if int(lines[i][id_in]) in res:
                avg_r = res[int(lines[i][id_in])]
            lines_final.append([int(lines[i][id_in]), 
                        lines[i][language_in], 
                        lines[i][title_in], 
                        lines[i][release_in], 
                        lines[i][popularity_in], 
                        lines[i][duration_in],
                        avg_r])
            for w in filter_genre(lines[i][genres_in]):
                if not w in genre_dict.keys():
                    cnt += 1
                    genre_dict[w] = cnt
                csvwriter.writerow([lines[i][id_in], genre_dict[w]])

    with open('movie.csv', 'w') as wfile:
        print("Creating movie.csv")
        csvwriter = csv.writer(wfile)
        csvwriter.writerow(header)
        csvwriter.writerows(lines_final)


with open('genres.csv', 'w') as wfile:
    print("Creating genres.csv")
    csvwriter = csv.writer(wfile)
    csvwriter.writerow(["GenreId","GenreName"])
    for g in genre_dict:
        csvwriter.writerow([genre_dict[g],g])

with open('ratings_small.csv', 'r') as file:
    csvFile = csv.reader(file)
    lines = list(csvFile)
    header = ['MovieId', 'Username', 'Num_Rating', 'Verbal_Rating']
    with open('rating.csv', 'w') as wfile:
        print("Creating rating.csv")
        csvwriter = csv.writer(wfile)
        csvwriter.writerow(header)
        lines_final = []
        for i in range(1,len(lines)):
            if lines[i][1] in ids:
                lines_final.append([lines[i][1], "user"+str(lines[i][0]), lines[i][2], ''])
        csvwriter.writerows(lines_final)


def filter_actor(s):
    bad_chars = ["[", "]", "{", "}", ",", ":"]
    l = "".join(i for i in s if not i in bad_chars).split("'")
    actors = []
    for i in range(len(l)):
        if l[i] == "name":
            actors.append((int(l[i-1]),l[i+2]))
    return actors[:2] # list of (id,name)

def filter_director(s):
    bad_chars = ["[", "]", "{", "}", ",", ":"]
    l = "".join(i for i in s if not i in bad_chars).split("'")
    directors = []
    for i in range(len(l)):
        if l[i] == "Director":
            directors.append((int(l[i-3]),l[i+4]))
            break
    return directors # (id,name)

actor_dict = {}
director_dict = {}

with open('credits.csv', 'r') as file:
    csvFile = csv.reader(file)
    lines = list(csvFile)
    id_in = lines[0].index('id')
    cast_in = lines[0].index('cast')
    crew_in = lines[0].index('crew')
    actors_final = []
    directors_final = []
    for i in range(1,len(lines)):
        if lines[i][id_in] in ids:
            for id,name in filter_actor(lines[i][cast_in]):
                actors_final.append((lines[i][id_in],id))
                actor_dict[id] = name
            for id,_ in filter_director(lines[i][crew_in]):
                directors_final.append((lines[i][id_in],id))
                director_dict[id] = name

    actors_final = [[a,b] for a,b in set(actors_final)]
    with open('Movie_Actor.csv', 'w') as wfile:
        print("Creating Movie_Actor.csv")
        csvwriter = csv.writer(wfile)
        csvwriter.writerow(["Movie_id","ActorId"])
        csvwriter.writerows(actors_final)
    directors_final = [[a,b] for a,b in set(directors_final)]

    with open('Movie_Director.csv', 'w') as wfile:
        print("Creating Movie_Director.csv")
        csvwriter = csv.writer(wfile)
        csvwriter.writerow(["Movie_id","DirectorId"])
        csvwriter.writerows(directors_final)

with open('actors.csv', 'w') as wfile:
    print("Creating actors.csv")
    csvwriter = csv.writer(wfile)
    csvwriter.writerow(["Id","Name"])
    for id,name in actor_dict.items():
        csvwriter.writerow([id,name])

with open('directors.csv', 'w') as wfile:
    print("Creating directors.csv")
    csvwriter = csv.writer(wfile)
    csvwriter.writerow(["Id","Name"])
    for id,name in director_dict.items():
        csvwriter.writerow([id,name])