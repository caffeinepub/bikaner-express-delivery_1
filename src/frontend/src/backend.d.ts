import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FullOrderWithTimestamp {
    id: string;
    proofPhoto?: DeliveryProofPhoto;
    customerName: string;
    status: OrderStatus;
    deliveryAddress: string;
    assignedRider: Principal;
    hasProofPhoto: boolean;
    customer: Principal;
    parcelPhoto?: ParcelPhoto;
    mobileNumber: string;
    dropLocation: string;
    proofPhotoTimestampString?: string;
    pickupAddress: string;
    proofPhotoTimestamp?: Time;
    timestamp: Time;
    paymentType: Variant_cash_online;
    parcelDescription: string;
    pickupLocation: string;
}
export interface CreateOrderArgs {
    customerName: string;
    deliveryAddress: Address;
    parcelPhoto?: ParcelPhoto;
    mobileNumber: string;
    dropLocation: string;
    pickupAddress: Address;
    paymentType: PaymentType;
    parcelDescription: string;
    pickupLocation: string;
}
export type Time = bigint;
export interface RiderProfile {
    id: RiderId;
    locationUrl?: string;
    vehicleType: string;
    name: string;
    phoneNumber: string;
}
export type Address = string;
export interface DeliveryOrder {
    id: OrderId;
    proofPhoto?: DeliveryProofPhoto;
    customerName: string;
    status: OrderStatus;
    deliveryAddress: Address;
    assignedRider?: RiderId;
    customer: CustomerId;
    parcelPhoto?: ParcelPhoto;
    mobileNumber: string;
    dropLocation: string;
    pickupAddress: Address;
    timestamp: Time;
    paymentType: PaymentType;
    parcelDescription: string;
    pickupLocation: string;
}
export type DeliveryProofPhoto = Uint8Array;
export type ParcelPhoto = Uint8Array;
export type RiderId = Principal;
export type CustomerId = Principal;
export interface FullOrder {
    id: string;
    proofPhoto?: string;
    customerName: string;
    status: OrderStatus;
    deliveryAddress: string;
    assignedRider: Principal;
    customer: Principal;
    parcelPhoto?: ParcelPhoto;
    mobileNumber: string;
    dropLocation: string;
    pickupAddress: string;
    timestamp: Time;
    paymentType: Variant_cash_online;
    parcelDescription: string;
    pickupLocation: string;
}
export interface UpdateOrderStatusArgs {
    status: OrderStatus;
    orderId: OrderId;
}
export interface DeliveryOrderInternal {
    id: OrderId;
    proofPhoto?: DeliveryProofPhoto;
    customerName: string;
    status: OrderStatus;
    deliveryAddress: Address;
    assignedRider?: RiderId;
    customer: CustomerId;
    parcelPhoto?: ParcelPhoto;
    mobileNumber: string;
    dropLocation: string;
    pickupAddress: Address;
    timestamp: Time;
    paymentType: PaymentType;
    parcelDescription: string;
    pickupLocation: string;
}
export type OrderId = string;
export interface UserProfile {
    name: string;
    role: Role;
}
export enum OrderStatus {
    new_ = "new",
    assigned = "assigned",
    picked = "picked",
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
export enum Variant_cash_online {
    cash = "cash",
    online = "online"
}
export interface backendInterface {
    addRider(riderId: Principal, name: string, phoneNumber: string, vehicleType: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRider(orderId: OrderId, rider: RiderId): Promise<void>;
    assignRiderToOrder(orderId: string | null, riderId: Principal | null): Promise<boolean>;
    assignRiderToOrderAndReturnRider(orderId: string | null, riderId: Principal | null): Promise<[DeliveryOrderInternal, RiderProfile | null] | null>;
    createOrder(args: CreateOrderArgs): Promise<OrderId>;
    createOrderAndReturn(order: FullOrder | null): Promise<boolean>;
    getAllAssignedOrders(): Promise<Array<DeliveryOrder>>;
    getAllDeliveredOrders(): Promise<Array<DeliveryOrder>>;
    getAllNewOrders(): Promise<Array<DeliveryOrder>>;
    getAllOrders(): Promise<Array<DeliveryOrderInternal>>;
    getAllPickedOrders(): Promise<Array<DeliveryOrder>>;
    getAllRiders(): Promise<Array<RiderProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyOrders(): Promise<Array<DeliveryOrderInternal>>;
    getOrder(orderId: OrderId): Promise<DeliveryOrderInternal>;
    getOrderProofPhotoWithTimestamp(orderId: string): Promise<FullOrderWithTimestamp | null>;
    getOrderWithRiderInfo(orderId: string): Promise<{
        order: DeliveryOrderInternal;
        rider?: RiderProfile;
    } | null>;
    getOrdersByCustomer(customerId: CustomerId): Promise<Array<DeliveryOrderInternal>>;
    getOrdersByRider(riderId: RiderId): Promise<Array<DeliveryOrderInternal>>;
    getOrdersByStatus(status: OrderStatus): Promise<Array<DeliveryOrderInternal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateRiderLocation(riderId: Principal, locationUrl: string): Promise<boolean>;
    updateStatus(args: UpdateOrderStatusArgs): Promise<void>;
    uploadParcelPhoto(orderId: OrderId, photo: ParcelPhoto): Promise<void>;
    uploadProofPhoto(orderId: OrderId, photo: DeliveryProofPhoto): Promise<void>;
}
