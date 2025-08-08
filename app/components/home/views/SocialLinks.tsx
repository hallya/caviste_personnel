import { SOCIAL_LINKS } from "./constants";
import { InstagramIcon, FacebookIcon } from "../../design-system/icons";

export default function SocialLinks() {
  return (
    <div className="fixed left-6 flex flex-col space-y-4 z-card bottom-4 md:top-4 md:bottom-auto m-0 p-0">
      <a
        href={SOCIAL_LINKS.INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 hover:text-primary-700 transition-colors"
        aria-label="Suivez-nous sur Instagram"
      >
        <InstagramIcon />
      </a>
      <a
        href={SOCIAL_LINKS.FACEBOOK}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 hover:text-primary-700 transition-colors"
        aria-label="Suivez-nous sur Facebook"
      >
        <FacebookIcon />
      </a>
    </div>
  );
} 