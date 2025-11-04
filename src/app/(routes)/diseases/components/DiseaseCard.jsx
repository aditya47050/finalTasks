import Link from "next/link";
import { ChevronRight, FileText } from 'lucide-react';
import { Image } from 'next/image';

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function DiseaseCard({ title, description, image }) {
  const slug = slugify(title);
  
  return (
    <Link href={`/disease/${slug}`} className="group block">
      <div className="bg-white border h-52 border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:border-blue-300">
        <div className="xs:p-3 md:p-6">
          <div className="flex xs:flex-col md:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              {!image ? (
                <Image
                  width={300}
                  height={300} 
                  src={image || "/placeholder.svg"} 
                  alt={title} 
                  className="xs:w-8 xs:h-8 md:w-16 md:h-16 object-cover rounded-xl border-2 border-gray-100" 
                />
              ) : (
                <div className="xs:w-8 xs:h-8 md:w-16 md:h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 xs:text-base md:text-lg mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="text-gray-600 xs:text-xs md:text-sm leading-relaxed line-clamp-3 mb-3">
                {description}
              </p>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                <span>Learn more</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
