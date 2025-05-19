import React, { useState } from 'react';
import { 
  FileText, Plus, Search, Grid3X3, List, Eye, Edit, Trash, 
  MoreVertical, Calendar, Users, Brain, Camera, Monitor,
  CreditCard, UserCheck, Upload, Link2, Copy
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import Badge from '../components/ui/Badge';
import { mockInterviews, mockDepartments } from '../data/mockData';
import { InterviewType, Interview, Question } from '../types';

interface InterviewFormData extends Interview {
  numberOfQuestions: number;
  questionComposition: {
    skills: number;
    background: number;
    education: number;
    general: number;
    language: number;
  };
}

const InterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState(mockInterviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);
  const [currentCreateStep, setCurrentCreateStep] = useState(1);
  const [formData, setFormData] = useState<InterviewFormData>({
    id: '', // Will be generated on create or filled on edit
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
    questions: [{ id: Date.now().toString(), content: '', format: 'text' as const }],
    createdAt: '', // Will be generated on create or filled on edit
    updatedAt: '', // Will be generated on create or filled on edit
    createdBy: '', // Will be filled on create or filled on edit
  });

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [interviewToShare, setInterviewToShare] = useState<typeof mockInterviews[0] | null>(null);
  const [candidateEmails, setCandidateEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null);

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
      verifyId: formData.verifyId,
      recordVideo: formData.recordVideo,
      screenShare: formData.screenShare,
      ssnVerification: formData.ssnVerification,
      hiringManager: formData.hiringManager,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'u1', // Assuming a default creator for now
      // Conditionally add questions only for MANUAL type
      ...(formData.type === InterviewType.MANUAL && { questions: formData.questions }),
    };
    
    setInterviews([...interviews, newInterview]);
    resetFormData();
    setIsCreateModalOpen(false);
  };

  const resetFormData = () => {
    setFormData({
      id: '',
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
      questions: [{ id: Date.now().toString(), content: '', format: 'text' as const }],
      createdAt: '',
      updatedAt: '',
      createdBy: '',
    });
    setCurrentCreateStep(1);
    setIsEditing(false);
    setEditingInterviewId(null);
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

  const openShareModal = (interview: Interview) => {
    setInterviewToShare(interview);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setInterviewToShare(null);
    setCandidateEmails([]);
    setNewEmail('');
  };

  const openEditModal = (interview: Interview) => {
    setIsEditing(true);
    setEditingInterviewId(interview.id);
    setFormData({
      ...interview,
      numberOfQuestions: interview.questions?.length || 10, // Assuming default 10 for LLM if questions is undefined
      questionComposition: interview.questionComposition || { // Use existing if available, otherwise default
        skills: 40,
        background: 20,
        education: 15,
        general: 15,
        language: 10,
      },
      recordVideo: interview.recordVideo || false,
      screenShare: interview.screenShare || false,
      ssnVerification: interview.ssnVerification || false,
      hiringManager: interview.hiringManager || '',
      questions: interview.questions || [{ id: Date.now().toString(), content: '', format: 'text' }], // Ensure questions is always an array with at least one question for manual type
    });
    setIsCreateModalOpen(true);
  };

  const handleAddCandidateEmail = () => {
    if (newEmail && !candidateEmails.includes(newEmail)) {
      setCandidateEmails([...candidateEmails, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveCandidateEmail = (emailToRemove: string) => {
    setCandidateEmails(candidateEmails.filter(email => email !== emailToRemove));
  };

  const handlePasteEmails = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const pastedText = e.target.value;
    const emails = pastedText.split(/[,;\s]+/).map(email => email.trim()).filter(email => email && !candidateEmails.includes(email));
    setCandidateEmails([...candidateEmails, ...emails]);
    e.target.value = ''; // Clear the textarea after pasting
  };

  const handleCopyInterviewLink = (interviewId: string) => {
    const interviewLink = `${window.location.origin}/candidate/interview/${interviewId}`;
    navigator.clipboard.writeText(interviewLink).then(() => {
      alert('Interview link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link.');
    });
  };

  const InterviewGridView = () => {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const toggleDropdown = (interviewId: string) => {
      console.log('Toggling dropdown for interview:', interviewId);
      setOpenDropdownId(openDropdownId === interviewId ? null : interviewId);
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInterviews.map((interview) => (
          <Card key={interview.id} className="animate-fade-in" interactive>
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
                      toggleDropdown(interview.id);
                    }}
                  >
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>
                  {openDropdownId === interview.id && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking dropdown
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                          onClick={() => {
                            openShareModal(interview);
                            setOpenDropdownId(null);
                          }}
                        >
                          Share to candidates
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                          onClick={() => {
                            handleCopyInterviewLink(interview.id);
                            setOpenDropdownId(null);
                          }}
                        >
                          Copy interview link
                        </button>
                        {/* Add other existing options here */}
                         <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                           onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(interview);
                                setOpenDropdownId(null);
                              }}
                        >
                          Edit
                        </button>
                         <button
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          role="menuitem"
                           onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(interview.id);
                                setOpenDropdownId(null);
                              }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
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
  };

  const InterviewListView = () => {
     const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const toggleDropdown = (interviewId: string) => {
      console.log('Toggling dropdown for interview:', interviewId);
      setOpenDropdownId(openDropdownId === interviewId ? null : interviewId);
    };

    return (
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
                <tr key={interview.id} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    {/* Dropdown for More Options */}
                    <button 
                      className="p-1 hover:bg-gray-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(interview.id);
                      }}
                    >
                      <MoreVertical size={18} className="text-gray-400" />
                    </button>
                    {openDropdownId === interview.id && (
                      <div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
                        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking dropdown
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                           <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                            onClick={() => {
                              openShareModal(interview);
                              setOpenDropdownId(null);
                            }}
                          >
                            Share to candidates
                          </button>
                          <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                            onClick={() => {
                              handleCopyInterviewLink(interview.id);
                              setOpenDropdownId(null);
                            }}
                          >
                            Copy interview link
                          </button>
                          {/* Add other existing options here */}
                           <button
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                             onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(interview);
                                setOpenDropdownId(null);
                              }}
                          >
                            Edit
                          </button>
                           <button
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            role="menuitem"
                             onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(interview.id);
                                setOpenDropdownId(null);
                              }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const CreateInterviewModal = () => (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={() => {
        setIsCreateModalOpen(false);
        resetFormData(); // Also resets isEditing and editingInterviewId
      }}
      title={isEditing ? "Edit Interview" : "Create New Interview"}
    >
      {
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Interview Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter interview name"
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <Select
              value={formData.departmentId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, departmentId: e.target.value })}
              options={mockDepartments.map(dept => ({ value: dept.id, label: dept.name }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hiring Manager
            </label>
            <Input
              type="text"
              value={formData.hiringManager}
              onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
              placeholder="Enter hiring manager's name"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              placeholder="Enter job description"
              rows={8} // Increased rows for larger job description
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interview Image
            </label>
            <div className="mt-1 flex items-center">
              <div className="flex-shrink-0 h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Interview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="ml-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interview Type
            </label>
            <Select
              value={formData.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, type: e.target.value as InterviewType })}
              options={[
                { value: InterviewType.LLM_BASED, label: 'LLM Based' },
                { value: InterviewType.MANUAL, label: 'Manual Questions with LLM Response' },
              ]}
            />
          </div>

          {formData.type === InterviewType.LLM_BASED ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <Input
                  type="number"
                  value={formData.numberOfQuestions}
                  onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) })}
                  min={1}
                  max={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Composition
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skills Assessment</span>
                    <Input
                      type="number"
                      value={formData.questionComposition?.skills}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          skills: parseInt(e.target.value)
                        }
                      })}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Background Check</span>
                    <Input
                      type="number"
                      value={formData.questionComposition?.background}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          background: parseInt(e.target.value)
                        }
                      })}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Education Verification</span>
                    <Input
                      type="number"
                      value={formData.questionComposition?.education}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          education: parseInt(e.target.value)
                        }
                      })}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">General Knowledge</span>
                    <Input
                      type="number"
                      value={formData.questionComposition?.general}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          general: parseInt(e.target.value)
                        }
                      })}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Language Check</span>
                    <Input
                      type="number"
                      value={formData.questionComposition?.language}
                      onChange={(e) => setFormData({
                        ...formData,
                        questionComposition: {
                          ...formData.questionComposition,
                          language: parseInt(e.target.value)
                        }
                      })}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Manual Questions Section - Implementation Pending */}
              <p className="text-gray-600">Manual questions section will be implemented here.</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Record Video</span>
              </div>
              <Toggle
                isEnabled={formData.recordVideo || false}
                onChange={() => setFormData({ ...formData, recordVideo: !formData.recordVideo })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">Screen Share</span>
              </div>
              <Toggle
                isEnabled={formData.screenShare || false}
                onChange={() => setFormData({ ...formData, screenShare: !formData.screenShare })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700">SSN Verification</span>
              </div>
              <Toggle
                isEnabled={formData.ssnVerification || false}
                onChange={() => setFormData({ ...formData, ssnVerification: !formData.ssnVerification })}
              />
            </div>
          </div>


          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetFormData();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={isEditing ? handleUpdateInterview : handleCreateInterview}
              disabled={!formData.name || !formData.jobDescription || (formData.type === InterviewType.MANUAL && (!formData.questions || formData.questions.length === 0 || formData.questions.some(q => !q.content)) )}
            >
              {isEditing ? "Save Changes" : "Create Interview"}
            </Button>
          </div>
        </div>
      }
    </Modal>
  );

  const handleUpdateInterview = () => {
    if (!editingInterviewId) return;

    const updatedInterviews = interviews.map(interview =>
      interview.id === editingInterviewId ? {
        ...interview,
        name: formData.name,
        departmentId: formData.departmentId,
        jobDescription: formData.jobDescription,
        imageUrl: formData.imageUrl || interview.imageUrl, // Keep old image if new one not provided
        type: formData.type,
        verifyId: formData.verifyId,
        recordVideo: formData.recordVideo,
        screenShare: formData.screenShare,
        ssnVerification: formData.ssnVerification,
        hiringManager: formData.hiringManager,
        // Conditionally update questions only for MANUAL type
        ...(formData.type === InterviewType.MANUAL && { questions: formData.questions }),
        updatedAt: new Date().toISOString(), // Update timestamp
      } : interview
    );

    setInterviews(updatedInterviews);
    resetFormData(); // Also resets isEditing and editingInterviewId
    setIsCreateModalOpen(false);
  };

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
          >
            Grid
          </Button>
          <Button
            variant={viewType === 'list' ? 'primary' : 'outline'}
            className="px-3"
            onClick={() => setViewType('list')}
            icon={<List size={18} />}
          >
            List
          </Button>
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
      
      <CreateInterviewModal />
      
      {/* Share Interview Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        title={`Share ${interviewToShare?.name || 'Interview'} to Candidates`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Emails</label>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Add email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCandidateEmail();
                  }
                }}
                className="flex-grow"
              />
              <Button variant="secondary" onClick={handleAddCandidateEmail} icon={<Plus size={16} />}>Add</Button>
            </div>
            <textarea
              placeholder="Or paste multiple emails (comma, semicolon, or space separated)"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              rows={3}
              onChange={handlePasteEmails}
            />
          </div>

          {candidateEmails.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Added Candidates:</h4>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
                {candidateEmails.map((email) => (
                  <div key={email} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
                    <span className="text-sm text-gray-800 truncate">{email}</span>
                    <button
                      onClick={() => handleRemoveCandidateEmail(email)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={closeShareModal}>Cancel</Button>
            <Button variant="primary" disabled={candidateEmails.length === 0}>
              Save and Send
            </Button>
          </div>
        </div>
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