import json
from dynamodb import get_performances_by_singer

def handler(event, context):
    singer_id = event['pathParameters']['singerId']

    response = {}
    response['headers']
    response['headers']['Content-Type'] = 'application/json'

    try:
        response['body'] = json.dumps(get_performances_by_singer(singer_id))
    except Exception as e:
        response['statusCode'] = 500
        response['body'] = str(e)
    else:
        response['statusCode'] = 200

    return response