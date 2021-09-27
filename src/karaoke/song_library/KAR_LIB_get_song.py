import sys
import logging
import traceback
import json
from songs_db import get_song

logger = logging.getLogger()
logger.setLevel(logging.INFO)

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
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_msg = json.dumps({
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_msg)
        
        response['statusCode'] = 500
        response['body'] = err_msg

    return response