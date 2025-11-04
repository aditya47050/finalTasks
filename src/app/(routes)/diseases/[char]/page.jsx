'use client';

import { useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import AlphabetNav from '../components/AlphabetNav';
import DiseaseCard from '../components/DiseaseCard';
import { diseaseData } from '../components/diseaseIndexData';
import Link from 'next/link';
import { sections } from '../../disease/components/DiseaseSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileFilters from '../components/mobile-filters';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, Search } from 'lucide-react';


export default function DiseaseIndexPage() {
  const router = useRouter();
  const params = useParams();
  const char = params?.char?.toLowerCase() || 'a';
  const filteredDiseases = diseaseData[char] || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAlphaIndex, setShowAlphaIndex] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const searchFilteredDiseases = filteredDiseases.filter(disease =>
    disease.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCharClick = (c) => {
    router.push(`/diseases/${c}`);
    setShowAlphaIndex(false);
  };

  const handleDiseaseClick = (slug) => {
    router.push(`/disease/${slug}`);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Current Letter Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200">
            <span className="text-gray-600 font-medium">Showing diseases starting with</span>
            <span className="text-3xl font-bold text-blue-600 uppercase bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
              {char}
            </span>
          </div>
        </div>

        {/* Alphabet Navigation */}
        <AlphabetNav activeChar={char} />

        {/* Search Bar */}

        {/* Mobile Filters */}
        {/* <MobileFilters 
          filteredDiseases={filteredDiseases}
          sections={sections}
          char={char}
        /> */}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 font-medium">
            {searchFilteredDiseases.length} result{searchFilteredDiseases.length !== 1 ? 's' : ''} found
          </p>
          
        </div>

        {/* Disease Cards Grid */}
        {searchFilteredDiseases.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {searchFilteredDiseases.map((disease, index) => (
              <DiseaseCard key={index} {...disease} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No diseases found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm 
                ? `No diseases matching "${searchTerm}" found for letter "${char.toUpperCase()}".`
                : `No diseases starting with "${char.toUpperCase()}" are currently available.`
              }
            </p>
          </div>
        )}
      </div>


    </>
  );
}
