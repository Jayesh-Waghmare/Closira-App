export type Channel = 'whatsapp' | 'email' | 'call';
export type Status = 'new' | 'qualified' | 'escalated';
export type Urgency = 'high' | 'medium';
export type Sender = 'customer' | 'ai' | 'agent';

export interface Enquiry {
  id: string;
  customer: string;
  channel: Channel;
  status: Status;
  reason?: string;
  receivedAt: string;
  sopMatch?: string;
  summary?: string;
  message?: string;
}

export interface Escalation {
  id: string;
  enquiryId: string;
  customer: string;
  channel: Channel;
  reason: string;
  urgency: Urgency;
  createdAt: string;
  resolved: boolean;
}

export interface FollowUp {
  id: string;
  enquiryId: string;
  customer: string;
  channel: Channel;
  dueAt: string;
  messagePreview: string;
  done: boolean;
}

export interface Message {
  id: string;
  enquiryId: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ConversationDetail: {
    enquiryId?: string;
    escalationId?: string;
  };
  Home: undefined;
  Leads: undefined;
  Escalations: undefined;
  FollowUps: undefined;
};

export type TabParamList = {
  Home: undefined;
  Leads: undefined;
  Escalations: undefined;
  FollowUps: undefined;
};
