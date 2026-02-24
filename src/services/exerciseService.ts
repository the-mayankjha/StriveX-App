const BASE_URL = '/api/v1';

// Fallback data for when API is down or limited
const FALLBACK_BODY_PARTS = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
const FALLBACK_EQUIPMENTS = ['body weight', 'dumbbell', 'barbell', 'cable', 'kettlebell', 'medicine ball', 'plate', 'resistance band', 'stability ball', 'weighted'];
const FALLBACK_MUSCLES = ['abductors', 'abs', 'adductors', 'biceps', 'calves', 'cardiovascular system', 'delts', 'forearms', 'glutes', 'hamstrings', 'lats', 'levator scapulae', 'pectorals', 'quads', 'serratus anterior', 'spine', 'traps', 'triceps', 'upper back'];

export interface ExerciseDBResponse {
  success: boolean;
  metadata: {
    totalExercises: number;
    totalPages: number;
    currentPage: number;
  };
  data: ExerciseDBItem[];
}

export interface ExerciseDBItem {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

const getCache = (key: string) => {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to set cache:', e);
  }
};

export const exerciseService = {
  async getExercises(offset = 0, limit = 20): Promise<ExerciseDBResponse> {
    try {
      const response = await fetch(`${BASE_URL}/exercises?offset=${offset}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return response.json();
    } catch (err) {
      console.warn('ExerciseDB fetch failed, using minimal response');
      return {
        success: false,
        metadata: { totalExercises: 0, totalPages: 0, currentPage: 0 },
        data: []
      };
    }
  },

  async searchExercises(query: string, limit = 20): Promise<ExerciseDBResponse> {
    try {
      const response = await fetch(`${BASE_URL}/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to search exercises');
      return response.json();
    } catch (err) {
      console.warn('ExerciseDB search failed');
      return {
        success: false,
        metadata: { totalExercises: 0, totalPages: 0, currentPage: 0 },
        data: []
      };
    }
  },

  async getBodyParts(): Promise<string[]> {
    const cacheKey = 'strivex_cache_bodyparts';
    try {
      const response = await fetch(`${BASE_URL}/bodyparts`);
      if (!response.ok) throw new Error('Failed to fetch body parts');
      const result = await response.json();
      const data = result.data.map((item: any) => item.name);
      setCache(cacheKey, data);
      return data;
    } catch (err) {
      console.warn('Using cached or fallback body parts due to error:', err);
      return getCache(cacheKey) || FALLBACK_BODY_PARTS;
    }
  },

  async getEquipments(): Promise<string[]> {
    const cacheKey = 'strivex_cache_equipments';
    try {
      const response = await fetch(`${BASE_URL}/equipments`);
      if (!response.ok) throw new Error('Failed to fetch equipments');
      const result = await response.json();
      const data = result.data.map((item: any) => item.name);
      setCache(cacheKey, data);
      return data;
    } catch (err) {
      console.warn('Using cached or fallback equipments due to error:', err);
      return getCache(cacheKey) || FALLBACK_EQUIPMENTS;
    }
  },

  async getTargetMuscles(): Promise<string[]> {
    const cacheKey = 'strivex_cache_muscles';
    try {
      const response = await fetch(`${BASE_URL}/muscles`);
      if (!response.ok) throw new Error('Failed to fetch target muscles');
      const result = await response.json();
      const data = result.data.map((item: any) => item.name);
      setCache(cacheKey, data);
      return data;
    } catch (err) {
      console.warn('Using cached or fallback muscles due to error:', err);
      return getCache(cacheKey) || FALLBACK_MUSCLES;
    }
  },

  async getExercisesByBodyPart(bodyPart: string, limit = 20): Promise<ExerciseDBResponse> {
    try {
      const response = await fetch(`${BASE_URL}/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch exercises by body part');
      return response.json();
    } catch (err) {
      return { success: false, metadata: { totalExercises: 0, totalPages: 0, currentPage: 0 }, data: [] };
    }
  },

  async getExercisesByEquipment(equipment: string, limit = 20): Promise<ExerciseDBResponse> {
    try {
      const response = await fetch(`${BASE_URL}/equipments/${encodeURIComponent(equipment)}/exercises?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch exercises by equipment');
      return response.json();
    } catch (err) {
      return { success: false, metadata: { totalExercises: 0, totalPages: 0, currentPage: 0 }, data: [] };
    }
  },

  async getExercisesByTarget(target: string, limit = 20): Promise<ExerciseDBResponse> {
    try {
      const response = await fetch(`${BASE_URL}/muscles/${encodeURIComponent(target)}/exercises?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch exercises by target muscle');
      return response.json();
    } catch (err) {
      return { success: false, metadata: { totalExercises: 0, totalPages: 0, currentPage: 0 }, data: [] };
    }
  }
};
