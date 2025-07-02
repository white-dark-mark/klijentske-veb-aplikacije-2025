import { OrderModel } from "./order.model"

export enum UserRole {
    WATCHER = 'watcher',
    ADMIN = 'admin'
}

export interface UserModel {
    id: number;
    email: string
    firstName: string
    lastName: string
    phone: string
    address: string
    favouriteDestination: string
    password: string
    role: UserRole
    orders: OrderModel[]
}