# importing the requests library
from snowflake.connector.pandas_tools import write_pandas
import snowflake.connector as snow
import requests
from flask import Flask
from flask_cors import CORS
import pandas as pd
import configparser
import json
import schedule
import time

# CREATE OBJECT
config_file = configparser.ConfigParser()
# ADDING Config file
config_file.read("Config.ini")
API_KEY = config_file.get("GENERAL", "API_KEY")
USER = config_file.get("GENERAL", "USER")
PASSWORD = config_file.get("GENERAL", "PASSWORD")
DATABASE = config_file.get("GENERAL", "DATABASE")
WAREHOUSE = config_file.get("GENERAL", "WAREHOUSE")
SCHEMA = config_file.get("GENERAL", "SCHEMA")
ROLE = config_file.get("GENERAL", "ROLE")
ACCOUNT = config_file.get("GENERAL", "ACCOUNT")
conn = snow.connect(user=USER,
                    password=PASSWORD,
                    account=ACCOUNT,
                    role=ROLE,
                    warehouse=WAREHOUSE,
                    database=DATABASE,
                    schema=SCHEMA)

app = Flask(__name__)
CORS(app)


def main():
    Country = ['Toronto', 'Waterloo', 'Mississauga', 'Kitchener',
               'Surrey', 'edmonton', 'nova scotia', 'ottawa']
    result = []
    for i in range(len(Country)):
        URL = "http://api.openweathermap.org/data/2.5/forecast?q={}&appid=f2ec04587b7eda134ebb18204e69230c".format(
            Country[i], API_KEY)
        print(URL)
        # sending get request and saving the response as response object
        r = requests.get(url=URL)
        result.append(r.json())

    with open('result.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(result, ensure_ascii=False))

    with open('result.json', 'r') as f:
        result = json.loads(f.read())
    df_nested_list_one = pd.json_normalize(result, record_path=['list'])
    df_nested_list_two = pd.json_normalize(
        result, record_path=['list', 'weather'], meta=['city'])

    df = pd.concat([df_nested_list_one, df_nested_list_two.reindex(
        df_nested_list_one.index)], axis=1)

    df = df.filter(["weather", "main.temp", "main.feels_like", "main.temp_min", "main.temp_max",
                    "main.humidity", "wind.speed", "wind.deg", "main", "description", "icon", "dt_txt", "city"])
    df.rename(columns={'weather': 'WEATHER', 'main.temp': 'TEMP', 'main.feels_like': 'FEELS_LIKE', 'main.temp_min': 'TEMP_MIN', 'main.temp_max': 'TEMP_MAX', 'main.humidity': 'HUMIDITY',
                       'wind.speed': 'WINDSPEED', 'wind.deg': 'WINDDEG', 'main': 'MAIN', 'description': 'DESCRIPTION', 'icon': 'ICON', 'dt_txt': 'DATE', 'city': 'CITY'}, inplace=True)
    # curr_timestamp = int(datetime.timestamp(datetime.now()))
    # df.to_csv('output.csv', index="false")
    cur = conn.cursor()
    sqlOne = "TRUNCATE TABLE WEATHER_APP;"
    print(cur.execute(sqlOne))
    success, nchunks, nrows, _ = write_pandas(conn, df, 'WEATHER_APP')
    print(success)
    print(nrows)
    sqlTwo = "UPDATE WEATHER_APP SET ID = MD5(CONCAT(TEMP,FEELS_LIKE,MAIN,WINDSPEED));"
    print(cur.execute(sqlTwo))


@app.route('/getAll')
def getAll():
    cur = conn.cursor()
    SqlGetAll = "SELECT TEMP, TEMP_MIN, TEMP_MAX, CITY, FEELS_LIKE, HUMIDITY, WINDSPEED, MAIN, DATE, ICON, ID FROM WEATHER_APP;"
    result = cur.execute(SqlGetAll).fetchall()
    final_result = []
    for elt in result:
        x = {
            "temp":elt[0],
        "min":elt[1],
        "max":elt[2],
        "city":json.loads(elt[3]),
        "feels_like":elt[4],
        "humidity":elt[5],
        "windspeed":elt[6],
        "type":json.loads(elt[7]),
        "date":json.loads(elt[8]),
        "icon":json.loads(elt[9]),
        "id":elt[10]
        }
        final_result.append(x)
    return final_result


app.run()
if __name__ == "__main__":
    schedule.every().day.at("12:00").do(main)
    while True:
        schedule.run_pending()
        time.sleep(60)