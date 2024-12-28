import { FaCoffee } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGA } from '@/hooks/useGA';
import { useEffect, useState } from 'react';

export default function DonateLink() {
  const { recordGa } = useGA();

  const [donateLink, setDonateLink] = useState<string>('https://buymeacoffee.com/venuziano');

  const fetchUserCountry = async (): Promise<void> => {
    try {
      const response: Response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const userIP: string = data.ip;
      
      const countryResponse: Response = await fetch(
        `https://ipapi.co/${userIP}/country/`,
        {
          method: 'GET',
        }
      );

      const country: string = await countryResponse.text();
      
      if (country === 'BR') setDonateLink('https://ko-fi.com/venuziano');
    } catch (error) {
      console.log('error', error)
    }
  };

  useEffect(() => {
    fetchUserCountry();
  }, []); // Fetch user country once when the component mounts

  return (
    <a
      href={donateLink}
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