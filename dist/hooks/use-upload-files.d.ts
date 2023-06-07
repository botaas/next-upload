import React from 'react';
declare type TrackedFile = {
    file: File;
    progress: number;
    uploaded: number;
    size: number;
};
export declare const useUploadFiles: () => {
    FileInput: (props: any) => React.JSX.Element;
    openFileDialog: () => void;
    files: TrackedFile[];
    addFile: (file: File) => void;
    updateFileProgress: (file: File, uploaded: number) => void;
    resetFiles: () => void;
};
export {};
