import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity, Thermometer, Droplets, Camera, Play, Bot, Send, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Type definitions
interface HealthData {
  heartRate: number;
  spO2: number;
  bodyTemp: number;
  envTemp: number;
  humidity: number;
  ecg: number[];
}

interface EmotionLog {
  emotion: string;
  stress_level: string;
}

interface ECGDataPoint {
  time: number;
  value: number;
}

interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  time: string;
}

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  type: 'heartRate' | 'spO2' | 'bodyTemp' | 'envTemp' | 'humidity';
}

type StatusType = 'heartRate' | 'spO2' | 'bodyTemp' | 'envTemp' | 'humidity';

// Helper function for status colors
const getStatusColor = (value: number, type: StatusType): string => {
  switch (type) {
    case 'heartRate':
      if (value >= 60 && value <= 100) return 'text-green-400';
      return 'text-yellow-400';
    case 'spO2':
      if (value >= 95) return 'text-green-400';
      if (value >= 90) return 'text-yellow-400';
      return 'text-red-400';
    case 'bodyTemp':
      if (value >= 36.1 && value <= 37.2) return 'text-green-400';
      return 'text-yellow-400';
    default:
      return 'text-green-400';
  }
};

// Helper function for status text
const getStatusText = (value: number, type: StatusType): string => {
  switch (type) {
    case 'heartRate':
      if (value >= 60 && value <= 100) return 'Stable';
      return value < 60 ? 'Low' : 'High';
    case 'spO2':
      if (value >= 95) return 'Up';
      return 'Low';
    case 'bodyTemp':
      if (value >= 36.1 && value <= 37.2) return 'Stable';
      return value < 36.1 ? 'Low' : 'High';
    case 'envTemp':
      return 'Down';
    case 'humidity':
      return 'Stable';
    default:
      return 'Stable';
  }
};

// StatCard Component
const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon: Icon, type }) => (
  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-400 text-xs sm:text-sm font-medium">{title}</h3>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
    </div>
    <div className="space-y-2">
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl sm:text-3xl font-bold ${getStatusColor(value, type)}`}>
          {value}
        </span>
        <span className="text-gray-400 text-xs sm:text-sm">{unit}</span>
      </div>
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-500">→</span>
        <span className="text-xs text-gray-400">{getStatusText(value, type)}</span>
      </div>
    </div>
  </div>
);

// ECGChart Component
interface ECGChartProps {
  ecgData: ECGDataPoint[];
  loading: boolean;
  healthData: HealthData;
}
const ECGChart: React.FC<ECGChartProps> = ({ ecgData, loading, healthData }) => (
  <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-700">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
      <h3 className="text-gray-400 text-sm font-medium">ECG Signal</h3>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-blue-400">Live</span>
      </div>
    </div>
    <div className="h-32 sm:h-48 mb-4">
      {ecgData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ecgData}>
            <XAxis hide />
            <YAxis hide domain={[-50, 150]}/>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={false}
              animationDuration={100}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 text-sm text-center">
            {loading ? 'Loading ECG data...' : 'No ECG data available'}
          </div>
        </div>
      )}
    </div>
    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
      <div className="text-center">
        <div className="text-gray-400 mb-1">BPM</div>
        <div className="text-blue-400 font-semibold">{healthData.heartRate}</div>
      </div>
      <div className="text-center">
        <div className="text-gray-400 mb-1">Rhythm</div>
        <div className="text-green-400 font-semibold">Normal</div>
      </div>
      <div className="text-center">
        <div className="text-gray-400 mb-1">Status</div>
        <div className="text-green-400 font-semibold">Stable</div>
      </div>
    </div>
  </div>
);

const DashSim: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    spO2: 98,
    bodyTemp: 36.5,
    envTemp: 22,
    humidity: 45,
    ecg: []
  });
  const [ecgData, setEcgData] = useState<ECGDataPoint[]>([]);
  const [emotionLog, setEmotionLog] = useState<EmotionLog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cameraConnected, setCameraConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'bot',
      message: "Hello! I'm your health AI assistant. I can help you understand your vital signs and provide health insights. What would you like to know?",
      time: '10:00 PM'
    }
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleToggleCamera = async () => {
    if (cameraConnected && stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraConnected(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(newStream);
        setCameraConnected(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraConnected(false);
      }
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  // This useEffect hook simulates real-time data fetching with random values.
  useEffect(() => {
    const dataInterval = setInterval(() => {
      // --- Generate Random Health Data ---
      const newHealthData = {
          heartRate: Math.floor(Math.random() * (90 - 65 + 1)) + 65, // Normal resting HR: 60-100
          spO2: Math.floor(Math.random() * (99 - 96 + 1)) + 96, // Normal SpO2: 95-100%
          bodyTemp: parseFloat((Math.random() * (37.2 - 36.4) + 36.4).toFixed(1)), // Normal temp: 36.1-37.2°C
          envTemp: Math.floor(Math.random() * (25 - 20 + 1)) + 20,
          humidity: Math.floor(Math.random() * (60 - 40 + 1)) + 40,
          ecg: [] // This is handled by ecgData state
      };
      
      // --- Generate Random Emotion Data ---
      const emotions = ['happy', 'neutral'];
      const newEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const newEmotionLog = {
          emotion: newEmotion,
          stress_level: newEmotion === 'happy' ? 'Low' : 'Low' // Stress is always low for this simulation
      };

      // --- Generate Simulated ECG Waveform ---
      const baseFrequency = newHealthData.heartRate / 60; // beats per second
      const points = 300; // number of points in the chart
      const newEcgDataPoints = Array.from({ length: points }, (_, i) => {
          // A simplified combination of sine waves to mimic P, Q, R, S, T waves
          const t = i / points * (2 * Math.PI) * baseFrequency * 2; // Time variable
          const pWave = 5 * Math.sin(t * 5 - 0.5);
          const qrsComplex = 60 * Math.sin(t) * Math.exp(-10 * Math.pow(t % (2*Math.PI) - 1, 2));
          const tWave = 15 * Math.sin(t * 2 + 1.5);
          const noise = (Math.random() - 0.5) * 5;
          const value = 50 + pWave + qrsComplex + tWave + noise;
          return { time: i, value };
      });
      
      // --- Update State ---
      setHealthData(newHealthData);
      setEmotionLog(newEmotionLog);
      setEcgData(newEcgDataPoints);
      setLastUpdated(new Date());

      if (loading) {
        setLoading(false);
      }

    }, 2000); // Update every 2 seconds

    return () => clearInterval(dataInterval); // Cleanup on unmount
  }, [loading]); // Rerun if loading changes (only for initial load)


  const handleSendMessage = async (): Promise<void> => {
    if (chatMessage.trim()) {
      const userMessage: ChatMessage = {
        type: 'user',
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [
        ...prev, 
        userMessage, 
        { type: 'bot', message: '...', time: '' }
      ]);
      
      const currentMessage = chatMessage;
      setChatMessage('');

      try {
        const response = await fetch('https://vitalyse-website-api.onrender.com/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: currentMessage,
            healthData: healthData 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from AI assistant');
        }

        const data = await response.json();

        const botResponse: ChatMessage = {
          type: 'bot',
          message: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatHistory(prev => [...prev.slice(0, -1), botResponse]);

      } catch (error) {
        console.error('Chat API error:', error);
        const errorResponse: ChatMessage = {
          type: 'bot',
          message: 'Sorry, I am having trouble connecting. Please try again later.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev.slice(0, -1), errorResponse]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4 mb-8">
          <img src="/Frame.png" alt="VitalEyes Logo" className="w-12 h-12 rounded-lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">VitalEyes</h1>
            <p className="text-gray-400 text-sm sm:text-base">Real-time health monitoring dashboard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <StatCard title="Heart Rate" value={healthData.heartRate} unit="BPM" icon={Heart} type="heartRate" />
          <StatCard title="SpO2 Level" value={healthData.spO2} unit="%" icon={Activity} type="spO2" />
          <StatCard title="Body Temp" value={healthData.bodyTemp} unit="°C" icon={Thermometer} type="bodyTemp" />
          <StatCard title="Env Temp" value={healthData.envTemp} unit="°C" icon={Thermometer} type="envTemp" />
          <StatCard title="Humidity" value={healthData.humidity} unit="%" icon={Droplets} type="humidity" />
        </div>

        <ECGChart ecgData={ecgData} loading={loading} healthData={healthData} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mt-8 mb-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                <h3 className="text-lg font-semibold text-white">External Camera</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${cameraConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm ${cameraConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {cameraConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg aspect-video flex flex-col items-center justify-center mb-6 border border-gray-600 p-4 relative">
                {cameraConnected && stream ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <>
                    <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mb-4" />
                    <p className="text-gray-400 text-center mb-4 text-sm sm:text-base">Camera feed is disconnected</p>
                  </>
                )}
                <button 
                  onClick={handleToggleCamera}
                  className="absolute bottom-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-sm z-10"
                >
                  {cameraConnected ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{cameraConnected ? 'Disconnect Device' : 'Connect Device'}</span>
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-3 sm:space-y-0">
                <span className="text-gray-400">Device: External Monitor</span>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors text-center">
                    Device Settings
                  </button>
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors text-center">
                    Sync
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-700">
              <h4 className="text-base font-semibold text-white mb-4">Facial Emotion Analysis</h4>
              {emotionLog ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Detected Emotion</div>
                    <div className="text-blue-400 font-bold capitalize">{emotionLog.emotion}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Stress Level</div>
                    <div className="text-blue-400 font-bold capitalize">{emotionLog.stress_level}</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Waiting for emotion data...</div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col h-96 xl:h-auto">
            <div className="p-4 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Health AI Assistant</h3>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto min-h-0">
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-xs lg:max-w-sm`}>
                      {chat.type === 'bot' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className={`p-3 rounded-lg ${
                        chat.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-200'
                      }`}>
                        <p className="text-xs sm:text-sm leading-relaxed">{chat.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{chat.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700 flex-shrink-0">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your health data..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Updating...'}
        </div>
      </div>
    </div>
  );
};

export default DashSim;

