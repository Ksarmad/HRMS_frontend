import { useAppDispatch, useAppSelector } from './redux';
import { fetchEmployees, createEmployee } from '../store/slices/employeeSlice';

export const useEmployees = () => {
  const dispatch = useAppDispatch();
  const employees = useAppSelector((state) => state.employees);

  return {
    ...employees,
    getEmployees: (params) => dispatch(fetchEmployees(params)),
    createEmployee: (data) => dispatch(createEmployee(data))
  };
};