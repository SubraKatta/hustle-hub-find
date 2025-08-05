import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { List, Database } from 'lucide-react';

export interface SchemaField {
  name: string;
  type: string;
  isArray: boolean;
  nestedFields?: SchemaField[];
}

interface SchemaViewerProps {
  schema: SchemaField[];
  selectedArrays: string[];
  onArraySelection: (fieldName: string, selected: boolean) => void;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({
  schema,
  selectedArrays,
  onArraySelection
}) => {
  const arrayFields = schema.filter(field => field.isArray);
  const nonArrayFields = schema.filter(field => !field.isArray);

  const renderField = (field: SchemaField, level = 0) => (
    <div key={field.name} className={`pl-${level * 4} py-2`}>
      <div className="flex items-center space-x-3">
        {field.isArray && (
          <Checkbox
            checked={selectedArrays.includes(field.name)}
            onCheckedChange={(checked) => onArraySelection(field.name, checked as boolean)}
          />
        )}
        <span className="font-medium">{field.name}</span>
        <Badge variant={field.isArray ? "default" : "secondary"}>
          {field.type}
        </Badge>
        {field.isArray && <List className="h-4 w-4 text-primary" />}
      </div>
      {field.nestedFields && (
        <div className="ml-4 border-l border-border pl-4 mt-2">
          {field.nestedFields.map(nested => renderField(nested, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <List className="h-5 w-5" />
            <span>Array Fields ({arrayFields.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {arrayFields.length > 0 ? (
            <div className="space-y-2">
              {arrayFields.map(field => renderField(field))}
            </div>
          ) : (
            <p className="text-muted-foreground">No array fields found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Non-Array Fields ({nonArrayFields.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nonArrayFields.length > 0 ? (
            <div className="space-y-2">
              {nonArrayFields.map(field => renderField(field))}
            </div>
          ) : (
            <p className="text-muted-foreground">No non-array fields found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};