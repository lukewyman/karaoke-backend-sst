import uuid 
import json
from karaoke.rotations.rotation import Rotation
from karaoke.rotations.rotations_db import create_rotation

def handler(event, context):
    rotation = Rotation(uuid.uuid4())
    
    response = {}
    response['headers'] = {}
    response['headers']['Content-Type'] = 'application/json'

    try:
        create_rotation(rotation)
    except Exception as e:
        print(e)
        response['statusCode'] = 500
        response['body'] = json.dumps(str(e))
    else:
        response['statusCode'] = 201
        response['body'] = json.dumps(rotation.to_dict())

    return response
    