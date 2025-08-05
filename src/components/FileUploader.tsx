import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Database } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'application/octet-stream': ['.parquet'],
      'application/x-parquet': ['.parquet']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8",
        "flex flex-col items-center justify-center space-y-4 min-h-[200px]",
        isDragActive && "border-primary bg-primary/5",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex space-x-2">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium">
          {isDragActive ? "Drop your file here" : "Upload JSON or Parquet file"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {isLoading ? "Processing file..." : "Drag & drop or click to select"}
        </p>
      </div>
      
      <Upload className="h-6 w-6 text-muted-foreground" />
    </Card>
  );
};