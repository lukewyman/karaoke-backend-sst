import json
from songs_db import delete_song

def handler(event, context):
    song_id = event['pathParameters']['songId']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        delete_song(song_id)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))
    else:
        response['statusCode'] = 204

    return response