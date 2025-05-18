import React, { useState } from 'react';
import { 
  Settings, Database, Link2, BrainCircuit, LogIn, LinkIcon, 
  Globe, Plus, CheckCircle, X, AlertTriangle
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import Select from '../components/ui/Select';
import { mockIntegrations } from '../data/mockData';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectType, setConnectType] = useState<'llm' | 'ats' | 'job_portal'>('llm');
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [apiKey, setApiKey] = useState('');
  const [selectedService, setSelectedService] = useState('');
  
  const llmOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic Claude' },
    { value: 'cohere', label: 'Cohere' },
    { value: 'vertexai', label: 'Google Vertex AI' },
  ];
  
  const atsOptions = [
    { value: 'lever', label: 'Lever' },
    { value: 'greenhouse', label: 'Greenhouse' },
    { value: 'workday', label: 'Workday' },
    { value: 'bamboohr', label: 'BambooHR' },
  ];
  
  const jobPortalOptions = [
    { value: 'linkedin', label: 'LinkedIn Jobs' },
    { value: 'indeed', label: 'Indeed' },
    { value: 'glassdoor', label: 'Glassdoor' },
    { value: 'wellfound', label: 'Wellfound (AngelList)' },
  ];
  
  const getOptionsForType = () => {
    switch (connectType) {
      case 'llm':
        return llmOptions;
      case 'ats':
        return atsOptions;
      case 'job_portal':
        return jobPortalOptions;
      default:
        return [];
    }
  };
  
  const handleConnect = () => {
    // In a real app, this would make an API call to connect the integration
    const option = getOptionsForType().find(o => o.value === selectedService);
    if (option) {
      const newIntegration = {
        id: `int${integrations.length + 1}`,
        name: option.label,
        type: connectType,
        isConnected: true,
        lastSynced: new Date().toISOString(),
      };
      
      setIntegrations([...integrations, newIntegration]);
      setIsConnectModalOpen(false);
      setApiKey('');
      setSelectedService('');
    }
  };
  
  const toggleConnection = (id: string) => {
    setIntegrations(
      integrations.map(int => 
        int.id === id ? { ...int, isConnected: !int.isConnected } : int
      )
    );
  };
  
  const openConnectModal = (type: 'llm' | 'ats' | 'job_portal') => {
    setConnectType(type);
    setIsConnectModalOpen(true);
  };
  
  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: <LinkIcon size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <AlertTriangle size={16} /> },
    { id: 'security', label: 'Security', icon: <LogIn size={16} /> },
    { id: 'appearance', label: 'Appearance', icon: <Settings size={16} /> },
  ];

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      {/* LLM Integrations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BrainCircuit size={20} className="text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">LLM Connections</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => openConnectModal('llm')}
            >
              Connect
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(int => int.type === 'llm').map((integration) => (
              <div key={integration.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-50 rounded-full mr-3">
                    <BrainCircuit size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">
                      {integration.isConnected 
                        ? `Last synced: ${new Date(integration.lastSynced || '').toLocaleDateString()}`
                        : 'Not connected'
                      }
                    </p>
                  </div>
                </div>
                <Toggle
                  isEnabled={integration.isConnected}
                  onChange={() => toggleConnection(integration.id)}
                />
              </div>
            ))}
            
            {integrations.filter(int => int.type === 'llm').length === 0 && (
              <div className="text-center py-6">
                <BrainCircuit size={36} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No LLM connections configured</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-3"
                  onClick={() => openConnectModal('llm')}
                >
                  Connect LLM
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* ATS Integrations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Database size={20} className="text-secondary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">ATS Connections</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => openConnectModal('ats')}
            >
              Connect
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(int => int.type === 'ats').map((integration) => (
              <div key={integration.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-secondary-50 rounded-full mr-3">
                    <Database size={18} className="text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">
                      {integration.isConnected 
                        ? `Last synced: ${new Date(integration.lastSynced || '').toLocaleDateString()}`
                        : 'Not connected'
                      }
                    </p>
                  </div>
                </div>
                <Toggle
                  isEnabled={integration.isConnected}
                  onChange={() => toggleConnection(integration.id)}
                />
              </div>
            ))}
            
            {integrations.filter(int => int.type === 'ats').length === 0 && (
              <div className="text-center py-6">
                <Database size={36} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No ATS connections configured</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-3"
                  onClick={() => openConnectModal('ats')}
                >
                  Connect ATS
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Job Portal Integrations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Globe size={20} className="text-accent-500 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Job Portal Connections</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => openConnectModal('job_portal')}
            >
              Connect
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.filter(int => int.type === 'job_portal').map((integration) => (
              <div key={integration.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-accent-50 rounded-full mr-3">
                    <Globe size={18} className="text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">
                      {integration.isConnected 
                        ? `Last synced: ${new Date(integration.lastSynced || '').toLocaleDateString()}`
                        : 'Not connected'
                      }
                    </p>
                  </div>
                </div>
                <Toggle
                  isEnabled={integration.isConnected}
                  onChange={() => toggleConnection(integration.id)}
                />
              </div>
            ))}
            
            {integrations.filter(int => int.type === 'job_portal').length === 0 && (
              <div className="text-center py-6">
                <Globe size={36} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No job portal connections configured</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-3"
                  onClick={() => openConnectModal('job_portal')}
                >
                  Connect Job Portal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications about new candidates</p>
            </div>
            <Toggle isEnabled={true} onChange={() => {}} />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-900">Interview Summaries</h3>
              <p className="text-sm text-gray-500">Daily or weekly summaries of interview results</p>
            </div>
            <Toggle isEnabled={true} onChange={() => {}} />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-900">Fraud Alerts</h3>
              <p className="text-sm text-gray-500">Immediate alerts for high fraud risk candidates</p>
            </div>
            <Toggle isEnabled={true} onChange={() => {}} />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-900">System Updates</h3>
              <p className="text-sm text-gray-500">Notifications about new features and updates</p>
            </div>
            <Toggle isEnabled={false} onChange={() => {}} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Password</h3>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  helperText="Password must be at least 8 characters"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <div>
                  <Button variant="primary">Update Password</Button>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Status: <span className="text-red-600 font-medium">Not Enabled</span>
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-4">Session Management</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">Current Session</div>
                      <div className="text-sm text-gray-500">
                        Web Browser · Los Angeles, CA · Last active now
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Current
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">Mobile App</div>
                      <div className="text-sm text-gray-500">
                        iPhone · San Francisco, CA · Last active 2 days ago
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceTab = () => (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900">Appearance Settings</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border border-primary-500 bg-white rounded-lg text-center cursor-pointer relative">
                <div className="absolute top-2 right-2 text-primary-500">
                  <CheckCircle size={16} />
                </div>
                <div className="h-12 bg-white border border-gray-200 rounded mb-2"></div>
                <div className="text-sm font-medium text-gray-900">Light</div>
              </div>
              
              <div className="p-4 border border-gray-200 bg-white rounded-lg text-center cursor-pointer">
                <div className="h-12 bg-gray-900 rounded mb-2"></div>
                <div className="text-sm font-medium text-gray-900">Dark</div>
              </div>
              
              <div className="p-4 border border-gray-200 bg-white rounded-lg text-center cursor-pointer">
                <div className="h-12 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                <div className="text-sm font-medium text-gray-900">System</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-3">Density</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="comfortable"
                  name="density"
                  type="radio"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  defaultChecked
                />
                <label htmlFor="comfortable" className="ml-3 text-sm font-medium text-gray-900">
                  Comfortable
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="compact"
                  name="density"
                  type="radio"
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="compact" className="ml-3 text-sm font-medium text-gray-900">
                  Compact
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-base font-medium text-gray-900 mb-3">Default Views</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departments View
                </label>
                <Select
                  options={[
                    { value: 'grid', label: 'Grid' },
                    { value: 'list', label: 'List' },
                  ]}
                  value="grid"
                  onChange={() => {}}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interviews View
                </label>
                <Select
                  options={[
                    { value: 'grid', label: 'Grid' },
                    { value: 'list', label: 'List' },
                  ]}
                  value="grid"
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'integrations':
        return renderIntegrationsTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'appearance':
        return renderAppearanceTab();
      default:
        return renderIntegrationsTab();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your application settings and integrations
        </p>
      </div>
      
      <div className="mb-6">
        <Tabs 
          tabs={tabs}
          defaultTab="integrations"
          onChange={setActiveTab}
        />
      </div>
      
      {renderActiveTab()}
      
      {/* Connect Integration Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          setApiKey('');
          setSelectedService('');
        }}
        title={`Connect ${
          connectType === 'llm' ? 'LLM' : 
          connectType === 'ats' ? 'ATS' : 'Job Portal'
        }`}
      >
        <div className="space-y-4">
          <Select
            label="Service"
            options={getOptionsForType()}
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          />
          
          <Input
            label="API Key"
            type="password"
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
          
          <div className="pt-2 text-sm text-gray-500">
            <p className="flex items-start">
              <span className="mr-2 mt-0.5"><AlertTriangle size={14} /></span>
              Your API key is securely stored and used only for connecting to the service.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsConnectModalOpen(false);
                setApiKey('');
                setSelectedService('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConnect}
              disabled={!apiKey || !selectedService}
              icon={<Link2 size={16} />}
            >
              Connect
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;