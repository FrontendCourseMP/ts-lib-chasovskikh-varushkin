export type WarningHandler = (message: string, el?: Element) => void;

export const defaultWarningHandler: WarningHandler = (message, el) => {
  console.warn(`[FormGuard] ${message}`, el);
};
