import { PutSecretValueCommand, PutSecretValueCommandInput, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { PutParameterCommand, PutParameterCommandInput, SSMClient, SSMClientConfig } from "@aws-sdk/client-ssm";

import { KeyType } from "./key-type";

export interface SecretKeyStoreOptions {
  /** The service configuration options */
  readonly configuration?: SSMClientConfig;
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
    const ssm = new SSMClient(this.options?.configuration ?? {});
    const params: PutParameterCommandInput = {
      Name: parameterName,
      Value: value,
      Type: "SecureString",
      Overwrite: true,
    };
    await ssm.send(new PutParameterCommand(params));
  }

  private async putSecretValue(secretId: string, value: string): Promise<void> {
    const secretsManager = new SecretsManagerClient(this.options?.configuration ?? {});
    const params: PutSecretValueCommandInput = {
      SecretId: secretId,
      SecretString: value,
    };
    await secretsManager.send(new PutSecretValueCommand(params));
  }
}
