import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from './Breadcrumbs';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px]">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex-1">
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-2">
          {/* Additional navbar actions like notifications or search can go here */}
        </div>
      </div>
    </header>
  );
}
