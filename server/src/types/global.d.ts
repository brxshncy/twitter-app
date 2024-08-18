import {Request as ExpressRequest, Response as ExpressResponse} from "express"

declare global {
    type Request = ExpressRequest
    type Response = ExpressResponse
}