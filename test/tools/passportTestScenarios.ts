import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';
import { yyyymmdd } from './utils';

const passportSchema = JSON.parse(
  fs.readFileSync('./schemas/json/PassportCredential.json', 'utf-8')
);

function generatePassportCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(passportSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/PassportCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'PassportCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/PassportCredential.json',
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
    passportNumber: faker.string.alphanumeric({ length: { min: 6, max: 7 } }),
    nationality: faker.location.country(),
    expiryDate: yyyymmdd(faker.date.soon({ days: 5 })),
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const passportTestScenarios = [
  {
    name: 'Valid Passport',
    data: generatePassportCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generatePassportCredential((data) => {
      delete data.credentialSubject.passportNumber;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extra Undefined Field',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.unknownField = 'randomValue';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Wrong Data Type',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = 'not_a_date';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generatePassportCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generatePassportCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generatePassportCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid URL in id',
    data: generatePassportCredential((data) => {
      data.credentialSubject.id = 'invalid_url';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extreme Values',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.passportNumber = 'X'.repeat(1000);
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Unusual Characters',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.name = '💥🔥🚀';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Null Values',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = null;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Injection Attack (XSS)',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.name = "<script>alert('XSS')</script>";
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid @type',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generatePassportCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid date type',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = faker.date.recent({ days: 1 });
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = ' USA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Empty Fields',
    data: generatePassportCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.name: empty',
    data: generatePassportCredential((data) => {
      data.credentialSubject.name = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: leading spaces',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = ' QWER12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: trailing spaces',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = 'QWER12345 ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: empty string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: spaces in between',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = 'QWER 12345';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: Too short (5 characters)',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = 'ABC12';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: Too long (10 characters)',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = '1234567890';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.passportNumber: Contains special characters',
    data: generatePassportCredential((data) => {
      data.credentialSubject.passportNumber = '!@#4567';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: spaces in between',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = "Martha's vineyard";
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: empty string',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: trailing space',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = 'CA ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: leading space',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = ' California';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: hyphen not allowed',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = 'New-York';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.nationality: numbers not allowed',
    data: generatePassportCredential((data) => {
      data.credentialSubject.nationality = '1234';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too short',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = 10101;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid birthDate: Too long',
    data: generatePassportCredential((data) => {
      data.credentialSubject.birthDate = 199901011;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid birthDate: Invalid date (Feb 30)',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.birthDate = 20240230;
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Invalid birthDate: MMDDYYYY instead of YYYYMMDD',
  //   data: generatePassportCredential((data) => {
  //     data.credentialSubject.birthDate = 12022024;
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Invalid publicAddress: Too short',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generatePassportCredential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
];