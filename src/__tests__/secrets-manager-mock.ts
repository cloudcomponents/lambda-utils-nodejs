import { SecretsManager } from "aws-sdk";

export class SecretsManagerMock {
  private secretStrings: Record<string, string>;
  private rejects = false;
  private rejectionMessage: string | undefined;

  constructor() {
    this.secretStrings = {};
  }

  public reset(): void {
    this.secretStrings = {};
    this.rejects = false;
    this.rejectionMessage = undefined;
  }

  public addSecretString(secretId: string, secretString: string): void {
    this.secretStrings = {
      ...this.secretStrings,
      [secretId]: secretString,
    };
  }

  public getSecretString(secretId: string): string {
    return this.secretStrings[secretId];
  }

  public rejectsPromise(message = "failed to fetch param"): void {
    this.rejects = true;
    this.rejectionMessage = message;
  }

  public get implementation(): Record<string, unknown> {
    return {
      getSecretValue: jest.fn((params) => ({
        promise: jest.fn(() => {
          return new Promise((resolve, reject) => {
            if (this.rejects) {
              reject(new Error(this.rejectionMessage));
            }
            if (this.secretStrings[params.SecretId]) {
              return resolve({
                SecretString: this.secretStrings[params.SecretId],
              });
            }
            reject(new Error("Missing secret"));
          });
        }),
      })),
      putSecretValue: jest.fn(
        (params: SecretsManager.Types.PutSecretValueRequest) => ({
          promise: jest.fn(() => {
            return new Promise((resolve, reject) => {
              if (this.rejects) {
                reject(new Error(this.rejectionMessage));
              }
              if (params.SecretString) {
                this.secretStrings[params.SecretId] = params.SecretString;
                return;
              }
              reject(new Error("Missing secretString"));
            });
          }),
        })
      ),
    };
  }
}
