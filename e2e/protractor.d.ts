declare module 'protractor' {
  export const browser: any;
  export const by: any;
  export const element: any;
  export interface ElementFinder {
    isPresent(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    click(): Promise<void>;
    getText(): Promise<string>;
    getAttribute(attr: string): Promise<string>;
    sendKeys(keys: string): Promise<void>;
  }
  export interface ElementArrayFinder {
    count(): Promise<number>;
    get(index: number): ElementFinder;
    each(fn: (element: ElementFinder, index: number) => void): Promise<void>;
  }
  export const logging: any;
} 