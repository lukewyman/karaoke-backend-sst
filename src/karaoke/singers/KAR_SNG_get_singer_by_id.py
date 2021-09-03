import json
from dynamodb import get_singer

def handler(event, context):
    singer_id = event['pathParameters']['singerId']

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        singer = get_singer(singer_id)
        # print(f'Singer: {singer}')
        if singer is None:
            response['statusCode'] = '404'
            response['body'] = json.dumps(f'Singer with id {singer_id} not found.')
        else:
            response['statusCode'] = 200
            response['body'] = json.dumps(singer)
    except Exception as e:
        # print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))

    return response