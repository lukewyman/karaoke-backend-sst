import * as AWS from 'aws-sdk';
import SingerService from './singerService';

const SINGERS_TABLE = process.env.singersTable;

const singerService = new SingerService(new AWS.DynamoDB.DocumentClient(), SINGERS_TABLE!);

export default singerService;
