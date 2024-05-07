[![cloudcomponents Logo](https://raw.githubusercontent.com/cloudcomponents/cdk-constructs/master/logo.png)](https://github.com/cloudcomponents/cdk-constructs)

# @cloudcomponents/lambda-utils

[![Build Status](https://github.com/cloudcomponents/lambda-utils-nodejs/actions/workflows/ci.yaml/badge.svg)](https://github.com/cloudcomponents/lambda-utils-nodejs/actions/workflows/ci.yaml)

> Lambda utils for cloudcomponents cdk constructs

## Install

```bash
npm i @cloudcomponents/lambda-utils
```

## How to use

### SecretKey
```typescript
import { SecretKey } from "@cloudcomponents/lambda-utils";

const secretKey = new SecretKey(process.env.SECRET_KEY_STRING as string);

export const handler = async (event, context) => {
  const value = await secretKey.getValue();
  return `Hello ${value}`
}

```

See [cdk-secret-key](https://github.com/cloudcomponents/cdk-constructs/tree/master/packages/cdk-secret-key) for the cdk counterpart

### SecretKeyStore
```typescript
import { SecretKeyStore } from "@cloudcomponents/lambda-utils";

const secretKeyStore = new SecretKeyStore(process.env.SECRET_KEY_STORE_STRING as string);

export const handler = async (event, context) => {
  const value = "secret"
  await secretKey.putValue(value);
  return `Hello`
}

```
See [cdk-secret-key](https://github.com/cloudcomponents/cdk-constructs/tree/master/packages/cdk-secret-key) for the cdk counterpart

## License

[MIT](LICENSE)
