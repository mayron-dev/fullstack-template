export type UseCaseResponse<T> = {
  data?: T
  error?: string
  success?: boolean
}

export abstract class Usecase<T = undefined, Res = void> {
  protected readonly serverUrl;
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl
  }
  abstract execute(params?: T): Promise<UseCaseResponse<Res>>;
}