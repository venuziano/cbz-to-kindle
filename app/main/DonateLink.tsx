import { FaCoffee } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGA } from '@/hooks/useGA';


export default function DonateLink() {
  const { recordGa } = useGA();
 
  return (
    <a
      href="https://ko-fi.com/venuziano"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-yellow-400 text-white p-3 rounded-lg shadow hover:bg-yellow-500 transition duration-300"
      onClick={() => recordGa({category: 'Interaction', action: 'Donate test1212'})}
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