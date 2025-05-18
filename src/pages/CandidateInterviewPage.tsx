import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Clock, Send, Loader2, AlertTriangle } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockInterviews } from '../data/mockData';

const CandidateInterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState(mockInterviews.find(i => i.id === id));
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This would be an API call in a real application
    const foundInterview = mockInterviews.find(i => i.id === id);
    setInterview(foundInterview);
    
    if (foundInterview) {
      // Start the interview with an initial message
      setTimeout(() => {
        setMessages([
          { 
            sender: 'ai', 
            text: `Welcome to your interview for the ${foundInterview.name} position. I'll be asking you a series of questions to assess your qualifications. Please take your time to provide thoughtful responses. Let's begin!` 
          }
        ]);
        askNextQuestion();
      }, 1000);
    }
    
    // Set up timer for interview duration
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [id]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const askNextQuestion = () => {
    if (!interview) return;
    
    setIsTyping(true);
    
    setTimeout(() => {
      let nextQuestion = '';
      
      // Get next question based on interview type
      if (interview.type === 'manual' && interview.questions) {
        if (currentQuestionIndex < interview.questions.length) {
          nextQuestion = interview.questions[currentQuestionIndex].content;
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          // All questions have been asked
          setIsInterviewComplete(true);
          nextQuestion = "Thank you for completing the interview. Your responses have been recorded and will be reviewed by our team. We'll be in touch with you shortly regarding next steps.";
        }
      } else {
        // For LLM-based interviews, simulate dynamic questions
        const dynamicQuestions = [
          "Can you tell me about your experience with the technologies mentioned in the job description?",
          "How do you approach problem-solving in your current role?",
          "Tell me about a challenging project you've worked on recently.",
          "Where do you see yourself professionally in the next 3-5 years?",
          "Do you have any questions about the role or our company?"
        ];
        
        if (currentQuestionIndex < dynamicQuestions.length) {
          nextQuestion = dynamicQuestions[currentQuestionIndex];
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          // All questions have been asked
          setIsInterviewComplete(true);
          nextQuestion = "Thank you for completing the interview. Your responses have been recorded and will be analyzed by our system. We'll be in touch with you shortly regarding next steps.";
        }
      }
      
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: nextQuestion }]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;
    
    // Add user message
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
    setInput('');
    
    // If not all questions have been asked, ask the next one after a delay
    if (!isInterviewComplete) {
      setTimeout(askNextQuestion, 1000);
    }
  };

  if (!interview) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Interview not found</h3>
        <p className="text-gray-500 mb-4">The interview you're looking for doesn't exist or has been removed</p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{interview.name}</h1>
              <p className="text-gray-600 text-sm mt-1">
                Interview ID: {interview.id}
              </p>
            </div>
            
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
              <Clock size={16} className="text-gray-600 mr-2" />
              <span className="font-medium">{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Chat UI */}
      <Card className="mb-6 h-[calc(100vh-250px)] flex flex-col">
        <CardContent className="flex-grow overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary-100 text-primary-900' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 text-gray-800 flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  <span>Typing...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isInterviewComplete ? "Interview complete" : "Type your response..."}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              disabled={isInterviewComplete || isTyping}
            />
            <Button
              type="submit"
              className="rounded-l-none"
              disabled={isInterviewComplete || isTyping || !input.trim()}
              icon={<Send size={16} />}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
      
      {interview.verifyId && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
          <AlertTriangle size={20} className="text-amber-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">ID Verification Required</h3>
            <p className="text-sm text-amber-700">
              This interview requires identity verification. Please have your ID ready for verification before you complete the interview.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateInterviewPage;