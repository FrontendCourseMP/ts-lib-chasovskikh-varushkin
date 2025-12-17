import { WarningHandler } from "../core/warning.js";

export interface ValidatorOptions {

  suppressWarnings?: boolean;
  warn?: WarningHandler;
}

export interface ValidationResult {
  valid: boolean;
}
