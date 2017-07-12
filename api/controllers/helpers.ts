import * as Express from 'express';

export function Controller() {
  return function<T extends {new(...args:any[]):{}}> (constructor:T) {
    const p = constructor.prototype;
    const methods = Object.keys(p);
    for (const method of methods) {
      const newMethod = '$$' + method;
      p[newMethod] || (p[newMethod] = p[method]);
    }
    return class extends constructor {
      constructor(...args) {
        super(...args);
        for (const method of methods) {
          const protoMethod = '$$' + method;
          this[method] = p[protoMethod].bind(this);
        }
      }
    }
  }
}

export interface RequestParameters {
  apiPath: string;
  path: any;
  operation: any;
  operationParameters: object[];
  operationPath: string[];
  params: any;
  security: object[];
  swaggerObject: object;
}

export interface SwaggerRequest extends Express.Request {
  swagger: RequestParameters;
}
