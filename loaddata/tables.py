import psycopg2, sys, config, create_tables
import pandas as pd
import time

def connect():
    conn = psycopg2.connect(host = config.host, database = config.dbname, user = config.user, password = config.pwd, port = config.port)
    return conn

def create_table(sql):
    conn = connect()
    cur = conn.cursor()
    cur.execute(sql)
    cur.execute("commit;")
    conn.close()
    return

def pg_load_table(file_path, table_name):
    try:
        t = time.time()
        conn = connect()
        cur = conn.cursor()
        f = open(file_path, "r")
        # Load table from the file with header
        cur.copy_expert("copy {} from STDIN CSV HEADER QUOTE '\"'".format(table_name), f)
        cur.execute("commit;")
        conn.close()
    except Exception as e:
        print("Error: {}".format(str(e)))
        sys.exit(1)

file_path = 'movie'
table_name = 'Movies'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Movies)
pg_load_table(file_path+'.csv', table_name)

file_path = 'user'
table_name = 'Users'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Users)
pg_load_table(file_path+'.csv', table_name)

file_path = 'genres'
table_name = 'Genre'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Genre)
pg_load_table(file_path+'.csv', table_name)

file_path = 'actors'
table_name = 'Actor'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Actor)
pg_load_table(file_path+'.csv', table_name)

file_path = 'directors'
table_name = 'Director'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Director)
pg_load_table(file_path+'.csv', table_name)

file_path = 'rating'
table_name = 'Rating'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Rating)
pg_load_table(file_path+'.csv', table_name)

file_path = 'Movie_Genre'
table_name = 'Movie_Genre'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Movie_Genre)
pg_load_table(file_path+'.csv', table_name)

# file_path = 
table_name = 'User_Genre'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_User_Genre)
# pg_load_table(file_path+'.csv', table_name)

file_path = 'Movie_Actor'
table_name = 'Movie_Actor'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Movie_Actor)
pg_load_table(file_path+'.csv', table_name)

file_path = 'Movie_Director'
table_name = 'Movie_Director'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Movie_Director)
pg_load_table(file_path+'.csv', table_name)

file_path = 'friends'
table_name = 'Friends'
print("Creating table {}".format(table_name))
create_table(create_tables.sql_Friends)
pg_load_table(file_path+'.csv', table_name)

