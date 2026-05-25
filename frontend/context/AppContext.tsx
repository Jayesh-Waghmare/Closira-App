import React, { createContext, useContext, useState } from "react";
import { Enquiry, Escalation, FollowUp, Message } from "../types";

import mockEnquiries from "../mock/enquiries.json";
import mockEscalations from "../mock/escalations.json";
import mockFollowUps from "../mock/followups.json";
import mockMessages from "../mock/conversations.json";

interface AppContextType {
  enquiries: Enquiry[];
  escalations: Escalation[];
  followUps: FollowUp[];
  messages: Message[];
  resolveEscalation: (id: string) => void;
  markFollowUpDone: (id: string) => void;
  addMessage: (enquiryId: string, text: string, sender: "customer" | "ai" | "agent") => void;
  scheduleFollowUp: (enquiryId: string, delayMinutes: number, template?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function fixMockDate(isoString: string): string {
  if (!isoString) return isoString;
  const targetDate = new Date(isoString);
  const now = new Date();
  
  const baseTime = new Date("2026-05-24T00:00:00Z").getTime();
  const diffMs = targetDate.getTime() - baseTime;
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const adjustedDate = new Date(todayStart + diffMs);
  return adjustedDate.toISOString();
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const loadedEnquiries = (mockEnquiries as Enquiry[]).map(e => ({
    ...e,
    receivedAt: fixMockDate(e.receivedAt)
  }));
  const loadedEscalations = (mockEscalations as Escalation[]).map(e => ({
    ...e,
    createdAt: fixMockDate(e.createdAt)
  }));
  const loadedFollowUps = (mockFollowUps as FollowUp[]).map(f => ({
    ...f,
    dueAt: fixMockDate(f.dueAt)
  }));
  const loadedMessages = (mockMessages as Message[]).map(m => ({
    ...m,
    timestamp: fixMockDate(m.timestamp)
  }));

  const [enquiries, setEnquiries] = useState<Enquiry[]>(loadedEnquiries);
  const [escalations, setEscalations] = useState<Escalation[]>(loadedEscalations);
  const [followUps, setFollowUps] = useState<FollowUp[]>(loadedFollowUps);
  const [messages, setMessages] = useState<Message[]>(loadedMessages);

  const resolveEscalation = (id: string) => {
    setEscalations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, resolved: true } : e))
    );
  };

  const markFollowUpDone = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, done: true } : f))
    );
  };

  const addMessage = (enquiryId: string, text: string, sender: "customer" | "ai" | "agent") => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      enquiryId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    if (sender !== "customer") {
      setEscalations((prev) =>
        prev.map((e) => (e.enquiryId === enquiryId ? { ...e, resolved: true } : e))
      );
    }
  };

  const scheduleFollowUp = (enquiryId: string, delayMinutes: number, template?: string) => {
    const enq = enquiries.find((e) => e.id === enquiryId);
    const newFu: FollowUp = {
      id: `fu_${Date.now()}`,
      enquiryId,
      customer: enq?.customer ?? "Unknown",
      channel: enq?.channel ?? "whatsapp",
      dueAt: new Date(Date.now() + delayMinutes * 60000).toISOString(),
      messagePreview: template ?? "Following up on your request.",
      done: false,
    };
    setFollowUps((prev) => [...prev, newFu]);
  };

  return (
    <AppContext.Provider
      value={{
        enquiries,
        escalations,
        followUps,
        messages,
        resolveEscalation,
        markFollowUpDone,
        addMessage,
        scheduleFollowUp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
