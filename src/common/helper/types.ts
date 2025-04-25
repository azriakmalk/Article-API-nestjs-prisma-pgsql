export interface ColumnMapping {
  [key: string]: {
    field: string;
    type: 'string' | 'bigint' | 'date' | 'number' | 'boolean' | 'enum';
    enums?: Record<string, any>;
  };
}
