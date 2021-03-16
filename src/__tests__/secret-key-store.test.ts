import { SSMParameterMock } from "./ssm-parameter-mock";
import { SecretsManagerMock } from "./secrets-manager-mock";
import { SecretKeyStore } from "../secret-key-store";
import { KeyType } from "../key-type";

const ssmMock = new SSMParameterMock();
const secretsManagerMock = new SecretsManagerMock();

jest.mock("aws-sdk", () => ({
  SSM: jest.fn().mockImplementation(() => ssmMock.implementation),
  SecretsManager: jest
    .fn()
    .mockImplementation(() => secretsManagerMock.implementation),
}));

beforeEach(() => {
  ssmMock.reset();
  secretsManagerMock.reset();
});

test("ssm parameter store", async () => {
  const value = "secret";
  const parameterName = "foo";

  const secretKeyStoreString = JSON.stringify({
    secretKeyType: KeyType.SSM_PARAMETER,
    parameterName,
  });

  const secretKeyStore = new SecretKeyStore(secretKeyStoreString);

  secretKeyStore.putSecret(value);

  expect(ssmMock.getParameter(parameterName).Value).toBe(value);
});

test("secrets manger store", async () => {
  const value = "secret";
  const secretId = "foo";

  const secretKeyStoreString = JSON.stringify({
    secretKeyType: KeyType.SECRETS_MANAGER,
    secretId,
  });

  const secretKeyStore = new SecretKeyStore(secretKeyStoreString);

  secretKeyStore.putSecret(value);

  expect(secretsManagerMock.getSecretString(secretId)).toBe(value);
});
