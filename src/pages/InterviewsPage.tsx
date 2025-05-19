import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Grid3X3, List, Eye, Edit, Trash, 
  MoreVertical, Calendar, Users, Brain, Camera, Monitor,
  CreditCard, UserCheck, Upload, Link2
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
    imageUrl: '',
    type: InterviewType.LLM_BASED,
    numberOfQuestions: 10,
    questionComposition: {
      skills: 40,
      background: 20,
      education: 15,
      general: 15,
      language: 10,
    },
    verifyId: false,
    recordVideo: false,
    screenShare: false,
    ssnVerification: false,
    hiringManager: '',
    questions: [{ content: '', format: 'text' as const }],
  });

  // Filter interviews based on search query
  const filteredInterviews = interviews.filter(
    interview => interview.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                interview.jobDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a storage service
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl });
    }
  };

  const handleCreateInterview = () => {
    const newInterview = {
      id: `i${interviews.length + 1}`,
      name: formData.name,
      departmentId: formData.departmentId,
      jobDescription: formData.jobDescription,
      imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
      type: formData.type,
      questions: formData.type === InterviewType.MANUAL ? formData.questions : undefined,
      verifyId: formData.verifyId,
      recordVideo: formData.recordVideo,
      screenShare: formData.screenShare,
      ssnVerification: formData.ssnVerification,
      hiringManager: formData.hiringManager,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'u1',
    };
    
    setInterviews([...interviews, newInterview]);
    resetFormData();
    setIsCreateModalOpen(false);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      departmentId: '',
      jobDescription: '',
      imageUrl: '',
      type: InterviewType.LLM_BASED,
      numberOfQuestions: 10,
      questionComposition: {
        skills: 40,
        background: 20,
        education: 15,
        general: 15,
        language: 10,
      },
      verifyId: false,
      recordVideo: false,
      screenShare: false,
      ssnVerification: false,
      hiringManager: '',
      questions: [{ content: '', format: 'text' as const }],
    });
    setCurrentCreateStep(1);
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
          resetFormData();
        }}
        title={`Create Interview - Step ${currentCreateStep} of 3`}
        maxWidth="xl"
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <Select
              label="Department"
              options={mockDepartments.map(dept => ({ value: dept.id, label: dept.name }))}
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              required
            />
            
            <Input
              label="Hiring Manager"
              placeholder="Enter hiring manager's name"
              value={formData.hiringManager}
              onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
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
                disabled={!formData.name || !formData.departmentId || !formData.jobDescription || !formData.hiringManager}
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
                      <h4 className="font-medium text-gray-900">LLM-Based Interview with AI Response Analysis</h4>
                      <p className="text-sm text-gray-500">
                        AI automatically generates questions and evaluates responses using advanced language models.
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
                      <h4 className="font-medium text-gray-900">Manual Questions with LLM Response Analysis</h4>
                      <p className="text-sm text-gray-500">
                        Create your own questions while still leveraging AI for response analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                type="number"
                label="Number of Questions"
                min={5}
                max={30}
                value={formData.numberOfQuestions}
                onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) })}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Composition
                </label>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Technical Skills & Experience</span>
                      <span>{formData.questionComposition.skills}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.questionComposition.skills}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          skills: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Background & Experience Verification</span>
                      <span>{formData.questionComposition.background}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.questionComposition.background}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          background: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Educational Verification</span>
                      <span>{formData.questionComposition.education}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.questionComposition.education}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          education: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>General Knowledge</span>
                      <span>{formData.questionComposition.general}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.questionComposition.general}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          general: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Language Proficiency</span>
                      <span>{formData.questionComposition.language}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.questionComposition.language}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          language: parseInt(e.target.value)
                        }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentCreateStep(1)}
              >
                Previous Step
              </Button>
              
              <Button
                variant="primary"
                onClick={() => setCurrentCreateStep(3)}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}
        
        {currentCreateStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Verification Requirements</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Camera className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Record Video</h4>
                      <p className="text-sm text-gray-500">Record candidate's video during the interview</p>
                    </div>
                  </div>
                  <Toggle
                    isEnabled={formData.recordVideo}
                    onChange={() => setFormData({ ...formData, recordVideo: !formData.recordVideo })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Screen Sharing</h4>
                      <p className="text-sm text-gray-500">Require candidate to share their screen</p>
                    </div>
                  </div>
                  <Toggle
                    isEnabled={formData.screenShare}
                    onChange={() => setFormData({ ...formData, screenShare: !formData.screenShare })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">SSN Verification</h4>
                      <p className="text-sm text-gray-500">Request SSN for identity verification</p>
                    </div>
                  </div>
                  <Toggle
                    isEnabled={formData.ssnVerification}
                    onChange={() => setFormData({ ...formData, ssnVerification: !formData.ssnVerification })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">ID Verification</h4>
                      <p className="text-sm text-gray-500">Verify candidate's identity before interview</p>
                    </div>
                  </div>
                  <Toggle
                    isEnabled={formData.verifyId}
                    onChange={() => setFormData({ ...formData, verifyId: !formData.verifyId })}
                  />
                </div>
              </div>
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