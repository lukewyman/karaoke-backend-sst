import json
from singers_db import get_all_singers 

def handler(event, context):

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        response['body'] = json.dumps(get_all_singers())
    except Exception as e:
        print(f'Error from handler: {e}')
        response['statusCode'] = 500
        response['body'] = str(e)
    else:
        response['statusCode'] = 200

    return response