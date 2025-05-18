import React, { useState } from 'react';
import { 
  BarChart2, Clock, Users, FileText, Brain, DownloadCloud 
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTimeMetrics, mockCandidatePerformance, mockInterviews } from '../data/mockData';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  
  // Calculate total time saved across all periods
  const totalTimeSaved = mockTimeMetrics.reduce((sum, metric) => sum + metric.hoursSaved, 0);
  
  // Calculate average score across all interviews
  const averageScore = mockCandidatePerformance.reduce((sum, perf) => 
    sum + perf.averageScore, 0
  ) / mockCandidatePerformance.length;
  
  // Count interviews by type
  const llmInterviewCount = mockInterviews.filter(i => i.type === 'llm_based').length;
  const manualInterviewCount = mockInterviews.filter(i => i.type === 'manual').length;

  const TimeChart = () => {
    const maxHours = Math.max(...mockTimeMetrics.map(m => m.hoursSaved));
    
    return (
      <div className="h-64 flex items-end space-x-2">
        {mockTimeMetrics.map((metric, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full">
              <div 
                className="w-full bg-primary-200 rounded-t-sm" 
                style={{ 
                  height: `${(metric.hoursSaved / maxHours) * 100}%`,
                  minHeight: '20px',
                }}
              >
                <div 
                  className="absolute bottom-0 w-full bg-primary-500 rounded-t-sm transition-all duration-500" 
                  style={{ 
                    height: `${(metric.hoursSaved / maxHours) * 100}%`,
                    minHeight: '20px',
                  }}
                ></div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">{metric.period}</div>
            <div className="font-medium text-sm text-gray-800">{metric.hoursSaved}h</div>
          </div>
        ))}
      </div>
    );
  };

  const PerformanceChart = () => {
    return (
      <div className="space-y-4">
        {mockCandidatePerformance.map((performance, index) => {
          const interview = mockInterviews.find(i => i.id === performance.interviewId);
          
          return (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-gray-900">{performance.interviewName}</div>
                <div className="text-sm text-gray-500">{performance.candidateCount} candidates</div>
              </div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm text-gray-500">Average Score</span>
                <span className="text-sm font-medium text-gray-800">{performance.averageScore}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ width: `${performance.averageScore}%` }}
                ></div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Top performer: {performance.topPerformer.candidateName} ({performance.topPerformer.score}%)
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const TimeRangeSelector = () => (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={timeRange === '1m' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('1m')}
      >
        1 Month
      </Button>
      <Button
        variant={timeRange === '3m' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('3m')}
      >
        3 Months
      </Button>
      <Button
        variant={timeRange === '6m' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('6m')}
      >
        6 Months
      </Button>
      <Button
        variant={timeRange === '1y' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setTimeRange('1y')}
      >
        1 Year
      </Button>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Insights on hiring efficiency and time saved
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline"
            icon={<DownloadCloud size={16} />}
            onClick={() => {/* Download analytics data */}}
          >
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Total Time Saved</h3>
              <div className="p-2 bg-primary-50 rounded-full">
                <Clock size={20} className="text-primary-600" />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-bold text-gray-900">{totalTimeSaved}</div>
              <div className="text-lg font-medium text-gray-500 mb-1">hours</div>
            </div>
            <div className="text-sm text-green-600 mt-2">↑ 15% from previous period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Average Score</h3>
              <div className="p-2 bg-secondary-50 rounded-full">
                <BarChart2 size={20} className="text-secondary-600" />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-bold text-gray-900">{averageScore.toFixed(1)}</div>
              <div className="text-lg font-medium text-gray-500 mb-1">%</div>
            </div>
            <div className="text-sm text-green-600 mt-2">↑ 3.2% from previous period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">LLM Interviews</h3>
              <div className="p-2 bg-accent-50 rounded-full">
                <Brain size={20} className="text-accent-500" />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-bold text-gray-900">{llmInterviewCount}</div>
              <div className="text-lg font-medium text-gray-500 mb-1">total</div>
            </div>
            <div className="text-sm text-green-600 mt-2">↑ 40% from previous period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-700">Manual Interviews</h3>
              <div className="p-2 bg-gray-100 rounded-full">
                <FileText size={20} className="text-gray-600" />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-bold text-gray-900">{manualInterviewCount}</div>
              <div className="text-lg font-medium text-gray-500 mb-1">total</div>
            </div>
            <div className="text-sm text-red-600 mt-2">↓ 12% from previous period</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time Saved Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Time Saved Over Time</h2>
              <TimeRangeSelector />
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <TimeChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Interview Performance</h2>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Interview Efficiency</h2>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">LLM vs. Manual</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  LLM interviews are 70% more time efficient
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Fraud Detection</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  42% time reduction in fraud screening
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Hiring Process Length</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  65% reduction in time-to-hire
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Candidate Quality</h2>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Technical Skills</div>
                  <div className="text-sm text-gray-500">Average across all candidates</div>
                </div>
                <div className="text-xl font-bold text-primary-600">78%</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Communication</div>
                  <div className="text-sm text-gray-500">Average across all candidates</div>
                </div>
                <div className="text-xl font-bold text-primary-600">82%</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Culture Fit</div>
                  <div className="text-sm text-gray-500">Average across all candidates</div>
                </div>
                <div className="text-xl font-bold text-primary-600">73%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Fraud Detection</h2>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 36 36" className="h-full w-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray="15, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-bold text-gray-900">15%</div>
                  <div className="text-sm text-gray-500">Fraud Rate</div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Identity Fraud</span>
                  <span className="font-medium text-gray-900">8%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Skill Misrepresentation</span>
                  <span className="font-medium text-gray-900">12%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location Fraud</span>
                  <span className="font-medium text-gray-900">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;