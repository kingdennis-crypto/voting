import { Request, Response, NextFunction } from 'express'
import ResponseHelper from '../helpers/response'

export async function isAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Implement authentication
    return next()
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Implement authentication check
    return next()
  } catch (error) {
    ResponseHelper.errorResponse(res, 500, error.message)
  }
}
