import { useState, useCallback } from 'react';

/**
 * Manages heatmap interaction state.
 *
 * hovered      — {i, j} | null
 * selected     — [{i, j}]  (shift-click appends, plain click replaces)
 * dragRegion   — {i0, j0, i1, j1} | null  (while dragging)
 */
export function useSelection() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState([]);
  const [dragRegion, setDragRegion] = useState(null);

  const hover = useCallback((cell) => setHovered(cell), []);
  const clearHover = useCallback(() => setHovered(null), []);

  const select = useCallback((cell, shiftKey = false) => {
    if (!cell) {
      setSelected([]);
      return;
    }
    setSelected((prev) => {
      if (shiftKey) {
        const exists = prev.some((c) => c.i === cell.i && c.j === cell.j);
        return exists
          ? prev.filter((c) => !(c.i === cell.i && c.j === cell.j))
          : [...prev, cell];
      }
      const alreadySingle =
        prev.length === 1 && prev[0].i === cell.i && prev[0].j === cell.j;
      return alreadySingle ? [] : [cell];
    });
  }, []);

  const clearSelection = useCallback(() => setSelected([]), []);

  const startDrag = useCallback((cell) => {
    setDragRegion({ i0: cell.i, j0: cell.j, i1: cell.i, j1: cell.j });
  }, []);

  const updateDrag = useCallback((cell) => {
    setDragRegion((prev) =>
      prev ? { ...prev, i1: cell.i, j1: cell.j } : null
    );
  }, []);

  const endDrag = useCallback((getResult, matrix) => {
    if (!dragRegion) return;
    const { i0, j0, i1, j1 } = dragRegion;
    const iMin = Math.min(i0, i1);
    const iMax = Math.max(i0, i1);
    const jMin = Math.min(j0, j1);
    const jMax = Math.max(j0, j1);
    const cells = [];
    for (let i = iMin; i <= iMax; i++) {
      for (let j = jMin; j <= jMax; j++) {
        const val = matrix?.[i]?.[j];
        if (val !== null && val !== undefined) {
          cells.push({ i, j });
        }
      }
    }
    setSelected(cells);
    setDragRegion(null);
  }, [dragRegion]);

  const cancelDrag = useCallback(() => setDragRegion(null), []);

  const isSelected = useCallback(
    (i, j) => selected.some((c) => c.i === i && c.j === j),
    [selected]
  );

  const isInDragRegion = useCallback(
    (i, j) => {
      if (!dragRegion) return false;
      const { i0, j0, i1, j1 } = dragRegion;
      return (
        i >= Math.min(i0, i1) &&
        i <= Math.max(i0, i1) &&
        j >= Math.min(j0, j1) &&
        j <= Math.max(j0, j1)
      );
    },
    [dragRegion]
  );

  return {
    hovered,
    selected,
    dragRegion,
    hover,
    clearHover,
    select,
    clearSelection,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    isSelected,
    isInDragRegion,
  };
}
