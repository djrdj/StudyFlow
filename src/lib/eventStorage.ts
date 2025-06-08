
export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  subject: string;
  reminder?: string;
}

const STORAGE_KEY = 'studyflow-events';

export const getEvents = (): Event[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const saveEvent = (event: Omit<Event, 'id'> | Event): Event => {
  const events = getEvents();
  
  if ('id' in event) {
    // Update existing event
    const index = events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      events[index] = event;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return event;
  } else {
    // Create new event
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };
    
    events.push(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  }
};

export const deleteEvent = (eventId: string): void => {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== eventId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
};

export const getEventById = (eventId: string): Event | undefined => {
  const events = getEvents();
  return events.find(event => event.id === eventId);
};
