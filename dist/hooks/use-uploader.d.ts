/// <reference types="react" />
declare type UploadResult = {
    url: string;
    bucket: string;
    key: string;
};
declare type RequestOptions = {
    url?: string;
    body?: Record<string, any>;
    headers?: HeadersInit;
};
declare type UploadToS3Options = {
    endpoint?: {
        request: RequestOptions;
    };
};
declare type OldOptions = {
    endpoint: string;
};
declare type Strategy = 'presigned' | 'aws-sdk';
export declare type Uploader<P = any> = (file: File, params: P, eventHandlers: {
    onProgress: (uploaded: number) => void;
}) => Promise<UploadResult>;
export declare const useUploader: (strategy: Strategy, uploader: Uploader, oldOptions?: OldOptions | undefined) => {
    FileInput: (props: any) => import("react").JSX.Element;
    openFileDialog: () => void;
    uploadToS3: (file: File, options?: UploadToS3Options) => Promise<UploadResult>;
    files: {
        file: File;
        progress: number;
        uploaded: number;
        size: number;
    }[];
    resetFiles: () => void;
};
export {};
