export type ScreenTab = 'home' | 'demo' | 'pricing' | 'contact';

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  text: string;
  time: string;
  agentName?: string;
  options?: string[];
}

export interface DemoFormData {
  fullName: string;
  workEmail: string;
  companyWebsite: string;
  trafficVolume: string;
  primaryGoal: string;
  message: string;
  agreedToTerms: boolean;
}

export interface ToastState {
  show: boolean;
  title: string;
  message: string;
  type?: 'success' | 'info';
}
