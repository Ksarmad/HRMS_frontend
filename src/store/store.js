import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import employeeSlice from './slices/employeeSlice';
import departmentSlice from './slices/departmentSlice';
// import designationSlice from './slices/designationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    employees: employeeSlice,
    departments: departmentSlice,
    // designations: designationSlice
  },
});

export default store;