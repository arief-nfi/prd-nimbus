import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Warehouse as WarehouseIcon } from 'lucide-react';
import { Warehouse } from '@/types/warehouse';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WarehouseTreeItemProps {
  warehouse: Warehouse;
  depth?: number;
}

export const WarehouseTreeItem: React.FC<WarehouseTreeItemProps> = ({ warehouse, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = warehouse.children && warehouse.children.length > 0;

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center py-2 px-4 hover:bg-accent/50 transition-colors rounded-md cursor-pointer",
          depth > 0 && "ml-4 border-l"
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 flex-1">
          {hasChildren ? (
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          ) : (
            <div className="w-6" />
          )}
          <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{warehouse.name}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {warehouse.code}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {warehouse.status}
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="mt-1 ml-4">
          {warehouse.children?.map((child) => (
            <WarehouseTreeItem key={child.id} warehouse={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};