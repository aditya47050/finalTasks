'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AlphabetNav = ({ activeChar }) => {
  const pathname = usePathname();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-wrap justify-center gap-2 mb-8">
        {alphabet.map((char) => (
          <Link key={char} href={`/diseases/${char.toLowerCase()}`}>
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all duration-200 font-semibold ${
                activeChar?.toUpperCase() === char
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md'
              }`}
            >
              {char}
            </div>
          </Link>
        ))}
      </div>

      {/* Tablet Navigation */}
      <div className="hidden md:flex lg:hidden flex-wrap justify-center gap-1.5 mb-6">
        {alphabet.map((char) => (
          <Link key={char} href={`/diseases/${char.toLowerCase()}`}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 font-medium text-sm ${
                activeChar?.toUpperCase() === char
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
              }`}
            >
              {char}
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Navigation - Scrollable */}
      <div className="md:hidden mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {alphabet.map((char) => (
            <Link key={char} href={`/diseases/${char.toLowerCase()}`}>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 font-medium text-sm flex-shrink-0 ${
                  activeChar?.toUpperCase() === char
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                }`}
              >
                {char}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlphabetNav;
