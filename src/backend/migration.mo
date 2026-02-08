import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OrderId = Text;
  type PhotoId = Text;
  type RiderId = Principal;
  type CustomerId = Principal;
  type Address = Text;
  type ParcelPhoto = Storage.ExternalBlob;
  type DeliveryProofPhoto = Storage.ExternalBlob;

  type OldOrderStatus = {
    #pending;
    #assigned;
    #pickedUp;
    #delivered;
  };

  type OldRole = {
    #customer;
    #rider;
    #admin;
  };

  type OldUserProfile = {
    name : Text;
    role : OldRole;
  };

  type OldDeliveryOrderInternal = {
    id : OrderId;
    customer : CustomerId;
    pickupAddress : Address;
    deliveryAddress : Address;
    parcelPhoto : ?ParcelPhoto;
    proofPhoto : ?DeliveryProofPhoto;
    status : OldOrderStatus;
    assignedRider : ?RiderId;
  };

  type OldActor = {
    orders : Map.Map<OrderId, OldDeliveryOrderInternal>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextOrderId : Nat;
  };

  type PaymentType = {
    #cash;
    #online;
  };

  type NewOrderStatus = {
    #new;
    #assigned;
    #picked;
    #delivered;
  };

  type NewRole = {
    #customer;
    #rider;
    #admin;
  };

  type NewUserProfile = {
    name : Text;
    role : NewRole;
  };

  type RiderProfile = {
    id : RiderId;
    name : Text;
    phoneNumber : Text;
    vehicleType : Text;
    locationUrl : ?Text;
  };

  type NewDeliveryOrderInternal = {
    id : OrderId;
    customer : CustomerId;
    pickupAddress : Address;
    deliveryAddress : Address;
    parcelPhoto : ?ParcelPhoto;
    proofPhoto : ?DeliveryProofPhoto;
    status : NewOrderStatus;
    assignedRider : ?RiderId;
    customerName : Text;
    mobileNumber : Text;
    pickupLocation : Text;
    dropLocation : Text;
    parcelDescription : Text;
    paymentType : PaymentType;
    timestamp : Time.Time;
  };

  type NewActor = {
    orders : Map.Map<OrderId, NewDeliveryOrderInternal>;
    riders : Map.Map<RiderId, RiderProfile>;
    proofPhotoTimestamps : Map.Map<OrderId, Time.Time>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextOrderId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<OrderId, OldDeliveryOrderInternal, NewDeliveryOrderInternal>(
      func(_orderId, oldOrder) {
        {
          oldOrder with
          status = #new;
          customerName = "Unknown Customer";
          mobileNumber = "";
          pickupLocation = "";
          dropLocation = "";
          parcelDescription = "";
          paymentType = #cash;
          timestamp = Time.now();
        };
      }
    );
    {
      orders = newOrders;
      riders = Map.empty<RiderId, RiderProfile>();
      proofPhotoTimestamps = Map.empty<OrderId, Time.Time>();
      userProfiles = old.userProfiles;
      nextOrderId = old.nextOrderId;
    };
  };
};
