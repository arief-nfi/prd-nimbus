import { format } from 'date-fns';

/**
 * Regenerates PO ID based on node type, date, and a sequence number.
 * Fulfills requirement: If PO Date changes before Submit, PO ID regenerates with new date.
 */
export const generatePoId = (nodeType: string, date: Date, sequence: number): string => {
  const prefix = nodeType === 'Warehouse' ? 'WH' : 'PO';
  const datePart = format(date, 'ddMMyy');
  const sequencePart = sequence.toString().padStart(4, '0');
  
  return `${prefix}${datePart}${sequencePart}`;
};