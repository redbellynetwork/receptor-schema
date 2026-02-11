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

  // Generate valid beneficiaries array
  const beneficiaryTypes = ['ubo', 'shareholder', 'director', 'beneficialOwner'];
  const numBeneficiaries = faker.number.int({ min: 1, max: 5 });

  data.credentialSubject = {
    id: did,
    beneficiaries: Array.from({ length: numBeneficiaries }, () => ({
      beneficiaryType: faker.helpers.arrayElement(beneficiaryTypes),
      name: faker.person.fullName(),
      email: faker.internet.email(),
    })),
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
    name: 'Missing Required Field: beneficiaries',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.beneficiaries;
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
    name: 'Empty beneficiaries array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries = [];
    }),
    expectedValid: false,
  },
  {
    name: 'Too many beneficiaries (exceeds maxItems: 10)',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries = Array.from({ length: 11 }, () => ({
        beneficiaryType: 'ubo',
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }));
    }),
    expectedValid: false,
  },
  {
    name: 'Missing beneficiaryType in array item',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.beneficiaries[0].beneficiaryType;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing name in array item',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.beneficiaries[0].name;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing email in array item',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.beneficiaries[0].email;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaries as string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries = 'not an array';
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaryType as number',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].beneficiaryType = 12345;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: name as number',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].name = 9876;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: email as number',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].email = 12345;
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
    name: 'Invalid beneficiaryType: empty string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].beneficiaryType = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid beneficiaryType: leading spaces',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].beneficiaryType =
        ' ' + data.credentialSubject.beneficiaries[0].beneficiaryType;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid beneficiaryType: trailing spaces',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].beneficiaryType =
        data.credentialSubject.beneficiaries[0].beneficiaryType + ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid name: empty string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid name: leading spaces',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].name =
        ' ' + data.credentialSubject.beneficiaries[0].name;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid name: trailing spaces',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].name =
        data.credentialSubject.beneficiaries[0].name + ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid email: empty string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].email = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid email: not a valid email format',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].email = 'not-an-email';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid email: missing @ symbol',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].email = 'user.example.com';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid email: missing domain',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].email = 'user@';
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values: beneficiaryType',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].beneficiaryType = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values: name',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].name = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values: email',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries[0].email = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Valid: Multiple beneficiaries',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries = [
        {
          beneficiaryType: 'ubo',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
        {
          beneficiaryType: 'shareholder',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
        },
        {
          beneficiaryType: 'director',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
        },
      ];
    }),
    expectedValid: true,
  },
  {
    name: 'Valid: Maximum beneficiaries (10)',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaries = Array.from({ length: 10 }, (_, i) => ({
        beneficiaryType: 'ubo',
        name: `Beneficiary ${i + 1}`,
        email: `beneficiary${i + 1}@example.com`,
      }));
    }),
    expectedValid: true,
  },
];
