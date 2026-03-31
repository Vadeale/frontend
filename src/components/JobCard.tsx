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
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
  const normalizedApiBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  const imageSrc = (() => {
    if (!job.image) return null;
    if (job.image.startsWith('http://') || job.image.startsWith('https://')) return job.image;
    if (job.image.startsWith('/')) return `${normalizedApiBase}${job.image}`;
    return `${normalizedApiBase}/${job.image}`;
  })();

  return (
    <article className="job-item">
      <div className="job-content">
        {imageSrc ? (
          <div className="job-thumbnail">
            <img src={imageSrc} alt="Изображение задания" className="job-img" onClick={() => onOpenImage(imageSrc)} />
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
