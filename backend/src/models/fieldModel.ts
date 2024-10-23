import { db } from '../utils/db';
import { iField, iOption, iDependency } from '../types/formTypes';

interface FieldData {
  formId: number;
  question: string;
  type: 'text' | 'single_choice' | 'multiple_choice' | 'date';
  position: number;
  options?: { text: string }[];
  dependencies?: { fieldId: number; optionIds: number[] }[];
  indicator?: string; 
}

export const fieldModel = {
  async getFieldsByForm(formId: number): Promise<iField[]> {
    const [fieldsRows] = await db.execute(
      `SELECT field.id, field.type, field.question, field.position, indicator.text as indicator 
       FROM field 
       LEFT JOIN indicator ON indicator.field_id = field.id
       WHERE field.form_id = ? AND field.deleted IS NULL 
       ORDER BY position ASC`,
      [formId]
    );

    const fields = fieldsRows as iField[];

    for (const field of fields) {
      const [optionsRows] = await db.execute(
        `SELECT id, text FROM field_option WHERE field_id = ? AND deleted IS NULL`,
        [field.id]
      );
      field.options = optionsRows as iOption[];

      const [dependenciesRows] = await db.execute(
        `SELECT dependent_field_id as fieldId, field_option_id as optionId
         FROM field_dependency WHERE field_id = ? AND deleted IS NULL`,
        [field.id]
      );

      const dependenciesMap: { [key: number]: iDependency } = {};

      (dependenciesRows as { fieldId: number; optionId: number }[]).forEach((row: { fieldId: number; optionId: number }) => {
        const { fieldId, optionId } = row;
        if (!dependenciesMap[fieldId]) {
          dependenciesMap[fieldId] = { fieldId, optionIds: [] };
        }
        dependenciesMap[fieldId].optionIds.push(optionId);
      });
      field.dependencies = Object.values(dependenciesMap);
    }

    return fields;
  },

  async createField(fieldData: FieldData) {
    const { formId, question, type, position, options, dependencies, indicator } = fieldData;

    const [fieldResult] = await db.execute(
      `INSERT INTO \`field\` (form_id, question, type, position) VALUES (?, ?, ?, ?)`,
      [formId, question, type, position]
    );
    const fieldId = (fieldResult as any).insertId;

    if (options && options.length > 0) {
      const optionQueries = options.map((opt) =>
        db.execute(
          `INSERT INTO \`field_option\` (field_id, text) VALUES (?, ?)`,
          [fieldId, opt.text]
        )
      );
      await Promise.all(optionQueries);
    }

    if (dependencies && dependencies.length > 0) {
      const dependencyQueries = dependencies.map((dep) =>
        dep.optionIds.map((optionId) =>
          db.execute(
            `INSERT INTO \`field_dependency\` (field_id, dependent_field_id, field_option_id) VALUES (?, ?, ?)`,
            [fieldId, dep.fieldId, optionId]
          )
        )
      );
      await Promise.all(dependencyQueries.flat());
    }

    console.log('type: ', type);
    if ((type === 'single_choice' || type === 'multiple_choice') && indicator) {
      console.log('indicator: ', indicator);
      await db.execute(
        `INSERT INTO \`indicator\` (field_id, text) VALUES (?, ?)`,
        [fieldId, indicator]
      );
    }

    const [newFieldRows] = await db.execute('SELECT * FROM `field` WHERE id = ?', [fieldId]);
    return (newFieldRows as any)[0];
  },
};
