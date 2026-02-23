import { useState } from 'react';
import { Card } from '../components/Card';
import { exercises } from '../data/exercises';
import { Search } from 'lucide-react';

export function ExerciseBank() {
  const [filter, setFilter] = useState('');

  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(filter.toLowerCase()) || 
    ex.muscleGroups.some(mg => mg.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-20 pt-2 animate-fade-in">
      <div className="px-1">
        <h2 className="text-2xl font-bold text-white mb-4">Exercises</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search exercises..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-surface border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-base focus:border-primary focus:outline-none transition-colors shadow-sm placeholder:text-text-muted/50"
          />
        </div>
      </div>

      <div className="space-y-3 px-1">
        {filteredExercises.map(ex => (
          <Card key={ex.id} className="active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white">{ex.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                ex.rank === 'S' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                ex.rank === 'A' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 
                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
              }`}>
                RANK {ex.rank}
              </span>
            </div>
            
            <p className="text-sm text-text-muted mb-4 leading-relaxed">{ex.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {ex.muscleGroups.map(mg => (
                <span key={mg} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-surfaceHighlight text-text-muted font-medium">
                  {mg}
                </span>
              ))}
            </div>
          </Card>
        ))}
        
        {filteredExercises.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            <p>No exercises found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
