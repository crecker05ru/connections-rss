import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Provider } from "@angular/core";
import { WithTokenInterceptor } from "../http/withToken-interceptor";

export const WithTokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: WithTokenInterceptor,
  multi: true
}