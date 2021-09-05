import json
from songs_db import get_all_songs

def handler(event, context):

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        response['body'] = json.dumps(get_all_songs())
    except Exception as e:
        response['statusCode'] = 500
        response['body'] = str(e)
    else:
        response['statusCode'] = 200

    return response