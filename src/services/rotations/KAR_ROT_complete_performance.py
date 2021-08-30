import os
from datetime import datetime
import json
import boto3

def handler(event, context):
    performance_data = json.loads(event['body'])

    performance_completed = {
        'singer_id': performance_data['singer_id'],
        'song_id': performance_data['song_id'],
        'song_title': performance_data['song_title'],
        'artist': performance_data['artist'],
        'performance_date': str(datetime.utcnow())
    }

    entries = [
        {
            'Detail': json.dumps(performance_completed),
            'DetailType': os.environ['PERFORMANCE_COMPLETED_DETAIL_TYPE'],
            'Source': os.environ['PERFORMANCE_COMPLETED_SOURCE'],
            'EventBusName': os.environ['KARAOKE_BUS']
        }
    ]

    client = boto3.client('events')

    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'
    try:
        result = client.put_events(Entries=entries)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = str(e)
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps(result)

    return response
