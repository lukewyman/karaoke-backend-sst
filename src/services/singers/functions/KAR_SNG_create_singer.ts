import { PostConfirmationTriggerEvent, Context, PostConfirmationTriggerHandler, Callback } from 'aws-lambda';
import singerService from '../database';
import Singer from '../domain/Singer';

export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent,
  context: Context,
  callback: Callback
) => {
  const { sub, email, given_name, family_name, preferred_username } = event.request.userAttributes;
  const tableName = process.env.singersTable!;
  const singer: Singer = {
    singerId: sub,
    firstName: given_name,
    lastName: family_name,
    stageName: preferred_username,
    email,
  };

  try {
    const created: Singer = await singerService.createSinger(singer);
    console.log(JSON.stringify(created));

    callback(null, event);
  } catch (err) {
    console.log(err);
    callback(err, null);
  }
};
