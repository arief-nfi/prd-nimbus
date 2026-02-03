import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Plus } from 'lucide-react';

const formSchema = z.object({
  nodeType: z.literal('Warehouse'),
  nodeId: z.string().min(1, 'Node ID is required'),
  name: z.string().min(1, 'Warehouse Name is required'),
  phoneNumber: z.string().regex(/^[1-9][0-9]{7,14}$/, 'Phone Number must be 8-15 digits and not start with 0'),
  address: z.string().min(1, 'Address is required'),
  status: z.enum(['Active', 'Inactive']),
});

type FormValues = z.infer<typeof formSchema>;

const DashboardCardsDefinition: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodeType: 'Warehouse',
      nodeId: '',
      name: '',
      phoneNumber: '',
      address: '',
      status: 'Active',
    },
  });

  // Simulate Node ID generation (FR-001)
  const generateNodeId = async () => {
    setIsGeneratingId(true);
    try {
      // Mocking API call to get next sequence
      const sequence = '0001';
      form.setValue('nodeId', `WH${sequence}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Maximum sequence reached for Warehouse. Contact administrator.',
      });
    } finally {
      setIsGeneratingId(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log('Submitted Data:', data);
      
      toast({
        title: 'Success',
        description: 'Dashboard card definition saved successfully.',
      });
      
      form.reset({
        nodeType: 'Warehouse',
        nodeId: '',
        name: '',
        phoneNumber: '',
        address: '',
        status: 'Active',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">D.2.2 Dashboard Cards Definition</CardTitle>
          <CardDescription>
            Define new dashboard nodes and warehouse configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nodeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Node Type <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        if (val === 'Warehouse') generateNodeId();
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select node type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nodeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Node ID <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input {...field} readOnly className="bg-muted" />
                          {isGeneratingId && (
                            <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warehouse Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter unique warehouse name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full warehouse address" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Definition</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCardsDefinition;