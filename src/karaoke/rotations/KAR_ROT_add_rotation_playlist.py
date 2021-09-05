import uuid
import json
from rotation import Rotation
from rotation_playlists_db import create_rotation_playlist

def handler(event, context):
    rotation = Rotation(uuid.uuid4())