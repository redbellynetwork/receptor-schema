# Receptor-schema

## Description

- This provides a list of schemas supported by the Receptor protocol by Redbelly.

## Features

- You can have an insight into all the JSON-LD, and JSON schema definitions of the Verifiable Credentials supported by Redbelly.
- You can also find the vocabulary files for the Credentials supported by Redbelly.

# Provided Schemas are :-

- AMLCTFCredential
- DriversLicenceCredential
- NationalIdCredential
- PassportCredential
- OptimaV1Credential
- KYC1By1Credential

# To Create test cases :-

Modifiy file `generateCredentialsData.ts`

1. Get schema

```ts
const amlCtfSchema = JSON.parse(
  fs.readFileSync('./schemas/json/AMLCTFCredential.json', 'utf-8')
);
```

2. Define function to generate credential using `@faker-js/faker`

```ts
function generateAMLCTFCredential(callback?: (data: any) => void): any {
  const data = jsf.generate(amlCtfSchema) as any;

  const did = `did:receptor:redbelly:${faker.helpers.arrayElement([
    'testnet',
    'mainnet',
  ])}:${faker.string.alphanumeric(42)}`;

  data['@context'] =
    'https://raw.githubusercontent.com/redbellynetwork/receptor-schema/refs/heads/main/schemas/json-ld/AMLCTFCredential.jsonld';

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
```

3. Then make testScenarios array like this

```ts
const amlCtfTestScenarios = [
  {
    name: 'Valid AMLCTFCredential',
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
];
```

4. Add scenario as value on your schema name

```ts
const testObject = {
  AMLCTFCredential: amlCtfTestScenarios,
};
```

5. Generte test data by running script generateCredentialsData

```shell
npx ts-node test/tools/generateCredentialsData.ts
```

6. Run test case using command

```shell
npm run test
```
