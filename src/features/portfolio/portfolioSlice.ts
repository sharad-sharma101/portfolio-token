import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WatchListRowSerializable } from '../../utils'

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
    removeCoinFromRows: (state, action: { payload: string | number }) => {
      const updatedRows = state.watchListRows.filter( (e :WatchListRowSerializable ) => e.id !== action.payload );
      state.watchListRows = [ ...updatedRows ];
    },
  },
})

export const { changleModalState, setWatchListRows, removeCoinFromRows } = portfolioSlice.actions
export default portfolioSlice.reducer