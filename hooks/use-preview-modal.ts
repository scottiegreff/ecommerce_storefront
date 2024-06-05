import { create } from 'zustand';

import { Product, Service } from '@/types';

interface PreviewModalStore {
  isOpen: boolean;
  data?: Product | Service;
  onOpen: (data: Product | Service) => void;
  onClose: () => void;
}

const usePreviewModal = create<PreviewModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: Product | Service ) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export default usePreviewModal;
