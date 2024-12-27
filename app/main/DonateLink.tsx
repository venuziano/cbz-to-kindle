import { FaCoffee } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGA } from '@/hooks/useGA';
import { useEffect, useState } from 'react';

export default function DonateLink() {
  const { recordGa } = useGA();

  const [userCountry, setUserCountry] = useState<string | null>(null);

  const fetchUserCountry = async (): Promise<void> => {
    try {
      const response: Response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const userIP: string = data.ip;
      console.log('data', data)
      const countryResponse: Response = await fetch(
        `https://ipapi.co/${userIP}/country/`,
        {
          method: 'GET',
        }
      );
      console.log('countryResponse', countryResponse)
      const country: string = await countryResponse.text();
      console.log('country', country)

      setUserCountry(country);
    } catch (error) {
      console.log('error', error)
    }
  };

  useEffect(() => {
    fetchUserCountry();
  }, []); // Fetch user country once when the component mounts

  if (userCountry == null) return <></>

  return (
    <a
      href={userCountry === 'BR' ? 'https://ko-fi.com/venuziano' : 'https://buymeacoffee.com/venuziano'}
      // href="https://ko-fi.com/venuziano"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-yellow-400 text-white p-3 rounded-lg shadow hover:bg-yellow-500 transition duration-300"
      onClick={() => recordGa({ category: 'Interaction', action: 'Donate test1212' })}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="inline-block"
      >
        <FaCoffee size={24} />
      </motion.div>
      <span>Buy Me a Coffee</span>
    </a>
  );
}