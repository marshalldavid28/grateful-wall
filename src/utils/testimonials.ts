
export interface Testimonial {
  id: string;
  studentName: string;
  imageUrl?: string; // LinkedIn screenshot or profile picture
  text: string;
  company?: string;
  role?: string;
  date: string;
  course?: string;
  featured?: boolean;
}

// Mock testimonials
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    studentName: 'Alex Chen',
    imageUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
    text: 'Adtechademy completely transformed my career. I went from struggling with basic ad concepts to managing complex campaigns within months. The instructors truly care about your success!',
    company: 'Digital MarketingPro',
    role: 'Ad Operations Manager',
    date: '2023-11-15',
    course: 'Advanced Ad Operations',
    featured: true
  },
  {
    id: '2',
    studentName: 'Sarah Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    text: 'The hands-on projects at Adtechademy gave me practical experience that immediately translated to my job. My team was impressed with my knowledge right away!',
    company: 'MediaSolutions',
    role: 'Ad Tech Specialist',
    date: '2023-10-22',
    course: 'Programmatic Fundamentals'
  },
  {
    id: '3',
    studentName: 'Miguel Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    text: 'I had tried other courses before, but nothing clicked until Adtechademy. The way they break down complex concepts makes everything so approachable.',
    company: 'AdExchange Global',
    role: 'Technical Product Manager',
    date: '2023-09-18',
    course: 'AdTech Architecture',
    featured: true
  },
  {
    id: '4',
    studentName: 'Priya Patel',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    text: 'The community at Adtechademy is incredibly supportive. Even after completing the course, I still keep in touch with my peers and instructors for advice.',
    company: 'TechMedia Solutions',
    role: 'Programmatic Specialist',
    date: '2023-12-05',
    course: 'Data Analytics for AdTech'
  },
  {
    id: '5',
    studentName: 'James Wilson',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    text: 'As someone from a non-technical background, I was worried about keeping up. Adtechademy's step-by-step approach made the transition into ad tech smooth and enjoyable.',
    company: 'Digital First Agency',
    role: 'Ad Operations Analyst',
    date: '2023-08-30',
    course: 'Ad Tech for Beginners'
  },
  {
    id: '6',
    studentName: 'Emma Davis',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    text: 'The ROI on this course is incredible. Within two months of graduating, I received a promotion and a 30% salary increase thanks to my new skills.',
    company: 'MarketingTech Inc',
    role: 'Senior Ad Operations',
    date: '2024-01-10',
    course: 'Campaign Management Mastery',
    featured: true
  }
];
