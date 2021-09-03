import json
from dynamodb import get_song

def handler(event, context):
    song_id = event['pathParameters']['songId']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        song = get_song(song_id)
        if song is None:
            response['statusCode'] = 404
            response['body'] = json.dumps(f'Song with id {song_id} not found')
        else:
            response['statusCode'] = 200
            response['body'] = json.dumps(song)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))

    return response