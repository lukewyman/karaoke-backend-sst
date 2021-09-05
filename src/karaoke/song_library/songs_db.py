import os
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

def _get_table():
    dynamodb = boto3.resource('dynamodb')
    return dynamodb.Table(os.environ['SONGS_TABLE'])


def create_song(song):
    table = _get_table()

    response = table.put_item(Item=song)

    return response.get('Attributes')


def get_song(song_id):
    table = _get_table()

    try:
        response = table.get_item(Key={'song_id': song_id})
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e 
    else:
        return response.get('Item')


def get_all_songs():
    table = _get_table()

    scan_kwargs = {
        'ProjectionExpression': 'song_id, title, artist, play_duration'
    }

    return table.scan(**scan_kwargs)['Items']


def update_song(song):
    table = _get_table()

    response = table.update_item(
        Key = {
            'song_id': song['song_id']
        },
        UpdateExpression = 'set title=:t, artist=:a, play_duration=:pd',
        ExpressionAttributeValues = {
            ':t': song['title'],
            ':a': song['artist'],
            ':pd': song['play_duration']
        },
        ReturnValues = 'ALL_NEW'
    )

    return response.get('Attributes')


def delete_song(song_id):
    table = _get_table()

    response = table.delete_item(
        Key = { 'song_id': song_id}
    )

    return response