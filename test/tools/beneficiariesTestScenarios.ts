import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';

const beneficiariesSchema = JSON.parse(
  fs.readFileSync('./schemas/json/BeneficiariesCredential.json', 'utf-8')
);

function generateBeneficiariesCredential(
  callback?: (data: any) => void
): any {
  const data = jsf.generate(beneficiariesSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/BeneficiariesCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'BeneficiariesCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/BeneficiariesCredential.json',
    type: 'JsonSchemaValidator2018',
  };
  data.subjectPosition = faker.helpers.arrayElement(['none', 'index', 'value']);
  data.merklizationRootPosition = faker.helpers.arrayElement([
    'none',
    'index',
    'value',
  ]);
  data.revNonce = faker.number.int();
  data.version = faker.number.int();
  data.updatable = faker.datatype.boolean();

  data.credentialSubject = {
    id: did,
    beneficiaryNames: faker.person.fullName(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const beneficiariesTestScenarios = [
  {
    name: 'Valid Beneficiaries Credential',
    data: generateBeneficiariesCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field: beneficiaryNames',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.beneficiaryNames;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: id',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Empty beneficiaryNames string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaryNames as array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = ['not', 'a', 'string'] as any;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaryNames as number',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 123 as any;
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateBeneficiariesCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid URL',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.id = 'invalid_url';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid: beneficiary names as string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames =
        'John Doe, Jane Smith, Bob Johnson';
    }),
    expectedValid: true,
  },
];
