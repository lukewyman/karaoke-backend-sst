import pytest
import json
import uuid
from datetime import datetime
from karaoke.rotations.rotation import Rotation

@pytest.fixture 
def fixture_singers():
    return [
        None,
        {
            'singer_id': 'd9791b8e-00bd-451d-8226-4bc11883c88e',
            'song_id': '5f0bdd34-8516-4978-bfd3-9fa19a7ce819',
            'song_title': 'title-1',
            'song_artist': 'artist-1'
        },
        {
            'singer_id': '6cf219fa-c458-4906-8426-5f6ef74baf0d',
            'song_id': 'fa04aeb3-f2e3-44df-8a01-15d54e974ef4',
            'song_title': 'title-2',
            'song_artist': 'artist-2'
        },
        {
            'singer_id': 'de73d467-8699-45a9-8794-c573911ebabd',
            'song_id': '1b23e435-f411-40cb-8104-b8347a10dc45',
            'song_title': 'title-3',
            'song_artist': 'artist-3'
        },
    ]


def test_serialize_empty_rotation():
    rotation_id = uuid.uuid4()
    rotation = Rotation(rotation_id)
    rotation_date = datetime.utcnow()
    rotation.performance_date = rotation_date

    rotation_dict = rotation.to_dict()

    assert rotation_dict == {
        'rotation_id': str(rotation_id),
        'performance_date': str(rotation_date),
        'singers': [],
        'current_singer': 0
    }


def test_serialize_rotation_with_singers(fixture_singers):
    rotation_id = uuid.uuid4()
    rotation = Rotation(rotation_id)
    rotation_date = datetime.utcnow()
    rotation.performance_date = rotation_date
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])
    rotation.complete_performance()

    rotation_dict = rotation.to_dict()

    assert rotation_dict == {
        'rotation_id': str(rotation_id),
        'performance_date': str(rotation_date),
        'singers': [{
            'singer_id': 'd9791b8e-00bd-451d-8226-4bc11883c88e',
            'song_id': '5f0bdd34-8516-4978-bfd3-9fa19a7ce819',
            'song_title': 'title-1',
            'song_artist': 'artist-1'
        },
        {
            'singer_id': '6cf219fa-c458-4906-8426-5f6ef74baf0d',
            'song_id': 'fa04aeb3-f2e3-44df-8a01-15d54e974ef4',
            'song_title': 'title-2',
            'song_artist': 'artist-2'
        },
        {
            'singer_id': 'de73d467-8699-45a9-8794-c573911ebabd',
            'song_id': '1b23e435-f411-40cb-8104-b8347a10dc45',
            'song_title': 'title-3',
            'song_artist': 'artist-3'
        }],
        'current_singer': 1
    }


def test_create_rotation_from_dictionary(fixture_singers):
    rotation_id = uuid.uuid4()
    rotation_date = datetime.utcnow()
    rotation_dict = {
        'rotation_id': str(rotation_id),
        'performance_date': str(rotation_date),
        'singers': [{
            'singer_id': 'd9791b8e-00bd-451d-8226-4bc11883c88e',
            'song_id': '5f0bdd34-8516-4978-bfd3-9fa19a7ce819',
            'song_title': 'title-1',
            'song_artist': 'artist-1'
        },
        {
            'singer_id': '6cf219fa-c458-4906-8426-5f6ef74baf0d',
            'song_id': 'fa04aeb3-f2e3-44df-8a01-15d54e974ef4',
            'song_title': 'title-2',
            'song_artist': 'artist-2'
        },
        {
            'singer_id': 'de73d467-8699-45a9-8794-c573911ebabd',
            'song_id': '1b23e435-f411-40cb-8104-b8347a10dc45',
            'song_title': 'title-3',
            'song_artist': 'artist-3'
        }],
        'current_singer': 1
    }

    rotation = Rotation.from_dict(rotation_dict)

    assert rotation.rotation_id == rotation_id
    assert rotation.performance_date == rotation_date
    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[2]