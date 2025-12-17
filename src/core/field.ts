import { rulesMap } from "./rules";
import { FieldRule } from "../types/field";

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

  validate() {
    const errors: string[] = [];

    // native validation
    if (!this.element.checkValidity()) {
      errors.push(this.element.validationMessage);
    }

    // custom rules
    this.rules.forEach((rule) => {
      const handler = rulesMap[rule.rule];
      if (!handler) return;

      const result = handler(this.element.value, rule, this.element);
      if (result) {
        errors.push(result);
      }
    });

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
}
