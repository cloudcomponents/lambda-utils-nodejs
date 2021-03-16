import { SecretsManager, SSM, ConfigurationOptions } from "aws-sdk";

import { KeyType } from "./key-type";

export interface SecretKeyStoreOptions {
  /** The service configuration options */
  readonly configuration?: ConfigurationOptions;
}

export class SecretKeyStore {
  constructor(
    private readonly secretKeyStoreString: string,
    private readonly options?: SecretKeyStoreOptions
  ) {}

  public putSecret(value: string): Promise<void> {
    const { secretKeyType, ...props } = JSON.parse(this.secretKeyStoreString);
    switch (secretKeyType) {
      case KeyType.SSM_PARAMETER: {
        return this.putParameter(props.parameterName, value);
      }
      case KeyType.SECRETS_MANAGER: {
        return this.putSecretValue(props.secretId, value);
      }
      default:
        throw new Error(`Unsupported secret key type ${secretKeyType}`);
    }
  }

  private async putParameter(
    parameterName: string,
    value: string
  ): Promise<void> {
    const ssm = new SSM(this.options?.configuration);
    const params: SSM.Types.PutParameterRequest = {
      Name: parameterName,
      Value: value,
      Type: "SecureString",
      Overwrite: true,
    };
    await ssm.putParameter(params).promise();
  }

  private async putSecretValue(secretId: string, value: string): Promise<void> {
    const secretsManager = new SecretsManager(this.options?.configuration);
    const params: SecretsManager.Types.PutSecretValueRequest = {
      SecretId: secretId,
      SecretString: value,
    };
    await secretsManager.putSecretValue(params).promise();
  }
}
