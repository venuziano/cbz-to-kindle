import GitHubLink from './GitHubLink';
import DonateLink from './DonateLink';

interface IActionsProperties {
  customClassName?: string
}

export default function Actions({ customClassName }: IActionsProperties) {
  return (
    <div className={`flex justify-center items-center bg-white rounded-lg shadow-lg p-2 ${customClassName}`}>
      <GitHubLink />
      <DonateLink />
    </div>
  )
}