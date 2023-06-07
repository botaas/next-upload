import { NextRequest } from "next/server";
import { S3Config } from '../../../../utils/config';
declare type Options = S3Config & {
    key?: (request: Request, filename: string) => string | Promise<string>;
};
declare type OptionsFetcher = (request: NextRequest) => Promise<Options>;
declare const APIRoute: ((request: NextRequest) => Promise<Response>) & {
    configure: (optionsFetcher: OptionsFetcher) => ((request: NextRequest) => Promise<Response>) & any;
};
export { APIRoute };
