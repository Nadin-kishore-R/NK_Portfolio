import { useContentStore, useEditModeStore } from '../store';

/**
 * useEditMode — convenience hook that surfaces edit mode state
 * and common edit-mode actions in one place.
 */
export function useEditMode() {
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const setEditMode = useEditModeStore((s) => s.setEditMode);
  const saveAll = useContentStore((s) => s.saveAll);

  const exitEditMode = () => {
    saveAll();
    setEditMode(false);
  };

  const saveChanges = () => {
    saveAll();
  };

  return { isEditMode, exitEditMode, saveChanges };
}
