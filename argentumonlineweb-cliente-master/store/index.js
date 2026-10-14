// Store con Zustand para Argentum Online Web
import { create } from 'zustand';

// Estado inicial
const useStore = create((set) => ({
  // Estados principales del juego
  account: null,
  characters: [],
  map: null,
  initsLoaded: false,
  player: null,
  gameData: {},
  
  // Métodos para actualizar el estado
  setAccount: (account) => set({ account }),
  setCharacters: (characters) => set({ characters }),
  setMap: (map) => set({ map }),
  setInitsLoaded: (initsLoaded) => set({ initsLoaded }),
  setPlayer: (player) => set({ player }),
  setGameData: (gameData) => set({ gameData }),
  
  // Métodos específicos del juego
  addCharacter: (character) => set((state) => ({
    characters: [...state.characters, character]
  })),
  
  updateCharacter: (updatedCharacter) => set((state) => ({
    characters: state.characters.map(char => 
      char.id === updatedCharacter.id ? updatedCharacter : char
    )
  }))
}));

export default useStore;