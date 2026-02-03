import React from 'react';
import { useItemGrid } from '../hooks/useItemGrid';
import { ItemInput } from '../../../shared/validation/item-validation.schema';

interface ItemGridProps {
  initialItems: ItemInput[];
  onUpdate: (items: ItemInput[]) => void;
}

export const ItemGrid: React.FC<ItemGridProps> = ({ initialItems, onUpdate }) => {
  const { items, removeItem, error } = useItemGrid(initialItems);

  const handleDelete = (index: number) => {
    const success = removeItem(index);
    if (success) {
      onUpdate(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="item-grid-container">
      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}
      
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || index}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>
                <button 
                  type="button"
                  onClick={() => handleDelete(index)}
                  aria-label="Delete item"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};