import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Users, MoreVertical, Grid3X3, List, Edit, Trash 
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { mockDepartments } from '../data/mockData';

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    dept => dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDepartment = () => {
    const newDepartment = {
      id: `d${departments.length + 1}`,
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setDepartments([...departments, newDepartment]);
    setFormData({ name: '', description: '' });
    setIsCreateModalOpen(false);
  };

  const handleEditDepartment = () => {
    if (!departmentToEdit) return;
    
    const updatedDepartments = departments.map(dept => 
      dept.id === departmentToEdit 
        ? { 
            ...dept, 
            name: formData.name, 
            description: formData.description,
            updatedAt: new Date().toISOString()
          } 
        : dept
    );
    
    setDepartments(updatedDepartments);
    setDepartmentToEdit(null);
    setFormData({ name: '', description: '' });
    setIsEditModalOpen(false);
  };

  const handleDeleteDepartment = () => {
    if (!departmentToDelete) return;
    
    const updatedDepartments = departments.filter(dept => dept.id !== departmentToDelete);
    setDepartments(updatedDepartments);
    setDepartmentToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (department: typeof departments[0]) => {
    setDepartmentToEdit(department.id);
    setFormData({
      name: department.name,
      description: department.description,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (departmentId: string) => {
    setDepartmentToDelete(departmentId);
    setIsDeleteModalOpen(true);
  };

  const DepartmentGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDepartments.map((department) => (
        <Card key={department.id} className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-primary-50 rounded-full mr-4">
                  <Building2 size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{department.name}</h3>
                  <p className="text-sm text-gray-500">{department.description}</p>
                </div>
              </div>
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
                <div className="absolute right-0 top-8 bg-white shadow-lg rounded-md py-1 w-32 z-10 hidden group-hover:block">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => openEditModal(department)}
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    onClick={() => openDeleteModal(department.id)}
                  >
                    <Trash size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Users size={16} className="mr-2" />
                {department.managerId ? '1 Manager' : 'No Manager Assigned'}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Created on {new Date(department.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(department)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => openDeleteModal(department.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const DepartmentListView = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manager
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredDepartments.map((department) => (
            <tr key={department.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-50 rounded-full mr-3">
                    <Building2 size={16} className="text-primary-600" />
                  </div>
                  <div className="font-medium text-gray-900">{department.name}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 max-w-xs truncate">{department.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(department.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {department.managerId ? 'Assigned' : 'None'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={() => openEditModal(department)}
                  icon={<Edit size={16} />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => openDeleteModal(department.id)}
                  icon={<Trash size={16} />}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">
            Manage your organization's departments
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Department
          </Button>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search departments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewType === 'grid' ? 'primary' : 'outline'}
            className="px-3"
            onClick={() => setViewType('grid')}
            icon={<Grid3X3 size={18} />}
          />
          <Button
            variant={viewType === 'list' ? 'primary' : 'outline'}
            className="px-3"
            onClick={() => setViewType('list')}
            icon={<List size={18} />}
          />
        </div>
      </div>
      
      {filteredDepartments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No departments found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first department to get started'}
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Department
          </Button>
        </div>
      ) : (
        viewType === 'grid' ? <DepartmentGridView /> : <DepartmentListView />
      )}
      
      {/* Create Department Modal */}
      <Modal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', description: '' });
        }}
        title="Add Department"
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Engineering"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Describe the department's role"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateDepartment}
              disabled={!formData.name}
            >
              Create Department
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setDepartmentToEdit(null);
          setFormData({ name: '', description: '' });
        }}
        title="Edit Department"
      >
        <div className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Engineering"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Describe the department's role"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setDepartmentToEdit(null);
                setFormData({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditDepartment}
              disabled={!formData.name}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDepartmentToDelete(null);
        }}
        title="Delete Department"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this department? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDepartmentToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteDepartment}
            >
              Delete Department
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;