"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getApiUrl, API_CONFIG } from "@/lib/config";

type JobOpening = {
  name: string;
  title: string;
  department: string;
  positions_open: number;
  experience_required: string;
  job_description: string;
  posted_date: string;
};

type CareersSectionProps = {
  onBackClick?: () => void;
};

export default function CareersSection({ onBackClick }: CareersSectionProps) {
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_ACTIVE_OPENINGS), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.message?.success && result.message?.data) {
          setOpenings(result.message.data);
          // Select the first job by default
          if (result.message.data.length > 0) {
            setSelectedJob(result.message.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching job openings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenings();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-waygent-orange border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-space-grotesk text-sm">Loading openings...</p>
        </div>
      </section>
    );
  }

  if (openings.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center">
            <Image
              src="/noopening.png"
              alt="No open positions"
              width={600}
              height={400}
              quality={85}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <div className="flex items-center justify-center relative">
            {onBackClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Back button clicked');
                  onBackClick();
                }}
                className="absolute left-0 inline-flex items-center gap-2 text-waygent-blue hover:text-waygent-blue-hover font-space-grotesk transition px-4 py-2 rounded-lg hover:bg-waygent-blue/5 cursor-pointer z-10"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Go back
              </button>
            )}
            <h2
              className="text-2xl md:text-3xl text-center"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
              }}
            >
              Join Our Team
            </h2>
          </div>
        </div>

        {/* Main Content: Vertical Tabs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Left: Vertical Tabs */}
          <div className="md:sticky md:top-4 md:self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200" style={{ background: 'linear-gradient(135deg, #8FB7C5 0%, #7AA5B5 100%)' }}>
                <h2 className="text-sm font-bold text-white font-futura uppercase tracking-wide">
                  Open Positions ({openings.length})
                </h2>
              </div>
              <nav className="p-2">
                {openings.map((job) => {
                  const isSelected = selectedJob?.name === job.name;
                  return (
                    <button
                      key={job.name}
                      onClick={() => setSelectedJob(job)}
                      className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ease-out font-space-grotesk mb-1 border cursor-pointer"
                      style={{
                        background: isSelected ? 'linear-gradient(135deg, #8FB7C5 0%, #7AA5B5 100%)' : 'transparent',
                        border: isSelected ? '1px solid #7AA5B5' : '1px solid transparent',
                        boxShadow: isSelected ? '0 2px 8px rgba(143, 183, 197, 0.4)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(143, 183, 197, 0.12)';
                          e.currentTarget.style.border = '1px solid rgba(143, 183, 197, 0.25)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(143, 183, 197, 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.border = '1px solid transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div className="text-sm font-semibold" style={{ color: isSelected ? '#FFFFFF' : '#374151' }}>
                        {job.title}
                      </div>
                      <div className="text-xs mt-1" style={{ color: isSelected ? 'rgba(255, 255, 255, 0.9)' : '#6B7280' }}>
                        {job.department} • {job.positions_open} {job.positions_open === 1 ? 'position' : 'positions'}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right: Job Details */}
          {selectedJob && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Job Header */}
              <div className="mb-6 p-6" style={{ background: 'linear-gradient(135deg, #8FB7C5 0%, #7AA5B5 100%)' }}>
                <h2 className="text-3xl font-bold text-white font-futura mb-4">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-white/90 font-space-grotesk">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedJob.department}</span>
                  </div>
                  {selectedJob.experience_required && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{selectedJob.experience_required}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{selectedJob.positions_open} {selectedJob.positions_open === 1 ? 'position' : 'positions'} open</span>
                  </div>
                </div>
              </div>
              <div className="p-8">

                {/* Job Description */}
                <div className="mb-8">
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedJob.job_description }}
                  />
                </div>

                {/* Apply Button */}
                <div className="pt-6 border-t border-gray-200">
                <a
                  href={`mailto:it@sena.services?subject=Application for ${encodeURIComponent(selectedJob.title)} Position`}
                  className="inline-block w-full md:w-auto px-8 py-3 bg-waygent-orange border-2 border-waygent-orange text-black font-bold rounded-lg hover:bg-waygent-orange/90 transition-all font-space-grotesk shadow-md hover:shadow-lg cursor-pointer text-center"
                >
                  Apply for this position
                </a>
                  <p className="text-xs text-gray-500 font-space-grotesk mt-3">
                    By applying, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
