import React, { useState } from 'react';
import { FileUploader } from './FileUploader';
import { SchemaViewer, type SchemaField } from './SchemaViewer';
import { CodeGenerator } from './CodeGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, FileText } from 'lucide-react';

export const DataAnalyzer: React.FC = () => {
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [selectedArrays, setSelectedArrays] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyze' | 'generate'>('upload');
  const { toast } = useToast();

  const analyzeJSONSchema = (data: any, prefix = ''): SchemaField[] => {
    const fields: SchemaField[] = [];
    
    if (Array.isArray(data)) {
      if (data.length > 0) {
        const itemSchema = analyzeJSONSchema(data[0], prefix);
        return itemSchema.map(field => ({ ...field, isArray: true }));
      }
      return [];
    }
    
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        const value = data[key];
        const fieldName = prefix ? `${prefix}.${key}` : key;
        
        if (Array.isArray(value)) {
          fields.push({
            name: fieldName,
            type: `array[${value.length > 0 ? typeof value[0] : 'unknown'}]`,
            isArray: true,
            nestedFields: value.length > 0 && typeof value[0] === 'object' ? analyzeJSONSchema(value[0]) : undefined
          });
        } else if (value && typeof value === 'object') {
          fields.push({
            name: fieldName,
            type: 'object',
            isArray: false,
            nestedFields: analyzeJSONSchema(value, fieldName)
          });
        } else {
          fields.push({
            name: fieldName,
            type: typeof value,
            isArray: false
          });
        }
      });
    }
    
    return fields;
  };

  const analyzeParquetSchema = async (file: File): Promise<SchemaField[]> => {
    try {
      // For now, return a mock schema since hyparquet setup requires more configuration
      // In a real implementation, you would use hyparquet to read the file metadata
      toast({
        title: "Parquet Analysis",
        description: "Parquet file analysis is coming soon. Using mock schema for demo.",
      });
      
      return [
        { name: 'id', type: 'int64', isArray: false },
        { name: 'name', type: 'string', isArray: false },
        { name: 'tags', type: 'array[string]', isArray: true },
        { name: 'metrics', type: 'array[double]', isArray: true },
        { name: 'created_at', type: 'timestamp', isArray: false }
      ];
    } catch (error) {
      throw new Error('Failed to analyze Parquet file');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);
    
    try {
      let analyzedSchema: SchemaField[] = [];
      
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        analyzedSchema = analyzeJSONSchema(data);
      } else if (file.name.endsWith('.parquet')) {
        analyzedSchema = await analyzeParquetSchema(file);
      } else {
        throw new Error('Unsupported file format');
      }
      
      setSchema(analyzedSchema);
      setCurrentStep('analyze');
      
      toast({
        title: "File analyzed successfully",
        description: `Found ${analyzedSchema.length} fields in ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArraySelection = (fieldName: string, selected: boolean) => {
    setSelectedArrays(prev => 
      selected 
        ? [...prev, fieldName]
        : prev.filter(name => name !== fieldName)
    );
  };

  const handleGenerateCode = () => {
    setCurrentStep('generate');
    toast({
      title: "Code generated",
      description: `Generated Spark code for ${selectedArrays.length} array fields`,
    });
  };

  const handleReset = () => {
    setSchema([]);
    setSelectedArrays([]);
    setFileName('');
    setCurrentStep('upload');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Analysis Tool</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Upload a JSON or Parquet file to analyze its schema and generate Spark code
                  for handling array and non-array fields separately.
                </p>
                <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
        );
      
      case 'analyze':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Schema Analysis: {fileName}</span>
                  </span>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Select the array fields you want to include in the array processing code:
                </p>
              </CardContent>
            </Card>
            
            <SchemaViewer
              schema={schema}
              selectedArrays={selectedArrays}
              onArraySelection={handleArraySelection}
            />
            
            <div className="flex justify-center">
              <Button onClick={handleGenerateCode} disabled={schema.length === 0}>
                Generate Spark Code
              </Button>
            </div>
          </div>
        );
      
      case 'generate':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Generated Code: {fileName}</span>
                  </span>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
            
            <CodeGenerator
              schema={schema}
              selectedArrays={selectedArrays}
              tableName="df"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {renderStep()}
    </div>
  );
};