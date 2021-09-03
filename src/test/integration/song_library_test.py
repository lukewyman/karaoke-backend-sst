import pytest
import requests
import json
import uuid

@pytest.fixture 
def song_library_api_endpoint():
    with open('src/test/integration/outputs.json') as outputs_file:
        outputs = json.load(outputs_file)

    endpoint = outputs['test-karaoke-song-library']['SongLibraryApiEndpoint']
    return f'{endpoint}/karaoke/songs'

def test_create_song(song_library_api_endpoint):
    post_data = {
        'title': 'title create song',
        'artist': 'artist create song',
        'playDuration': '3:00'
    }
    headers = {'Content-Type': 'application/json'}
    url = f'{song_library_api_endpoint}'

    response = requests.post(url, data=json.dumps(post_data), headers=headers)
    body = response.json()

    assert response.status_code == 201
    assert 'song_id' in body


def test_get_song(song_library_api_endpoint):
    song_id = '5e529a52-783a-42a1-9677-69518e2847ed'
    get_response = requests.get(f'{song_library_api_endpoint}/{song_id}')
    get_response_body = get_response.json()

    assert get_response.status_code == 200
    assert 'song_id' in get_response_body
    assert 'title' in get_response_body
    assert get_response_body['title'] == 'title GET'
    assert 'artist' in get_response_body
    assert get_response_body['artist'] == 'artist GET'
    assert 'play_duration' in get_response_body
    assert get_response_body['play_duration'] == 'play_duration GET'


def test_get_songs(song_library_api_endpoint):
    get_response = requests.get(song_library_api_endpoint)
    get_response_body = get_response.json()

    assert len(get_response_body) >= 2

    song_ids = [item['song_id'] for item in get_response_body]
    assert '0f0823ce-0692-425e-9df5-d092c087fc28' in song_ids
    assert 'd53ce3cf-3c01-4ae1-ba57-4f661f0d2ca3' in song_ids


def test_song_not_found(song_library_api_endpoint):
    bad_song_id = str(uuid.uuid4())

    get_response = requests.get(f'{song_library_api_endpoint}/{bad_song_id}')

    assert get_response.status_code == 404


def test_put_song(song_library_api_endpoint):
    song_id = 'c81cc1b0-dce6-48ba-b382-c0fa2b6a8304'
    put_data = {
        'title': 'title updated',
        'artist': 'artist updated',
        'playDuration': 'play_duration updated'
    }
    headers = {'Content-Type': 'application/json'}
    put_url = f'{song_library_api_endpoint}/{song_id}'
    put_response = requests.put(put_url, data=json.dumps(put_data), headers=headers)
    put_response_body = put_response.json()

    assert put_response.status_code == 200
    assert 'song_id' in put_response_body
    assert 'title' in put_response_body
    assert put_response_body['title'] == 'title updated'
    assert 'artist' in put_response_body
    assert put_response_body['artist'] == 'artist updated'
    assert 'play_duration' in put_response_body
    assert put_response_body['play_duration'] == 'play_duration updated'


def test_delete_song(song_library_api_endpoint):
    song_id = '0e4c0895-82bf-42b1-be95-38b5edbd9f71'
    del_url = f'{song_library_api_endpoint}/{song_id}'

    del_response = requests.delete(del_url)

    assert del_response.status_code == 204

    get_response = requests.get(del_url)

    assert get_response.status_code == 404