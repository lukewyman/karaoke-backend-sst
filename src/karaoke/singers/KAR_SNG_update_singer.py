import json
from singers_db import update_singer

def handler(event, context):
    singer = json.loads(event['body'])
    singer['singer_id'] = event['pathParameters']['singerId']
    
    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        response['body'] = json.dumps(update_singer(singer))
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = str(e)
    else:
        response['statusCode'] = 200

    return response
        