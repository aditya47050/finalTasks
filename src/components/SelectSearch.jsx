'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // No need for useParams, usePathname, or useSearchParams here
import { ArrowDown, SearchIcon } from 'lucide-react';
import { Input } from './ui/input';

const SelectSearch = ({ search, placeholder = {placeholder}}) => {
    const router = useRouter();
    const initialRender = useRef(true);
    const [text, setText] = useState(search);
    // const handleSearch = () => {
    //     const url = new URL(window.location.href);

    //     if (!text) {
    //         url.searchParams.delete('query');
    //     } else {
    //         url.searchParams.set('query', text);
    //     }

    //     router.push(`${url}`);
    // };
    // useEffect(() => {
    //     const url = new URL(window.location.href);
    //     if (initialRender.current) {
    //         initialRender.current = false;
    //         return;
    //     }

    //     if (!text) {
    //         url.searchParams.delete('query');
    //         router.push(`${url}`);
    //     } else {
    //         url.searchParams.set('query', text);
    //         router.push(`${url}`);
    //     }
    // }, [text]);

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
                    className="rounded-full px-4 py-2 p-6 md:w-[30rem] bg-blue-200 placeholder-blue-950 placeholder:font-semibold pl-16"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 mt-1" 
                >
                    <span className=" p-2 font-bold px-4 rounded-full">  <ArrowDown className="h-8 w-8 bg-blue-950 p-1 rounded-full text-white" /></span>
                </button>
            </div>
        </div>
    );
};

export default SelectSearch;
