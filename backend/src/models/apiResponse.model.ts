export class ApiResponse<Type> {
  data?: Type;
  message?: string;
  isSuccess = true;

  constructor(data?: Type, message?: string, isSuccess = true) {
    this.data = data;
    this.message = message;
    this.isSuccess = isSuccess;
  }
}
