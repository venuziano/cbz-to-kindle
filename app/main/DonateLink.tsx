import { FaCoffee, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGA } from '@/hooks/useGA';
import { useEffect, useMemo, useState } from 'react';
import { IconType } from 'react-icons';

interface IFloatingEmoji {
  Emoji: IconType,
  color: string,
  delay?: number,
}

export const FloatingEmoji = ({ Emoji, color, delay = 0 }: IFloatingEmoji) => {
  // Generate random x positions so they don’t all follow the exact same path
  const [x1, x2] = useMemo(() => {
    const randX1 = (Math.random() * 35) - 25;
    const randX2 = (Math.random() * 35) - 25; // second random
    return [randX1, randX2];
  }, []);

  // Generate random y offsets so they float a bit differently in vertical space
  const [y1, y2] = useMemo(() => {
    const randY1 = (Math.random() * 8);
    const randY2 = (Math.random() * 8);
    return [randY1, randY2];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        // Slightly different path for each instance
        opacity: [0, 1, 0],
        x: [0, x1, x2],
        y: [0, -50 - y1, -90 - y2],
      }}
      transition={{
        duration: 2,
        ease: 'easeOut',
        repeat: Infinity,
        repeatDelay: 1,
        delay,
      }}
      className="absolute"
      style={{
        // top of the coffee cup
        top: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        color,
      }}
    >
      <Emoji size={16} />
    </motion.div>
  );
};

export default function DonateLink() {
  const { recordGa } = useGA();

  const [donateLink, setDonateLink] = useState<string>('https://buymeacoffee.com/venuziano');

  const emojis = [
    { id: 'icon-1', icon: FaHeart, color: '#ff3860', delay: 0 },
    { id: 'icon-2', icon: FaHeart, color: '#ff3860', delay: 0.4 },
    { id: 'icon-3', icon: FaHeart, color: '#ff3860', delay: 0.8 },
  ];

  const fetchUserCountry = async () => {
    try {
      const response = await fetch('/api/getCountry');
      const data = await response.json();

      if (data.country === 'BR') {
        setDonateLink('https://ko-fi.com/venuziano');
      }
    } catch (error) {
      console.error('Error fetching country from route:', error);
    }
  };

  // const fetchUserCountry = async (): Promise<void> => {
  //   try {
  //     const response: Response = await fetch("https://api.ipify.org?format=json");
  //     const data = await response.json();
  //     const userIP: string = data.ip;

  //     const countryResponse: Response = await fetch(
  //       `https://ipapi.co/${userIP}/country/`,
  //       {
  //         method: 'GET',
  //       }
  //     );

  //     const country: string = await countryResponse.text();

  //     if (country === 'BR') setDonateLink('https://ko-fi.com/venuziano');
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // };

  useEffect(() => {
    fetchUserCountry();
  }, []); // Fetch user country once when the component mounts

  return (
    <a
      href={donateLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 
                 bg-yellow-400 text-white 
                 p-3 rounded-lg shadow 
                 hover:bg-yellow-500 
                 transition duration-300 md:ml-2 mt-4 md:mt-0"
      onClick={() => recordGa({ category: 'Interaction', action: 'Donate test1212' })}
    >
      {/* Coffee icon container (relative) so we can absolutely position emojis */}
      <div className="relative inline-block">
        {/* The rotating/scaling coffee cup */}
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block"
        >
          <FaCoffee size={24} />
        </motion.div>

        {/* Render three floating emojis with staggered delays and random paths */}
        {emojis.map(({ id, icon: Icon, color, delay }) => (
          <FloatingEmoji key={id} Emoji={Icon} color={color} delay={delay} />
        ))}
      </div>

      <span>Buy Me a Coffee</span>
    </a>
    //   <a
    //     href={donateLink}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //     className="
    //   relative 
    //   flex items-center gap-2 
    //   bg-yellow-400 text-white 
    //   p-3 rounded-lg shadow 
    //   hover:bg-yellow-500 
    //   transition duration-300
    //   overflow-hidden
    //   donate-btn-container
    // "
    //     onClick={() => recordGa({ category: 'Interaction', action: 'Donate test1212' })}
    //   >
    //     <motion.div
    //       animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
    //       transition={{ repeat: Infinity, duration: 2 }}
    //       className="inline-block"
    //     >
    //       <FaCoffee size={24} />
    //     </motion.div>
    //     <span className="relative z-10">Buy Me a Coffee</span>
    //   </a>
  );
}