import { SSMParameterMock } from "./ssm-parameter-mock";
import { SecretsManagerMock } from "./secrets-manager-mock";
import { SecretKey } from "../secret-key";
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

test("plain text secret", async () => {
  const value = "secret";

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.PLAIN_TEXT,
    value,
  });

  const secretKey = new SecretKey();

  expect(await secretKey.getValue(secretKeyString)).toBe(value);
});

test("ssm parameter secret", async () => {
  const value = "secret";
  const parameterName = "foo";

  ssmMock.addParameter({
    Name: parameterName,
    Type: "SecureString",
    Value: value,
  });

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.SSM_PARAMETER,
    parameterName,
  });

  const secretKey = new SecretKey();

  expect(await secretKey.getValue(secretKeyString)).toBe(value);
});

test("secrets manger secret", async () => {
  const value = "secret";
  const secretId = "foo";

  secretsManagerMock.addSecretString(secretId, value);

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.SECRETS_MANAGER,
    secretId,
  });

  const secretKey = new SecretKey();

  expect(await secretKey.getValue(secretKeyString)).toBe(value);
});

test("secrets manger secret with fieldName", async () => {
  const value = "secret";
  const secretString = JSON.stringify({ xxx: value });
  const secretId = "foo";

  secretsManagerMock.addSecretString(secretId, secretString);

  const secretKeyString = JSON.stringify({
    secretKeyType: KeyType.SECRETS_MANAGER,
    secretId,
    fieldName: "xxx",
  });

  const secretKey = new SecretKey();

  expect(await secretKey.getValue(secretKeyString)).toBe(value);
});
