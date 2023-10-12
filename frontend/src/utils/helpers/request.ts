import axios, { AxiosResponse, AxiosError } from 'axios'

const BASE_URL = 'http://localhost:5050'
type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'

export default class RequestHelper {
  public static async makeRequest<T>(
    url: string,
    method: Method,
    headers: { organisation: string; peer: string },
    data?: unknown
  ): Promise<AxiosResponse<T>> {
    try {
      const response: AxiosResponse<T> = await axios({
        url: BASE_URL + url,
        method,
        data,
        headers,
      })
      return response
    } catch (error) {
      throw error
    }
  }
}
