import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    role: Role;
}
export interface CreateOrderArgs {
    deliveryAddress: Address;
    parcelPhoto?: ParcelPhoto;
    pickupAddress: Address;
}
export type Address = string;
export type DeliveryProofPhoto = Uint8Array;
export type ParcelPhoto = Uint8Array;
export type RiderId = Principal;
export type CustomerId = Principal;
export interface UpdateOrderStatusArgs {
    status: OrderStatus;
    orderId: OrderId;
}
export interface DeliveryOrderInternal {
    id: OrderId;
    proofPhoto?: DeliveryProofPhoto;
    status: OrderStatus;
    deliveryAddress: Address;
    assignedRider?: RiderId;
    customer: CustomerId;
    parcelPhoto?: ParcelPhoto;
    pickupAddress: Address;
}
export type OrderId = string;
export enum OrderStatus {
    assigned = "assigned",
    pending = "pending",
    pickedUp = "pickedUp",
    delivered = "delivered"
}
export enum Role {
    admin = "admin",
    customer = "customer",
    rider = "rider"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRider(orderId: OrderId, rider: RiderId): Promise<void>;
    createOrder(args: CreateOrderArgs): Promise<OrderId>;
    getAllOrders(): Promise<Array<DeliveryOrderInternal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<DeliveryOrderInternal>>;
    getOrder(orderId: OrderId): Promise<DeliveryOrderInternal>;
    getOrdersByCustomer(customerId: CustomerId): Promise<Array<DeliveryOrderInternal>>;
    getOrdersByRider(riderId: RiderId): Promise<Array<DeliveryOrderInternal>>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<DeliveryOrderInternal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateStatus(args: UpdateOrderStatusArgs): Promise<void>;
    uploadParcelPhoto(orderId: OrderId, photo: ParcelPhoto): Promise<void>;
    uploadProofPhoto(orderId: OrderId, photo: DeliveryProofPhoto): Promise<void>;
}
