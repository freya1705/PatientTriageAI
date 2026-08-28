import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

const TriageContext = createContext(null);

export const TriageProvider = ({ children }) => {
  // Navigation & View Roles
  const [activeTab, setActiveTab] = useState('worklist'); // 'worklist', 'my-patients', 'all-waiting', 'command-center', 'replay-simulation', 'patient-detail', 'audit', 'privacy', 'about-scoring'
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surgeActive, setSurgeActive] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Nurse Identity & Staff Handling State
  const [activeNurseName, setActiveNurseName] = useState('RN Sarah Chen');
  const [assignedPatientIds, setAssignedPatientIds] = useState(new Set(['P-017', 'P-001', 'P-008', 'P-014']));
  const [handlingMap, setHandlingMap] = useState({}); // { [patientId]: { nurseName: string, time: string } }

  // Active Modals & Overlays
  const [reassessmentTargetPatient, setReassessmentTargetPatient] = useState(null);
  const [whyModalPatient, setWhyModalPatient] = useState(null);
  const [whyComparisonPair, setWhyComparisonPair] = useState(null); // [p1Id, p2Id]
  const [whatIfPatient, setWhatIfPatient] = useState(null);
  const [safetyOutcomeData, setSafetyOutcomeData] = useState(null);
  const [portalPatientId, setPortalPatientId] = useState(null);
  const [overrideModalPatient, setOverrideModalPatient] = useState(null);
  const [trendModalPatient, setTrendModalPatient] = useState(null);

  // Pre-Orders Hub & Live Safety Feed
  const [preordersList, setPreordersList] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);

  // ED Replay Simulation State
  const [replayTimeline, setReplayTimeline] = useState([]);
  const [replayStepIndex, setReplayStepIndex] = useState(0);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(3000); // ms per tick
  const replayTimerRef = useRef(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchQueue = useCallback(async () => {
    try {
      const data = await api.getLiveQueue();
      setQueueData(data);
      setSurgeActive(data.surge_active);
    } catch (err) {
      console.error('Failed to fetch live queue:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPreorders = useCallback(async () => {
    try {
      const res = await api.listPreorders();
      setPreordersList(res.preorders || []);
    } catch (err) {
      console.error('Failed to fetch preorders:', err);
    }
  }, []);

  const fetchLiveFeed = useCallback(async () => {
    try {
      const res = await api.getLiveSafetyFeed();
      setLiveEvents(res.events || []);
    } catch (err) {
      console.error('Failed to fetch live feed:', err);
    }
  }, []);

  const fetchTimeline = useCallback(async () => {
    try {
      const res = await api.getSimulationTimeline();
      setReplayTimeline(res.steps || []);
    } catch (err) {
      console.error('Failed to fetch simulation timeline:', err);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    fetchPreorders();
    fetchLiveFeed();
    fetchTimeline();

    let interval = null;
    if (autoRefresh && !replayPlaying) {
      interval = setInterval(() => {
        fetchQueue();
        fetchLiveFeed();
        fetchPreorders();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchQueue, fetchPreorders, fetchLiveFeed, fetchTimeline, autoRefresh, replayPlaying]);

  // "I'm On It" Handling Workflow
  const handleImOnIt = (patientId) => {
    setHandlingMap((prev) => {
      const isAlreadyHandling = prev[patientId]?.nurseName === activeNurseName;
      if (isAlreadyHandling) {
        const next = { ...prev };
        delete next[patientId];
        showToast(`Released handling on ${patientId}`, 'info');
        return next;
      }
      showToast(`🟡 Marked ${patientId} as being handled by ${activeNurseName}`, 'info');
      return {
        ...prev,
        [patientId]: { nurseName: activeNurseName, time: 'Just Now' }
      };
    });
  };

  // Replay Mode Step Execution
  const applyStep = async (stepIdx) => {
    try {
      await api.applySimulationStep(stepIdx);
      setReplayStepIndex(stepIdx);
      await fetchQueue();
      await fetchLiveFeed();
      await fetchPreorders();
    } catch (err) {
      console.error('Failed to apply simulation step:', err);
    }
  };

  const playReplay = () => {
    setReplayPlaying(true);
    setAutoRefresh(false);
  };

  const pauseReplay = () => {
    setReplayPlaying(false);
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
  };

  const stepForwardReplay = async () => {
    const nextIdx = (replayStepIndex + 1) % (replayTimeline.length || 7);
    await applyStep(nextIdx);
  };

  const resetReplay = async () => {
    pauseReplay();
    await handleResetData();
    setReplayStepIndex(0);
    showToast('Simulation reset to 10:00 AM baseline.', 'info');
  };

  useEffect(() => {
    if (replayPlaying && replayTimeline.length > 0) {
      replayTimerRef.current = setTimeout(async () => {
        if (replayStepIndex < replayTimeline.length - 1) {
          await applyStep(replayStepIndex + 1);
        } else {
          setReplayPlaying(false);
          showToast('🎬 Replay completed: Patient P-017 stabilized in closed-loop resolution.', 'success');
        }
      }, replaySpeed);
    }
    return () => {
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    };
  }, [replayPlaying, replayStepIndex, replayTimeline, replaySpeed]);

  // Closed-Loop Clinical Action Handlers
  const handleClosedLoopReassess = async (patientId, newSpo2 = null, newHr = null, newSbp = null) => {
    try {
      setLoading(true);
      const res = await api.reassessAction({
        patient_id: patientId,
        new_spo2: newSpo2,
        new_hr: newHr,
        new_sbp: newSbp,
        nurse_name: activeNurseName,
        notes: 'Bedside reassessment completed. Supplemental oxygen and surveillance refreshed.'
      });
      // Clear handling status
      setHandlingMap((prev) => {
        const next = { ...prev };
        delete next[patientId];
        return next;
      });
      await fetchQueue();
      await fetchLiveFeed();
      setReassessmentTargetPatient(null);
      setSafetyOutcomeData(res.safety_outcome);
      showToast(`✓ Reassessment complete for ${patientId}. Risk recalculated.`, 'success');
    } catch (err) {
      showToast('Reassessment failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openReassessmentModal = (patient) => {
    setReassessmentTargetPatient(patient);
  };

  const closeReassessmentModal = () => {
    setReassessmentTargetPatient(null);
  };

  const handleApprovePreorder = async (orderId) => {
    try {
      await api.approvePreorder(orderId, { action: 'APPROVE', clinician_name: activeNurseName });
      await fetchPreorders();
      await fetchLiveFeed();
      showToast(`🧪 Pre-Order ${orderId} approved and auto-routed to tech!`, 'success');
    } catch (err) {
      showToast('Failed to approve pre-order', 'error');
    }
  };

  const handleDismissPreorder = async (orderId, reason) => {
    try {
      await api.dismissPreorder(orderId, { action: 'DISMISS', dismiss_reason: reason || 'Order not clinically indicated' });
      await fetchPreorders();
      await fetchLiveFeed();
      showToast(`Pre-order ${orderId} dismissed.`, 'info');
    } catch (err) {
      showToast('Dismissal failed', 'error');
    }
  };

  const handleToggleSurge = async () => {
    const nextState = !surgeActive;
    try {
      setLoading(true);
      await api.toggleSurge(nextState);
      setSurgeActive(nextState);
      await fetchQueue();
      await fetchPreorders();
      showToast(
        nextState
          ? '🚨 3X Surge Activated: 60 Patients in ED. Action queue compressed to Top Interventions.'
          : 'Standard ED volume restored (20 baseline benchmark patients).',
        nextState ? 'warning' : 'success'
      );
    } catch (err) {
      showToast('Error toggling surge mode', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    try {
      setLoading(true);
      await api.resetBenchmark();
      setHandlingMap({});
      await fetchQueue();
      await fetchPreorders();
      await fetchLiveFeed();
      showToast('System reset to original 20 benchmark clinical patients.', 'success');
    } catch (err) {
      showToast('Failed to reset dataset', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateDeterioration = async (patientId) => {
    try {
      await api.simulateDeterioration(patientId);
      await fetchQueue();
      await fetchLiveFeed();
      await fetchPreorders();
      showToast(`📉 SpO₂ drop & HR spike simulated on ${patientId}. Patient escalated in Action Queue!`, 'warning');
    } catch (err) {
      showToast('Simulation failed', 'error');
    }
  };

  const handleToggleAttending = async (patientId) => {
    try {
      const res = await api.toggleAttending(patientId);
      await fetchQueue();
      await fetchLiveFeed();
      showToast(
        res.is_attended
          ? `👩⚕️ Attending physician assigned to ${patientId}`
          : `Patient ${patientId} marked unattended`,
        'info'
      );
    } catch (err) {
      showToast('Toggle failed', 'error');
    }
  };

  const viewPatientDetail = (patientId) => {
    setSelectedPatientId(patientId);
    setActiveTab('patient-detail');
  };

  const openWhatIfModal = (patient) => {
    setWhatIfPatient(patient);
  };

  const openWhyComparison = (p1Id, p2Id) => {
    setWhyComparisonPair([p1Id, p2Id]);
  };

  const openPatientPortalCompanion = (patientId) => {
    setPortalPatientId(patientId);
  };

  return (
    <TriageContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        queueData,
        loading,
        surgeActive,
        autoRefresh,
        setAutoRefresh,
        fetchQueue,
        activeNurseName,
        setActiveNurseName,
        assignedPatientIds,
        setAssignedPatientIds,
        handlingMap,
        handleImOnIt,
        handleToggleSurge,
        handleResetData,
        handleSimulateDeterioration,
        handleToggleAttending,
        handleClosedLoopReassess,
        viewPatientDetail,
        // Modal state
        reassessmentTargetPatient,
        openReassessmentModal,
        closeReassessmentModal,
        whyModalPatient,
        setWhyModalPatient,
        whyComparisonPair,
        setWhyComparisonPair,
        openWhyComparison,
        whatIfPatient,
        setWhatIfPatient,
        openWhatIfModal,
        trendModalPatient,
        setTrendModalPatient,
        overrideModalPatient,
        setOverrideModalPatient,
        safetyOutcomeData,
        setSafetyOutcomeData,
        portalPatientId,
        setPortalPatientId,
        openPatientPortalCompanion,
        preordersList,
        fetchPreorders,
        handleApprovePreorder,
        handleDismissPreorder,
        liveEvents,
        fetchLiveFeed,
        // Replay simulation
        replayTimeline,
        replayStepIndex,
        replayPlaying,
        replaySpeed,
        setReplaySpeed,
        playReplay,
        pauseReplay,
        stepForwardReplay,
        resetReplay,
        applyStep,
        toastMessage,
        showToast
      }}
    >
      {children}
    </TriageContext.Provider>
  );
};

export const useTriage = () => useContext(TriageContext);
