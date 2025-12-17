export type FieldRule =
  | { rule: 'required'; message?: string }
  | { rule: 'minLength'; value: number; message?: string }
  | { rule: 'maxLength'; value: number; message?: string }
  | { rule: 'email'; message?: string }
  | { rule: 'pattern'; value: string; message?: string }
  | { rule: 'match'; value: string; message?: string }
  | { rule: 'min'; value: number; message?: string }
  | { rule: 'minChecked'; value: number; message?: string }
  | { rule: 'max'; value: number; message?: string };

export interface FieldConfig {
  name: string;
  rules: FieldRule[];
}
