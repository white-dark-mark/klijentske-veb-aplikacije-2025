import { OrderModel } from "./order.model"

export interface UserModel {
    email: string
    password: string
    orders: OrderModel[]
}