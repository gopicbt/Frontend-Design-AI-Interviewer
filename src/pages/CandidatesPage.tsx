import React, { useState } from 'react';
import { 
  Users, Search, Filter, CheckCircle, AlertTriangle, UserCheck, 
  XCircle, ChevronDown, ChevronUp, Eye, CalendarDays
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { mockCandidates, mockInterviews } from '../data/mockData';
import { Candidate, InterviewType } from '../types';

const CandidatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'overallScore' | 'fraudScore' | 'interviewedDate'>('interviewedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterRecommended, setFilterRecommended] = useState<boolean | null>(null);
  const [filterHighFraud, setFilterHighFraud] = useState<boolean | null>(null);
  
  const [openFilterMenu, setOpenFilterMenu] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<{[key: string]: string | string[]}>({});

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
      (filterHighFraud === null || (filterHighFraud ? candidate.fraudScore > 30 : candidate.fraudScore <= 30)) &&
      // Column filters
      (columnFilters.name ? candidate.name.toLowerCase().includes(columnFilters.name.toString().toLowerCase()) : true) &&
      (columnFilters.interview ? getInterviewName(candidate.interviewId).toLowerCase().includes(columnFilters.interview.toString().toLowerCase()) : true) &&
      (columnFilters.interviewedDate ? candidate.interviewedDate?.includes(columnFilters.interviewedDate.toString()) : true) &&
      (columnFilters.status ? (columnFilters.status === 'Recommended' ? candidate.recommended : !candidate.recommended) : true) // Assuming status filter is for Recommended/Not Recommended
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
      } else if (sortField === 'fraudScore') {
        return sortDirection === 'asc'
          ? a.fraudScore - b.fraudScore
          : b.fraudScore - a.fraudScore;
      } else if (sortField === 'interviewedDate') {
        // Handle date sorting (assuming YYYY-MM-DD format)
        const dateA = new Date(a.interviewedDate || '').getTime();
        const dateB = new Date(b.interviewedDate || '').getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
       return 0; // Default return for completeness
    });

  const toggleSort = (field: 'name' | 'overallScore' | 'fraudScore' | 'interviewedDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleColumnFilterChange = (column: string, value: string | string[]) => {
    setColumnFilters(prevFilters => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const toggleFilterMenu = (column: string) => {
    setOpenFilterMenu(openFilterMenu === column ? null : column);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRecommended(null);
    setFilterHighFraud(null);
    setSortField('interviewedDate');
    setSortDirection('desc');
    setColumnFilters({});
    setOpenFilterMenu(null);
  };

  // Get unique values for categorical filters (e.g., Interview Name, Status)
  const getUniqueColumnValues = (column: keyof Candidate | 'interview' | 'status') => {
    if (column === 'interview') {
      return [...new Set(mockInterviews.map(i => i.name))].sort() as string[]; // Get unique interview names
    } else if (column === 'status') {
      return ['Recommended', 'Not Recommended'];
    } else if (column === 'interviewedDate') {
         return [...new Set(mockCandidates.map(c => c.interviewedDate).filter(date => date))].sort() as string[]; // Sort dates
    }
     else if (column === 'name') {
         return [...new Set(mockCandidates.map(c => c.name))].sort() as string[]; // Get unique candidate names
     } else if (column === 'overallScore') {
        return [...new Set(mockCandidates.map(c => c.overallScore))].sort((a, b) => a - b).map(String); // Get and sort unique scores, return as strings
     } else if (column === 'fraudScore') {
        return [...new Set(mockCandidates.map(c => c.fraudScore))].sort((a, b) => a - b).map(String); // Get and sort unique fraud scores, return as strings
     }
     // For other columns, a text search is more appropriate currently
    return [];
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
            {searchQuery || filterRecommended !== null || filterHighFraud !== null || Object.keys(columnFilters).length > 0
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                  <div className="flex items-center space-x-1">
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => toggleSort('name')}
                    >
                      <span>Candidate</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                    <button onClick={() => toggleFilterMenu('name')} className="p-1 -mr-1 rounded hover:bg-gray-100">
                      <Filter size={14} className={columnFilters.name ? 'text-primary-600' : 'text-gray-400'} />
                    </button>
                  </div>
                   {openFilterMenu === 'name' && (
                      <div className="absolute top-full mt-2 left-0 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                         <Input
                           type="text"
                           placeholder="Search name"
                           value={columnFilters.name as string || ''}
                           onChange={(e) => handleColumnFilterChange('name', e.target.value)}
                           className="text-sm mb-2"
                         />
                         <div className="max-h-32 overflow-y-auto space-y-1">
                            {getUniqueColumnValues('name').map(name => (
                               <div
                                  key={name}
                                  className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                  onClick={() => handleColumnFilterChange('name', name)}
                               >
                                  {name}
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                   <div className="flex items-center space-x-1">
                    <span>Interview</span>
                     <button onClick={() => toggleFilterMenu('interview')} className="p-1 -mr-1 rounded hover:bg-gray-100">
                       <Filter size={14} className={columnFilters.interview ? 'text-primary-600' : 'text-gray-400'} />
                    </button>
                   </div>
                    {openFilterMenu === 'interview' && (
                      <div className="absolute top-full mt-2 left-0 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                         <Input
                           type="text"
                           placeholder="Search interview"
                           value={columnFilters.interview as string || ''}
                           onChange={(e) => handleColumnFilterChange('interview', e.target.value)}
                           className="text-sm mb-2"
                         />
                           <div className="max-h-32 overflow-y-auto space-y-1">
                            {getUniqueColumnValues('interview').map(interviewName => (
                               <div
                                  key={interviewName}
                                  className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                  onClick={() => handleColumnFilterChange('interview', interviewName)}
                               >
                                  {interviewName}
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                  <div className="flex items-center space-x-1">
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => toggleSort('overallScore')}
                    >
                      <span>Score</span>
                      {sortField === 'overallScore' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                     <button onClick={() => toggleFilterMenu('overallScore')} className="p-1 -mr-1 rounded hover:bg-gray-100">
                       <Filter size={14} className={columnFilters.overallScore ? 'text-primary-600' : 'text-gray-400'} />
                    </button>
                  </div>
                   {openFilterMenu === 'overallScore' && (
                      <div className="absolute top-full mt-2 left-0 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                         <Input
                           type="number"
                           placeholder="Filter score"
                           value={columnFilters.overallScore as string || ''}
                           onChange={(e) => handleColumnFilterChange('overallScore', e.target.value)}
                           className="text-sm mb-2"
                         />
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {getUniqueColumnValues('overallScore').map(score => (
                               <div
                                  key={score}
                                  className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                  onClick={() => handleColumnFilterChange('overallScore', score)}
                               >
                                  {score}%
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                   <div className="flex items-center space-x-1">
                    <button 
                      className="flex items-center space-x-1"
                      onClick={() => toggleSort('fraudScore')}
                    >
                      <span>Fraud Risk</span>
                      {sortField === 'fraudScore' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                     <button onClick={() => toggleFilterMenu('fraudScore')} className="p-1 -mr-1 rounded hover:bg-gray-100">
                       <Filter size={14} className={columnFilters.fraudScore ? 'text-primary-600' : 'text-gray-400'} />
                    </button>
                   </div>
                     {openFilterMenu === 'fraudScore' && (
                      <div className="absolute top-full mt-2 left-0 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                         <Input
                           type="number"
                           placeholder="Filter fraud risk"
                           value={columnFilters.fraudScore as string || ''}
                           onChange={(e) => handleColumnFilterChange('fraudScore', e.target.value)}
                           className="text-sm mb-2"
                         />
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {getUniqueColumnValues('fraudScore').map(score => (
                               <div
                                  key={score}
                                  className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                                  onClick={() => handleColumnFilterChange('fraudScore', score)}
                               >
                                  {score}%
                               </div>
                            ))}
                         </div>
                      </div>
                   )}
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                   <div className="flex items-center space-x-1">
                     <button 
                      className="flex items-center space-x-1"
                      onClick={() => toggleSort('interviewedDate')}
                    >
                      <span>Interviewed Date</span>
                       {sortField === 'interviewedDate' && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </button>
                      <button onClick={() => toggleFilterMenu('interviewedDate')} className="p-1 -mr-1 rounded hover:bg-gray-100">
                       <CalendarDays size={14} className={columnFilters.interviewedDate ? 'text-primary-600' : 'text-gray-400'} />
                    </button>
                   </div>
                   {openFilterMenu === 'interviewedDate' && (
                      <div className="absolute top-full mt-2 left-0 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2">
                         <Input
                           type="date"
                           placeholder="Filter date"
                           value={columnFilters.interviewedDate as string || ''}
                           onChange={(e) => handleColumnFilterChange('interviewedDate', e.target.value)}
                           className="text-sm"
                         />
                      </div>
                   )}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative">
                   <div className="flex items-center space-x-1">
                     <span>Status</span>
                      <button onClick={() => toggleFilterMenu('status')} className="p-1 -mr-1 rounded hover:bg-gray-100">
                       <Filter size={14} className={columnFilters.status ? 'text-primary-600' : 'text-gray-400'} />
                    </button>
                   </div>
                     {openFilterMenu === 'status' && (
                       <div className="absolute top-full mt-2 left-0 z-10 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2 space-y-1">
                         <label className="flex items-center text-sm text-gray-700">
                           <input
                             type="checkbox"
                             className="form-checkbox"
                             checked={columnFilters.status?.includes('Recommended') || false}
                             onChange={(e) => {
                               const statusFilters = columnFilters.status || [];
                               if (e.target.checked) {
                                 handleColumnFilterChange('status', [...statusFilters as string[], 'Recommended']);
                               } else {
                                 handleColumnFilterChange('status', (statusFilters as string[]).filter(s => s !== 'Recommended'));
                               }
                             }}
                           />
                           <span className="ml-2">Recommended</span>
                         </label>
                         <label className="flex items-center text-sm text-gray-700">
                            <input
                             type="checkbox"
                             className="form-checkbox"
                             checked={columnFilters.status?.includes('Not Recommended') || false}
                             onChange={(e) => {
                               const statusFilters = columnFilters.status || [];
                               if (e.target.checked) {
                                 handleColumnFilterChange('status', [...statusFilters as string[], 'Not Recommended']);
                               } else {
                                 handleColumnFilterChange('status', (statusFilters as string[]).filter(s => s !== 'Not Recommended'));
                               }
                             }}
                           />
                           <span className="ml-2">Not Recommended</span>
                         </label>
                       </div>
                    )}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.interviewedDate || 'N/A'}
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