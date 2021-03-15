import { SSM } from "aws-sdk";

interface Parameter {
  Name: string;
  Type: "SecureString";
  Value: string;
}

export class SSMParameterMock {
  private parameters: Record<string, Parameter>;
  private rejects = false;
  private rejectionMessage: string | undefined;

  constructor() {
    this.parameters = {};
  }

  public reset(): void {
    this.parameters = {};
    this.rejects = false;
    this.rejectionMessage = undefined;
  }

  public addParameter(param: Parameter): void {
    this.parameters = {
      ...this.parameters,
      [param.Name]: param,
    };
  }

  public getParameter(name: string): Parameter {
    return this.parameters[name];
  }

  public rejectsPromise(message = "failed to fetch param"): void {
    this.rejects = true;
    this.rejectionMessage = message;
  }

  public get implementation(): Record<string, unknown> {
    return {
      getParameter: jest.fn((params) => ({
        promise: jest.fn(() => {
          return new Promise((resolve, reject) => {
            if (this.rejects) {
              reject(new Error(this.rejectionMessage));
            }
            if (this.parameters[params.Name]) {
              return resolve({
                Parameter: this.parameters[params.Name],
              });
            }
            reject(new Error("Missing param"));
          });
        }),
      })),
      putParameter: jest.fn((params: SSM.Types.PutParameterRequest) => ({
        promise: jest.fn(() => {
          return new Promise((resolve, reject) => {
            if (this.rejects) {
              reject(new Error(this.rejectionMessage));
            }
            this.parameters[params.Name] = {
              Name: params.Name,
              Type: "SecureString",
              Value: params.Value,
            };
          });
        }),
      })),
    };
  }
}
