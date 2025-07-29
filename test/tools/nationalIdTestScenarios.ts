import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';
import { yyyymmdd } from './utils';

const nationalIdSchema = JSON.parse(
  fs.readFileSync('./schemas/json/NationalIdCredential.json', 'utf-8')
);

function generateNationalIdCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(nationalIdSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/NationalIdCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'NationalIdCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/NationalIdCredential.json',
    type: 'JsonSchemaValidator2018',
  };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
  };
  data.subjectPosition = faker.helpers.arrayElement(['none', 'index', 'value']);
  data.merklizationRootPosition = faker.helpers.arrayElement([
    'none',
    'index',
    'value',
  ]);
  data.revNonce = faker.number.int;
  data.version = faker.number.int();
  data.updatable = faker.datatype.boolean();

  data.credentialSubject = {
    id: did,
    name: faker.person.fullName(),
    birthDate: yyyymmdd(faker.date.recent({ days: 10 })),
    nationalIDNumber: faker.string.uuid(),
    country: faker.location.country(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const nationalIdTestScenarios = [
  {
    name: 'Valid National ID',
    data: generateNationalIdCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateNationalIdCredential((data) => {
      delete data.credentialSubject.nationalIDNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generateNationalIdCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generateNationalIdCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generateNationalIdCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extreme Values',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.nationalIDNumber = 'X'.repeat(1000);
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid URL in id',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.id = 'invalid_url';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Unusual Characters',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.name = '💥🔥🚀';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Empty Fields',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.name = '';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Null Values',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = null;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Injection Attack (XSS)',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.name = "<script>alert('XSS')</script>";
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid @type',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generateNationalIdCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = ' USA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: leading spaces',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: trailing spaces',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: empty string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationalIDNumber: spaces in between',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.nationalIDNumber = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: spaces in between',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: empty string',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: trailing space',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: leading space',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: hyphen not allowed',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.country: numbers not allowed',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.country = '1234';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.birthDate = 10101;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too long',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.birthDate = 199901011;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid birthDate: Invalid date (Feb 30)',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.birthDate = 20240230;
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid birthDate: MMDDYYYY instead of YYYYMMDD',
  //   data: generateNationalIdCredential((data) => {
  //     data.credentialSubject.birthDate = 12022024;
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateNationalIdCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
];