import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Warehouse as WarehouseIcon } from 'lucide-react';

const warehouseSchema = z.object({
  nodeType: z.enum(['Warehouse', 'Store', 'Distribution Center'], {
    required_error: "Node Type is required",
  }),
  nodeId: z.string().min(1, "Node ID is required"),
  name: z.string().min(1, "Warehouse Name is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().regex(/^[1-9][0-9]{7,14}$/, {
    message: "Phone Number must be 8-15 digits and cannot start with 0 (VR-002)",
  }),
  status: z.enum(['Active', 'Inactive']).default('Active'),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

const D21DashboardLayout: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      nodeType: 'Warehouse',
      nodeId: 'WH0001', // Mock auto-populated
      name: '',
      address: '',
      phoneNumber: '',
      status: 'Active',
    },
  });

  const onSubmit = async (data: WarehouseFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock unique name check (VR-001)
      if (data.name.toLowerCase() === 'existing') {
        form.setError('name', { message: 'Name must be unique system-wide' });
        return;
      }

      toast({
        title: "Success",
        description: "Warehouse created successfully (WH0001)",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">D.2.1 Dashboard Layout</h1>
        <p className="text-muted-foreground">Manage system nodes and warehouse configurations.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WarehouseIcon className="h-5 w-5" />
            Create New Warehouse Node
          </CardTitle>
          <CardDescription>
            Enter the details for the new warehouse node. Fields marked with <span className="text-red-500">*</span> are mandatory (VR-004).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nodeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Node Type <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select node type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Warehouse">Warehouse</SelectItem>
                          <SelectItem value="Store">Store</SelectItem>
                          <SelectItem value="Distribution Center">Distribution Center</SelectItem>
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
                        <Input {...field} readOnly className="bg-muted" />
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
                      <Input placeholder="e.g. 8123456789 (no leading 0)" {...field} />
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
                        placeholder="Enter full warehouse address" 
                        className="min-height-[100px]"
                        {...field} 
                      />
                    </FormControl>
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
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Create Node</>
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

export default D21DashboardLayout;