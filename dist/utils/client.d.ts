import { S3Client } from '@aws-sdk/client-s3';
import { S3Config } from './config';
export declare function getClient(config: S3Config): S3Client;
