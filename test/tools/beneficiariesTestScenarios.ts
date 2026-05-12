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

/**
 * Generates a valid beneficiaryRoles string per pattern:
 * ^[A-Za-z]+(?:&[A-Za-z]+)*(?:,[A-Za-z]+(?:&[A-Za-z]+)*)*$
 * I.e. roles for one beneficiary are ampersand-separated, and beneficiaries are comma-separated.
 */
function validBeneficiaryRolesString(numBeneficiaries = 1): string {
  const roleGroups = [
    ['ubo', 'director'],
    ['ubo', 'representative'],
    ['representative'],
  ];

  return roleGroups
    .slice(0, numBeneficiaries)
    .map((roles) => roles.join('&'))
    .join(',');
}

function generateBeneficiariesCredential(callback?: (data: any) => void): any {
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
    beneficiaryRoles: validBeneficiaryRolesString(
      faker.number.int({ min: 1, max: 3 })
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
    name: 'Missing Required Field: beneficiaryRoles',
    data: generateBeneficiariesCredential((data) => {
      delete data.credentialSubject.beneficiaryRoles;
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
    name: 'Empty beneficiaryRoles string',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = '';
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
    name: 'Wrong Data Type: beneficiaryRoles as array',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = ['ubo', 'director'];
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
    name: 'Wrong Data Type: beneficiaryRoles as null',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = null as any;
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
    name: 'Wrong Data Type: beneficiaryRoles as boolean',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = true as any;
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
    name: 'Invalid: beneficiaryRoles whitespace only',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = '   ';
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
    name: 'Invalid: beneficiaryRoles single space',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = ' ';
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
    name: 'Invalid: beneficiaryRoles leading space',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = ' ubo';
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
    name: 'Invalid: beneficiaryRoles trailing space',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo ';
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
    name: 'Valid: comma-separated beneficiary roles (no space after comma)',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo,director,representative';
    }),
    expectedValid: true,
  },
  {
    name: 'Valid: ampersand-separated roles for one beneficiary',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo&director';
    }),
    expectedValid: true,
  },
  {
    name: 'Valid: ampersand roles for comma-separated beneficiaries',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles =
        'ubo&director,ubo&representative';
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
    name: 'Invalid: space after comma in beneficiaryRoles',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo, director';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: space around ampersand in beneficiaryRoles',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo &director';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: trailing ampersand in beneficiaryRoles',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo&';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: leading ampersand in beneficiaryRoles',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = '&ubo';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid: double ampersand in beneficiaryRoles',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo&&director';
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
    name: 'Invalid: beneficiaryRoles with number',
    data: generateBeneficiariesCredential((data) => {
      data.credentialSubject.beneficiaryRoles = 'ubo1';
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
