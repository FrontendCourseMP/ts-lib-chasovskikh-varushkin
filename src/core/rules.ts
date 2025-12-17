import { FieldRule } from '../types/field.js';

export type RuleResult = string | null;

export type RuleHandler = (
  value: string,
  rule: FieldRule,
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
) => RuleResult;

export const rulesMap: Record<string, RuleHandler> = {
  required(value, rule) {
    if (!value) {
      return rule.message || 'Field is required';
    }
    return null;
  },

  minLength(value, rule) {
    if (rule.rule === 'minLength' && value.length < rule.value) {
      return rule.message || `Minimum length is ${rule.value}`;
    }
    return null;
  },

  maxLength(value, rule) {
    if (rule.rule === 'maxLength' && value.length > rule.value) {
      return rule.message || `Maximum length is ${rule.value}`;
    }
    return null;
  },

  email(_value, rule, element) {
    if (element instanceof HTMLInputElement && element.type === 'email') {
      if (!element.checkValidity()) {
        return rule.message || 'Invalid email';
      }
    }
    return null;
  },

  pattern(value, rule) {
    if (rule.rule === 'pattern') {
      const regex = new RegExp(rule.value);
      if (!regex.test(value)) {
        return rule.message || `Value does not match pattern`;
      }
    }
    return null;
  },

  match(value, rule, element) {
    if (rule.rule === 'match') {
      const other = element.form?.querySelector(
        `[name="${rule.value}"]`
      ) as HTMLInputElement;

      if (other && other.value !== value) {
        return rule.message || `Values do not match`;
      }
    }
    return null;
  },

  min(value, rule) {
    if (rule.rule === 'min') {
      const num = Number(value);
      if (!isNaN(num) && num < rule.value) {
        return rule.message || `Minimum value is ${rule.value}`;
      }
    }
    return null;
  },

  max(value, rule) {
    if (rule.rule === 'max') {
      const num = Number(value);
      if (!isNaN(num) && num > rule.value) {
        return rule.message || `Maximum value is ${rule.value}`;
      }
    }
    return null;
  },

  minChecked() {
  return null;
  },
};
