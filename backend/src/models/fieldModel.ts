import { db } from '../utils/db';
import { iField, iOption, iDependency } from '../types/formTypes';
import { RowDataPacket } from 'mysql2';

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
};
