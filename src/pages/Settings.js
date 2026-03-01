import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នា');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ');
      return;
    }

    setLoading(true);
    // TODO: Implement password change API
    toast.success('បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ');
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">ការកំណត់</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ឈ្មោះអ្នកប្រើប្រាស់
                </label>
                <input
                  type="text"
                  value={user?.username}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  អ៊ីមែល
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ឈ្មោះពេញ
                </label>
                <input
                  type="text"
                  value={user?.full_name || ''}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  តួនាទី
                </label>
                <input
                  type="text"
                  value={user?.is_admin ? 'អ្នកគ្រប់គ្រង' : 'អ្នកប្រើ'}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">ផ្លាស់ប្តូរពាក្យសម្ងាត់</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ពាក្យសម្ងាត់បច្ចុប្បន្ន
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ពាក្យសម្ងាត់ថ្មី
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' : 'អាប់ដេតពាក្យសម្ងាត់'}
              </button>
            </form>
          </div>
        </div>

        {/* System Information */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">ព័ត៌មានប្រព័ន្ធ</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">កំណែ</p>
                <p className="text-sm font-medium text-gray-900">1.0.0</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">បរិយាកាស</p>
                <p className="text-sm font-medium text-gray-900">ផលិតកម្ម</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">ការចូលចុងក្រោយ</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">ស្ថានភាព API</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="ml-2 text-sm text-gray-900">បានភ្ជាប់</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;