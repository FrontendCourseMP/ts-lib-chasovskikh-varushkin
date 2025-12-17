import { rulesMap } from "./rules.js";
import { FieldRule } from "../types/field.js";

export default class Field {
  public element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  public checkboxes?: HTMLInputElement[];
  public rules: FieldRule[];

  constructor(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    rules: FieldRule[],
    checkboxes?: HTMLInputElement[]
  ) {
    this.element = element;
    this.rules = rules;
    this.checkboxes = checkboxes;
  }

  private isCheckboxGroup(): boolean {
    return !!this.checkboxes;
  }

  private getValue(): string | string[] {
    if (this.isCheckboxGroup()) {
      return this.checkboxes!.filter(el => el.checked).map(el => el.value);
    }
    return this.element.value;
  }

  validate() {
    const errors: string[] = [];
    this.clearErrors();

    const value = this.getValue();

    this.rules.forEach(rule => {
      const handler = rulesMap[rule.rule];
      if (!handler) return;
      // ✅ Передаем element третьим аргументом
      const result = handler(value, rule, this.element);
      if (result) errors.push(result);
    });

    if (errors.length) this.showErrors(errors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  clearErrors() {
    const container = this.getErrorContainer();
    if (container) container.textContent = '';
  }

  private getErrorContainer(): HTMLElement | null {
    if (this.isCheckboxGroup()) {
      const wrapper = this.checkboxes![0].closest('.field');
      return wrapper?.querySelector('.error') || null;
    }
    return this.element.parentElement?.querySelector('.error') || null;
  }

  private showErrors(errors: string[]) {
    const container = this.getErrorContainer();
    if (!container) return;
    container.innerHTML = errors.map(err => `<div>${err}</div>`).join('');
  }
}
