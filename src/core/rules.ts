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
    if ('value' in rule && value.length < rule.value) {
      return rule.message || `Minimum length is ${rule.value}`;
    }
    return null;
  },

  maxLength(value, rule) {
    if ('value' in rule && value.length > rule.value) {
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
};
