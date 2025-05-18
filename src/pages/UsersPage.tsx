import React, { useState } from 'react';
import { 
  Users, Plus, Search, Shield, Edit, Trash, MoreVertical, 
  Settings, UserPlus 
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { mockUsers, mockDepartments, mockPermissions } from '../data/mockData';
import { UserRole } from '../types';
import Avatar from '../components/ui/Avatar';

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [userForPermissions, setUserForPermissions] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.HIRING_MANAGER,
    department: '',
  });

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEditModal = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || '',
      });
      setUserToEdit(userId);
      setIsEditModalOpen(true);
    }
  };

  const handleOpenDeleteModal = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const handleOpenPermissionsModal = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setUserForPermissions(userId);
      setUserPermissions(user.permissions.map(p => p.id));
      setIsPermissionsModalOpen(true);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (userPermissions.includes(permissionId)) {
      setUserPermissions(userPermissions.filter(id => id !== permissionId));
    } else {
      setUserPermissions([...userPermissions, permissionId]);
    }
  };

  const getUserRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.ADMIN:
        return 'bg-primary-100 text-primary-800';
      case UserRole.HIRING_MANAGER:
        return 'bg-secondary-100 text-secondary-800';
      case UserRole.CANDIDATE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add User
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first user to get started'}
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add User
          </Button>
        </div>
      ) : (
        <Card className="animate-fade-in">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const departmentName = user.department 
                  ? mockDepartments.find(d => d.id === user.department)?.name || 'Unknown' 
                  : 'None';
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar 
                          src={user.avatar}
                          alt={user.name}
                          size="sm"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserRoleBadgeColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {departmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Shield size={14} />}
                        onClick={() => handleOpenPermissionsModal(user.id)}
                      >
                        {user.permissions.length} Permissions
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleOpenEditModal(user.id)}
                        icon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleOpenDeleteModal(user.id)}
                        icon={<Trash size={16} />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
      
      {/* Create User Modal */}
      <Modal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({
            name: '',
            email: '',
            role: UserRole.HIRING_MANAGER,
            department: '',
          });
        }}
        title="Add User"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Select
            label="Role"
            options={[
              { value: UserRole.ADMIN, label: 'Admin' },
              { value: UserRole.HIRING_MANAGER, label: 'Hiring Manager' },
              { value: UserRole.CANDIDATE, label: 'Candidate' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            required
          />
          
          <Select
            label="Department"
            options={[
              { value: '', label: 'None' },
              ...mockDepartments.map(dept => ({ value: dept.id, label: dept.name })),
            ]}
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({
                  name: '',
                  email: '',
                  role: UserRole.HIRING_MANAGER,
                  department: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<UserPlus size={16} />}
            >
              Create User
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setUserToEdit(null);
          setFormData({
            name: '',
            email: '',
            role: UserRole.HIRING_MANAGER,
            department: '',
          });
        }}
        title="Edit User"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <Select
            label="Role"
            options={[
              { value: UserRole.ADMIN, label: 'Admin' },
              { value: UserRole.HIRING_MANAGER, label: 'Hiring Manager' },
              { value: UserRole.CANDIDATE, label: 'Candidate' },
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            required
          />
          
          <Select
            label="Department"
            options={[
              { value: '', label: 'None' },
              ...mockDepartments.map(dept => ({ value: dept.id, label: dept.name })),
            ]}
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setUserToEdit(null);
                setFormData({
                  name: '',
                  email: '',
                  role: UserRole.HIRING_MANAGER,
                  department: '',
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Permissions Modal */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => {
          setIsPermissionsModalOpen(false);
          setUserForPermissions(null);
          setUserPermissions([]);
        }}
        title="Manage Permissions"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {userForPermissions && (
            <p className="text-sm text-gray-600">
              Managing permissions for{' '}
              <span className="font-medium text-gray-900">
                {mockUsers.find(u => u.id === userForPermissions)?.name}
              </span>
            </p>
          )}
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockPermissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {permission.name.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {permission.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={userPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsPermissionsModalOpen(false);
                setUserForPermissions(null);
                setUserPermissions([]);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={<Shield size={16} />}
            >
              Save Permissions
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;