import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Upload, 
  FileText, 
  X, 
  Eye, 
  Download, 
  AlertCircle, 
  Loader2, 
  CheckCircle2 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const formSchema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, "Document is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE, 
      "Maximum file size is 2MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), 
      "Unsupported file format. Only PDF or Image (.jpg/.jpeg/.png) are allowed"
    ),
  description: z.string().optional(),
});

export default function DocumentUploadPreview() {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; type: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (ACCEPTED_FILE_TYPES.includes(file.type)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      // Mock API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      const file = values.file[0];
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      toast({
        title: "Upload Successful",
        description: `Document ${file.name} has been uploaded and processed.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "An error occurred while uploading the document.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    form.reset();
    setPreviewUrl(null);
    setUploadedFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">B.10.7 Document Upload & Preview</h1>
        <p className="text-muted-foreground">Upload warehouse-related documentation for verification and records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Max file size 2MB. Supported formats: PDF, JPG, PNG.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Document <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          <div 
                            className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF, PNG, JPG (max 2MB)</p>
                            </div>
                            <Input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept={ACCEPTED_FILE_TYPES.join(',')}
                              onChange={(e) => {
                                onChange(e.target.files);
                                onFileChange(e);
                              }}
                              {...rest}
                            />
                          </div>
                          {form.watch('file')?.[0] && (
                            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
                              <FileText className="h-5 w-5 text-primary" />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{form.watch('file')[0].name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(form.watch('file')[0].size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                onClick={handleClear}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the document" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isUploading || !form.formState.isDirty}
                  >
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload Document
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Preview
              {previewUrl && (
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" asChild>
                    <a href={previewUrl} download="preview" target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center min-h-[400px] border-t">
            {previewUrl ? (
              <div className="w-full h-full min-h-[400px] relative">
                {form.watch('file')?.[0]?.type === 'application/pdf' ? (
                  <iframe 
                    src={previewUrl} 
                    className="w-full h-full min-h-[500px] rounded-md" 
                    title="PDF Preview"
                  />
                ) : (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-w-full max-h-[500px] object-contain rounded-md mx-auto"
                  />
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-muted rounded-full p-6 inline-block">
                  <Eye className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">No document selected</p>
                  <p className="text-xs text-muted-foreground">Select a file to see its preview here</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {uploadedFile && (
        <Alert className="bg-primary/5 border-primary/20">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <AlertTitle>Upload Status</AlertTitle>
          <AlertDescription>
            File <strong>{uploadedFile.name}</strong> has been successfully uploaded and is ready for association with Node ID WH0001.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
