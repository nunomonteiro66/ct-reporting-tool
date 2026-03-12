import { useState } from 'react';
import './styles.css';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { SortableListItem } from '@/types/sortable-list';
import Column from './column';
import Item from './item';

type SortableListProps = {
  items: SortableListItem[];
  onItemsChange: (items: SortableListItem[]) => void;
};

const SortableList = ({ items, onItemsChange }: SortableListProps) => {
  const [columnOrder, setColumnOrder] = useState(() => Object.keys(items));

  return (
    <DragDropProvider
      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (source?.type === 'column') return;

        onItemsChange((items) => move(items, event));
      }}
      onDragEnd={(event) => {
        const { source, target } = event.operation;

        if (!source || event.canceled || source.type !== 'column') return;

        setColumnOrder((columns) => move(columns, event));
      }}
    >
      <div className="Root">
        {columnOrder.map((column, columnIndex) => (
          <Column key={column} id={column} index={columnIndex}>
            {items[column].map((id, index) => (
              <Item key={id} id={id} index={index} column={column} />
            ))}
          </Column>
        ))}
      </div>
    </DragDropProvider>
  );
};

export default SortableList;
