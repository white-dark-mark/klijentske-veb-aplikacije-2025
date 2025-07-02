import { OrderModel } from "../models/order.model"
import { UserModel, UserRole } from "../models/user.model"

export class UserService {

    static lastUserId = 1; 

    static retrieveUsers(): UserModel[] {
        if (!localStorage.getItem('users')) {
            const arr: UserModel[] = [
                {
                    id: 1, 
                    email: 'user@example.com',
                    firstName: 'Example',
                    lastName: 'User',
                    phone: '+3816123456789',
                    address: 'Mokroluska 14, Vozdovac',
                    favouriteGenre: 'Banja Luka',
                    password: 'user123',
                    role: UserRole.WATCHER,
                    orders: []
                }
            ]

            localStorage.setItem('users', JSON.stringify(arr))
        }

        return JSON.parse(localStorage.getItem('users')!)
    }

    static createUser(model: UserModel) {
        model.id = this.lastUserId++;
        model.role = UserRole.WATCHER; // Default role for new users
        const users = this.retrieveUsers()

        for (let u of users) {
            if (u.email === model.email)
                return false
        }

        users.push(model)
        localStorage.setItem('users', JSON.stringify(users))
        return true
    }

    static updateUser(model: UserModel) {
        const users = this.retrieveUsers()
        for (let u of users) {
            if (u.email === model.email) {
                u.firstName = model.firstName
                u.lastName = model.lastName
                u.address = model.address
                u.phone = model.phone
                u.favouriteGenre = model.favouriteGenre
            }
        }

        localStorage.setItem('users', JSON.stringify(users))
    }

    static login(email: string, password: string): boolean {
        for (let user of this.retrieveUsers()) {
            if (user.email === email && user.password === password) {
                localStorage.setItem('active', user.email)
                return true
            }
        }

        return false
    }

    static getActiveUser(): UserModel | null {
        if (!localStorage.getItem('active'))
            return null

        for (let user of this.retrieveUsers()) {
            if (user.email == localStorage.getItem('active')) {
                return user
            }
        }

        return null
    }

    static createOrder(order: OrderModel) {
        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.orders.push(order)
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }

    static changeOrderStatus(state: 'ordered' | 'paid' | 'canceled', id: number) {
        const active = this.getActiveUser()
        if (active) {
            const arr = this.retrieveUsers()
            for (let user of arr) {
                if (user.email == active.email) {
                    for (let order of user.orders) {
                        if (order.id == id) {
                            order.status = state
                        }
                    }
                    localStorage.setItem('users', JSON.stringify(arr))
                    return true
                }
            }
        }
        return false
    }

    static changeRating(r: boolean, id: number) {
        const active = this.getActiveUser()
        if (active) {
            const arr = this.retrieveUsers()
            for (let user of arr) {
                if (user.email == active.email) {
                    for (let order of user.orders) {
                        if (order.id == id && order.status == 'paid') {
                            order.rating = r
                        }
                    }
                    localStorage.setItem('users', JSON.stringify(arr))
                    return true
                }
            }
        }
        return false
    }

    static changePassword(newPassword: string): boolean {

        const arr = this.retrieveUsers()
        for (let user of arr) {
            if (user.email == localStorage.getItem('active')) {
                user.password = newPassword
                localStorage.setItem('users', JSON.stringify(arr))
                return true
            }
        }

        return false
    }

    // Role-related methods
    static isCurrentUserAdmin(): boolean {
        // Check localStorage override first
        const adminOverride = localStorage.getItem('userRoleOverride');
        if (adminOverride === 'admin') {
            console.log('🔑 Admin access granted via localStorage override');
            return true;
        }

        // Check user's actual role
        const activeUser = this.getActiveUser();
        if (activeUser && activeUser.role === UserRole.ADMIN) {
            console.log('🔑 Admin access granted via user role');
            return true;
        }

        return false;
    }

    static setAdminOverride(isAdmin: boolean): void {
        if (isAdmin) {
            localStorage.setItem('userRoleOverride', 'admin');
            console.log('🔧 Admin override enabled in localStorage');
        } else {
            localStorage.removeItem('userRoleOverride');
            console.log('🔧 Admin override disabled');
        }
    }

    static getCurrentUserRole(): UserRole {
        const adminOverride = localStorage.getItem('userRoleOverride');
        if (adminOverride === 'admin') {
            return UserRole.ADMIN;
        }

        const activeUser = this.getActiveUser();
        return activeUser?.role || UserRole.WATCHER;
    }
}