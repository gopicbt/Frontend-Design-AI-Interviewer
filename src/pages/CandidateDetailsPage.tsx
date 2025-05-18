import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft, User, FileText, CheckCircle, AlertTriangle, Clock,
  ChevronUp, ChevronDown, Download, BarChart
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { mockCandidates, mockInterviews } from '../data/mockData';

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState(mockCandidates.find(c => c.id === id));
  const [interview, setInterview] = useState(
    candidate ? mockInterviews.find(i => i.id === candidate.interviewId) : null
  );
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  
  useEffect(() => {
    // This would be an API call in a real application
    const foundCandidate = mockCandidates.find(c => c.id === id);
    setCandidate(foundCandidate);
    
    if (foundCandidate) {
      const foundInterview = mockInterviews.find(i => i.id === foundCandidate.interviewId);
      setInterview(foundInterview);
    }
  }, [id]);
  
  if (!candidate || !interview) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="text-lg font-medium text-gray-900 mb-1">Candidate not found</div>
        <p className="text-gray-500 mb-4">The candidate you're looking for doesn't exist or has been removed</p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/candidates'}
        >
          Back to Candidates
        </Button>
      </div>
    );
  }
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const scoreClass = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const fraudRiskClass = (score: number) => {
    if (score <= 10) return 'text-green-600';
    if (score <= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Button
          variant="outline"
          icon={<ArrowLeft size={16} />}
          onClick={() => window.location.href = '/candidates'}
        >
          Back to Candidates
        </Button>
      </div>
      
      {/* Candidate Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-14 w-14 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <User size={24} className="text-primary-600" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600">{candidate.email}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">
                Completed on {new Date(candidate.completedAt).toLocaleDateString()}
              </span>
            </div>
            
            {candidate.recommended ? (
              <Badge variant="success">Recommended</Badge>
            ) : (
              <Badge variant="danger">Not Recommended</Badge>
            )}
            
            {candidate.resumeUrl && (
              <Button
                variant="outline"
                size="sm"
                icon={<Download size={14} />}
              >
                Resume
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Score Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Overall Score</h3>
              <div className={`text-2xl font-bold ${scoreClass(candidate.overallScore)}`}>
                {candidate.overallScore}%
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  candidate.overallScore >= 80 ? 'bg-green-500' : 
                  candidate.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${candidate.overallScore}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Fraud Risk Score</h3>
              <div className={`text-2xl font-bold ${fraudRiskClass(candidate.fraudScore)}`}>
                {candidate.fraudScore}%
              </div>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  candidate.fraudScore <= 10 ? 'bg-green-500' : 
                  candidate.fraudScore <= 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${candidate.fraudScore}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-700 mb-2">System Recommendation</h3>
            {candidate.recommended ? (
              <div className="flex items-center text-green-600">
                <CheckCircle size={20} className="mr-2" />
                <span>Proceed with candidate</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertTriangle size={20} className="mr-2" />
                <span>Not recommended for this position</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Collapsible Sections */}
      <div className="space-y-4">
        {/* Interview Overview */}
        <Card>
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('overview')}
          >
            <div className="flex items-center">
              <FileText size={20} className="text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Interview Overview</h2>
            </div>
            <div>
              {expandedSection === 'overview' ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </div>
          </div>
          
          {expandedSection === 'overview' && (
            <CardContent className="px-6 pt-0 pb-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Interview Details</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium text-gray-700">Position:</span> {interview.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium text-gray-700">Interview Type:</span> {
                      interview.type === 'llm_based' ? 'LLM-Based' : 'Manual Questions'
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">ID Verification:</span> {
                      interview.verifyId ? 'Required' : 'Not Required'
                    }
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Job Description</h3>
                  <p className="text-sm text-gray-600">
                    {interview.jobDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Response Analysis */}
        <Card>
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('responses')}
          >
            <div className="flex items-center">
              <BarChart size={20} className="text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Response Analysis</h2>
            </div>
            <div>
              {expandedSection === 'responses' ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </div>
          </div>
          
          {expandedSection === 'responses' && (
            <CardContent className="px-6 pt-0 pb-6 border-t border-gray-100">
              <div className="space-y-6">
                {candidate.responses.map((response, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-700">Question {index + 1}</h3>
                      <div 
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${response.score >= 80 ? 'bg-green-100 text-green-800' : 
                            response.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}
                        `}
                      >
                        Score: {response.score}%
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Question:</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {interview.questions && interview.questions[index]
                          ? interview.questions[index].content
                          : "What is your experience with the technologies required for this position?"}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700">Candidate's Response:</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {response.answer}
                      </p>
                    </div>
                    
                    {response.feedback && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Feedback:</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {response.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Behavior Analysis */}
        <Card>
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('behavior')}
          >
            <div className="flex items-center">
              <User size={20} className="text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Behavior Analysis</h2>
            </div>
            <div>
              {expandedSection === 'behavior' ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </div>
          </div>
          
          {expandedSection === 'behavior' && (
            <CardContent className="px-6 pt-0 pb-6 border-t border-gray-100">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Behavior Summary</h3>
                  <p className="text-sm text-gray-600">
                    {candidate.behaviourReport || 
                      "The candidate demonstrated professional communication skills throughout the interview. Responses were clear and articulate, showing a good understanding of the technical concepts discussed. The candidate maintained a positive attitude and showed enthusiasm for the role."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Communication</h4>
                    <div className="flex items-center">
                      <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">85%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Technical Knowledge</h4>
                    <div className="flex items-center">
                      <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${candidate.overallScore}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">{candidate.overallScore}%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Culture Fit</h4>
                    <div className="flex items-center">
                      <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">70%</span>
                    </div>
                  </div>
                </div>
                
                {/* Fraud Detection */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-2">Fraud Detection Results</h3>
                  <Card>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Result
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confidence
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            Location Verification
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" />
                              <span className="text-sm">Verified</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            95%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            Skills Consistency
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-green-600">
                              <CheckCircle size={16} className="mr-1" />
                              <span className="text-sm">Consistent</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            90%
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ID Verification
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {candidate.fraudScore < 30 ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle size={16} className="mr-1" />
                                <span className="text-sm">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <AlertTriangle size={16} className="mr-1" />
                                <span className="text-sm">Not Verified</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.fraudScore < 30 ? '85%' : '40%'}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            Response Authenticity
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {candidate.fraudScore < 30 ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle size={16} className="mr-1" />
                                <span className="text-sm">Authentic</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <AlertTriangle size={16} className="mr-1" />
                                <span className="text-sm">Suspicious</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.fraudScore < 30 ? '90%' : '30%'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Card>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CandidateDetailsPage;