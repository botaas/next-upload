/// <reference types="react" />
export declare const usePresignedUpload: () => {
    FileInput: (props: any) => import("react").JSX.Element;
    openFileDialog: () => void;
    uploadToS3: (file: File, options?: {
        endpoint?: {
            request: {
                url?: string | undefined;
                body?: Record<string, any> | undefined;
                headers?: Headers | string[][] | Record<string, string> | undefined;
            };
        } | undefined;
    }) => Promise<{
        url: string;
        bucket: string;
        key: string;
    }>;
    files: {
        file: File;
        progress: number;
        uploaded: number;
        size: number;
    }[];
    resetFiles: () => void;
};
