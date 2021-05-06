import pandas as pd
import csv

with open('user.csv', 'w') as wfile:
    print("Creating user.csv")
    header = ['username', 'name', 'password', 'email_id', 'last_watched', 'login', 'language_pref1', 'language_pref2', 'admin']
    csvwriter = csv.writer(wfile)
    csvwriter.writerow(header)
    for i in range(1, 672):
        csvwriter.writerow(['user'+str(i), 'user'+str(i), 'user'+str(i), 'user'+str(i)+'@foo.com', '', 'false', '', '', 'false'])

with open('facebook.csv', 'r') as file:
    csvFile = csv.reader(file)
    lines = list(csvFile)
    with open('friends.csv', 'w') as wfile:
        print("Creating friends.csv")
        csvwriter = csv.writer(wfile)
        csvwriter.writerow(["username1", "username2"])
        for i in range(len(lines)):
            u1 = 1+int(lines[i][0])
            u2 = 1+int(lines[i][1])
            if u1 < 672 and u2 < 672:
                csvwriter.writerow(["user"+str(u1), "user"+str(u2)])