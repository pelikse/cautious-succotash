import { BsGithub, BsSpotify } from 'react-icons/bs';
import { FaLinkedinIn } from 'react-icons/fa6';
import { RiTerminalFill } from 'react-icons/ri';
import { useState } from 'react';

export default function MobileDock() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleLinkedinClick = () => {
    window.open('https://linkedin.com/in/felixxx', '_blank');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/pelikse', '_blank');
  };

  const handleSpotifyClick = () => {
    window.open('https://open.spotify.com', '_blank');
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className='absolute -top-12 left-1/2 -translate-x-1/2'>
      <div className='px-2 py-1 bg-[#1d1d1f]/80 backdrop-blur-sm text-white text-xs rounded-lg border border-gray-600 whitespace-nowrap'>
        {text}
      </div>
    </div>
  );

  return (
    <div className='fixed bottom-0 left-0 right-0 md:hidden z-50'>
      <div className='mx-4 mb-4 p-3 bg-gradient-to-t from-gray-700 to-gray-800 backdrop-blur-xl rounded-3xl flex justify-around items-center max-w-[400px] mx-auto'>
        
        {/* LinkedIn */}
        <button
          onClick={handleLinkedinClick}
          onMouseEnter={() => setHoveredIcon('linkedin')}
          onMouseLeave={() => setHoveredIcon(null)}
          className='relative'
        >
          <div className='w-16 h-16 bg-gradient-to-t from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg'>
            <FaLinkedinIn size={38} className='text-white' />
          </div>
          {hoveredIcon === 'linkedin' && <Tooltip text='LinkedIn' />}
        </button>

        {/* GitHub */}
        <button
          onClick={handleGithubClick}
          onMouseEnter={() => setHoveredIcon('github')}
          onMouseLeave={() => setHoveredIcon(null)}
          className='relative'
        >
          <div className='w-16 h-16 bg-gradient-to-t from-black to-black/60 rounded-2xl flex items-center justify-center shadow-lg'>
            <BsGithub size={38} className='text-white' />
          </div>
          {hoveredIcon === 'github' && <Tooltip text='GitHub' />}
        </button>

        {/* Spotify */}
        <button
          onClick={handleSpotifyClick}
          onMouseEnter={() => setHoveredIcon('spotify')}
          onMouseLeave={() => setHoveredIcon(null)}
          className='relative'
        >
          <div className='w-16 h-16 bg-gradient-to-t from-black to-black/60 rounded-2xl flex items-center justify-center shadow-lg'>
            <BsSpotify size={38} className='text-[#1ED760]' />
          </div>
          {hoveredIcon === 'spotify' && <Tooltip text='Spotify Playlist' />}
        </button>

        {/* Terminal */}
        <button
          onMouseEnter={() => setHoveredIcon('terminal')}
          onMouseLeave={() => setHoveredIcon(null)}
          className='relative'
        >
          <div className='w-16 h-16 rounded-2xl overflow-hidden shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-500 rounded-2xl'></div>
            <div className='absolute inset-[2px] rounded-2xl bg-black'>
              <div className='absolute top-1 left-2'>
                <RiTerminalFill size={18} className='text-white' />
              </div>
            </div>
          </div>
          {hoveredIcon === 'terminal' && <Tooltip text='Terminal' />}
        </button>
      </div>
    </div>
  );
}
