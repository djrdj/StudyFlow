
export interface StudySession {
  id: string;
  subjectId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
}

export interface Subject {
  id: string;
  name: string;
  totalTime: number; // in seconds
  colorTag?: string;
}

export interface AppData {
  subjects: Subject[];
  sessions: StudySession[];
}

const STORAGE_KEY = 'studyflow-data';

export const getStoredData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      data.sessions = data.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime),
      }));
      return data;
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
  
  return {
    subjects: [
      { id: "1", name: "Mathematics", totalTime: 4320 }, // 1h 12m in seconds
      { id: "2", name: "Science", totalTime: 2700 }, // 45m in seconds
      { id: "3", name: "English", totalTime: 1800 }, // 30m in seconds
    ],
    sessions: [],
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const addSubject = (name: string): Subject => {
  const data = getStoredData();
  const newSubject: Subject = {
    id: Date.now().toString(),
    name: name.trim(),
    totalTime: 0,
  };
  data.subjects.push(newSubject);
  saveData(data);
  return newSubject;
};

export const updateSubject = (id: string, updates: Partial<Subject>): void => {
  const data = getStoredData();
  const index = data.subjects.findIndex(s => s.id === id);
  if (index !== -1) {
    data.subjects[index] = { ...data.subjects[index], ...updates };
    saveData(data);
  }
};

export const deleteSubject = (id: string): void => {
  const data = getStoredData();
  data.subjects = data.subjects.filter(s => s.id !== id);
  data.sessions = data.sessions.filter(s => s.subjectId !== id);
  saveData(data);
};

export const addSession = (subjectId: string, startTime: Date, endTime: Date): StudySession => {
  const data = getStoredData();
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  
  const newSession: StudySession = {
    id: Date.now().toString(),
    subjectId,
    startTime,
    endTime,
    duration,
  };
  
  data.sessions.push(newSession);
  
  // Update subject total time
  const subject = data.subjects.find(s => s.id === subjectId);
  if (subject) {
    subject.totalTime += duration;
  }
  
  saveData(data);
  return newSession;
};

export const getTodaySessions = (): StudySession[] => {
  const data = getStoredData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return data.sessions.filter(session => 
    session.startTime >= today && session.startTime < tomorrow
  );
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${secs}s`;
  }
};

export const formatTimeDetailed = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
