import json
from singers_db import delete_singer

def handler(event, context):
    singer_id = event['pathParameters']['singerId']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        delete_singer(singer_id)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))
    else:
        response['statusCode'] = 204

    return response