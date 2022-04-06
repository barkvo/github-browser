import { HttpService } from "../core/http/http.service";

const API_BASE_URL = "https://api.github.com";

export class GithubApiService extends HttpService {
  constructor() {
    super({ baseURL: API_BASE_URL });
  }
}
