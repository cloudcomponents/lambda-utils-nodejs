import { PutSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { ParameterType, PutParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

import { SecretKeyStore } from "../secret-key-store";
import { KeyType } from "../key-type";

const ssmClientMock = mockClient(SSMClient);
const secretsManagerClientMock = mockClient(SecretsManagerClient);

beforeEach(() => {
  secretsManagerClientMock.reset();
  ssmClientMock.reset();
});

test("ssm parameter store", async () => {
  const value = "secret";
  const parameterName = "foo";
  const requestParams = {
    Name: parameterName,
    Value: value,
    Type: ParameterType.SECURE_STRING,
    Overwrite: true,
  };

  ssmClientMock.on(PutParameterCommand, requestParams).resolves({});

  const secretKeyStoreString = JSON.stringify({
    secretKeyType: KeyType.SSM_PARAMETER,
    parameterName,
  });

  const secretKeyStore = new SecretKeyStore(secretKeyStoreString);

  secretKeyStore.putSecret(value);

  expect(ssmClientMock).toHaveReceivedCommandWith(PutParameterCommand, requestParams);
});

test("secrets manger store", async () => {
  const value = "secret";
  const secretId = "foo";
  const requestParams = {
    SecretId: secretId,
    SecretString: value,
  };

  secretsManagerClientMock.on(PutSecretValueCommand, requestParams).resolves({});

  const secretKeyStoreString = JSON.stringify({
    secretKeyType: KeyType.SECRETS_MANAGER,
    secretId,
  });

  const secretKeyStore = new SecretKeyStore(secretKeyStoreString);

  secretKeyStore.putSecret(value);

  expect(secretsManagerClientMock).toHaveReceivedCommandWith(PutSecretValueCommand, requestParams);
});
