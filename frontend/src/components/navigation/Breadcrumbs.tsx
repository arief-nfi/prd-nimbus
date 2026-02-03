import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground py-4">
      <Link 
        to="/d21-dashboard-layout" 
        className="hover:text-foreground transition-colors flex items-center"
      >
        <Home size={16} />
      </Link>
      
      {pathnames.length > 0 && <ChevronRight size={14} className="shrink-0" />}
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        
        // Format the path name: remove ID prefixes and replace hyphens with spaces
        const name = value
          .replace(/^[a-z]\d+-/i, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <React.Fragment key={to}>
            {last ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {name}
              </span>
            ) : (
              <>
                <Link 
                  to={to} 
                  className="hover:text-foreground transition-colors truncate max-w-[150px]"
                >
                  {name}
                </Link>
                <ChevronRight size={14} className="shrink-0" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
