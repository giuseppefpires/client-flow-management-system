
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface DataTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export const DataTableActions: React.FC<DataTableActionsProps> = ({
  onEdit,
  onDelete,
  editLabel = 'Editar',
  deleteLabel = 'Excluir'
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        title={editLabel}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        title={deleteLabel}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
