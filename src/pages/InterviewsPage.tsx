import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Grid3X3, List, Eye, Edit, Trash, 
  MoreVertical, Calendar, Users, Brain 
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import Badge from '../components/ui/Badge';
import { mockInterviews, mockDepartments } from '../data/mockData';
import { InterviewType } from '../types';

const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState(mockInterviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);
  const [currentCreateStep, setCurrentCreateStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    departmentId: '',
    jobDescription: '',
    type: InterviewType.LLM_BASED,
    verifyId: false,
    questions: [{ content: '', format: 'text' as const }],
  });

  // Filter interviews based on search query
  const filteredInterviews = interviews.filter(
    interview => interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                interview.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...(formData.questions || []), { content: '', format: 'text' as const }],
    });
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...(formData.questions || [])];
    updatedQuestions[index] = { ...updatedQuestions[index], content: value };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleCreateInterview = () => {
    const newInterview = {
      id: `i${interviews.length + 1}`,
      name: formData.name,
      departmentId: formData.departmentId,
      jobDescription: formData.jobDescription,
      type: formData.type,
      questions: formData.type === InterviewType.MANUAL ? formData.questions : undefined,
      verifyId: formData.verifyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'u1', // Current user's ID would normally go here
    };
    
    setInterviews([...interviews, newInterview]);
    setFormData({
      name: '',
      departmentId: '',
      jobDescription: '',
      type: InterviewType.LLM_BASED,
      verifyId: false,
      questions: [{ content: '', format: 'text' as const }],
    });
    setCurrentCreateStep(1);
    setIsCreateModalOpen(false);
  };

  const handleDeleteInterview = () => {
    if (!interviewToDelete) return;
    
    const updatedInterviews = interviews.filter(interview => interview.id !== interviewToDelete);
    setInterviews(updatedInterviews);
    setInterviewToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = (interviewId: string) => {
    setInterviewToDelete(interviewId);
    setIsDeleteModalOpen(true);
  };

  const InterviewGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredInterviews.map((interview) => (
        <Card key={interview.id} className="animate-fade-in" interactive onClick={() => window.location.href = `/interviews/${interview.id}`}>
          <div className="h-36 bg-gray-200 relative overflow-hidden">
            {interview.imageUrl && (
              <img 
                src={interview.imageUrl} 
                alt={interview.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                {interview.type === InterviewType.LLM_BASED ? 'LLM Based' : 'Manual'}
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-1">{interview.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {interview.jobDescription.substring(0, 100)}
                  {interview.jobDescription.length > 100 ? '...' : ''}
                </p>
              </div>
              <div className="relative">
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle dropdown menu
                  }}
                >
                  <MoreVertical size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  {interview.type === InterviewType.LLM_BASED ? (
                    <Brain size={14} className="mr-1 text-primary-500" />
                  ) : (
                    <FileText size={14} className="mr-1 text-secondary-500" />
                  )}
                  <span>
                    {interview.type === InterviewType.LLM_BASED ? 'AI Interview' : 'Manual Questions'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const InterviewListView = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interview
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredInterviews.map((interview) => {
            const department = mockDepartments.find(d => d.id === interview.departmentId);
            
            return (
              <tr key={interview.id} className="hover:bg-gray-50" onClick={() => window.location.href = `/interviews/${interview.id}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-50 rounded-full mr-3">
                      <FileText size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{interview.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {interview.jobDescription.substring(0, 50)}
                        {interview.jobDescription.length > 50 ? '...' : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {department?.name || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={interview.type === InterviewType.LLM_BASED ? 'primary' : 'secondary'}>
                    {interview.type === InterviewType.LLM_BASED ? 'LLM Based' : 'Manual'}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(interview.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/interviews/${interview.id}`;
                    }}
                    icon={<Eye size={16} />}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/interviews/${interview.id}/edit`;
                    }}
                    icon={<Edit size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(interview.id);
                    }}
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
    </div>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600 mt-1">
            Create and manage interview processes
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Interview
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
            placeholder="Search interviews..."
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
      
      {filteredInterviews.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No interviews found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first interview to get started'}
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Interview
          </Button>
        </div>
      ) : (
        viewType === 'grid' ? <InterviewGridView /> : <InterviewListView />
      )}
      
      {/* Create Interview Modal */}
      <Modal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCurrentCreateStep(1);
          setFormData({
            name: '',
            departmentId: '',
            jobDescription: '',
            type: InterviewType.LLM_BASED,
            verifyId: false,
            questions: [{ content: '', format: 'text' as const }],
          });
        }}
        title={`Create Interview - Step ${currentCreateStep} of ${formData.type === InterviewType.LLM_BASED ? 2 : 3}`}
      >
        {currentCreateStep === 1 && (
          <div className="space-y-4">
            <Input
              label="Interview Name"
              placeholder="e.g. Senior Frontend Developer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Select
              label="Department"
              options={mockDepartments.map(dept => ({ value: dept.id, label: dept.name }))}
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Describe the role and requirements"
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setCurrentCreateStep(2)}
                disabled={!formData.name || !formData.departmentId || !formData.jobDescription}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}
        
        {currentCreateStep === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Interview Type</h3>
              
              <div className="space-y-3">
                <div 
                  className={`
                    p-4 border rounded-lg cursor-pointer
                    ${formData.type === InterviewType.LLM_BASED ? 
                      'border-primary-500 bg-primary-50' : 
                      'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setFormData({ ...formData, type: InterviewType.LLM_BASED })}
                >
                  <div className="flex items-start">
                    <div className="mr-4">
                      <Brain size={24} className="text-primary-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">LLM-Based Interview</h4>
                      <p className="text-sm text-gray-500">
                        AI automatically generates questions based on the job description and evaluates responses.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`
                    p-4 border rounded-lg cursor-pointer
                    ${formData.type === InterviewType.MANUAL ? 
                      'border-secondary-500 bg-secondary-50' : 
                      'border-gray-200 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setFormData({ ...formData, type: InterviewType.MANUAL })}
                >
                  <div className="flex items-start">
                    <div className="mr-4">
                      <FileText size={24} className="text-secondary-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Manual Questions</h4>
                      <p className="text-sm text-gray-500">
                        Create your own set of predefined questions for the interview.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-gray-900">Verify Candidate Identity</h3>
                <p className="text-sm text-gray-500">Require ID verification before the interview</p>
              </div>
              <Toggle 
                isEnabled={formData.verifyId}
                onChange={() => setFormData({ ...formData, verifyId: !formData.verifyId })}
              />
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentCreateStep(1)}
              >
                Previous Step
              </Button>
              
              {formData.type === InterviewType.LLM_BASED ? (
                <Button
                  variant="primary"
                  onClick={handleCreateInterview}
                >
                  Create Interview
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => setCurrentCreateStep(3)}
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        )}
        
        {currentCreateStep === 3 && formData.type === InterviewType.MANUAL && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 mb-3">Interview Questions</h3>
            
            <div className="space-y-4">
              {formData.questions?.map((question, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Question {index + 1}
                      </label>
                      {index > 0 && (
                        <button
                          type="button"
                          className="text-red-600 text-sm hover:text-red-800"
                          onClick={() => {
                            const updatedQuestions = [...(formData.questions || [])];
                            updatedQuestions.splice(index, 1);
                            setFormData({ ...formData, questions: updatedQuestions });
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={2}
                      placeholder="Enter your question here"
                      value={question.content}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Response Type
                    </label>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                      value={question.format}
                      onChange={(e) => {
                        const updatedQuestions = [...(formData.questions || [])];
                        updatedQuestions[index] = { 
                          ...updatedQuestions[index], 
                          format: e.target.value as 'text' | 'multiple_choice' | 'yes_no' 
                        };
                        setFormData({ ...formData, questions: updatedQuestions });
                      }}
                    >
                      <option value="text">Text Response</option>
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="yes_no">Yes/No</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={handleAddQuestion}
                className="w-full"
              >
                + Add Another Question
              </Button>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentCreateStep(2)}
              >
                Previous Step
              </Button>
              
              <Button
                variant="primary"
                onClick={handleCreateInterview}
                disabled={
                  !formData.questions ||
                  formData.questions.length === 0 ||
                  formData.questions.some(q => !q.content)
                }
              >
                Create Interview
              </Button>
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setInterviewToDelete(null);
        }}
        title="Delete Interview"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this interview? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setInterviewToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteInterview}
            >
              Delete Interview
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterviewsPage;