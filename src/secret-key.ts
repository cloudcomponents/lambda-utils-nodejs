import { ConfigurationOptions } from "aws-sdk";
import {
  ssmParameter,
  secretsManagerSecret,
  Parameter,
  Secret,
} from "aws-parameter-cache";

import { KeyType } from "./key-type";

export interface SecretKeyOptions {
  /** The maximum amount of time in milliseconds a parameter will be considered fresh */
  readonly maxAge?: number;

  /** The service configuration options */
  readonly configuration?: ConfigurationOptions;
}

export class SecretKey {
  private param?: Parameter | Secret;

  constructor(
    private readonly secretKeyString: string,
    private readonly options?: SecretKeyOptions
  ) {}

  public async getValue(): Promise<string> {
    const { secretKeyType, ...props } = JSON.parse(this.secretKeyString);

    switch (secretKeyType) {
      case KeyType.PLAIN_TEXT:
        return props.value;

      case KeyType.SSM_PARAMETER: {
        if (!this.param) {
          this.param = ssmParameter({
            ssmConfiguration: this.options?.configuration,
            maxAge: this.options?.maxAge,
            name: props.parameterName,
            withDecryption: true,
          });
        }

        const value = await (this.param as Parameter).value;

        if (Array.isArray(value)) {
          throw new Error("StringList is not supported!");
        }

        return value;
      }

      case KeyType.SECRETS_MANAGER: {
        if (!this.param) {
          this.param = secretsManagerSecret({
            secretsManagerConfiguration: this.options?.configuration,
            maxAge: this.options?.maxAge,
            secretId: props.secretId,
          });
        }

        const value = await (this.param as Secret).secretString;

        return props.fieldName ? JSON.parse(value)[props.fieldName] : value;
      }

      default:
        throw new Error(`Unsupported secret key type ${secretKeyType}`);
    }
  }

  public refresh(): void {
    if (this.param) {
      this.param.refresh();
    }
  }
}
