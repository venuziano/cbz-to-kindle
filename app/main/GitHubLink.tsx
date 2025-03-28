import { useGA } from '@/hooks/useGA';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';

interface IGitHubLinkProperties {
  customClassName?: string
}

export default function GitHubLink({ customClassName }: IGitHubLinkProperties) {
  const { recordGa } = useGA();
  const translation: TFunction = useTranslation('common').t;

  return (
    <div 
      className={`flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-2 ${customClassName}`}
      onClick={() => recordGa({category: 'Interaction', action: 'Github_test'})}
    >
      <a
        href="https://github.com/venuziano"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
      >
        <FaGithub size={32} />
        <span className="text-lg font-medium">{translation("gitHub")}</span>
      </a>
    </div>
  );
}