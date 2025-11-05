"use client";

import { useState, useEffect } from "react";
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

export default function CareersSection() {
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-600 font-space-grotesk">
            Loading job openings...
          </div>
        </div>
      </section>
    );
  }

  if (openings.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center">
            <img
              src="/noopening.png"
              alt="No open positions"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-futura mb-3">
            Join Our Team
          </h1>
          <p className="text-lg text-gray-600 font-space-grotesk">
            Help us build the future of business software
          </p>
        </div>

        {/* Main Content: Vertical Tabs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Left: Vertical Tabs */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-700 font-futura uppercase tracking-wide">
                  Open Positions ({openings.length})
                </h2>
              </div>
              <nav className="p-2">
                {openings.map((job) => (
                  <button
                    key={job.name}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-space-grotesk mb-1 ${
                      selectedJob?.name === job.name
                        ? 'bg-waygent-orange text-black font-semibold shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-sm font-semibold">{job.title}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {job.department} • {job.positions_open} {job.positions_open === 1 ? 'position' : 'positions'}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right: Job Details */}
          {selectedJob && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              {/* Job Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 font-futura mb-3">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-space-grotesk">
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
          )}
        </div>
      </div>
    </section>
  );
}
