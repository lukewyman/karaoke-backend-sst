import sys
import json
import boto3

def _make_batch_item(item):
    return {
        'PutRequest': {
            'Item': item
        }
    }


def load_seed_data(seed_file_name, table_name):
    with open(seed_file_name) as seed_file:
        items = json.load(seed_file)['items']

    request_items = {}
    request_items[table_name] = [_make_batch_item(item) for item in items]

    client = boto3.client('dynamodb')
    client.batch_write_item(RequestItems=request_items)


if __name__ == '__main__':
    load_seed_data(sys.argv[1], sys.argv[2])