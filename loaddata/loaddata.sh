python3 -m pip install -r requirements.txt

wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1qV12J4AYE6VYNTd-YoO7aik55QFlWJKJ' -O facebook.csv
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=15WXP3LabvlpA3Q93NoahPeSTRIgtoDHi' -O ratings_small.csv
wget --no-check-certificate 'https://docs.google.com/uc?export=download&id=1XxiCdOaAHBTv5LNr1mc74H7lXFvOA3CZ' -O movies_metadata.csv
wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1UDB-ZaFx_H21Smrpr7MhTu5A9SJsuwPe' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1UDB-ZaFx_H21Smrpr7MhTu5A9SJsuwPe" -O credits.csv && rm -rf /tmp/cookies.txt

python3 generate_movie.py
python3 generate_user.py
echo "\n"
python3 tables.py

rm *.csv