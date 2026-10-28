import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function validateSchema(data: unknown, schema: AnySchema): { valid: boolean; errors: string } {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  const errors = valid ? '' : ajv.errorsText(validate.errors);
  return { valid, errors };
}
