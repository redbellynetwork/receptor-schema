import fs from 'fs';
import { faker } from '@faker-js/faker';
import jsf from 'json-schema-faker';

const wholesaleInvestorSchema = JSON.parse(
  fs.readFileSync('./schemas/json/AUSophisticatedWholesaleInvestorCredential.json', 'utf-8')
);

function generateWholesaleInvestorCredentials(
  callback?: (data: any) => void
): any {
  const data = jsf.generate(wholesaleInvestorSchema) as any;
  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  const bytes = faker.number.int({
    min: 1 * 1024 * 1024,
    max: 2 * 1024 * 1024,
  });
  const contentSize = (bytes / (1024 * 1024)).toFixed(1) + 'MB';

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/AUSophisticatedWholesaleInvestorCredential.jsonld';
  data.id = faker.string.uuid();
  data.type = ['VerifiableCredential', 'AUSophisticatedWholesaleInvestorCredential'];
  data.issuanceDate = faker.date.past().toISOString();
  data.expirationDate = faker.date.future().toISOString();
  data.issuer = { id: faker.internet.url() };
  data.credentialStatus = {
    id: faker.internet.url(),
    type: 'CredentialStatusList2021',
    revocationNonce: faker.number.int(),
  };
  data.credentialSchema = {
    id: 'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json/AUSophisticatedWholesaleInvestorCredential.json',
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
    accountantCertification: faker.helpers.arrayElement(['CPA', 'CA', 'IPA']),
    accountantMembershipNumber: faker.string.uuid(),
    accountantEmail: faker.internet.email(),
  };

  if (callback) {
    callback(data);
  }

  return data;
}

export const wholesaleInvestorTestScenarios = [
  {
    name: 'Valid Au Sophisticated Wholesale Investor',
    data: generateWholesaleInvestorCredentials(),
    expectedValid: true,
  },
  {
    name: 'Missing Required Field: id',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.id;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantMembershipNumber',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantMembershipNumber;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantCertification',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantCertification;
    }),
    expectedValid: false,
  },
  {
    name: 'Missing Required Field: accountantEmail',
    data: generateWholesaleInvestorCredentials((data) => {
      delete data.credentialSubject.accountantEmail;
    }),
    expectedValid: false,
  },
  {
    name: 'Malformed Context: undefined',
    data: generateWholesaleInvestorCredentials((data) => {
      data['@context'] = undefined;
    }),
    expectedValid: false,
  },
];