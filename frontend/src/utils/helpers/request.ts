import axios, { AxiosResponse, AxiosError } from 'axios'

const BASE_URL = '${process.env.NEXT_PUBLIC_SERVER_URL}'
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
