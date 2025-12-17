
````md
# FormGuard

**FormGuard** — лёгкая JavaScript/TypeScript библиотека для валидации HTML-форм с поддержкой Constraint Validation API и пользовательских правил.

---

## QuickStart

### Установка

```bash
npm install form-guard
````

### Подключение

```ts
import FormGuard from 'form-guard';

const form = document.querySelector('form')!;
const validator = new FormGuard(form, {
  suppressWarnings: false, // подавление предупреждений
});
```

### Добавление полей

```ts
validator.addField('username', [
  { rule: 'required', message: 'Введите имя' },
  { rule: 'minLength', value: 3, message: 'Минимум 3 символа' },
]);

validator.addField('email', [
  { rule: 'required', message: 'Введите email' },
  { rule: 'email', message: 'Некорректный email' },
]);

validator.addField('skills', [
  { rule: 'required', message: 'Выберите хотя бы один навык' },
]);
```

---

## Пример HTML формы

### Одиночные поля

```html
<div class="field">
  <label for="username">Имя пользователя</label>
  <input type="text" name="username" id="username" required />
  <div class="error"></div>
</div>
```

### Checkbox-группы

```html
<div class="field">
  <label>Навыки</label>
  <label><input type="checkbox" name="skills" value="js"> JavaScript</label>
  <label><input type="checkbox" name="skills" value="css"> CSS</label>
  <label><input type="checkbox" name="skills" value="html"> HTML</label>
  <div class="error"></div>
</div>
```

---

## Валидация формы

```ts
form.addEventListener('submit', (e) => {
  if (!validator.validate()) {
    e.preventDefault(); // предотвращаем отправку формы
  } else {
    alert('Форма успешно прошла валидацию!');
  }
});
```

* Метод `validate()` возвращает `true`, если все поля валидны, иначе `false`.

---

## Поддерживаемые правила

| Правило      | Описание                                                                        |
| ------------ | ------------------------------------------------------------------------------- |
| `required`   | Поле обязательно. Для checkbox-групп проверяет, что выбран хотя бы один элемент |
| `minLength`  | Минимальная длина текста                                                        |
| `maxLength`  | Максимальная длина текста                                                       |
| `email`      | Проверка корректности email                                                     |
| `pattern`    | Проверка соответствия регулярному выражению                                     |
| `match`      | Значение поля должно совпадать с другим полем формы                             |
| `min`        | Минимальное числовое значение                                                   |
| `max`        | Максимальное числовое значение                                                  |
| `minChecked` | Минимальное количество выбранных элементов в checkbox-группе                    |

---

## Особенности

* Использует стандартный **Constraint Validation API**
* Поддерживает HTML атрибуты (`required`, `minlength`, `type="email"`)
* Поддерживает пользовательские JS-правила с собственными сообщениями
* Проверяет согласованность HTML-атрибутов и JS-правил
* Поддерживает подавление предупреждений через `suppressWarnings`
* Работает с одиночными полями и группами чекбоксов

---

## API Reference

### `FormGuard(form: HTMLFormElement, options?: { suppressWarnings?: boolean; warn?: WarningHandler })`

* `form` — HTML форма для валидации
* `options.suppressWarnings` — `boolean`, подавление предупреждений (по умолчанию `false`)
* `options.warn` — функция предупреждения `warn(message: string, el?: Element)`

### `addField(name: string, rules: FieldRule[], checkboxes?: HTMLInputElement[])`

Добавляет поле для валидации:

* `name` — имя поля (`name` атрибут в HTML)
* `rules` — массив правил валидации (`FieldRule[]`)
* `checkboxes` — необязательный массив чекбоксов для групп

### `validate(): boolean`

Выполняет валидацию всех добавленных полей формы.
Возвращает `true`, если все поля валидны, иначе `false`.

---

### Тип `FieldRule`

```ts
type FieldRule =
  | { rule: 'required'; message?: string }
  | { rule: 'minLength'; value: number; message?: string }
  | { rule: 'maxLength'; value: number; message?: string }
  | { rule: 'email'; message?: string }
  | { rule: 'pattern'; value: string; message?: string }
  | { rule: 'match'; value: string; message?: string }
  | { rule: 'min'; value: number; message?: string }
  | { rule: 'minChecked'; value: number; message?: string }
  | { rule: 'max'; value: number; message?: string };
```

---

## Пример работы

* Попытка отправить пустую форму — выводятся ошибки под каждым полем
* Email без `@` — ошибка под полем email
* Ни один чекбокс не выбран — ошибка под группой чекбоксов
* Все поля заполнены корректно — форма отправляется или вызывается `alert('Форма успешно прошла валидацию!')`

