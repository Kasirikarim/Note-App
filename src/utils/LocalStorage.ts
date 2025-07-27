export function setSetting(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function getSetting(key: string, defaultValue: string = ""): string {
  const value = localStorage.getItem(key);
  return value !== null ? value : defaultValue;
}
