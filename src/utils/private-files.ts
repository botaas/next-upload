import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Config } from './config';
import { getClient } from './client';

export const generateTemporaryUrl = async (
  key: string,
  config: S3Config
) => {
  let client = getClient(config);

  let command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });

  let url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return url;
};