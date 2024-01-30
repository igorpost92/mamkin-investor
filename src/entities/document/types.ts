interface PrimitiveField {
  type?: 'string' | 'boolean';
}

interface NumberField {
  type: 'number';
  precision?: number;
  // TODO: min/max
}

interface DateField {
  type: 'date';
  dateFormat?: 'date' | 'datetime';
}

interface ObjectField {
  type: 'object';
  getOptions: () => Promise<any[]>;
  getId: (data: any) => string;
  getPresentation: (data: any) => string;
}

export type DocumentFieldConfig = (PrimitiveField | NumberField | DateField | ObjectField) & {
  name: string;
  title?: string;
  required?: boolean;
};
