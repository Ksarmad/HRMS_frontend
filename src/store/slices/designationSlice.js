// src/redux/slices/designationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { designationService } from '../../services/designationService';

// Thunk to fetch all designations
export const fetchDesignations = createAsyncThunk(
  'designations/fetchDesignations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await designationService.getDesignations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
    }
  }
);

const designationSlice = createSlice({
  name: 'designations',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.designations; 
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = designationSlice.actions;
export default designationSlice.reducer;
