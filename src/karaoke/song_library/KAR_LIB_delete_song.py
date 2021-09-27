import sys
import logging
import traceback
import json
from songs_db import delete_song

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logger.info(f'event: {event}')
    song_id = event['pathParameters']['songId']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        delete_song(song_id)
    except Exception as e:
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_message = json.dumps({
            'errorType': exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_message)
        
        response['statusCode'] = 500
        response['body'] = err_message
    else:
        response['statusCode'] = 204

    return response