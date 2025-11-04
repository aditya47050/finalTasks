'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import DiseaseSidebar from './../../components/DiseaseSidebar';
import { diseaseData } from './../../components/diseaseData';

export default function DieseaseDetailsClient() {
  const { slug } = useParams();

  // Search slug inside all alphabet groups
  let foundData = null;
  for (const letter in diseaseData) {
    if (diseaseData[letter][slug]) {
      foundData = diseaseData[letter][slug];
      break;
    }
  }


  useEffect(() => {
    const headers = document.querySelectorAll(".style__header___3s4Ew");

    headers.forEach(header => {
      header.addEventListener("click", function () {
        const content = this.nextElementSibling;
        if (content && content.classList.contains("style__section___KWiqo")) {
          content.style.display =
            content.style.display === "none" ? "block" : "none";
        }
      });
    });

    // Start hidden
    document.querySelectorAll(".style__section___KWiqo").forEach(section => {
      section.style.display = "none";
    });

    // Cleanup event listeners when component unmounts
    return () => {
      headers.forEach(header => {
        header.replaceWith(header.cloneNode(true)); // remove listeners
      });
    };
  }, []);

  if (!foundData) {
    return <div className="container mt-10 text-red-600">Disease not found.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:container md:px-4 lg:pb-6 gap-6">
      <main className="flex-1 bg-white px-4 md:p-4 rounded-xl shadow">
        
        <div
          className="prose max-w-none px-2 md:p-4 text-justify"
          dangerouslySetInnerHTML={{ __html: foundData.content }}
        />
      </main>
    </div>
  );
}
