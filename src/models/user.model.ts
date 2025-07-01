import { OrderModel } from "./order.model"

export interface UserModel {
    id: number;
    email: string
    firstName: string
    lastName: string
    phone: string
    address: string
    favouriteDestination: string
    password: string
    orders: OrderModel[]
}