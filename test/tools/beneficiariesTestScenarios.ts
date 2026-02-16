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

  const numBeneficiaries = faker.number.int({ min: 1, max: 5 });
  data.credentialSubject = {
    id: did,
    beneficiaryNames: Array.from({ length: numBeneficiaries }, () =>
      faker.person.fullName()
    ),
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
    name: 'Empty beneficiaryNames array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = [];
    }),
    expectedValid: false,
  },
  {
    name: 'Too many beneficiaries (exceeds maxItems: 10)',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = Array.from(
        { length: 11 },
        (_, i) => `Beneficiary ${i + 1}`
      );
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaryNames as string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'not an array';
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: array item as number',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames[0] = 9876;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid name: empty string in array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames[0] = '';
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
    name: 'Null value in beneficiaryNames array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames[0] = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Valid: Multiple beneficiaries',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = [
        'John Doe',
        'Jane Smith',
        'Bob Johnson',
      ];
    }),
    expectedValid: true,
  },
  {
    name: 'Valid: Maximum beneficiaries (10)',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = Array.from(
        { length: 10 },
        (_, i) => `Beneficiary ${i + 1}`
      );
    }),
    expectedValid: true,
  },
];
