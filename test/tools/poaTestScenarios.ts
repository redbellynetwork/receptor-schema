import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';
import { yyyymmdd } from './utils';

const proofOfAddressSchema = JSON.parse(
  fs.readFileSync('./schemas/json/ProofOfAddressCredential.json', 'utf-8')
);

function generateProofOfAddressCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(proofOfAddressSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/ProofOfAddressCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'ProofOfAddressCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/ProofOfAddressCredential.json',
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
    street: faker.location.street(),
    city: faker.location.city(),
    postCode: faker.location.zipCode('#####'),
    country: faker.location.countryCode('alpha-3'),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const proofOfAddressTestScenarios = [
  {
    name: 'Valid Proof of Address',
    data: generateProofOfAddressCredential(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field: country',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.country;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: city',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.city;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: street',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.street;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: postCode',
    data: generateProofOfAddressCredential((data) => {
      delete data.credentialSubject.postCode;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: postCode as number',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.postCode = 12345;
    }),
    expectedValid: false,
  },
  {
    name: 'Wrong Data Type: city as number',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.city = 9876;
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateProofOfAddressCredential((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid postCode: empty string',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.postCode = '';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid postCode: alphanumeric',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.postCode = '123AB';
    }),
    expectedValid: false,
  },
  {
    name: 'Invalid country: whitespace only',
    data: generateProofOfAddressCredential((data) => {
      data.credentialSubject.country = '   ';
    }),
    expectedValid: false,
  },
];