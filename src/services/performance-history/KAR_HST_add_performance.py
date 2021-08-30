from dynamodb import create_performance

def handler(event, context):
    performance = event['detail']

    try:
        create_performance(performance)
    except Exception as e:
        print(e)