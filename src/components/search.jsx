'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';

const Search = ({ search = '', placeholder = "Search Healthcare Services" }) => {
    const router = useRouter();
    const [text, setText] = useState(search);

    const handleSearch = () => {
        const url = new URL(window.location.href);

        if (!text) {
            url.searchParams.delete('query');
        } else {
            url.searchParams.set('query', text);
        }

        router.push(`${url}`);
    };

    return (
        <div className="mb-5 mt-4 container mx-auto p-2 hidden md:hidden lg:block">
            <div className="relative pt-2">
                <span className="absolute inset-y-0 left-0 flex items-center mt-2 pl-3">
                    <SearchIcon className="h-2 w-2 bg-blue-950 rounded-full text-blue-200 p-2 md:h-8 md:w-8" />
                </span>

                <Input
                    onChange={e => setText(e.target.value)}
                    value={text}
                    placeholder={placeholder}  // Use the passed placeholder prop here
                    className="rounded-full px-4 py-2 p-6 bg-[#B1C9EB] placeholder-blue-950 placeholder:font-semibold pl-16"
                />
                <button
                    type="button"
                    onClick={handleSearch}  // Trigger search on button click
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 mt-1"
                >
                    <span className="bg-white p-2 font-bold text-blue-600 px-4 rounded-full">Search</span>
                </button>
            </div>
        </div>
    );
};

export default Search;
