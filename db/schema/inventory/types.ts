export enum ItemType {
  ANALYZER = "ANALYZER",
  ACCESSORY = "ACCESSORY",
  SPARE_PART = "SPARE_PART",
  CYLINDER = "CYLINDER",
  EXTERNAL_PUMP = "EXTERNAL_PUMP",
  FLOW_METER = "FLOW_METER",
  DATALOGGER = "DATALOGGER",
  UPS = "UPS",
  OTHER = "OTHER",
}

export enum SparePartType {
  FILTER = "FILTER",
  PUMP_KIT = "PUMP_KIT",
  OTHER = "OTHER",
}

export enum SparePartState {
  NEW = "NEW",
  USED = "USED",
  REPAIRED = "REPAIRED",
  EXHAUSTED = "EXHAUSTED",
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
