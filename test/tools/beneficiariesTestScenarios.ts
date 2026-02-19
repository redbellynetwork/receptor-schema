import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';

const beneficiariesSchema = JSON.parse(
  fs.readFileSync('./schemas/json/BeneficiariesCredential.json', 'utf-8')
);

/**
 * Generates a valid beneficiaryNames string per pattern: ^\S+(?: \S+)*(?:,\S+(?: \S+)*)*$
 * I.e. one or more space-separated words; multiple names comma-separated with no space after comma.
 */
function validBeneficiaryNamesString(numNames = 1): string {
  const names = Array.from({ length: numNames }, () => faker.person.fullName());
  return names.join(',');
}

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
    beneficiaryNames: validBeneficiaryNamesString(
      faker.number.int({ min: 1, max: 4 })
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
    name: 'Empty beneficiaryNames string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaryNames as array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = ['John Doe', 'Jane Smith'];
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
    name: 'Wrong Data Type: beneficiaryNames as null',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = null as any;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: beneficiaryNames as boolean',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = true as any;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: beneficiaryNames whitespace only',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = '   ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: beneficiaryNames single space',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = ' ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: beneficiaryNames leading space',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = ' Alice Smith';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: beneficiaryNames trailing space',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'Alice Smith ';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid: single beneficiary name',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'Alice Smith';
    }),
    expectedValid: true,
  },
  {
    name: 'Valid: single word name',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'Alice';
    }),
    expectedValid: true,
  },
  {
    name: 'Valid: comma-separated names (no space after comma)',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames =
        'John Doe,Jane Smith,Bob Johnson';
    }),
    expectedValid: true,
  },
  {
    name: 'Invalid: space after comma in beneficiaryNames',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'John Doe, Jane Smith';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: double space between words in beneficiaryNames',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'John  Doe';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid: beneficiary name with hyphen',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryNames = 'Mary-Jane Watson';
    }),
    expectedValid: true,
  },
  {
    name: 'Missing required: issuanceDate',
    data: generateBeneficiariesCredential((data) => {
      delete data.issuanceDate;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing required: credentialStatus',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialStatus;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid issuer: missing id',
    data: generateBeneficiariesCredential((data) => {
      data.issuer = {};
    }),
    expectedValid: false,
  },
];
