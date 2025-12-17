export type FieldRule =
  | { rule: 'required'; message?: string }
  | { rule: 'minLength'; value: number; message?: string }
  | { rule: 'maxLength'; value: number; message?: string }
  | { rule: 'email'; message?: string };

export interface FieldConfig {
  name: string;
  rules: FieldRule[];
}
