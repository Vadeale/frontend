import type { Job } from '../types';
import { detectContactType, formatJobDate, getContactButtonText, pluralizeResponses } from '../lib/job-utils';

interface JobCardProps {
  job: Job;
  onOpenImage: (src: string | null) => void;
  onRespond: (job: Job, type: 'email' | 'link' | 'phone', contact: string) => Promise<void>;
}

export function JobCard({ job, onOpenImage, onRespond }: JobCardProps) {
  const contact = job.public_contacts || job.email || '';
  const type = detectContactType(contact);

  return (
    <article className="job-item">
      <div className="job-content">
        {job.image ? (
          <div className="job-thumbnail">
            <img src={job.image} alt="Изображение задания" className="job-img" onClick={() => onOpenImage(job.image ?? null)} />
          </div>
        ) : null}
        <div className="job-text">{job.text}</div>
      </div>
      <div className="job-footer">
        <button className="contact-btn" data-type={type} type="button" onClick={() => void onRespond(job, type, contact)}>
          {getContactButtonText(type)}
        </button>
        <div className="job-meta">
          <span>{formatJobDate(job.created_at)}</span>
          <span className="job-responses">
            <span className="response-icon">💬</span>
            <span className="responses-count">{pluralizeResponses(job.responses || 0)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
