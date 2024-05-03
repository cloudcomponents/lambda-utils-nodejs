import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { GetParameterCommand, ParameterType, SSMClient } from "@aws-sdk/client-ssm";
import { mockClient } from 'aws-sdk-client-mock';

import { SecretKey } from "../secret-key";
import { KeyType } from "../key-type";

const secretsManagerClientMock = mockClient(SecretsManagerClient);
const ssmClientMock = mockClient(SSMClient);

beforeEach(() => {
  secretsManagerClientMock.reset();
  ssmClientMock.reset();
});

test("plain text secret", async () => {
  const value = "secret";

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.PLAIN_TEXT,
    value,
  });

  const secretKey = new SecretKey(secretKeyString);

  expect(await secretKey.getValue()).toBe(value);
});

test("ssm parameter secret", async () => {
  const value = "secret";
  const parameterName = "foo";
  const requestParams = {
    Name: parameterName,
    WithDecryption: true,
  };

  ssmClientMock.on(GetParameterCommand, requestParams).resolvesOnce({
    Parameter: {
      Name: parameterName,
      Type: ParameterType.SECURE_STRING,
      Value: value,
    }
  });

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.SSM_PARAMETER,
    parameterName,
  });

  const secretKey = new SecretKey(secretKeyString);

  expect(await secretKey.getValue()).toBe(value);
});

test("secrets manger secret", async () => {
  const value = "secret";
  const secretId = "foo";
  const requestParams = {
    SecretId: secretId,
    VersionId: undefined,
    VersionStage: undefined,
  };

  secretsManagerClientMock.on(GetSecretValueCommand, requestParams).resolvesOnce({
    Name: secretId,
    SecretString: value,
  });

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.SECRETS_MANAGER,
    secretId,
  });

  const secretKey = new SecretKey(secretKeyString);

  expect(await secretKey.getValue()).toBe(value);
});

test("secrets manger secret with fieldName", async () => {
  const value = "secret";
  const secretString = JSON.stringify({ xxx: value });
  const secretId = "foo";
  const requestParams = {
    SecretId: secretId,
    VersionId: undefined,
    VersionStage: undefined,
  };

  secretsManagerClientMock.on(GetSecretValueCommand, requestParams).resolvesOnce({
    Name: secretId,
    SecretString: secretString,
  });

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.SECRETS_MANAGER,
    secretId,
    fieldName: "xxx",
  });

  const secretKey = new SecretKey(secretKeyString);

  expect(await secretKey.getValue()).toBe(value);
});
