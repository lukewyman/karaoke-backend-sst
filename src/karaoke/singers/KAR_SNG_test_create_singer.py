import json
import uuid
from singers_db import create_singer

def handler(event, context):

    singer = json.loads(event['body'])
    singer['singer_id'] = str(uuid.uuid4())

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        create_singer(singer)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))
    else:
        response['statusCode'] = 201
        response['body'] = json.dumps(singer)

    return response