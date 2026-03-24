interface AlertToastProps {
  alert: { message: string; error?: boolean } | null;
}

export function AlertToast({ alert }: AlertToastProps) {
  if (!alert) return null;
  return <div className={`alert ${alert.error ? 'error' : ''}`}>{alert.message}</div>;
}
