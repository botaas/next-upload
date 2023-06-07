import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Config } from '../../../../utils/config';
import { getClient } from '../../../../utils/client';
import { sanitizeKey, uuid } from '../../../../utils/keys';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  STSClient,
  GetFederationTokenCommand,
  STSClientConfig,
} from '@aws-sdk/client-sts';


type Options = S3Config & {
  key?: (request: Request, filename: string) => string | Promise<string>;
};

type OptionsFetcher = (request: NextRequest) => Promise<Options>;

const makeRouteHandler = (optionsFetcher?: OptionsFetcher) => {
  const route = async function (request: NextRequest) {    
    const { strategy, filename, type } = await request.json();
  
    if (!optionsFetcher) {
      return new Response("S3 Upload: Missing config", { status: 400 })
    }

    const options = await optionsFetcher(request);
    if (!options) {
      return new Response("S3 Upload: No config fetched", { status: 400 })
    }

    const key = options.key ? await Promise.resolve(options.key(request, filename)) : `uploads/${uuid()}/${sanitizeKey(filename)}`;
    let { bucket, region, endpoint } = options;

    if (strategy === 'presigned') {
      const client = getClient(options);
  
      const params = {
        Bucket: bucket,
        Key: key,
        ContentType: type,
        CacheControl: 'max-age=630720000',
      }

      const url = await getSignedUrl(client, new PutObjectCommand(params), {
        expiresIn: 60 * 60,
      });

      return NextResponse.json({
        key,
        bucket,
        region,
        endpoint,
        url,
      });
    } else {
      let stsConfig: STSClientConfig = {
        credentials: {
          accessKeyId: options.accessKeyId,
          secretAccessKey: options.secretAccessKey,
        },
        region,
      };

      const policy = {
        Statement: [
          {
            Sid: 'Stmt1S3UploadAssets',
            Effect: 'Allow',
            Action: ['s3:PutObject'],
            Resource: [`arn:aws:s3:::${bucket}/${key}`],
          },
        ],
      };

      const sts = new STSClient(stsConfig);

      const command = new GetFederationTokenCommand({
        Name: 'S3UploadWebToken',
        Policy: JSON.stringify(policy),
        DurationSeconds: 60 * 60, // 1 hour
      });

      const token = await sts.send(command);

      return NextResponse.json({
        token,
        key,
        bucket,
        region,
      });
    }
  }

  let configure = (optionsFetcher: OptionsFetcher) => makeRouteHandler(optionsFetcher);
  return Object.assign(route, { configure })
}

const APIRoute = makeRouteHandler();
export { APIRoute }