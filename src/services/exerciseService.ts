const BASE_URL = 'https://exercisedb.dev/api/v1';

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

export const exerciseService = {
  async getExercises(offset = 0, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/exercises?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch exercises');
    return response.json();
  },

  async searchExercises(query: string, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to search exercises');
    return response.json();
  },

  async getBodyParts(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/bodyparts`);
    if (!response.ok) throw new Error('Failed to fetch body parts');
    const result = await response.json();
    return result.data.map((item: any) => item.name);
  },

  async getEquipments(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/equipments`);
    if (!response.ok) throw new Error('Failed to fetch equipments');
    const result = await response.json();
    return result.data.map((item: any) => item.name);
  },

  async getTargetMuscles(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/muscles`);
    if (!response.ok) throw new Error('Failed to fetch target muscles');
    const result = await response.json();
    return result.data.map((item: any) => item.name);
  },

  async getExercisesByBodyPart(bodyPart: string, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch exercises by body part');
    return response.json();
  },

  async getExercisesByEquipment(equipment: string, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/equipments/${encodeURIComponent(equipment)}/exercises?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch exercises by equipment');
    return response.json();
  },

  async getExercisesByTarget(target: string, limit = 20): Promise<ExerciseDBResponse> {
    const response = await fetch(`${BASE_URL}/muscles/${encodeURIComponent(target)}/exercises?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch exercises by target muscle');
    return response.json();
  }
};
