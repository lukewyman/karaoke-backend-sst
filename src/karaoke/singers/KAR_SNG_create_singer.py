import sys
import logging
import traceback
import json
from singers_db import create_singer

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logger.info('event: {event}')
    user = event['request']['userAttributes']

    singer = {}
    singer['singer_id'] = user['sub']
    singer['first_name'] = user['given_name']
    singer['last_name'] = user['family_name']
    singer['stage_name'] = user['preferred_username']
    singer['email'] = user['email']

    try:
        create_singer(singer)
    except Exception as e:
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_msg = json.dumps({
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_msg)
    
    return event