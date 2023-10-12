import { Request, Response } from 'express'

export default class ResponseHelper {
  public static successResponse(
    response: Response,
    statusCode: number,
    payload: any
  ) {
    response.status(200).json({
      success: true,
      statusCode: statusCode,
      payload,
    })
  }

  public static errorResponse(
    response: Response,
    statusCode: number,
    message?: string
  ) {
    response.status(statusCode).json({
      success: false,
      statusCode: statusCode,
      error: {
        timestamp: Date.now(),
        message: message || 'Something went wrong',
      },
    })
  }
}
