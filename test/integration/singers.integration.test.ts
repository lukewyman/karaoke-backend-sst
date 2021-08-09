import * as AWS from 'aws-sdk';
const axios = require('axios').default;
import * as outputs from '../../outputs.json';

AWS.config.update({ region: 'us-west-2' });
const userPoolId = outputs['test-karaoke-auth'].UserPoolId;
const clientId = outputs['test-karaoke-auth'].UserPoolClientId;
const provider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
const singersApiEndpoint = outputs['test-karaoke-singers'].SingersApiEndpoint;

const signUp = (params: AWS.CognitoIdentityServiceProvider.SignUpRequest) => {
  return provider.signUp(params).promise();
};

const confirmUser = async (signUpResponse: AWS.CognitoIdentityServiceProvider.SignUpResponse) => {
  const userId: string = signUpResponse.UserSub;
  const confirmParams = {
    UserPoolId: userPoolId,
    Username: 'susan@example.com',
  };
  const response = await provider.adminConfirmSignUp(confirmParams).promise();
  console.log(response);
  return userId;
};

const getSinger = async (userId: string): Promise<any> => {
  const response = await axios.get(`${singersApiEndpoint}/karaoke/singers/${userId}`);
  console.log(response);
  return response;
};

test('Creating a User at Signup creates a Singer', async () => {
  const signupParams = {
    ClientId: clientId,
    Username: 'susan@example.com',
    Password: 'Passw0rd!',
    UserAttributes: [
      {
        Name: 'given_name',
        Value: 'Susan',
      },
      {
        Name: 'family_name',
        Value: 'Jones',
      },
      {
        Name: 'preferred_username',
        Value: 'Suzie Q',
      },
    ],
  };

  const result = await Promise.resolve(signupParams).then(signUp).then(confirmUser).then(getSinger);
  expect(result.status).toBe(200);
});
