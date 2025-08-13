interface AnnouncementProps {
  message: string | null;
}

export default function Announcement({ message }: AnnouncementProps) {
  if (!message) return null;

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {message}
    </div>
  );
}
