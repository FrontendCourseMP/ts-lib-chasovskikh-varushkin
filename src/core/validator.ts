import Field from './field.js';
import { FieldRule } from '../types/field.js';
import { WarningHandler } from './warning.js';

export interface ValidatorOptions {
  suppressWarnings?: boolean;
  warn?: WarningHandler;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

export default class Validator {
  private form: HTMLFormElement;
  private fields: Record<string, Field> = {};
  private warn: WarningHandler;

  constructor(form: HTMLFormElement, options?: ValidatorOptions) {
    this.form = form;
    this.warn = options?.warn || (() => {});
  }

  addField(
    name: string,
    rules: FieldRule[],
    checkboxes?: HTMLInputElement[]
  ): void {
    const el = this.form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${name}"]`);
    if (!el && (!checkboxes || checkboxes.length === 0)) {
      throw new Error(`Элемент с именем "${name}" не найден`);
    }
    this.fields[name] = new Field(el!, rules, checkboxes);
  }

  validate(): ValidationResult {
    const errors: Record<string, string[]> = {};

    Object.entries(this.fields).forEach(([name, field]) => {
      const result = field.validate();
      if (!result.valid) errors[name] = result.errors;
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
