import pytest
import requests
import json
import boto3

@pytest.fixture
def cognito_resources():
    with open('src/test/integration/outputs.json') as outputs_file:
        outputs = json.load(outputs_file)

    return outputs['test-karaoke-auth']


@pytest.fixture
def singers_api_endpoint():
    with open('src/test/integration/outputs.json') as outputs_file:
        outputs = json.load(outputs_file)

    endpoint = outputs['test-karaoke-singers']['SingersApiEndpoint']
    return f'{endpoint}/karaoke/singers'


@pytest.fixture
def user_attributes():
    return [
            {
                'Name': 'given_name',
                'Value': 'test'
            },
            {
                'Name': 'family_name',
                'Value': 'user'
            },
            {
                'Name': 'preferred_username',
                'Value': 'super star'
            }
        ]


def test_create_singer_at_sign_up(cognito_resources, user_attributes, singers_api_endpoint):
    client = boto3.client('cognito-idp')

    response = client.sign_up(
        ClientId = cognito_resources['UserPoolClientId'],
        Username = 'testuser@example.com',
        Password = 'p@ssW0rd',
        UserAttributes = user_attributes
    )

    user_id = response['UserSub']

    client.admin_confirm_sign_up(
        UserPoolId = cognito_resources['UserPoolId'],
        Username = 'testuser@example.com'
    )

    get_response = requests.get(f'{singers_api_endpoint}/{user_id}')
    get_response_body = get_response.json()

    assert get_response.status_code == 200
    assert 'singer_id' in get_response_body
    assert 'first_name' in get_response_body
    assert get_response_body['first_name'] == 'test'
    assert 'last_name' in get_response_body
    assert get_response_body['last_name'] == 'user'
    assert 'stage_name' in get_response_body
    assert get_response_body['stage_name'] == 'super star'
    assert 'email' in get_response_body
    assert get_response_body['email'] == 'testuser@example.com'