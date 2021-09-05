from singers_db import create_singer

def handler(event, context):
    user = event['request']['userAttributes']

    singer = {}
    singer['singer_id'] = user['sub']
    singer['first_name'] = user['given_name']
    singer['last_name'] = user['family_name']
    singer['stage_name'] = user['preferred_username']
    singer['email'] = user['email']

    try:
        create_singer(singer)
    except Exception as e:
        print(e)
    
    return event