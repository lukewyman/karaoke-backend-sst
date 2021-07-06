import * as AWS from 'aws-sdk';
import PerformanceService from './performanceService';

const PERFORMANCES_TABLE = process.env.performancesTable;

const performanceService = new PerformanceService(new AWS.DynamoDB.DocumentClient(), PERFORMANCES_TABLE!);

export default performanceService;
