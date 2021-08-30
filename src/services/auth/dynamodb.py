import os
import boto3
from boto3.dynamodb.conditions import Key 
from botocore.exceptions import ClientError

def _get_table():
    dynamodb = boto3.resource('dynamodb')
    return dynamodb.Table(os.environ['SINGERS_TABLE'])


def create_singer(singer):
    table = _get_table()

    response = table.put_item(Item = singer)

    return response


def get_singer(singer_id):
    table = _get_table()

    try:
        response = table.get_item(Key={'singer_id': singer_id})
    except ClientError as e:
        print(e.response['Error']['Message'])
        raise e
    else:
        return response.get('Item')


def get_singers():
    table = _get_table()

    scan_kwargs = {
        'ProjectionExpression': 'customer_id, first_name, last_name, address, phone'
    }

    return table.scan(**scan_kwargs)['Items']


def update_singer(singer):
    table = _get_table()

    response = table.update_item(
        Key = { 'singer_id': singer['singer_id'] },
        UpdateExpression = 'set first_name=:fn, last_name=:ln, email=:e, stage_name=:sn',
        ExpressionAttributeValues = {
            ':fn': singer['first_name'],
            ':ln': singer['last_name'],
            ':e':  singer['email'],
            ':sn': singer['stage_name']
        },
        ReturnValues = 'ALL_NEW'
    )

    return response


def delete_singer(singer_id):
    table = _get_table()

    response = table.delete_item(Key = { 'singer_id': singer_id })

    return response