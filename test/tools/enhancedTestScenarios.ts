import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';
import { yyyymmdd } from './utils';

const enhancedIdschema = JSON.parse(
  fs.readFileSync('./schemas/json/EnhancedIdCredential.json', 'utf-8')
);


function generateEnhancedIDCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(enhancedIdschema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/EnhancedIdCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'EnhancedIdCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/EnhancedIdCredential.json',
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
    dataSource: faker.company.name(),
    name: faker.person.fullName(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    referenceId: faker.string.uuid(),
    country: faker.location.state(),
    documentType: faker.helpers
      .slugify(faker.word.words({ count: { min: 1, max: 2 } }))
      .replace(/-/g, '_')
      .toUpperCase(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const enhancedTestScenarios = [
  {
    name: 'Valid Essential ID',
    data: generateEnhancedIDCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateEnhancedIDCredential((data) => {
      delete data.credentialSubject.referenceId;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateEnhancedIDCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid value in id',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.id = 'invalid_value';
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing id',
    data: generateEnhancedIDCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = ' USA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: leading spaces',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.referenceId = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: trailing spaces',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.referenceId = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: empty string',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.referenceId = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.referenceId: spaces in between',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.referenceId = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: spaces in between',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: empty string',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: trailing space',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: leading space',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: hyphen not allowed',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: numbers not allowed',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.country = '1234';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.birthDate = -2240524800;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
  {
    name: 'Invalid credentialSubject.documentType: spaces in between',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.documentType = 'ID CARD';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: empty string',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.documentType = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: trailing space',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.documentType = 'PASSPORT ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: leading space',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.documentType = ' PASSPORT';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: hyphen not allowed',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.documentType = 'ID-CARD';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.documentType: numbers not allowed',
    data: generateEnhancedIDCredential((data) => {
      data.credentialSubject.documentType = '1234';
    }),
    expectedValid: false,
  },
];
