import { describe, it, expect, vi, beforeEach } from "vitest";
import Validator from "../src/core/validator.js";
import { FieldRule } from "../src/types/field.js";

describe("Validator", () => {
  let form: HTMLFormElement;
  let validator: Validator;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="test-form">
        <div class="field">
          <input type="text" name="username" id="username" required />
          <div class="error"></div>
        </div>
        <div class="field">
          <input type="email" name="email" id="email" />
          <div class="error"></div>
        </div>
        <div class="field">
          <input type="checkbox" name="roles" value="admin" />
          <input type="checkbox" name="roles" value="user" />
          <div class="error"></div>
        </div>
      </form>
    `;

    form = document.getElementById("test-form") as HTMLFormElement;

    validator = new Validator(form, {
      warn: vi.fn(), // мок для предупреждений
    });
  });

  it("валидная форма (happy path)", () => {
    const usernameInput = form.querySelector<HTMLInputElement>("#username")!;
    const emailInput = form.querySelector<HTMLInputElement>("#email")!;

    validator.addField("username", [
      { rule: "required", message: "Поле обязательно для заполнения" },
    ]);

    validator.addField("email", [
      { rule: "required", message: "Поле обязательно для заполнения" },
      { rule: "email", message: "Неверный email" },
    ]);

    usernameInput.value = "Иван";
    emailInput.value = "ivan@example.com";

    const result = validator.validate();
    expect(result.valid).toBe(true);
  });

  it("проверка required", () => {
    const usernameInput = form.querySelector<HTMLInputElement>("#username")!;
    validator.addField("username", [
      { rule: "required", message: "Поле обязательно для заполнения" },
    ]);

    usernameInput.value = "";

    const result = validator.validate();
    expect(result.valid).toBe(false);

    const errorContainer = usernameInput.parentElement!.querySelector(".error")!;
    expect(errorContainer.textContent).toContain("Поле обязательно для заполнения");
  });

  it("проверка email", () => {
    const emailInput = form.querySelector<HTMLInputElement>("#email")!;
    validator.addField("email", [
      { rule: "required", message: "Поле обязательно для заполнения" },
      { rule: "email", message: "Неверный email" },
    ]);

    emailInput.value = "неверный-email";

    const result = validator.validate();
    expect(result.valid).toBe(false);

    const errorContainer = emailInput.parentElement!.querySelector(".error")!;
    expect(errorContainer.textContent).toContain("Неверный email");
  });

  it("проверка группы чекбоксов с minChecked", () => {
    const checkboxes = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="roles"]'));
    const rules: FieldRule[] = [
      { rule: "minChecked", value: 2, message: "Выберите минимум 2 варианта" },
    ];

    validator.addField("roles", rules, checkboxes);

    // Отметим только один чекбокс
    checkboxes[0].checked = true;
    let result = validator.validate();
    expect(result.valid).toBe(false);

    const errorContainer = checkboxes[0].parentElement!.querySelector(".error")!;
    expect(errorContainer.textContent).toContain("Выберите минимум 2 варианта");

    // Отметим оба чекбокса
    checkboxes[1].checked = true;
    result = validator.validate();
    expect(result.valid).toBe(true);
  });
});
