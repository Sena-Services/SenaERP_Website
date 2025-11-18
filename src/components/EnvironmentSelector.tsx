"use client";

import { useState, useEffect, useRef } from "react";

export interface Environment {
  name: string;
  display_name?: string;
  environment_name?: string;
  description?: string;
  active_blueprints?: Array<{
    type?: string;
    blueprint_type?: string;
  }>;
  // Direct count fields from API
  interface_count?: number;
  data_count?: number;
  workflows_count?: number;
  agents_count?: number;
}

interface EnvironmentSelectorProps {
  currentEnvironment?: string;
  onEnvironmentSelect?: (environmentName: string) => void;
  initialEnvironments?: Environment[];
  readOnly?: boolean;
  previewMode?: boolean;
}

export default function EnvironmentSelector({
  currentEnvironment,
  onEnvironmentSelect = () => {},
  initialEnvironments,
  readOnly = false,
  previewMode = false,
}: EnvironmentSelectorProps) {
  // State - Environment List
  const [error, setError] = useState<string | null>(null);
  const [activeEnvironments, setActiveEnvironments] = useState<Environment[]>(
    initialEnvironments ?? [],
  );
  const [searchQuery, setSearchQuery] = useState("");

  // State - Create/Edit Dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [newEnvironment, setNewEnvironment] = useState({
    displayName: "",
    description: "",
  });

  // State - Tagline Animation
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const taglineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const taglines = [
    "Build anything through conversation",
    "You can just build things",
    "Communication becomes creation",
    "Talk to build, build to scale",
    "Your words, our workflows",
    "Describe it, deploy it",
  ];

  // Computed - Filtered Environments
  const filteredEnvironments = searchQuery.trim()
    ? activeEnvironments.filter((env) => {
        const query = searchQuery.trim().toLowerCase();
        const displayName = (
          env.display_name ||
          env.environment_name ||
          env.name ||
          ""
        ).toLowerCase();
        const description = (env.description || "").toLowerCase();
        return displayName.includes(query) || description.includes(query);
      })
    : activeEnvironments;

  // Load Environments
  const loadEnvironments = async () => {
    try {
      if (readOnly) {
        if (initialEnvironments) {
          setActiveEnvironments(initialEnvironments);
        }
        return;
      }

      setError(null);

      const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://localhost:8000";
      const response = await fetch(
        `${frappeUrl}/api/method/sentra_core.sentra_core.doctype.erp_environment.erp_environment.get_active_environments`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load environments");
      }

      const data = await response.json();
      const environments = data.message || data || [];
      setActiveEnvironments(Array.isArray(environments) ? environments : []);
    } catch (err: any) {
      console.error("[EnvironmentSelector] Error loading environments:", err);
      setError(err.message || "Failed to load environments");
    }
  };

  // Handle Create Environment
  const handleCreateEnvironment = async () => {
    if (readOnly) return;

    if (!newEnvironment.displayName.trim()) return;

    // Check for duplicate environment name
    const duplicate = activeEnvironments.find(
      (env) =>
        (env.display_name || env.environment_name || env.name).toLowerCase() ===
        newEnvironment.displayName.trim().toLowerCase()
    );

    if (duplicate) {
      setValidationError("An environment with this name already exists");
      return;
    }

    try {
      setIsCreating(true);
      setValidationError("");
      setError(null);

      const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://localhost:8000";
      const response = await fetch(
        `${frappeUrl}/api/method/sentra_core.sentra_core.doctype.erp_environment.erp_environment.create_environment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: newEnvironment.displayName,
            description: newEnvironment.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create environment");
      }

      const data = await response.json();

      if (data.message?.success || data.success) {
        const environmentName = data.message?.environment_name || data.environment_name;
        setShowCreateDialog(false);
        setValidationError("");
        onEnvironmentSelect(environmentName);
      } else {
        throw new Error(data.message?.message || "Failed to create environment");
      }
    } catch (err: any) {
      console.error("[EnvironmentSelector] Error creating environment:", err);
      setValidationError(err.message || "Failed to create environment");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Update Environment
  const handleUpdateEnvironment = async () => {
    if (readOnly) return;

    if (!newEnvironment.displayName.trim() || !editingEnvironment) return;

    // Check for duplicate environment name (excluding current environment)
    const duplicate = activeEnvironments.find(
      (env) =>
        env.name !== editingEnvironment.name &&
        (env.display_name || env.environment_name || env.name).toLowerCase() ===
          newEnvironment.displayName.trim().toLowerCase()
    );

    if (duplicate) {
      setValidationError("An environment with this name already exists");
      return;
    }

    try {
      setIsCreating(true);
      setValidationError("");
      setError(null);

      const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://localhost:8000";
      const response = await fetch(
        `${frappeUrl}/api/method/sentra_core.sentra_core.doctype.erp_environment.erp_environment.update_environment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            environment_name: editingEnvironment.name,
            display_name: newEnvironment.displayName,
            description: newEnvironment.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update environment");
      }

      const data = await response.json();

      if (data.message?.success || data.success) {
        setShowCreateDialog(false);
        setValidationError("");
        await loadEnvironments();
      } else {
        throw new Error(data.message?.message || "Failed to update environment");
      }
    } catch (err: any) {
      console.error("[EnvironmentSelector] Error updating environment:", err);
      setValidationError(err.message || "Failed to update environment");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle Delete Environment
  const handleDeleteEnvironment = async () => {
    if (readOnly) return;

    if (!editingEnvironment) return;

    try {
      setIsCreating(true);
      setValidationError("");
      setError(null);

      const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL || "http://localhost:8000";
      const response = await fetch(
        `${frappeUrl}/api/method/sentra_core.sentra_core.doctype.erp_environment.erp_environment.delete_environment`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            environment_name: editingEnvironment.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete environment");
      }

      const data = await response.json();

      if (data.message?.success || data.success) {
        setShowCreateDialog(false);
        setValidationError("");
        await loadEnvironments();
      } else {
        throw new Error(data.message?.message || "Failed to delete environment");
      }
    } catch (err: any) {
      console.error("[EnvironmentSelector] Error deleting environment:", err);
      setValidationError(err.message || "Failed to delete environment");
    } finally {
      setIsCreating(false);
    }
  };

  // Event Handlers
  const selectEnvironment = (environmentName: string) => {
    if (!readOnly && !previewMode) {
      onEnvironmentSelect(environmentName);
    } else if (previewMode) {
      // In preview mode, still allow selection but just update parent
      onEnvironmentSelect(environmentName);
    }
  };

  const createNewEnvironment = () => {
    if (readOnly) return;

    setIsEditMode(false);
    setEditingEnvironment(null);
    setNewEnvironment({
      displayName: "",
      description: "",
    });
    setValidationError("");
    setShowCreateDialog(true);
  };

  const openEditDialog = (env: Environment) => {
    if (readOnly) return;

    setIsEditMode(true);
    setEditingEnvironment(env);
    setNewEnvironment({
      displayName: env.display_name || env.environment_name || env.name,
      description: env.description || "",
    });
    setValidationError("");
    setShowCreateDialog(true);
  };

  const getComponentCount = (env: Environment, type: string): number => {
    // First try to get from direct count fields (new API structure)
    if (type === "UI" && env.interface_count !== undefined) return env.interface_count;
    if (type === "Logic" && env.workflows_count !== undefined) return env.workflows_count;
    if (type === "Database" && env.data_count !== undefined) return env.data_count;
    if (type === "Agents" && env.agents_count !== undefined) return env.agents_count;

    // Fallback to active_blueprints array (old structure)
    if (!env.active_blueprints || !Array.isArray(env.active_blueprints)) return 0;
    return env.active_blueprints.filter((bp) => {
      const blueprintType = bp.type || bp.blueprint_type || "";
      return blueprintType === type;
    }).length;
  };

  // Lifecycle - Load environments and start tagline rotation
  useEffect(() => {
    if (readOnly) {
      if (initialEnvironments) {
        setActiveEnvironments(initialEnvironments);
      }
    } else {
      loadEnvironments();
    }

    taglineIntervalRef.current = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3500);

    return () => {
      if (taglineIntervalRef.current) {
        clearInterval(taglineIntervalRef.current);
      }
    };
  }, [initialEnvironments, readOnly]);

  // Animated tagline characters
  const animatedTagline = taglines[currentTaglineIndex]
    .split("")
    .map((char, index) => ({
      char: char === " " ? "\u00A0" : char,
      delay: index * 30,
    }));

  return (
    <div className={`environment-selector ${previewMode ? 'preview-zoom' : ''}`}>
      {/* Create/Edit Environment Dialog */}
      {showCreateDialog && (
        <div className="dialog-overlay" onClick={() => setShowCreateDialog(false)}>
          <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="dialog-header">
              <h2 className="dialog-title">
                {isEditMode ? "Edit Environment" : "Create Environment"}
              </h2>
              <button onClick={() => setShowCreateDialog(false)} className="dialog-close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="dialog-body">
              <div className="dialog-form-group">
                <label className="dialog-label">
                  Name <span className="required-asterisk">*</span>
                </label>
                <input
                  value={newEnvironment.displayName}
                  onChange={(e) => {
                    setNewEnvironment({ ...newEnvironment, displayName: e.target.value });
                    setValidationError("");
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      if (isEditMode) {
                        handleUpdateEnvironment();
                      } else {
                        handleCreateEnvironment();
                      }
                    }
                  }}
                  type="text"
                  className="dialog-input"
                  placeholder="e.g., My Pet Shop ERP"
                  autoFocus
                />
              </div>

              <div className="dialog-form-group">
                <label className="dialog-label">Description</label>
                <textarea
                  value={newEnvironment.description}
                  onChange={(e) =>
                    setNewEnvironment({ ...newEnvironment, description: e.target.value })
                  }
                  className="dialog-textarea"
                  placeholder="What will this environment be used for?"
                  rows={Math.max(
                    8,
                    Math.min(Math.ceil((newEnvironment.description?.length || 0) / 50), 20)
                  )}
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="dialog-footer">
              <div className="dialog-footer-content">
                {/* Validation Error Area */}
                {validationError && (
                  <div className="validation-error-container">
                    <div className="validation-error-box">
                      <svg
                        className="validation-error-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="validation-error-text">{validationError}</p>
                    </div>
                  </div>
                )}

                {/* Buttons Row */}
                <div className="dialog-footer-buttons">
                  {/* Delete Button (only in edit mode) */}
                  {isEditMode && (
                    <button
                      onClick={handleDeleteEnvironment}
                      className="dialog-button-delete"
                      disabled={isCreating}
                    >
                      <svg
                        className="delete-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="delete-text">Delete</span>
                    </button>
                  )}

                  {/* Spacer */}
                  <div className="button-spacer"></div>

                  <button
                    onClick={() => setShowCreateDialog(false)}
                    className="dialog-button-cancel"
                    disabled={isCreating}
                  >
                    <span className="button-text">Cancel</span>
                  </button>
                  <button
                    onClick={isEditMode ? handleUpdateEnvironment : handleCreateEnvironment}
                    className="dialog-button-create"
                    disabled={!newEnvironment.displayName || isCreating}
                  >
                    {!isCreating ? (
                      <span className="button-text">{isEditMode ? "Save" : "Create"}</span>
                    ) : (
                      <span className="loading-container">
                        <svg className="loading-spinner" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="button-text">
                          {isEditMode ? "Saving..." : "Creating..."}
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="selector-content">
        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-2xl w-full">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error Loading Environments
                </h3>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadEnvironments}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!error && (
          <div
            className={`flex flex-col items-center h-full px-4 ${
              activeEnvironments.length > 0 ? "py-3" : "pt-6"
            }`}
          >
            <div
              className={`w-full max-w-3xl flex flex-col h-full`}
            >
              {/* Hero Section */}
              <div className={`text-center flex-shrink-0 ${previewMode ? 'mb-2 mt-3' : 'mb-4'}`}>
                <div className={`inline-flex items-center justify-center ${previewMode ? 'mb-0' : 'mb-1'}`}>
                  <img src="/waygent.png" alt="Sena ERP" className={previewMode ? 'w-10 h-10' : 'w-12 h-12'} />
                </div>
                <h1 className={`font-bold text-gray-800 ${previewMode ? 'text-3xl mb-0.5' : 'text-4xl mb-1.5'}`}>Sena ERP</h1>
                <div className="tagline-container">
                  <p className={`tagline ${previewMode ? 'text-sm' : 'text-sm'}`}>
                    <span className="tagline-text">
                      {animatedTagline.map((item, index) => (
                        <span
                          key={`${currentTaglineIndex}-${index}`}
                          className="tagline-char"
                          style={{ animationDelay: `${item.delay}ms` }}
                        >
                          {item.char}
                        </span>
                      ))}
                    </span>
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              {activeEnvironments.length >= 4 && (
                <div className={`flex-shrink-0 flex justify-center w-full ${previewMode ? 'mb-2' : 'mb-4'}`}>
                  <div className={`relative ${previewMode ? 'w-3/4' : 'w-3/4'}`}>
                    <svg
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none ${previewMode ? 'w-5 h-5' : 'w-5 h-5'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                      placeholder="Search environments..."
                      className="search-input"
                    />
                  </div>
                </div>
              )}

              {/* Environment Cards */}
              {activeEnvironments.length > 0 && (
                <div
                  className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex items-center py-2`}
                  style={{ pointerEvents: 'auto', minHeight: 0 }}
                >
                  <div
                    className={`grid gap-2 md:grid-cols-2 w-full ${
                      activeEnvironments.length === 1 ? "single-env-grid" : ""
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {filteredEnvironments.map((env) => (
                      <div
                        key={env.name}
                        data-environment-card={env.name}
                        onClick={() => {
                          selectEnvironment(env.name);
                        }}
                        className={`group cursor-pointer environment-card ${
                          env.name === currentEnvironment ? "environment-card-selected" : ""
                        } ${
                          activeEnvironments.length === 1 ? "single-environment-card" : ""
                        }`}
                        style={{ pointerEvents: 'auto' }}
                      >
                        {/* Edit Icon */}
                        {!readOnly && !previewMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(env);
                            }}
                            className="edit-icon-button"
                            title="Edit environment"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}

                        {/* Card Content */}
                        <div
                          className={previewMode ? "environment-card-clickable cursor-pointer" : "environment-card-clickable"}
                        >
                          <div className="flex items-start gap-2 environment-card-inner">
                            <div className="flex-shrink-0 flex items-center justify-center">
                              <svg
                                className={`w-4 h-4 transition-colors duration-200 ${
                                  env.name === currentEnvironment
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h3
                                  className={`font-medium text-xs transition-colors duration-200 ${
                                    env.name === currentEnvironment
                                      ? "text-blue-900"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {env.display_name || env.environment_name || env.name}
                                </h3>
                              </div>
                              <p className="env-description">
                                {env.description || "ERP Environment"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* No Search Results */}
                    {searchQuery && filteredEnvironments.length === 0 && (
                      <div className="col-span-2 text-center py-8">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-gray-500">
                          No environments found matching &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Create New Environment Card */}
              {!previewMode && (
                <div
                  className={
                    activeEnvironments.length > 0
                      ? "flex justify-center mb-6 flex-shrink-0"
                      : "flex justify-center flex-shrink-0"
                  }
                >
                  <div className="w-1/2">
                    <div
                      onClick={createNewEnvironment}
                      className={
                        "group environment-card create-new-card" +
                        (readOnly
                          ? " cursor-default pointer-events-none opacity-80"
                          : " cursor-pointer")
                      }
                    >
                      <div className="flex items-center gap-3 environment-card-inner">
                        <div className="flex-shrink-0 flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 text-sm mb-0.5 leading-tight">
                            Create New Environment
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug">
                            Start fresh with a new ERP environment
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .environment-selector {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          background-color: transparent;
          overflow-y: auto;
          pointer-events: auto;
        }

        .environment-selector.preview-zoom {
          overflow: visible;
          transform: scale(0.85) translate(-8.8%, -11%);
          transform-origin: center;
          width: 118%;
          height: 118%;
          pointer-events: auto;
        }

        .environment-selector.preview-zoom .selector-content {
          overflow: visible;
          pointer-events: auto;
        }

        .selector-content {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        /* Tagline Animation */
        .tagline-container {
          opacity: 0.85;
          min-height: 28px;
        }

        .tagline {
          font-size: 1rem;
          color: #64748b;
          margin: 0;
          font-weight: 400;
          line-height: 1.6;
        }

        .tagline-text {
          display: inline-block;
        }

        .tagline-char {
          display: inline-block;
          animation: fadeInChar 0.5s ease-out both;
        }

        @keyframes fadeInChar {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Search Input */
        .search-input {
          display: block;
          width: 100%;
          padding: 0.375rem 1rem 0.375rem 3rem;
          background-color: #f8f7f4 !important;
          border: 1.25px solid rgba(15, 23, 42, 0.18) !important;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #1e293b !important;
          font-family: inherit;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 2px 8px -4px rgba(15, 23, 42, 0.15);
          outline: none;
        }

        .preview-zoom .search-input {
          padding: 0.625rem 1.25rem 0.625rem 3.25rem;
          font-size: 1rem;
          border-radius: 1rem;
          border: 1.5px solid rgba(15, 23, 42, 0.2) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 4px 12px -4px rgba(15, 23, 42, 0.2);
        }

        .search-input:focus {
          border-color: rgba(59, 130, 246, 0.4) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
        }

        .preview-zoom .search-input:focus {
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }

        /* Environment card styling */
        .environment-card {
          background: #f8f7f4;
          border: 1px solid rgba(15, 23, 42, 0.18);
          border-radius: 0.5rem;
          padding: 8px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 6px 12px -12px rgba(15, 23, 42, 0.25);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        /* Bigger cards only in preview mode */
        .preview-zoom .environment-card {
          padding: 8px;
          min-height: 64px;
          cursor: pointer;
          position: relative;
        }

        .preview-zoom .environment-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-zoom .environment-card:hover::after {
          opacity: 1;
        }

        /* Bigger content in preview mode cards */
        .preview-zoom .environment-card h3 {
          font-size: 0.75rem;
          line-height: 1.3;
          font-weight: 600;
        }

        .preview-zoom .env-description {
          font-size: 0.625rem;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        .preview-zoom .environment-card svg {
          width: 1rem;
          height: 1rem;
        }

        .preview-zoom .component-badge {
          height: 16px;
          padding: 0 4px;
          gap: 2px;
        }

        .preview-zoom .component-badge svg {
          width: 10px;
          height: 10px;
        }

        .preview-zoom .component-badge span {
          font-size: 9px;
          font-weight: 600;
        }

        /* Edit Icon Button */
        .edit-icon-button {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .edit-icon-button svg {
          color: #64748b;
          transition: all 0.2s;
        }

        .edit-icon-button:hover svg {
          color: #3b82f6;
          transform: scale(1.1);
        }

        .environment-card:hover .edit-icon-button {
          display: flex;
        }

        .environment-card-clickable {
          cursor: pointer;
        }

        .single-env-grid {
          display: flex;
          justify-content: center;
        }

        .single-environment-card {
          width: 100%;
          max-width: 600px;
          padding: 1.25rem;
        }

        .environment-card-selected {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(96, 165, 250, 0.05));
          border: 1.5px solid rgba(59, 130, 246, 0.4);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(59, 130, 246, 0.1),
            0 8px 24px -8px rgba(59, 130, 246, 0.3), 0 0 20px -8px rgba(59, 130, 246, 0.15);
        }

        .environment-card-selected .environment-card-clickable:not(.cursor-pointer) {
          cursor: default;
          pointer-events: none;
        }

        .preview-zoom .environment-card-selected .environment-card-clickable {
          cursor: pointer !important;
          pointer-events: auto !important;
        }

        .preview-zoom .environment-card-clickable {
          cursor: pointer !important;
          pointer-events: auto !important;
        }

        .preview-zoom .environment-card {
          pointer-events: auto !important;
        }

        .selected-badge {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-radius: 0.375rem;
          box-shadow: 0 2px 8px -2px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .selected-badge svg {
          width: 12px;
          height: 12px;
          display: block;
        }

        .selected-badge span {
          display: inline-flex;
          align-items: center;
          line-height: 1;
        }

        .environment-card-inner {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .env-description {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.625rem;
          line-height: 1.2;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .environment-card:not(.environment-card-selected):hover {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(245, 158, 11, 0.04));
          border-color: rgba(15, 23, 42, 0.24);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 18px -14px rgba(245, 158, 11, 0.35);
          transform: translateY(-2px);
        }

        .preview-zoom .environment-card:not(.environment-card-selected):hover {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.04));
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 12px 24px -14px rgba(59, 130, 246, 0.4);
          transform: translateY(-3px) scale(1.01);
        }

        .environment-card:not(.environment-card-selected):active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.08));
          border-color: rgba(15, 23, 42, 0.28);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 8px 16px -14px rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .environment-card:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.6);
          outline-offset: 2px;
        }

        .create-new-card {
          border-style: dashed;
          border-color: rgba(59, 130, 246, 0.3);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(59, 130, 246, 0.01));
        }

        .create-new-card:hover {
          border-style: dashed;
          border-color: rgba(59, 130, 246, 0.5);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.04));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 18px -14px rgba(59, 130, 246, 0.35);
        }

        .create-new-card:active {
          border-style: dashed;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(59, 130, 246, 0.08));
        }

        .create-new-card .environment-card-inner {
          align-items: center;
        }

        .component-counts {
          display: flex;
          align-items: center;
          gap: 3px;
          flex-wrap: wrap;
        }

        .component-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          padding: 0 4px;
          background: rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 3px;
          transition: all 0.2s ease;
          height: 14px;
          box-sizing: border-box;
          line-height: 1;
        }

        .component-badge:hover {
          background: rgba(148, 163, 184, 0.12);
          border-color: rgba(148, 163, 184, 0.3);
        }

        .component-badge svg {
          width: 10px;
          height: 10px;
          flex-shrink: 0;
          color: #64748b;
          stroke-width: 2;
          display: block;
        }

        .component-badge span {
          font-size: 9px;
          font-weight: 600;
          color: #475569;
          text-align: center;
        }

        /* Custom Scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }

        .preview-zoom .custom-scrollbar {
          overflow: visible;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.25);
          background-clip: content-box;
        }

        /* Dialog Styles */
        .dialog-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.15s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .dialog-container {
          background: #faf9f5;
          border: none;
          border-radius: 16px;
          width: 90%;
          max-width: 460px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #eef2ff;
          border-bottom: none;
          border-radius: 16px 16px 0 0;
        }

        .dialog-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .dialog-close {
          padding: 4px;
          border: none;
          background: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.15s;
        }

        .dialog-close:hover {
          background: rgba(59, 130, 246, 0.08);
          color: #3b82f6;
        }

        .dialog-body {
          padding: 20px;
          padding-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #faf9f5;
        }

        .dialog-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dialog-label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          letter-spacing: 0.01em;
        }

        .required-asterisk {
          color: #3b82f6;
          font-weight: 600;
        }

        .dialog-input,
        .dialog-textarea {
          width: 100%;
          padding: 9px 12px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 8px;
          font-size: 13px;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .dialog-input::placeholder,
        .dialog-textarea::placeholder {
          color: #94a3b8;
        }

        .dialog-input:focus,
        .dialog-textarea:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .dialog-textarea {
          resize: vertical;
          min-height: 60px;
          max-height: 400px;
          line-height: 1.5;
          overflow-y: auto;
        }

        .dialog-footer {
          padding: 12px 20px 12px 20px;
          border-top: none;
          background: #faf9f5;
        }

        .dialog-footer-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .validation-error-container {
          width: 100%;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .validation-error-box {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 10px 12px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
          animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        .validation-error-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          color: #ef4444;
          margin-top: 1px;
        }

        .validation-error-text {
          font-size: 12px;
          color: #dc2626;
          margin: 0;
          font-weight: 500;
          line-height: 1.4;
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          flex: 1;
          min-width: 0;
        }

        .dialog-footer-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
        }

        .button-spacer {
          flex: 1;
        }

        .dialog-button-cancel {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 14px;
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 7px;
          transition: all 0.15s;
          font-family: inherit;
          line-height: 1;
        }

        .dialog-button-cancel:hover:not(:disabled) {
          background: rgba(0, 0, 0, 0.04);
          color: #475569;
        }

        .dialog-button-cancel:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .dialog-button-create {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 18px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 7px;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: inherit;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .button-text {
          display: inline-block;
          line-height: 1;
          transform: translateY(0.5px);
        }

        .loading-container {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          line-height: 1;
        }

        .loading-spinner {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .dialog-button-create:hover:not(:disabled) {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-1px) scale(1.02);
        }

        .dialog-button-create:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .dialog-button-create:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .dialog-button-delete {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 8px 16px;
          background: none;
          border: 1px solid #ef4444;
          color: #ef4444;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 7px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: inherit;
          line-height: 1;
          white-space: nowrap;
        }

        .delete-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          stroke-width: 2;
        }

        .delete-text {
          display: inline-block;
          line-height: 1;
          transform: translateY(1.4px);
        }

        .dialog-button-delete:hover:not(:disabled) {
          background: #ef4444;
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          transform: translateY(-1px);
        }

        .dialog-button-delete:hover:not(:disabled) .delete-icon {
          stroke: white;
        }

        .dialog-button-delete:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
        }

        .dialog-button-delete:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
