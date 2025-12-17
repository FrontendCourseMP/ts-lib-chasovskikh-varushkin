import { FieldRule } from '../types/field';
import { FieldValidity } from '../types/validity';

export default class Field {
  public element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  public rules: FieldRule[];

  constructor(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    rules: FieldRule[]
  ) {
    this.element = element;
    this.rules = rules;
  }

  get nativeValidity(): ValidityState {
    return this.element.validity;
  }

  validate(): FieldValidity {
    const errors: string[] = [];

    // native validation
    if (!this.element.checkValidity()) {
      errors.push(this.element.validationMessage);
    }

    // custom rules
    this.rules.forEach((rule) => {
      if (rule.rule === 'required' && !this.element.value) {
        errors.push(rule.message || 'Field is required');
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
