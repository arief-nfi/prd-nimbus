import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Warehouse, 
  Users, 
  Package, 
  Ruler, 
  ClipboardList, 
  ShoppingCart, 
  FileUp, 
  Layers, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  category?: string;
}

const menuItems: NavItem[] = [
  { title: 'Dashboard', path: '/d21-dashboard-layout', icon: LayoutDashboard },
  { title: 'Warehouse Create', path: '/a71-warehouse-create-screen', icon: Warehouse, category: 'Master Data' },
  { title: 'Supplier Create', path: '/a73-supplier-create-screen', icon: Users, category: 'Master Data' },
  { title: 'Supplier List', path: '/a74-supplier-list-screen', icon: Users, category: 'Master Data' },
  { title: 'Item Create', path: '/a75-item-create-screen', icon: Package, category: 'Master Data' },
  { title: 'Item List', path: '/a76-item-list-screen', icon: Package, category: 'Master Data' },
  { title: 'UOM Create', path: '/a77-uom-create-screen', icon: Ruler, category: 'Master Data' },
  { title: 'UOM List', path: '/a78-uom-list-screen', icon: Ruler, category: 'Master Data' },
  { title: 'Inventory List', path: '/a79-inventory-list-screen', icon: ClipboardList, category: 'Inventory' },
  { title: 'Inventory View', path: '/a109-inventory-view', icon: ClipboardList, category: 'Inventory' },
  { title: 'PO List', path: '/b70-purchase-order-list-screen', icon: ShoppingCart, category: 'Procurement' },
  { title: 'PO Create', path: '/b71-purchase-order-create-screen', icon: ShoppingCart, category: 'Procurement' },
  { title: 'PO Item List', path: '/b72-po-item-list', icon: ShoppingCart, category: 'Procurement' },
  { title: 'Docs Upload', path: '/b107-document-upload-preview', icon: FileUp, category: 'System' },
  { title: 'Form Inputs', path: '/c72-form-inputs', icon: Layers, category: 'Components' },
  { title: 'Tree View', path: '/a103-tree-view-behavior', icon: Layers, category: 'Components' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const categories = Array.from(new Set(menuItems.map(item => item.category).filter(Boolean)));

  return (
    <aside 
      className={cn(
        "flex flex-col h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b">
        {!isCollapsed && <span className="font-bold text-xl tracking-tight">NIMBUS</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {categories.map(cat => (
          <div key={cat} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {cat}
              </h3>
            )}
            {menuItems
              .filter(item => item.category === cat)
              .map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
                  )}
                  title={isCollapsed ? item.title : ''}
                >
                  <item.icon size={20} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.title}</span>}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start p-2", isCollapsed ? "px-0 justify-center" : "")}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@nimbus.com</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
