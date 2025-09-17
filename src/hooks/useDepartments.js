import { useAppDispatch, useAppSelector } from './redux';
import { fetchDepartments } from '../store/slices/departmentSlice';

export const useDepartments = () => {
  const dispatch = useAppDispatch();
  const departments = useAppSelector((state) => state.departments);

  return {
    ...departments,
    getDepartments: () => dispatch(fetchDepartments())
  };
};