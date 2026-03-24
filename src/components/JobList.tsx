import type { Job } from '../types';
import { JobCard } from './JobCard';

interface JobListProps {
  jobs: Job[];
  onOpenImage: (src: string | null) => void;
  onRespond: (job: Job, type: 'email' | 'link' | 'phone', contact: string) => Promise<void>;
}

export function JobList({ jobs, onOpenImage, onRespond }: JobListProps) {
  if (jobs.length === 0) {
    return <div className="empty-state">Нет активных заданий</div>;
  }

  return (
    <div className="job-list" id="jobs-list">
      {jobs.map((job) => (
        <JobCard key={job.token} job={job} onOpenImage={onOpenImage} onRespond={onRespond} />
      ))}
    </div>
  );
}
