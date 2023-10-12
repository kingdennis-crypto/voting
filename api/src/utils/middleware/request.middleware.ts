import { Request, Response, NextFunction } from 'express'
import ResponseHelper from '../helpers/response'

export const requireHeaders =
  (headersToInclude: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const targetList = Object.keys(req.headers)
    const missingFields = headersToInclude.filter(
      (field: string) => !targetList.includes(field)
    )

    if (missingFields.length > 0) {
      return ResponseHelper.errorResponse(
        res,
        400,
        "You didn't include the correct headers"
      )
    }

    next()
  }

export const requireFieldsOrParams =
  (fieldsOrParams: string[], requestType: 'body' | 'param') =>
  (req: Request, res: Response, next: NextFunction) => {
    const isBody = requestType === 'body'

    const targetFieldList = isBody
      ? Object.keys(req.body)
      : Object.keys(req.params)

    const missingFields = fieldsOrParams.filter(
      (field: string) => !targetFieldList.includes(field)
    )

    if (missingFields.length > 0) {
      const responseMessage = `The following ${
        isBody ? 'fields' : 'parameters'
      } are all required for this route: ${fieldsOrParams.join(', ')}`

      return ResponseHelper.errorResponse(res, 400, responseMessage)
    }

    next()
  }
