export interface iForm {
  id: number;
  title: string;
  status: 'draft' | 'published';
  fields: iField[];
}

export interface iDependency {
  fieldId: number;
  optionIds: number[];
}

export interface iField {
  id: number;
  type: FieldType;
  question: string;
  options?: iOption[];
  position: number;
  dependencies?: iDependency[];
  indicator?: string;
}

export interface iOption {
  id: number;
  text: string;
}

export enum FieldType {
  TEXT = 'text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  DATE = 'date'
}
