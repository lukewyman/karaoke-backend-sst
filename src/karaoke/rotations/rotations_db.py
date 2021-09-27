import os
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from karaoke.rotations.rotation import Rotation

def _get_table():
    dynamodb = boto3.resource('dynamodb')
    return dynamodb.Table(os.environ['ROTATIONS_TABLE'])

def create_rotation(rotation):
    table = _get_table()

    response = table.put_item(Item=rotation.to_dict())

    return response.get('Attributes')


def get_rotation_by_id(rotation_id):
    table = _get_table()

    try:
        response = table.get_item(Key={'rotation_id': str(rotation_id)})
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e 
    else:
        return Rotation.from_dict(response.get('Item'))


def get_rotations():
    table = _get_table()

    scan_kwargs = {
        'ProjectionExpression': 'rotation_id, performance_date, singers, current_singer'
    }

    rotation_dicts = table.scan(**scan_kwargs)['Items']

    return [Rotation.from_dict(rd) for rd in rotation_dicts]


def update_rotation(rotation):
    table = _get_table()

    rotation_dict = rotation.to_dict()

    response = table.update_item(
        Key = {
            'rotation_id': rotation_dict['rotation_id']
        },
        UpdateExpression = 'set performance_date=:pd, singers=:s, current_singer=:cs',
        ExpressionAttributeValues = {
            ':pd': rotation_dict['performance_date'],
            ':s': rotation_dict['singers'],
            ':cs': rotation_dict['current_singer']
        },
        ReturnValues = 'ALL_NEW'
    )

    return response.get('Attributes')