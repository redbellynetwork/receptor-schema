import Ajv from 'ajv';
import fs from 'fs';
import addFormats from 'ajv-formats';
import { test, expect } from '@playwright/test';

const fileList = fs.readdirSync('./test/data');

fileList.forEach((file) => {
  const scenarios = JSON.parse(fs.readFileSync(`./test/data/${file}`, 'utf-8'));

  const credentialSchema = JSON.parse(
    fs.readFileSync(`./schemas/json/${file}`, 'utf-8')
  );

  const ajv = new Ajv({ strict: false, allowUnionTypes: true });
  addFormats(ajv);
  const validate = ajv.compile(credentialSchema);

  test.describe(`Testcases for ${file}: `, () => {
    scenarios.forEach(
      (scenario: { name: string; data: any; expectedValid: any }) => {
        test(scenario.name, async () => {
          const { data, expectedValid } = scenario;
          const valid = validate(data);

          const errors = validate.errors
            ? validate.errors
                .map((error) => `${error.instancePath} ${error.message}`)
                .join(', ')
            : undefined;

          expect(valid, {
            message: `${errors ? errors : 'Validation result not expected'}`,
          }).toBe(expectedValid);
        });
      }
    );
  });
});
