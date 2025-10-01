import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { updateHoldingInLocalStorage, type WatchListRowSerializable } from '../../utils'

interface PortfolioState {
  modalOpenState: boolean;
  watchListRows: WatchListRowSerializable[];
}

const initialState: PortfolioState = {
  modalOpenState: false,
  watchListRows: [],
}

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    changleModalState: (state, action: PayloadAction<boolean>) => {
      state.modalOpenState = action.payload;
    },
    setWatchListRows: (state, action: PayloadAction<WatchListRowSerializable[]>) => {
      state.watchListRows = action.payload;
    },
    addNewlyAddedCoins: (state, action: PayloadAction<WatchListRowSerializable[]>) => {
      state.watchListRows = [ ...state.watchListRows, ...action.payload];
    },
    removeCoinFromRows: (state, action: { payload: string | number }) => {
      const updatedRows = state.watchListRows.filter( (e :WatchListRowSerializable ) => e.id !== action.payload );
      state.watchListRows = [ ...updatedRows ];
    },
    makeRowHoldingEditable: (state, action: { payload: string | number }) => {
      const updatedRows = state.watchListRows.map( (e :WatchListRowSerializable ) => {
        if(e.id === action.payload) return {...e, isEditable: true}
        return { ...e };
      });
      state.watchListRows = [ ...updatedRows ];
    },
    changeHolding: (state, action: { payload: { id: string | number, holding: number } }) => {
      const updatedRows = state.watchListRows.map( (e :WatchListRowSerializable ) => {
        if(e.id === action.payload.id) return {...e, holding: action.payload.holding, isEditable: false}
        return { ...e };
      });
      state.watchListRows = [ ...updatedRows ];

      updateHoldingInLocalStorage(action.payload.id, action.payload.holding);
    },
  },
})

export const { changleModalState, setWatchListRows, removeCoinFromRows, makeRowHoldingEditable, changeHolding, addNewlyAddedCoins } = portfolioSlice.actions
export default portfolioSlice.reducer