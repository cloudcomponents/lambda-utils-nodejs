[![cloudcomponents Logo](https://raw.githubusercontent.com/cloudcomponents/cdk-constructs/master/logo.png)](https://github.com/cloudcomponents/cdk-constructs)

# @cloudcomponents/lambda-utils 

[![Build Status](https://github.com/cloudcomponents/lambda-utils-nodejs/workflows/CI/badge.svg)](https://github.com/cloudcomponents/lambda-utils-nodejs/actions?query=workflow=CI)

> Lambda utils for cloudcomponents cdk constructs

## Install

```bash
npm i @cloudcomponents/lambda-utils
```

## How to use

### SecretKey
```typescript
import { SecretKey } from "@cloudcomponents/lambda-utils";

const secretKey = new SecretKey();
const secretKeyString = process.env.SECRET_KEY_STRING as string;

export const handler = async (event, context) => {
  const value = await secretKey.getValue(secretKeyString);
  return `Hello ${value}`
}

```

### SecretKeyStore
```typescript
import { SecretKeyStore } from "@cloudcomponents/lambda-utils";

const secretKeyStore = new SecretKeyStore();
const secretKeyStoreString = process.env.SECRET_KEY_STORE_STRING as string;

export const handler = async (event, context) => {
  const value = "secret"
  await secretKey.putValue(secretKeyStoreString, value);
  return `Hello`
}

```

## License

[MIT](LICENSE)
