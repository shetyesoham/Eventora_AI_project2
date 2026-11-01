"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService, DEMO_EVENT_ID } from "@/services/api";
import { EventItem } from "@/types";

interface EventContextType {
  currentEventId: string;
  currentEvent: EventItem | null;
  eventsList: EventItem[];
  setCurrentEventId: (id: string) => void;
  refreshEvents: () => Promise<void>;
  loading: boolean;
}

const EventContext = createContext<EventContextType>({
  currentEventId: DEMO_EVENT_ID,
  currentEvent: null,
  eventsList: [],
  setCurrentEventId: () => {},
  refreshEvents: async () => {},
  loading: true,
});

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [currentEventId, setCurrentEventIdState] = useState<string>(DEMO_EVENT_ID);
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load active event ID from localStorage if available
  useEffect(() => {
    const savedId = localStorage.getItem("eventora_active_event_id");
    if (savedId) {
      setCurrentEventIdState(savedId);
    }
  }, []);

  const setCurrentEventId = (id: string) => {
    setCurrentEventIdState(id);
    localStorage.setItem("eventora_active_event_id", id);
  };

  const refreshEvents = async () => {
    try {
      const list = await apiService.getEvents();
      setEventsList(list);
      
      // If current selected event exists in list, set it, else fall back to first
      const found = list.find((e) => e.id === currentEventId) || list[0] || null;
      setCurrentEvent(found);
      if (found && found.id !== currentEventId) {
        setCurrentEventId(found.id);
      }
    } catch (err) {
      console.error("Error refreshing events context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, [currentEventId]);

  return (
    <EventContext.Provider
      value={{
        currentEventId,
        currentEvent,
        eventsList,
        setCurrentEventId,
        refreshEvents,
        loading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}

