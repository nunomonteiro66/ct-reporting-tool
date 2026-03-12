import { useSortable } from '@dnd-kit/react/sortable';

type ItemProps = {
  id: string;
  index: number;
  column: string;
};

const Item = ({ id, index, column }: ItemProps) => {
  console.log(id, index, column);
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: column,
  });

  return (
    <button className="Item" ref={ref} data-dragging={isDragging}>
      {id}
    </button>
  );
};

export default Item;
