import json
import uuid
from songs_db import create_song

def handler(event, context):
    print(event)
    song = {}
    song['song_id'] = str(uuid.uuid4())
    body = json.loads(event['body'])
    song['title'] = body['title']
    song['artist'] = body['artist']
    song['play_duration'] = body['playDuration']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        create_song(song)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))
    else:
        response['statusCode'] = 201
        response['body'] = json.dumps(song)
    
    return response
