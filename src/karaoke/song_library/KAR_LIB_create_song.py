import sys
import logging
import traceback
import json
import uuid
from songs_db import create_song

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logger.info(f'event: {event}')
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
    else:
        response['statusCode'] = 201
        response['body'] = json.dumps(song)
    
    return response
