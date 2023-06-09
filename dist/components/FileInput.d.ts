import React, { ChangeEvent } from 'react';
export declare const FileInput: React.ForwardRefExoticComponent<{
    onChange: (file: File | undefined, event: ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>;
