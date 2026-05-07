import { HeaderGroup, Header, Table } from '@tanstack/react-table';

export function splitPinnedHeaderGroups<T extends Record<string, unknown>>(
  headerGroups: HeaderGroup<T>[],
  visibleColumns: string[]
): HeaderGroup<T>[] {
  return headerGroups.map((hg) => {
    const newHeaders: Header<T, unknown>[] = [];

    for (const header of hg.headers) {
      const isGroup = header.column.columns.length > 0;

      if (!isGroup || header.colSpan <= 1) {
        newHeaders.push(header);
        continue;
      }

      const leafColumns = header.column
        .getLeafColumns()
        .filter((leaf) => visibleColumns.includes(leaf.id));

      const allSamePinned = leafColumns.every(
        (col) => col.getIsPinned() === leafColumns[0].getIsPinned()
      );

      if (allSamePinned) {
        newHeaders.push(header);
        continue;
      }

      // Group consecutive leaves by pinning state
      const segments: {
        pinned: false | 'left' | 'right';
        leaves: typeof leafColumns;
      }[] = [];

      for (const leaf of leafColumns) {
        const pinState = leaf.getIsPinned();
        const last = segments[segments.length - 1];
        if (last && last.pinned === pinState) {
          last.leaves.push(leaf);
        } else {
          segments.push({ pinned: pinState, leaves: [leaf] });
        }
      }

      // One fake header per segment
      for (const segment of segments) {
        const firstLeaf = segment.leaves[0];
        const totalSize = segment.leaves.reduce(
          (sum, col) => sum + col.getSize(),
          0
        );

        newHeaders.push({
          ...header,
          id: `${header.id}-seg-${firstLeaf.id}`,
          colSpan: segment.leaves.length,
          // Override position/size methods to reflect this segment
          getSize: () => totalSize,
          getStart: (position?: 'left' | 'right') =>
            firstLeaf.getStart(position!),
          column: {
            ...header.column,
            getIsPinned: () => segment.pinned,
            getIsLastColumn: (pos: 'left' | 'right') =>
              segment.leaves[segment.leaves.length - 1].getIsLastColumn(pos),
            getIsFirstColumn: (pos: 'left' | 'right') =>
              segment.leaves[0].getIsFirstColumn(pos),
          } as any,
        } as unknown as Header<T, unknown>);
      }
    }

    return { ...hg, headers: newHeaders };
  });
}
