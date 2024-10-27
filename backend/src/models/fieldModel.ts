import { db } from '../utils/db';
import { iField, iOption, iDependency } from '../types/formTypes';
import { RowDataPacket } from 'mysql2';

export interface CreateFieldInput {
  formId: number;
  question: string;
  type: 'text' | 'single_choice' | 'multiple_choice' | 'date';
  position: number;
  options?: { text: string }[];
  dependencies?: { fieldId: number; optionIds: number[] }[];
  indicator?: string;
}

export interface UpdateFieldInput {
  question?: string | null;
  type?: 'text' | 'single_choice' | 'multiple_choice' | 'date' | null;
  indicator?: string | null;
  dependencies?: { fieldId: number; optionIds: number[] }[] | null;
  options?: { id?: number; text: string }[] | null;
}

export const fieldModel = {
  async getField(fieldId: number): Promise<iField | null> {
    const [fieldRows] = await db.execute<RowDataPacket[]>(
      `SELECT field.id, field.type, field.question, field.position, indicator.text as indicator
       FROM field
       LEFT JOIN indicator ON indicator.field_id = field.id
       WHERE field.id = ? AND field.deleted IS NULL and indicator.deleted IS NULL`,
      [fieldId]
    );

    if (!fieldRows.length) return null;
    const field = fieldRows[0] as iField;

    const [optionsRows] = await db.execute(
      `SELECT id, text FROM field_option WHERE field_id = ? AND deleted IS NULL`,
      [fieldId]
    );
    field.options = optionsRows as iOption[];

    const [dependenciesRows] = await db.execute(
      `SELECT dependent_field_id as fieldId, field_option_id as optionId
       FROM field_dependency WHERE field_id = ? AND deleted IS NULL`,
      [fieldId]
    );

    const dependenciesMap: { [key: number]: iDependency } = {};
    (dependenciesRows as { fieldId: number; optionId: number }[]).forEach(({ fieldId, optionId }) => {
      if (!dependenciesMap[fieldId]) {
        dependenciesMap[fieldId] = { fieldId, optionIds: [] };
      }
      dependenciesMap[fieldId].optionIds.push(optionId);
    });
    field.dependencies = Object.values(dependenciesMap);

    return field;
  },

  async getFieldsByForm(formId: number): Promise<iField[]> {
    const [fieldsRows] = await db.execute(
      `SELECT field.id, field.type, field.question, field.position, indicator.text as indicator 
       FROM field 
       LEFT JOIN indicator ON indicator.field_id = field.id and indicator.deleted IS NULL
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

  async createField(fieldData: CreateFieldInput) {
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

    if ((type === 'single_choice' || type === 'multiple_choice') && indicator) {
      await db.execute(
        `INSERT INTO \`indicator\` (field_id, text) VALUES (?, ?)`,
        [fieldId, indicator]
      );
    }

    return await this.getField(fieldId);
  },

  async updateField(fieldId: number, updates: UpdateFieldInput) {
    const { question, type, indicator, dependencies, options } = updates;

    if (question || type) {
      await db.execute(
        `UPDATE field SET question = COALESCE(?, question), type = COALESCE(?, type) WHERE id = ?`,
        [question, type, fieldId]
      );
    }

    if (type === 'text' || type === 'date') {
       await db.execute(
        'UPDATE indicator SET deleted = CURRENT_TIMESTAMP WHERE field_id = ?',
        [fieldId]
      );
  
      await db.execute(
        'UPDATE field_option SET deleted = CURRENT_TIMESTAMP WHERE field_id = ?',
        [fieldId]
      );
  
      await db.execute(
        'UPDATE field_dependency SET deleted = CURRENT_TIMESTAMP WHERE dependent_field_id = ?',
        [fieldId]
      );
    }

    if (indicator) {
      const [existingIndicatorRows] = await db.execute(
        'SELECT * FROM indicator WHERE field_id = ? and deleted IS NULL',
        [fieldId]
      );
      const existingIndicator = (existingIndicatorRows as any[])[0];

      if (existingIndicator) {
        await db.execute(
          'UPDATE indicator SET text = ? WHERE field_id = ?',
          [indicator, fieldId]
        );
      } else if (indicator !== null) {
        await db.execute(
          'INSERT INTO indicator (field_id, text) VALUES (?, ?)',
          [fieldId, indicator]
        );
      }
    }

    if (options) {
      console.log('options: ', options);
      const [existingOptionsRows] = await db.execute(
        'SELECT * FROM field_option WHERE field_id = ? and deleted IS NULL',
        [fieldId]
      );
      const existingOptions = existingOptionsRows as any[];
      console.log('existingOptions: ', existingOptions);
      const existingOptionIds = existingOptions.map(opt => opt.id);
      console.log('existingOptionIds: ', existingOptionIds);
      const incomingOptionIds = options.map(opt => opt.id).filter(id => id !== undefined);

      const optionsToDelete = existingOptionIds.filter(id => id && !incomingOptionIds.includes(id));
      if (optionsToDelete.length > 0) {
        await db.execute(
          'UPDATE field_option SET deleted = now() WHERE id IN (?)',
          [optionsToDelete]
        );
      }

      for (const option of options) {
        if (option.id) {
          await db.execute(
            'UPDATE field_option SET text = ? WHERE id = ?',
            [option.text, option.id]
          );
        } else {
          await db.execute(
            'INSERT INTO field_option (field_id, text) VALUES (?, ?)',
            [fieldId, option.text]
          );
        }
      }
    }

    if (dependencies && dependencies.length > 0) {
      // Como só é possível ter uma dependência por campo, pega a primeira.
      // Caso seja necessário ter mais de uma, é necessário alterar aqui.
      const dependency = dependencies[0];
      const { fieldId: dependentFieldId, optionIds } = dependency;

      const [existingDependencies] = await db.execute(
        'SELECT * FROM field_dependency WHERE field_id = ? AND dependent_field_id = ? and deleted IS NULL',
        [fieldId, dependentFieldId]
      );

      const existingOptionIds = (existingDependencies as any[]).map((dep: any) => dep.field_option_id);

      const optionsToRemove = existingOptionIds.filter(id => !optionIds.includes(id));

      if (optionsToRemove.length > 0) {
        await db.execute(
          `UPDATE field_dependency SET deleted = CURRENT_TIMESTAMP 
           WHERE field_id = ? AND dependent_field_id = ? AND field_option_id IN (${optionsToRemove.join(',')})`,
          [fieldId, dependentFieldId]
        );
      }

      for (const optionId of optionIds) {
        if (!existingOptionIds.includes(optionId)) {
          await db.execute(
            'INSERT INTO field_dependency (field_id, dependent_field_id, field_option_id) VALUES (?, ?, ?)',
            [fieldId, dependentFieldId, optionId]
          );
        }
      }
    } else {
      await db.execute(
        'UPDATE field_dependency SET deleted = CURRENT_TIMESTAMP WHERE field_id = ?',
        [fieldId]
      );
    }

    return await this.getField(fieldId);
  },
  
  // deleteField vai deletar não só o field, mas as dependencias(as que ele depende de alguém, as que dependem dele não), indicadores e opções associadas a ele
  async deleteField(fieldId: number) {
    await db.execute(
      'UPDATE field SET deleted = CURRENT_TIMESTAMP WHERE id = ?',
      [fieldId]
    );

    await db.execute(
      'UPDATE indicator SET deleted = CURRENT_TIMESTAMP WHERE field_id = ?',
      [fieldId]
    );

    await db.execute(
      'UPDATE field_option SET deleted = CURRENT_TIMESTAMP WHERE field_id = ?',
      [fieldId]
    );

    await db.execute(
      'UPDATE field_dependency SET deleted = CURRENT_TIMESTAMP WHERE field_id = ? OR dependent_field_id = ?',
      [fieldId, fieldId]
    );
  },

  async updateFieldOrder(formId: number, fields: { fieldId: number, position: number }[]) {
    const [existingFieldsRows] = await db.execute(
      'SELECT id, position FROM field WHERE form_id = ? AND deleted IS NULL',
      [formId]
    );
  
    const existingFields = existingFieldsRows as { id: number, position: number }[];
  
    const fieldsToUpdate = fields.filter(({ fieldId, position }) => {
      const currentField = existingFields.find(f => f.id === fieldId);
      return currentField && currentField.position !== position;
    });
  
    if (fieldsToUpdate.length === 0) {
      return;
    }
  
    console.log('fieldsToUpdate: ', fieldsToUpdate);

    const updateQueries = fieldsToUpdate.map(({ fieldId, position }) =>
      db.execute(
        'UPDATE field SET position = ? WHERE id = ?',
        [position, fieldId]
      )
    );
  
    await Promise.all(updateQueries);
  },
};
