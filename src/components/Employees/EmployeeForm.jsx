import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createEmployee, updateEmployee, clearError } from '../../store/slices/employeeSlice';
import { fetchDepartments } from '../../store/slices/departmentSlice';
import { fetchDesignations } from '../../store/slices/designationSlice';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fileUploadService } from '../../services/fileUploadService';
import { toast } from 'react-toastify';
import { X, Upload, User, Building, Briefcase, Users, Calendar, DollarSign } from 'lucide-react';

const EmployeeForm = ({ employee = null, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.employees);
  const { list: departments } = useAppSelector((state) => state.departments);
  const { list: designations } = useAppSelector((state) => state.designations);
  const { list: managers } = useAppSelector((state) => state.employees);

  // const state = useAppSelector((state) => state);
  // console.log();
  

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    designation_id: '',
    manager_id: '',
    join_date: '',
    salary_structure_id: '',
    status: 'ACTIVE'
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  
  useEffect(() => {
    if (!dataFetched) {
      dispatch(fetchDepartments());
      dispatch(fetchDesignations());
        if (managers.length === 0) {
      dispatch(fetchEmployees({ limit: 100 }));
    }
      setDataFetched(true);
    }
  }, [dispatch, dataFetched]);

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        designation_id: employee.designation_id || '',
        manager_id: employee.manager_id || '',
        join_date: employee.join_date ? employee.join_date.split('T')[0] : '',
        salary_structure_id: employee.salary_structure_id || '',
        status: employee.status || 'ACTIVE'
      });
      
      if (employee.photo_url) {
        setPhotoPreview(employee.photo_url);
      }
    }
  }, [employee]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validation = fileUploadService.validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      setUploading(true);
      
      // Compress image before upload
      const compressedFile = await fileUploadService.compressImage(file);
      
      // Create preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setPhotoPreview(previewUrl);
      setPhoto(compressedFile);
      
      toast.success('Photo ready for upload');
    } catch (error) {
      toast.error('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Department is required';
    }

    if (!formData.designation_id) {
      newErrors.designation_id = 'Designation is required';
    }

    if (!formData.join_date) {
      newErrors.join_date = 'Join date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      let photoUrl = null;

      // Upload photo if selected
      if (photo) {
        const uploadResponse = await fileUploadService.uploadEmployeePhoto(photo);
        photoUrl = uploadResponse.data.url;
      }

      const employeeData = {
        ...formData,
        photo_url: photoUrl || employee?.photo_url,
        salary_structure_id:1


      };

      if (employee) {
        await dispatch(updateEmployee({ id: employee.id, employeeData })).unwrap();
        toast.success('Employee updated successfully');
      } else {
        await dispatch(createEmployee(employeeData)).unwrap();
        toast.success('Employee created successfully');
      }

      onSuccess?.();
      onClose?.();
      
    } catch (error) {
      toast.error(error.message || 'Failed to save employee');
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    URL.revokeObjectURL(photoPreview);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="mx-auto w-full max-w-4xl card p-0 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b shrink-0">
          <h2 className="text-2xl font-bold text-slate-900">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="btn btn-ghost p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Upload */}
            <div className="lg:col-span-1">
              <label className="form-label">Photo</label>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {photoPreview ? (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-32 w-32 rounded-full object-cover border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center ring-1 ring-slate-300">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer btn btn-secondary flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                  />
                </label>
                {uploading && (
                  <p className="text-sm text-slate-500 mt-2">Processing image...</p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-slate-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Job Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.department_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <select
                  name="designation_id"
                  value={formData.designation_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.designation_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Designation</option>
                  {designations.map(desig => (
                    <option key={desig.id} value={desig.id}>{desig.title}</option>
                  ))}
                </select>
                {errors.designation_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.designation_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager
                </label>
                <select
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.first_name} {manager.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Join Date *
                </label>
                <input
                  type="date"
                  name="join_date"
                  value={formData.join_date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                    errors.join_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.join_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.join_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="RESIGNED">Resigned</option>
                  <option value="TERMINATED">Terminated</option>
                </select>
              </div>
            </div>
          </div>

        </div>

          {/* Form Actions */}
          <div className="bg-white border-t p-4 sm:p-6 flex justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
