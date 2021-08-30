import pytest
import requests
import json

@pytest.fixture 
def singers_api_endpoint():
    with open('test/integration/outputs.json') as outputs_file:
        outputs = json.load(outputs_file)

    endpoint = outputs['test-karaoke-singers']['SingersApiEndpoint']
    return f'{endpoint}/karaoke/singers'


def test_get_singer(singers_api_endpoint):
    singer_id = 'c891be7b-d500-47ca-8d8a-f683e5710231'
    get_response = requests.get(f'{singers_api_endpoint}/{singer_id}')
    get_response_body = get_response.json()

    assert get_response.status_code == 200
    assert 'singer_id' in get_response_body
    assert 'first_name' in get_response_body
    assert get_response_body['first_name'] == 'first_name GET'
    assert 'last_name' in get_response_body
    assert get_response_body['last_name'] == 'last_name GET'
    assert 'stage_name' in get_response_body
    assert get_response_body['stage_name'] == 'stage_name GET'
    assert 'email' in get_response_body
    assert get_response_body['email'] == 'email GET'


def test_get_singers(singers_api_endpoint):
    pass


def test_singer_not_found(singers_api_endpoint):
    pass


def test_put_singer(singers_api_endpoint):
    pass


def test_delete_singer(singers_api_endpoint):
    pass