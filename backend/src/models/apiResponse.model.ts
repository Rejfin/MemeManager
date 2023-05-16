export class ApiResponse<Type> {
  data?: Type;
  message?: string;
  isSuccess: boolean = true;

  constructor(data?: Type, message?: string, isSuccess: boolean = true) {
    this.data = data;
    this.message = message;
    this.isSuccess = isSuccess;
  }
}
