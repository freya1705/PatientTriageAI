import React, { useState } from "react";
import { TriageProvider, useTriage } from "./context/TriageContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { NurseWorklist } from "./pages/NurseWorklist";
import { SearchAllWaitingPage } from "./pages/SearchAllWaitingPage";
import { CommandCenterPage } from "./pages/CommandCenterPage";
import { AuditPage } from "./pages/AuditPage";
import { PatientDetailPage } from "./pages/PatientDetailPage";
import { ReplaySimulationPage } from "./pages/ReplaySimulationPage";
import { IntakePage } from "./pages/IntakePage";
import { AboutScoringPage } from "./pages/AboutScoringPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { PrivacyPage } from "./pages/PrivacyPage";

// Global Modals & Drawers
import { OverrideModal } from "./components/OverrideModal";
import { PatientDrawer } from "./components/PatientDrawer";
import { VitalTrendModal } from "./components/VitalTrendModal";
import { ReassessmentModal } from "./components/ReassessmentModal";
import { SafetyOutcomeModal } from "./components/SafetyOutcomeModal";
import { PatientTransparencyCompanion } from "./components/PatientTransparencyCompanion";

const AppContent = () => {
  const {
    activeTab,
    toastMessage,
    portalPatientId,
    setPortalPatientId,
  } = useTriage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex font-sans overflow-x-hidden">
      {/* 1. Left Minimal Navigation Rail */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Workspace Top Header */}
        <Header />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center space-x-2 ${
                toastMessage.type === "error"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : toastMessage.type === "warning"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Primary Page Router */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          {(activeTab === "worklist" ||
            activeTab === "dashboard" ||
            activeTab === "control-tower") && <NurseWorklist />}
          {activeTab === "my-patients" && (
            <NurseWorklist initialFilter="MY_PATIENTS" />
          )}
          {activeTab === "all-waiting" && <SearchAllWaitingPage />}
          {activeTab === "command-center" && <CommandCenterPage />}
          {activeTab === "audit" && <AuditPage />}
          {activeTab === "patient-detail" && <PatientDetailPage />}
          {activeTab === "replay-simulation" && <ReplaySimulationPage />}
          {activeTab === "intake" && <IntakePage />}
          {activeTab === "evaluation" && <EvaluationPage />}
          {activeTab === "about-scoring" && <AboutScoringPage />}
          {activeTab === "privacy" && <PrivacyPage />}
        </main>

        {/* Minimalist Clinical Footer */}
        <footer className="border-t border-slate-200 bg-white py-3 px-6 text-center text-xs text-slate-400">
          <p>
            PatientTriage.ai &bull; Emergency Waiting Room Safety Copilot &bull; Continuous Risk Surveillance
          </p>
        </footer>
      </div>

      {/* Global Clinical Governance Modals & Drawers */}
      <OverrideModal />
      <PatientDrawer />
      <VitalTrendModal />
      <ReassessmentModal />
      <SafetyOutcomeModal />

      {portalPatientId && (
        <PatientTransparencyCompanion
          patientId={portalPatientId}
          onClose={() => setPortalPatientId(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <TriageProvider>
      <AppContent />
    </TriageProvider>
  );
}
