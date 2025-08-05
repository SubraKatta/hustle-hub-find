import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useToast } from '@/hooks/use-toast';
import type { SchemaField } from './SchemaViewer';

interface CodeGeneratorProps {
  schema: SchemaField[];
  selectedArrays: string[];
  tableName?: string;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({
  schema,
  selectedArrays,
  tableName = "df"
}) => {
  const { toast } = useToast();

  const generateArrayCode = () => {
    if (selectedArrays.length === 0) return "# No array fields selected";

    const arrayFields = schema.filter(field => selectedArrays.includes(field.name));
    
    let code = `# Spark code for handling array fields\nfrom pyspark.sql import SparkSession\nfrom pyspark.sql.functions import explode, col, collect_list\n\n`;
    
    arrayFields.forEach(field => {
      code += `# Explode ${field.name} array\n`;
      code += `${tableName}_exploded_${field.name} = ${tableName}.select("*", explode(col("${field.name}")).alias("${field.name}_item"))\n\n`;
      
      code += `# Collect back to array if needed\n`;
      code += `${tableName}_collected_${field.name} = ${tableName}_exploded_${field.name}.groupBy([col for col in ${tableName}.columns if col != "${field.name}"]).agg(collect_list("${field.name}_item").alias("${field.name}_collected"))\n\n`;
    });

    return code;
  };

  const generateNonArrayCode = () => {
    const nonArrayFields = schema.filter(field => !field.isArray && !selectedArrays.includes(field.name));
    
    if (nonArrayFields.length === 0) return "# No non-array fields available";

    let code = `# Spark code for handling non-array fields\nfrom pyspark.sql import SparkSession\nfrom pyspark.sql.functions import col, when, isNull\n\n`;
    
    const fieldNames = nonArrayFields.map(field => `"${field.name}"`).join(", ");
    code += `# Select non-array fields\n`;
    code += `${tableName}_non_arrays = ${tableName}.select(${fieldNames})\n\n`;
    
    code += `# Basic operations on non-array fields\n`;
    nonArrayFields.forEach(field => {
      if (field.type.includes('string')) {
        code += `# String operations for ${field.name}\n`;
        code += `${tableName}_processed = ${tableName}_non_arrays.withColumn("${field.name}_upper", upper(col("${field.name}")))\n`;
      } else if (field.type.includes('number') || field.type.includes('int') || field.type.includes('double')) {
        code += `# Numeric operations for ${field.name}\n`;
        code += `${tableName}_processed = ${tableName}_non_arrays.withColumn("${field.name}_squared", col("${field.name}") * col("${field.name}"))\n`;
      }
    });

    code += `\n# Filter out null values\n`;
    code += `${tableName}_clean = ${tableName}_processed.filter(${nonArrayFields.map(field => `col("${field.name}").isNotNull()`).join(" & ")})\n`;

    return code;
  };

  const copyToClipboard = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code copied!",
        description: `${type} code copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const arrayCode = generateArrayCode();
  const nonArrayCode = generateNonArrayCode();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Array Fields Spark Code</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(arrayCode, "Array")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SyntaxHighlighter
            language="python"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            {arrayCode}
          </SyntaxHighlighter>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Non-Array Fields Spark Code</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(nonArrayCode, "Non-array")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SyntaxHighlighter
            language="python"
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            {nonArrayCode}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
    </div>
  );
};