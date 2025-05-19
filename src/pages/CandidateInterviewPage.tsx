import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Clock, Send, Loader2, AlertTriangle, Video, Monitor, CreditCard, CheckCircle, Brain } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockInterviews } from '../data/mockData';
import { InterviewType } from '../types';
import Input from '../components/ui/Input';

type InterviewStage = 
  | 'loading'
  | 'pre_interview_video'
  | 'pre_interview_screen'
  | 'pre_interview_ssn'
  | 'interview_active'
  | 'completed'
  | 'error';

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

  const [interviewStage, setInterviewStage] = useState<InterviewStage>('loading');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [ssnVerified, setSsnVerified] = useState(false);
  
  useEffect(() => {
    const foundInterview = mockInterviews.find(i => i.id === id);
    setInterview(foundInterview);
    
    if (!foundInterview) {
      setInterviewStage('error');
      return;
    }

    // Determine the initial stage based on interview requirements
    if (foundInterview.recordVideo && !videoEnabled) {
      setInterviewStage('pre_interview_video');
    } else if (foundInterview.screenShare && !screenShareEnabled) {
      setInterviewStage('pre_interview_screen');
    } else if (foundInterview.ssnVerification && !ssnVerified) {
       setInterviewStage('pre_interview_ssn');
    } else {
      setInterviewStage('interview_active');
       // Start the interview with an initial message
      setTimeout(() => {
        setMessages([
          { 
            sender: 'ai', 
            text: `Welcome to your interview for the ${foundInterview.name} position. I'll be asking you a series of questions to assess your qualifications. Please take your time to provide thoughtful responses. Let's begin!` 
          }
        ]);
         if (foundInterview.type === InterviewType.MANUAL && foundInterview.questions && foundInterview.questions.length > 0) {
             askNextQuestion();
         } else if (foundInterview.type === InterviewType.LLM_BASED) {
             // For LLM, we might have an initial dynamic question or wait for user input
              askNextQuestion(); // Ask the first dynamic question
         } else {
             // Handle interviews with no questions defined (shouldn't happen often)
             setMessages(prev => [...prev, { sender: 'ai', text: "It looks like there are no questions defined for this interview. Please contact the hiring team." }]);
             setIsInterviewComplete(true);
             setInterviewStage('completed');
         }

      }, 1000);

      // Set up timer for interview duration
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }

  }, [id, videoEnabled, screenShareEnabled, ssnVerified]); // Depend on these to re-evaluate stage
  
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
    if (!interview || isInterviewComplete) return;
    
    setIsTyping(true);
    
    setTimeout(() => {
      let nextQuestion = '';
      
      // Get next question based on interview type
      if (interview.type === InterviewType.MANUAL && interview.questions) {
        if (currentQuestionIndex < interview.questions.length) {
          nextQuestion = interview.questions[currentQuestionIndex].content;
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          // All questions have been asked
          setIsInterviewComplete(true);
          nextQuestion = "Thank you for completing the interview. Your responses have been recorded and will be reviewed by our team. We'll be in touch with you shortly regarding next steps.";
           setInterviewStage('completed');
        }
      } else if (interview.type === InterviewType.LLM_BASED) {
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
           setInterviewStage('completed');
        }
      }
       else {
           // Should not happen if interview type is properly set
            setIsInterviewComplete(true);
            nextQuestion = "An error occurred during the interview. Please contact the hiring team.";
            setInterviewStage('error');
       }
      
      setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: nextQuestion }]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping || isInterviewComplete) return;
    
    // Add user message
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
    setInput('');
    
    // If not all questions have been asked, ask the next one after a delay
    if (!isInterviewComplete) {
      setTimeout(askNextQuestion, 1000);
    }
  };

  if (!interview && interviewStage === 'error') {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Interview not found or an error occurred</h3>
        <p className="text-gray-500 mb-4">The interview you're looking for doesn't exist, has been removed, or there was an issue loading it.</p>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  if (interviewStage === 'loading') {
      return (
          <div className="min-h-screen flex items-center justify-center">
             <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
             <p className="ml-3 text-gray-600">Loading interview details...</p>
          </div>
      );
  }

  if (!interview) return null; // Should not happen if loading and error stages are handled

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
      
      {/* Pre-interview Stages */}
      {interviewStage === 'pre_interview_video' && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
              <Video size={48} className="mx-auto text-primary-500" />
              <h3 className="text-lg font-medium text-gray-900">Enable Video</h3>
              <p className="text-gray-600">Please enable your camera so the AI can see you during the interview.</p>
              <Button variant="primary" onClick={() => setVideoEnabled(true)}>I'm Ready</Button>
          </div>
      )}

      {interviewStage === 'pre_interview_screen' && (
           <div className="bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
              <Monitor size={48} className="mx-auto text-secondary-500" />
              <h3 className="text-lg font-medium text-gray-900">Share Your Screen</h3>
              <p className="text-gray-600">Please share your screen if requested by the interviewer.</p>
              <Button variant="primary" onClick={() => setScreenShareEnabled(true)}>Ready to Share</Button>
          </div>
      )}

       {interviewStage === 'pre_interview_ssn' && (
           <div className="bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
              <CreditCard size={48} className="mx-auto text-accent-500" />
              <h3 className="text-lg font-medium text-gray-900">SSN Verification</h3>
              <p className="text-gray-600">Please be prepared to show your SSN to the camera for verification.</p>
              <Button variant="primary" onClick={() => setSsnVerified(true)}>Understood</Button>
          </div>
      )}

      {/* Interview Active Stage */}
      {interviewStage === 'interview_active' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
               {/* Candidate Video Section */}
               <Card className="md:col-span-1 flex flex-col">
                   <CardHeader><h3 className="text-lg font-medium text-gray-900">Your Video</h3></CardHeader>
                   <CardContent className="flex-grow flex items-center justify-center bg-gray-200 rounded-md">
                       {/* Placeholder for Candidate Video Feed */}
                       <p className="text-gray-500">Candidate Video Feed Here</p>
                   </CardContent>
               </Card>
 
               {/* AI Avatar and Transcript Section */}
               <Card className="md:col-span-2 flex flex-col">
                   <CardHeader><h3 className="text-lg font-medium text-gray-900">AI Interviewer</h3></CardHeader>
                   <CardContent className="flex-grow flex flex-col space-y-4">
                       {/* Placeholder for AI Avatar */}
                       <div className="flex justify-center">
                           <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center">
                               <Brain size={40} className="text-blue-700" />
                           </div>
                       </div>
 
                       {/* Transcript Section */}
                       <div className="flex-grow overflow-y-auto border border-gray-200 rounded-md p-4 space-y-3 text-sm text-gray-800">
                           {messages.map((message, index) => (
                               <div key={index} className={`${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                   <span className={`inline-block px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-primary-100 text-primary-900' : 'bg-gray-100 text-gray-800'}`}>
                                       {message.text}
                                   </span>
                               </div>
                           ))}
                            {isTyping && (
                                <div className="text-left">
                                     <span className="inline-block px-3 py-2 rounded-lg bg-gray-100 text-gray-800 flex items-center">
                                          <Loader2 size={16} className="animate-spin mr-2" />
                                          <span>AI is speaking...</span>
                                     </span>
                                </div>
                            )}
                           <div ref={messagesEndRef} />
                       </div>
                   </CardContent>
                    {/* Input area - Placeholder for Mic Input */}
                   <div className="p-4 border-t border-gray-200 text-center">
                        {isInterviewComplete ? (
                            <p className="text-gray-600">Interview complete. Thank you!</p>
                        ) : isTyping ? (
                            <p className="text-gray-600 flex items-center justify-center"><Loader2 size={16} className="animate-spin mr-2" /> AI is speaking...</p>
                        ) : (
                             // Placeholder for a mic button or voice input indicator
                            <Button variant="primary" disabled>Click to Speak (Placeholder)</Button>
                        )}
                   </div>
               </Card>
           </div>
      )}

      {interviewStage === 'completed' && (
           <div className="bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
              <CheckCircle size={48} className="mx-auto text-green-500" />
              <h3 className="text-lg font-medium text-gray-900">Interview Complete</h3>
              <p className="text-gray-600">Thank you for completing the interview. You can now close this window.</p>
               <Button variant="primary" onClick={() => window.close()}>Close Window</Button>
          </div>
      )}

       {interviewStage === 'error' && (
           <div className="bg-white p-8 rounded-lg shadow-sm text-center space-y-6">
              <AlertTriangle size={48} className="mx-auto text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">Interview Error</h3>
              <p className="text-gray-600">An error occurred loading the interview. Please contact the hiring team.</p>
               <Button variant="primary" onClick={() => window.location.href = '/'}>Go to Homepage</Button>
          </div>
      )}

    </div>
  );
};

export default CandidateInterviewPage;