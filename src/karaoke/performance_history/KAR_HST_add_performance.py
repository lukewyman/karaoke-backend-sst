import sys
import logging
import traceback
import json
from performances_db import create_performance

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    performance = event['detail']

    try:
        create_performance(performance)
    except Exception as e:
        exception_type, exception_value, exception_traceback = sys.exc_info()
        traceback_string = traceback.format_exception(exception_type, exception_value, exception_traceback)
        err_msg = json.dumps({
            "errorType": exception_type.__name__,
            "errorMessage": str(exception_value),
            "stackTrace": traceback_string
        })
        logger.error(err_msg)