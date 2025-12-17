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
      return this.checkboxes!.filter((el) => el.checked).map((el) => el.value);
    }

    return this.element.value;
  }

  get nativeValidity(): ValidityState {
    return this.element.validity;
  }

  validate() {
    const errors: string[] = [];
    this.clearErrors();

    if (this.isCheckboxGroup()) {
      const value = this.getValue() as string[];

      const minRule = this.rules.find((r) => r.rule === 'minChecked');
    if (minRule && value.length < minRule.value) {
      errors.push(minRule.message || `Select at least ${minRule.value} options`);
    }
    } else {
      if (!this.element.checkValidity()) {
        errors.push(this.element.validationMessage);
      }

      const value = this.getValue() as string;

      this.rules.forEach((rule) => {
        const handler = rulesMap[rule.rule];
        if (!handler) return;

        const result = handler(value, rule, this.element);
        if (result) errors.push(result);
      });
    }

    if (errors.length) {
      this.showErrors(errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  checkConsistency(warn: (msg: string, el?: Element) => void) {
    const el = this.element;

    this.rules.forEach((rule) => {
      if (rule.rule === "required" && !el.hasAttribute("required")) {
        warn('JS rule "required" but no HTML required attribute', el);
      }

      if (rule.rule === "minLength") {
        const attr = el.getAttribute("minlength");
        if (attr && Number(attr) !== rule.value) {
          warn(`minLength mismatch: HTML=${attr}, JS=${rule.value}`, el);
        }
      }

      if (rule.rule === "email" && el instanceof HTMLInputElement) {
        if (el.type !== "email") {
          warn("JS email rule but input type is not email", el);
        }
      }
    });
  }

  private getErrorContainer(): HTMLElement | null {
    if (this.isCheckboxGroup()) {
      const fieldWrapper = this.checkboxes![0].closest(".field");
      return fieldWrapper?.querySelector(".error") || null;
    }

    return this.element.parentElement?.querySelector(".error") || null;
  }

  clearErrors() {
    const container = this.getErrorContainer();
    if (container) container.textContent = "";
  }

  showErrors(errors: string[]) {
    const container = this.getErrorContainer();
    if (!container) return;

    container.innerHTML = errors.map((err) => `<div>${err}</div>`).join("");
  }
}
