import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Queue & Dashboard
  getLiveQueue: async () => {
    const res = await axios.get(`${API_BASE}/queue/live`);
    return res.data;
  },

  getEvaluationMetrics: async () => {
    const res = await axios.get(`${API_BASE}/queue/evaluation`);
    return res.data;
  },

  updateHospitalProfile: async (profileType) => {
    const res = await axios.post(`${API_BASE}/queue/profile`, { profile_type: profileType });
    return res.data;
  },

  // Patients
  getPatients: async () => {
    const res = await axios.get(`${API_BASE}/patients`);
    return res.data;
  },

  getPatientDetail: async (id) => {
    const res = await axios.get(`${API_BASE}/patients/${id}`);
    return res.data;
  },

  intakePatient: async (payload) => {
    const res = await axios.post(`${API_BASE}/patients`, payload);
    return res.data;
  },

  assessPatientSandbox: async (payload) => {
    const res = await axios.post(`${API_BASE}/triage/assess`, payload);
    return res.data;
  },

  addVitals: async (id, vitalsData) => {
    const res = await axios.post(`${API_BASE}/patients/${id}/vitals`, vitalsData);
    return res.data;
  },

  overrideTriage: async (id, overrideData) => {
    const res = await axios.post(`${API_BASE}/patients/${id}/override`, overrideData);
    return res.data;
  },

  toggleAttending: async (id) => {
    const res = await axios.post(`${API_BASE}/patients/${id}/toggle-attend`);
    return res.data;
  },

  assignPhysician: async (id, data) => {
    const res = await axios.post(`${API_BASE}/patients/${id}/assign-physician`, data);
    return res.data;
  },

  toggleAttendant: async (id) => {
    const res = await axios.post(`${API_BASE}/patients/${id}/toggle-attendant`);
    return res.data;
  },

  simulateDeterioration: async (id) => {
    const res = await axios.post(`${API_BASE}/patients/${id}/simulate-deterioration`);
    return res.data;
  },

  resetBenchmark: async () => {
    const res = await axios.post(`${API_BASE}/patients/reset`);
    return res.data;
  },

  // Surge
  toggleSurge: async (active) => {
    const res = await axios.post(`${API_BASE}/surge/toggle`, { active });
    return res.data;
  },

  // Audit Logs
  getAuditLogs: async (limit = 100, patientId = null) => {
    const params = { limit };
    if (patientId) params.patient_id = patientId;
    const res = await axios.get(`${API_BASE}/audit/logs`, { params });
    return res.data;
  },

  getAuditSummary: async () => {
    const res = await axios.get(`${API_BASE}/audit/summary`);
    return res.data;
  },

  // --- Control Tower Extensions ---
  // Simulation & ED Replay Mode
  getSimulationTimeline: async () => {
    const res = await axios.get(`${API_BASE}/simulation/timeline`);
    return res.data;
  },

  applySimulationStep: async (stepIndex) => {
    const res = await axios.post(`${API_BASE}/simulation/apply-step/${stepIndex}`);
    return res.data;
  },

  // Closed-Loop Clinical Actions & Outcomes
  reassessAction: async (payload) => {
    const res = await axios.post(`${API_BASE}/actions/reassess`, payload);
    return res.data;
  },

  getCounterfactualView: async (patientId) => {
    const res = await axios.get(`${API_BASE}/actions/counterfactual/${patientId}`);
    return res.data;
  },

  getWhyComparison: async (p1Id, p2Id) => {
    const res = await axios.get(`${API_BASE}/actions/why-comparison/${p1Id}/${p2Id}`);
    return res.data;
  },

  // Standing Pre-Orders Hub
  listPreorders: async () => {
    const res = await axios.get(`${API_BASE}/preorders/`);
    return res.data;
  },

  approvePreorder: async (orderId, payload = {}) => {
    const res = await axios.post(`${API_BASE}/preorders/${orderId}/approve`, payload);
    return res.data;
  },

  dismissPreorder: async (orderId, payload) => {
    const res = await axios.post(`${API_BASE}/preorders/${orderId}/dismiss`, payload);
    return res.data;
  },

  // Patient Smart Transparency Companion & Live Safety Feed
  getPatientPortalView: async (patientId) => {
    const res = await axios.get(`${API_BASE}/portal/patient/${patientId}`);
    return res.data;
  },

  getLiveSafetyFeed: async () => {
    const res = await axios.get(`${API_BASE}/portal/feed/live-events`);
    return res.data;
  },

  // 108 EMS Pre-Arrival Telemetry
  getIncomingEms: async () => {
    const res = await axios.get(`${API_BASE}/ems/incoming`);
    return res.data;
  },

  preallocateBay: async (emsId, bayName, assignedBy = "Charge Nurse") => {
    const res = await axios.post(`${API_BASE}/ems/pre-allocate-bay`, {
      ems_id: emsId,
      bay_name: bayName,
      assigned_by: assignedBy
    });
    return res.data;
  }
};
