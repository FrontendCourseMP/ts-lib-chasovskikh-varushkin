// Точка входа в ваше решение
import { FieldRule } from './types/field';
import { ValidatorOptions } from './types/validator';

export default class FormGuard {
  private form: HTMLFormElement;
  private fields = new Map<string, FieldRule[]>();
  private options: ValidatorOptions;

  constructor(form: HTMLFormElement, options: ValidatorOptions = {}) {
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('FormGuard: form is not HTMLFormElement');
    }

    this.form = form;
    this.options = options;

    this.checkFormStructure();
  }

  private checkFormStructure() {
    const inputs = this.form.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const name = input.getAttribute('name');

      if (!name) {
        this.warn('Input without name attribute', input);
      }

      const id = input.getAttribute('id');
      if (id) {
        const label = this.form.querySelector(`label[for="${id}"]`);
        if (!label) {
          this.warn(`Missing label for ${name}`, input);
        }
      }
    });
  }

  private warn(message: string, el?: Element) {
    if (!this.options.suppressWarnings) {
      console.warn(`[FormGuard] ${message}`, el);
    }
  }

  addField(name: string, rules: FieldRule[]) {
    const field = this.form.querySelector(`[name="${name}"]`);

    if (!field) {
      throw new Error(`Field "${name}" not found`);
    }

    this.fields.set(name, rules);
  }

  validate(): boolean {
    let isValid = true;

    this.fields.forEach((rules, name) => {
      const field = this.form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (!field) return;

      // native validation
      if (!field.checkValidity()) {
        isValid = false;
      }

      // custom rules
      rules.forEach((rule) => {
        if (rule.rule === 'required' && !field.value) {
          isValid = false;
        }
      });
    });

    return isValid;
  }
}
