"use client";

import {
    FileJson,
    FileText,
    FileType,
    FileCode,
    Image,
    FileType2 as FileTypeScriptIcon,
} from "lucide-react";

interface FileIconProps {
    extension: string;
    className?: string;
}

export function FileIcon({ extension, className }: FileIconProps) {
    switch (extension.toLowerCase()) {
        case "ts":
        case "tsx":
            return <FileTypeScriptIcon className={className} />;
        case "js":
        case "jsx":
            return <FileCode className={className} />;
        case "json":
            return <FileJson className={className} />;
        case "md":
            return <FileText className={className} />;
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "svg":
            return <Image className={className} />;
        default:
            return <FileType className={className} />;
    }
}