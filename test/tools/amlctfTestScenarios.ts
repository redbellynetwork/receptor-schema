import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';
import { yyyymmdd } from './utils';

const amlCtfSchema = JSON.parse(
  fs.readFileSync('./schemas/json/AMLCTFCredential.json', 'utf-8')
);

function generateAMLCTFCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(amlCtfSchema) as any;

  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/AMLCTLCredential.jsonld';

  data.credentialSubject.id = did;
  data.credentialSubject.amlCheckStatus = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.pepStatus = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.sanctionsCheck = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.adverseMediaStatus = faker.helpers.arrayElement([
    'passed',
    'failed',
  ]);
  data.credentialSubject.monitoringStatus = faker.helpers.arrayElement([
    'active',
    'inactive',
  ]);

  if (callback) {
    callback(data);
  }

  return data;
}

export const amlCtfTestScenarios = [
  {
    name: 'Valid AML & CTF Check',
    data: generateAMLCTFCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateAMLCTFCredential((data) => {
      delete data.credentialSubject.amlCheckStatus;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Extra Undefined Field',
  //   data: generateAMLCTFCredential((data) => {
  //     data.credentialSubject.unknownField = 'randomValue';
  //   }),
  //   expectedValid: true,
  // },
  {
    name: 'Wrong Data Type',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = 12345;
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Malformed Context: Invalid string',
  //   data: generateAMLCTFCredential((data) => {
  //     data['@context'] = 'invalid_context';
  //   }),
  //   expectedValid: false,
  // },
  // {
  //   name: 'Malformed Context: Empty array',
  //   data: generateAMLCTFCredential((data) => {
  //     data['@context'] = [];
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Malformed Context: undefined',
    data: generateAMLCTFCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid URL in id',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.id = 'not_a_url';
    }),
    expectedValid: false,
  },
  {
    name: 'Extreme Values',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = 'a'.repeat(1000);
    }),
    expectedValid: false,
  },
  {
    name: 'Unusual Characters',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = '💥🔥🚀';
    }),
    expectedValid: false,
  },
  {
    name: 'Empty Fields',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Null Values',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = null;
    }),
    expectedValid: false,
  },
  {
    name: 'Array Instead of String',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = ['pass', 'fail'];
    }),
    expectedValid: false,
  },
  {
    name: 'Incorrect Enum Value',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = 'maybe';
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid IRI Reference',
  //   data: generateAMLCTFCredential((data) => {
  //     data['aml-vocab'] = 'invalid-iri';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Injection Attack (XSS)',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = "<script>alert('XSS')</script>";
    }),
    expectedValid: false,
  },
  // {
  //   name: 'Invalid @type',
  //   data: generateAMLCTFCredential((data) => {
  //     data.credentialSubject.type = 'SomeOtherType';
  //   }),
  //   expectedValid: false,
  // },
  {
    name: 'Missing id',
    data: generateAMLCTFCredential((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Leading/Trailing Spaces',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.amlCheckStatus = ' pass ';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: invalid string',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.id = 'did:In-valid string:redbelly';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid credentialSubject.id: empty string',
    data: generateAMLCTFCredential((data) => {
      data.credentialSubject.id = '';
    }),
    expectedValid: false,
  },
];
