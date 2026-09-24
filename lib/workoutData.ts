export interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core';
  equipment: 'Barbell' | 'Dumbbell' | 'Bodyweight' | 'Machine' | 'Cable';
  sets: number;
  reps: string;
  restSeconds: number;
  tip: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  description: string;
  daysPerWeek: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
}

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'push-pull-legs',
    title: 'Push / Pull / Legs (PPL)',
    description: 'The gold standard routine for building muscle and strength while burning fat.',
    daysPerWeek: '3 – 6 Days / week',
    difficulty: 'Intermediate',
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Bench Press',
        category: 'Chest',
        equipment: 'Barbell',
        sets: 4,
        reps: '8 - 10 reps',
        restSeconds: 90,
        tip: 'Retract shoulder blades, keep feet flat on the ground.',
      },
      {
        id: 'ex-2',
        name: 'Incline Dumbbell Press',
        category: 'Chest',
        equipment: 'Dumbbell',
        sets: 3,
        reps: '10 - 12 reps',
        restSeconds: 60,
        tip: 'Set bench to 30-degree incline for upper chest focus.',
      },
      {
        id: 'ex-3',
        name: 'Barbell Squat',
        category: 'Legs',
        equipment: 'Barbell',
        sets: 4,
        reps: '6 - 8 reps',
        restSeconds: 120,
        tip: 'Keep chest upright, push knees out over toes.',
      },
      {
        id: 'ex-4',
        name: 'Romanian Deadlift',
        category: 'Legs',
        equipment: 'Barbell',
        sets: 3,
        reps: '10 - 12 reps',
        restSeconds: 90,
        tip: 'Hinge at the hips, keep back straight to load hamstrings.',
      },
      {
        id: 'ex-5',
        name: 'Pull-Ups / Lat Pulldown',
        category: 'Back',
        equipment: 'Bodyweight',
        sets: 4,
        reps: '8 - 12 reps',
        restSeconds: 90,
        tip: 'Lead with chest to pull shoulders back and down.',
      },
      {
        id: 'ex-6',
        name: 'Overhead Shoulder Press',
        category: 'Shoulders',
        equipment: 'Dumbbell',
        sets: 3,
        reps: '8 - 10 reps',
        restSeconds: 60,
        tip: 'Press straight overhead without excessive lower back arch.',
      },
    ],
  },
  {
    id: 'upper-lower',
    title: 'Upper / Lower Split',
    description: 'Optimal 4-day split for muscle hypertrophy and balanced recovery.',
    daysPerWeek: '4 Days / week',
    difficulty: 'Intermediate',
    exercises: [
      {
        id: 'ex-7',
        name: 'Dumbbell Bent-Over Row',
        category: 'Back',
        equipment: 'Dumbbell',
        sets: 4,
        reps: '10 - 12 reps',
        restSeconds: 60,
        tip: 'Pull dumbbells toward belly button to engage lower lats.',
      },
      {
        id: 'ex-8',
        name: 'Leg Press',
        category: 'Legs',
        equipment: 'Machine',
        sets: 4,
        reps: '10 - 15 reps',
        restSeconds: 90,
        tip: 'Control the eccentric downward phase for quad activation.',
      },
      {
        id: 'ex-9',
        name: 'Dumbbell Lateral Raise',
        category: 'Shoulders',
        equipment: 'Dumbbell',
        sets: 4,
        reps: '12 - 15 reps',
        restSeconds: 45,
        tip: 'Lead with elbows to isolate side deltoids.',
      },
      {
        id: 'ex-10',
        name: 'Bicep Dumbbell Curls',
        category: 'Arms',
        equipment: 'Dumbbell',
        sets: 3,
        reps: '12 reps',
        restSeconds: 45,
        tip: 'Keep elbows stationary at your sides throughout rep.',
      },
    ],
  },
  {
    id: 'full-body',
    title: 'Full Body Recomp Routine',
    description: 'Time-efficient 3-day routine ideal for fat loss & muscle preservation.',
    daysPerWeek: '3 Days / week',
    difficulty: 'Beginner',
    exercises: [
      {
        id: 'ex-11',
        name: 'Goblet Squats',
        category: 'Legs',
        equipment: 'Dumbbell',
        sets: 3,
        reps: '12 reps',
        restSeconds: 60,
        tip: 'Hold dumbbell close to chest, squat deep below parallel.',
      },
      {
        id: 'ex-12',
        name: 'Push-Ups',
        category: 'Chest',
        equipment: 'Bodyweight',
        sets: 3,
        reps: '12 - 15 reps',
        restSeconds: 45,
        tip: 'Maintain strict plank position, lower chest to floor.',
      },
      {
        id: 'ex-13',
        name: 'Plank Hold',
        category: 'Core',
        equipment: 'Bodyweight',
        sets: 3,
        reps: '45 - 60 seconds',
        restSeconds: 45,
        tip: 'Squeeze glutes and brace core tightly.',
      },
    ],
  },
];
