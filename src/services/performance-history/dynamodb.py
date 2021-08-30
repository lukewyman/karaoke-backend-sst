import os
import boto3
from botocore.exceptions import ClientError


def _get_table():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['PERFORMANCES_TABLE'])


def create_performance(performance):
    table = _get_table()

    response = table.put_item(
        Item = performance
    )

    return response


def get_performances_by_singer(singer_id):
    table = _get_table()

    response = table.query(
        KeyConditionExpression=Key('singer_id').eq(singer_id)
    )

    return response['Items']