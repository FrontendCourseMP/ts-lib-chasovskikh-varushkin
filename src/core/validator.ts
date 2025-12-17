import Field from "./Field";
import { FieldRule } from "../types/field";
import { ValidatorOptions } from "../types/validator";

export default class Validator {
  protected form: HTMLFormElement;
  protected fields = new Map<string, Field>();
  protected options: ValidatorOptions;

  constructor(form: HTMLFormElement, options: ValidatorOptions = {}) {
    if (!(form instanceof HTMLFormElement)) {
      throw new Error("FormGuard: form is not HTMLFormElement");
    }

    this.form = form;
    this.options = options;

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

  protected warn(message: string, el?: Element) {
    if (!this.options.suppressWarnings) {
      console.warn(`[FormGuard] ${message}`, el);
    }
  }

  addField(name: string, rules: FieldRule[]) {
    const element = this.form.querySelector<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >(`[name="${name}"]`);

    if (!element) {
      throw new Error(`Field "${name}" not found`);
    }

    const field = new Field(element, rules);
    this.fields.set(name, field);
  }

  validate(): boolean {
    let isValid = true;

    this.fields.forEach((field) => {
      const result = field.validate();

      if (!result.valid) {
        isValid = false;
      }
    });

    return isValid;
  }
}
