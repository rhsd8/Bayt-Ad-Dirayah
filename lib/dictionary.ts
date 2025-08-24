export interface Dictionary {
  [key: string]: unknown;
  admin: {
    title: string
    totalStudents: string
    totalCourses: string
    totalMaterials: string
    recentActivity: string
    createCourse: string
    courseTitle: string
    courseDescription: string
    courseLevel: string
  }
  courses: {
    beginner: string
    intermediate: string
    advanced: string
    startCourse: string
    lessons: string
    materials: string
  }
  materials: {
    uploadMaterial: string
    uploadSuccess: string
    viewPDF: string
    downloadPDF: string
  }
  common: {
    back: string
    cancel: string
    save: string
    upload: string
  }
  navigation?: Record<string, string>
  dashboard?: Record<string, string>
  progress?: Record<string, string>
  quiz?: Record<string, string>
  flashcards?: Record<string, string>
  community?: Record<string, string>
  notes?: Record<string, string>
  profile?: Record<string, string>
  settings?: Record<string, string>
  auth?: Record<string, string>
  pdf?: Record<string, string>
  accessibility?: Record<string,string>
  errors?: Record<string, string>
  landing?: Record<string, unknown>
}
