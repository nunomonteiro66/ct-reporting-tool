import { Column, Header } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export const getCommonPinningStyles = <T extends Record<string, unknown>>(
  column: Column<T, unknown>,
  header?: Header<T, unknown> // ✅ pass header when available
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  // Use header.getStart() for accurate position on placeholder/group headers
  // Fall back to column.getStart() for body cells
  const leftOffset = header ? header.getStart('left') : column.getStart('left');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
      ? '4px 0 4px -4px gray inset'
      : undefined,
    left: isPinned === 'left' ? `${leftOffset}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export default getCommonPinningStyles;
