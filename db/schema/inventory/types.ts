export enum ItemType {
  ANALYZER = "ANALYZER",
  PART = "PART",
  CYLINDER = "CYLINDER",
  PUMP = "PUMP",
  FLOW_METER = "FLOW_METER",
  PROBE = "PROBE",
  DATALOGGER = "DATALOGGER",
}

export enum PartType {
  CONSUMABLE = "CONSUMABLE",
  REPLACEABLE = "REPLACEABLE",
  REPAIRABLE = "REPAIRABLE",
}

export enum PartState {
  NEW = "NEW",
  USED = "USED",
  REPAIRED = "REPAIRED",
  EXHAUSTED = "EXHAUSTED",
  EXPIRED = "EXPIRED",
  BROKEN = "BROKEN",
}

export enum AnalyzerState {
  OPERATIONAL = "OPERATIONAL", // Functioning normally
  STARTUP = "STARTUP", // In startup process
  MAINTENANCE = "MAINTENANCE", // Under maintenance
  CALIBRATION = "CALIBRATION", // Being calibrated
  FAULT = "FAULT", // Error condition
  SHUTDOWN = "SHUTDOWN", // Powered down
  OUT_OF_SERVICE = "OUT_OF_SERVICE", // Long-term inactive
}
