import { S3Client } from '@aws-sdk/client-s3';
import { S3Config } from './config';

export function getClient(config: S3Config) {
  const client = new S3Client({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: config.region,
    ...(config.forcePathStyle ? { forcePathStyle: config.forcePathStyle } : {}),
    ...(config.endpoint ? { endpoint: config.endpoint } : {}),
  });

  return client;
}