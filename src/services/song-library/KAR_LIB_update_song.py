import json
from dynamodb import update_song

def handler(event, context):
    song = {}
    song['song_id'] = event['pathParameters']['songId']
    body = json.loads(event['body'])
    song['title'] = body['title']
    song['artist'] = body['artist']
    song['play_duration'] = body['playDuration']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        response['body'] = json.dumps(update_song(song))
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))

    return response