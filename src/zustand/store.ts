import { create } from 'zustand';
import { PlayerInfoType } from '@/pages/personal/api';

interface PlayerState {
  playerInfo: PlayerInfoType | null;
  setPlayerInfo: (playerInfo: PlayerInfoType) => void;
}

const useStore = create<PlayerState>((set) => ({
  playerInfo: null,
  setPlayerInfo: (playerInfo) => set(() => ({playerInfo})),
}));

export default useStore;
