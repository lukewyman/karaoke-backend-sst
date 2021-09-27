import os
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key


def _get_table():
    dynamodb = boto3.resource('dynamodb')
    return dynamodb.Table(os.environ['PERFORMANCES_TABLE'])


def create_performance(performance):
    table = _get_table()

    response = table.put_item(Item=performance)

    return response.get('Attributes')


def get_performances_by_singer(singer_id):
    table = _get_table()

    response = table.query(
        KeyConditionExpression=Key('singer_id').eq(singer_id)
    )

    return response['Items']