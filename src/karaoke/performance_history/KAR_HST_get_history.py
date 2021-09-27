import sys
import logging
import traceback
import json
from dynamodb import get_performances_by_singer

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    logger.info(f'event: {event}')
    singer_id = event['pathParameters']['singerId']

    response = {}
    response['headers']
    response['headers']['Content-Type'] = 'application/json'

    try:
        response['body'] = json.dumps(get_performances_by_singer(singer_id))
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
        response['statusCode'] = 200

    return response