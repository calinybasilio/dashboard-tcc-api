export default class ValidadoresSerive {
  constructor() {}

  static validPassword(password: string) {
    if (!password) {
      throw new Error("Senha não foi informada!");
    }
    if (password.length < 8) {
      throw new Error("A senha deve possuir o mínimo de 8 caracteres!");
    }
  }

  static validEmail(email: string) {
    if (!email || email == "") {
      throw new Error("Email não foi informado!");
    }
  }

  static validNumberQueryParam(param?: any) {
    return !isNaN(+param) &&
      param !== null &&
      param !== undefined &&
      (param as any) !== ""
      ? true
      : false;
  }
}
