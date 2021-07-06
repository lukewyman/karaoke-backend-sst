import * as AWS from 'aws-sdk';
import SongService from './songService';

const SONGS_TABLE = process.env.songsTable;

const songService = new SongService(new AWS.DynamoDB.DocumentClient(), SONGS_TABLE!);

export default songService;
