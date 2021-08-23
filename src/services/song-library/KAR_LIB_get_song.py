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
            response['body'] = json.dumps(f'Song with id {song_id} not found')
        else:
            response['body'] = json.dumps(song)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))
    else:
        response['statusCode'] = 404

    return response