# FormGuard

FormGuard — лёгкая JavaScript/TypeScript библиотека для валидации HTML-форм с поддержкой
Constraint Validation API и пользовательских правил.

## Установка

```bash
npm install form-guard
````

## Инициализация

```ts
import FormGuard from 'form-guard';

const form = document.querySelector('form')!;
const validator = new FormGuard(form, {
  suppressWarnings: false, // опция для подавления предупреждений
});
```

## Добавление полей

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

### Поддерживаемые правила

* `required` — поле обязательно
* `minLength` — минимальная длина текста
* `maxLength` — максимальная длина текста
* `email` — проверка корректности email

> Для checkbox-групп правило `required` проверяет, что выбран хотя бы один элемент.

---

## HTML структура

**Одиночные поля:**

```html
<div class="field">
  <label for="username">Имя пользователя</label>
  <input type="text" name="username" id="username" required />
  <div class="error"></div>
</div>
```

**Checkbox-группы:**

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

`validate()` возвращает `true`, если все поля валидны, иначе `false`.

---

## Особенности

* Использует стандартный **Constraint Validation API**
* Поддерживает HTML атрибуты (`required`, `minlength`, `type="email"`)
* Поддерживает пользовательские JS-правила с собственными сообщениями
* Проверяет согласованность HTML-атрибутов и JS-правил
* Поддерживает подавление предупреждений через опцию `suppressWarnings`
* Работает с одиночными полями и группами чекбоксов

---

## Структура проекта

```
src/
├── core/
│   ├── Validator.ts
│   ├── Field.ts
│   └── rules.ts
├── types/
│   ├── validator.ts
│   ├── field.ts
│   ├── form.ts
│   └── validity.ts
├── main.ts
```

`dist/` содержит собранные ES-модули для подключения в браузере:

```html
<script type="module">
  import FormGuard from './dist/main.js';
</script>
```

---

## Пример работы

* Попытка отправить пустую форму — выводятся ошибки под каждым полем
* Email без `@` — ошибка под полем email
* Ни один чекбокс не выбран — ошибка под группой чекбоксов
* Все поля заполнены корректно — форма отправляется или вызывается `alert('Форма успешно прошла валидацию!')`
