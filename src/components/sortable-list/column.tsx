import { useSortable } from '@dnd-kit/react/sortable';
import { ReactNode } from 'react';
import { CollisionPriority } from '@dnd-kit/abstract';

type ColumnProps = {
  id: string;
  index: number;
  children: ReactNode;
};

const Column = ({ children, id, index }: ColumnProps) => {
  const { ref } = useSortable({
    id,
    index,
    type: 'column',
    collisionPriority: CollisionPriority.Low,
    accept: ['item', 'column'],
  });

  return (
    <div className="Column" ref={ref}>
      {children}
    </div>
  );
};

export default Column;
