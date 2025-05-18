import React, { useState } from 'react';
import { 
  Users, Search, Filter, CheckCircle, AlertTriangle, UserCheck, 
  XCircle, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { mockCandidates, mockInterviews } from '../data/mockData';

const CandidatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'overallScore' | 'fraudScore'>('overallScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterRecommended, setFilterRecommended] = useState<boolean | null>(null);
  const [filterHighFraud, setFilterHighFraud] = useState<boolean | null>(null);
  
  const getInterviewName = (interviewId: string) => {
    const interview = mockInterviews.find(i => i.id === interviewId);
    return interview ? interview.name : 'Unknown Interview';
  };

  // Filter and sort candidates
  const filteredCandidates = mockCandidates
    .filter(candidate => 
      (candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       candidate.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterRecommended === null || candidate.recommended === filterRecommended) &&
      (filterHighFraud === null || (filterHighFraud ? candidate.fraudScore > 30 : candidate.fraudScore <= 30))
    )
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'overallScore') {
        return sortDirection === 'asc'
          ? a.overallScore - b.overallScore
          : b.overallScore - a.overallScore;
      } else {
        return sortDirection === 'asc'
          ? a.fraudScore - b.fraudScore
          : b.fraudScore - a.fraudScore;
      }
    });

  const toggleSort = (field: 'name' | 'overallScore' | 'fraudScore') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRecommended(null);
    setFilterHighFraud(null);
    setSortField('overallScore');
    setSortDirection('desc');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600 mt-1">
            View and analyze candidate performance
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button
            variant={filterRecommended === true ? 'primary' : 'outline'}
            icon={<CheckCircle size={16} />}
            onClick={() => setFilterRecommended(filterRecommended === true ? null : true)}
          >
            Recommended
          </Button>
          <Button
            variant={filterHighFraud === true ? 'danger' : 'outline'}
            icon={<AlertTriangle size={16} />}
            onClick={() => setFilterHighFraud(filterHighFraud === true ? null : true)}
          >
            High Fraud Risk
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
            placeholder="Search candidates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          icon={<Filter size={18} />}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
      
      {filteredCandidates.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No candidates found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterRecommended !== null || filterHighFraud !== null 
              ? 'Try adjusting your filters or search term' 
              : 'No candidates have completed interviews yet'}
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <Card className="animate-fade-in">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => toggleSort('name')}
                  >
                    <span>Candidate</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interview
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => toggleSort('overallScore')}
                  >
                    <span>Score</span>
                    {sortField === 'overallScore' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1"
                    onClick={() => toggleSort('fraudScore')}
                  >
                    <span>Fraud Risk</span>
                    {sortField === 'fraudScore' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary-50 rounded-full mr-3">
                        <Users size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getInterviewName(candidate.interviewId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className={`
                        px-3 py-1 inline-flex text-xs font-semibold rounded-full
                        ${candidate.overallScore >= 80 ? 'bg-green-100 text-green-800' : 
                          candidate.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {candidate.overallScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className={`
                        px-3 py-1 inline-flex text-xs font-semibold rounded-full
                        ${candidate.fraudScore <= 10 ? 'bg-green-100 text-green-800' : 
                          candidate.fraudScore <= 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}
                      `}
                    >
                      {candidate.fraudScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {candidate.recommended ? (
                      <div className="flex items-center text-green-600">
                        <UserCheck size={16} className="mr-1" />
                        <span className="text-sm font-medium">Recommended</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle size={16} className="mr-1" />
                        <span className="text-sm font-medium">Not Recommended</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={16} />}
                      onClick={() => window.location.href = `/candidates/${candidate.id}`}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default CandidatesPage;