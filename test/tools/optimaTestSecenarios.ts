import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';
import { yyyymmdd } from './utils';

const optimav1Schema = JSON.parse(
  fs.readFileSync('./schemas/json/OptimaV1Credential.json', 'utf-8')
);

function generateOptimaV1Credential(callback?: (data: any) => void): any {
  const data = jsf.generate(optimav1Schema) as any;
  data['@context'] = [
    'https://www.w3.org/ns/credentials/v2',
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/OptimaV1Credential.jsonld',
  ];
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'OptimaV1Credential'];
  data.validFrom = faker.date.past().toISOString();
  data.validUntil = faker.date.future().toISOString();
  data.issuer = faker.internet.url();
  data.credentialSubject = {
    publicAddress: faker.finance.ethereumAddress(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const optimaV1TestScenarios = [
  {
    name: 'Valid Optima V1',
    data: generateOptimaV1Credential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field',
    data: generateOptimaV1Credential((data) => {
      delete data.credentialSubject.publicAddress;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress = 'not_an__ethereum_address';
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateOptimaV1Credential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Too short',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress = '0x123';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Contains non-hex characters',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0xGHIJKL7890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Missing 0x prefix',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '1234567890abcdef1234567890abcdef12345678';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid publicAddress: Uppercase 0X prefix',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0XABCDEF1234567890ABCDEF1234567890ABCDEF12';
    }),
    expectedValid: false,
  },
  {
    name: 'Valid publicAddress: Mixed case (allowed in Ethereum)',
    data: generateOptimaV1Credential((data) => {
      data.credentialSubject.publicAddress =
        '0xAbCdEf1234567890ABCDEF1234567890abcdef12';
    }),
    expectedValid: true,
  },
];