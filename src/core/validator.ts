import Field from "./field.js";
import { FieldRule } from "../types/field.js";
import { ValidatorOptions } from "../types/validator.js";
import { WarningHandler, defaultWarningHandler } from "./warning.js";

export default class Validator {
  protected form: HTMLFormElement;
  protected fields = new Map<string, Field>();
  protected options: ValidatorOptions;
  protected warn: WarningHandler;

  constructor(form: HTMLFormElement, options: ValidatorOptions = {}) {
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("FormGuard: form is not HTMLFormElement");
    }

    this.form = form;
    this.options = options;
    this.warn = options.warn ?? defaultWarningHandler;

    this.checkFormStructure();
  }

  protected checkFormStructure() {
    const inputs = this.form.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select");

    inputs.forEach((input) => {
      const name = input.getAttribute("name");

      if (!name) {
        this.warn("Input without name attribute", input);
      }

      const id = input.getAttribute("id");
      if (id) {
        const label = this.form.querySelector(`label[for="${id}"]`);
        if (!label) {
          this.warn(`Missing label for ${name}`, input);
        }
      }

      const errorEl = input.parentElement?.querySelector(".error");
      if (!errorEl) {
        this.warn(`Missing error container for ${name}`, input);
      }
    });
  }

  addField(name: string, rules: FieldRule[]) {
    const elements = Array.from(
      this.form.querySelectorAll<HTMLInputElement>(`[name="${name}"]`)
    );

    if (!elements.length) {
      throw new Error(`Field "${name}" not found`);
    }

    // checkbox group
    if (elements.length > 1 && elements.every((el) => el.type === "checkbox")) {
      const checkboxField = new Field(elements[0], rules, elements);
      checkboxField.checkConsistency(this.warn);
      this.fields.set(name, checkboxField);
      return;
    }

    // single field
    const singleField = new Field(elements[0], rules);
    singleField.checkConsistency(this.warn);
    this.fields.set(name, singleField);
  }

  validate(): boolean {
    let isValid = true;

    this.fields.forEach((fieldInstance) => {
      const { valid } = fieldInstance.validate();
      if (!valid) isValid = false;
    });

    return isValid;
  }
}
