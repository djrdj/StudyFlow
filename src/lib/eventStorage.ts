
export interface StudyEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  subjectId?: string;
  type: 'exam' | 'assignment' | 'study-session' | 'reminder';
  notifyBefore: number; // minutes before event
  completed: boolean;
}

const EVENTS_KEY = 'studyflow-events';

export const getStoredEvents = (): StudyEvent[] => {
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (!stored) return [];
    
    const events = JSON.parse(stored);
    return events.map((event: any) => ({
      ...event,
      date: new Date(event.date)
    }));
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const saveEvents = (events: StudyEvent[]) => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

export const addEvent = (event: Omit<StudyEvent, 'id'>) => {
  const events = getStoredEvents();
  const newEvent: StudyEvent = {
    ...event,
    id: Date.now().toString()
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

export const updateEvent = (id: string, updates: Partial<StudyEvent>) => {
  const events = getStoredEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
  }
};

export const deleteEvent = (id: string) => {
  const events = getStoredEvents();
  const filtered = events.filter(e => e.id !== id);
  saveEvents(filtered);
};

export const getUpcomingEvents = (days: number = 7): StudyEvent[] => {
  const events = getStoredEvents();
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);
  
  return events
    .filter(event => event.date >= now && event.date <= futureDate && !event.completed)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};
