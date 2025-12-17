import { FieldRule } from '../types/field.js';

export type RuleResult = string | null;

export type RuleHandler = (
  value: string | string[],
  rule: FieldRule,
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
) => RuleResult;

export const rulesMap: Record<string, RuleHandler> = {
  required(value, rule) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return rule.message || 'Поле обязательно для заполнения';
    }
    return null;
  },

  minLength(value, rule) {
    if (rule.rule === 'minLength' && typeof value === 'string') {
      if (value.length < rule.value) {
        return rule.message || `Минимальная длина ${rule.value} символов`;
      }
    }
    return null;
  },

  maxLength(value, rule) {
    if (rule.rule === 'maxLength' && typeof value === 'string') {
      if (value.length > rule.value) {
        return rule.message || `Максимальная длина ${rule.value} символов`;
      }
    }
    return null;
  },

  email(value, rule, element) {
    if (rule.rule === 'email' && element instanceof HTMLInputElement && element.type === 'email') {
      if (!element.checkValidity()) {
        return rule.message || 'Неверный email';
      }
    }
    return null;
  },

  pattern(value, rule) {
    if (rule.rule === 'pattern' && typeof value === 'string') {
      const regex = new RegExp(rule.value);
      if (!regex.test(value)) {
        return rule.message || 'Значение не соответствует шаблону';
      }
    }
    return null;
  },

  match(value, rule, element) {
    if (rule.rule === 'match' && typeof value === 'string') {
      const other = element.form?.querySelector<HTMLInputElement>(
        `[name="${rule.value}"]`
      );
      if (other && other.value !== value) {
        return rule.message || 'Значения не совпадают';
      }
    }
    return null;
  },

  min(value, rule) {
    if (rule.rule === 'min') {
      const num = Number(value);
      if (!isNaN(num) && num < rule.value) {
        return rule.message || `Минимальное значение ${rule.value}`;
      }
    }
    return null;
  },

  max(value, rule) {
    if (rule.rule === 'max') {
      const num = Number(value);
      if (!isNaN(num) && num > rule.value) {
        return rule.message || `Максимальное значение ${rule.value}`;
      }
    }
    return null;
  },

  minChecked(value, rule) {
    if (rule.rule === 'minChecked' && Array.isArray(value)) {
      if (value.length < rule.value) {
        return rule.message || `Выберите минимум ${rule.value} вариантов`;
      }
    }
    return null;
  },
};
