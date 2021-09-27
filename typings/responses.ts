export interface IAppResBody {
  err_message?: string;
  status: 'success' | 'fail';
}

export interface ISignUpResponse extends IAppResBody {
  field?: 'username' | 'email' | 'unknown';
}
