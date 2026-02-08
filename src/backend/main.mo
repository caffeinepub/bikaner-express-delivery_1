import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import List "mo:core/List";
import Char "mo:core/Char";
import Migration "migration";

(with migration = Migration.run)
actor {
  type OrderId = Text;
  type PhotoId = Text;
  type ParcelPhoto = Storage.ExternalBlob;
  type DeliveryProofPhoto = Storage.ExternalBlob;
  type RiderId = Principal;
  type CustomerId = Principal;
  type Address = Text;

  public type OrderStatus = {
    #new;
    #assigned;
    #picked;
    #delivered;
  };

  public type Role = {
    #customer;
    #rider;
    #admin;
  };

  public type PaymentType = {
    #cash;
    #online;
  };

  public type UserProfile = {
    name : Text;
    role : Role;
  };

  public type RiderProfile = {
    id : RiderId;
    name : Text;
    phoneNumber : Text;
    vehicleType : Text;
    locationUrl : ?Text;
  };

  public type DeliveryOrder = {
    id : OrderId;
    customer : CustomerId;
    pickupAddress : Address;
    deliveryAddress : Address;
    parcelPhoto : ?ParcelPhoto;
    proofPhoto : ?DeliveryProofPhoto;
    status : OrderStatus;
    assignedRider : ?RiderId;
    customerName : Text;
    mobileNumber : Text;
    pickupLocation : Text;
    dropLocation : Text;
    parcelDescription : Text;
    paymentType : PaymentType;
    timestamp : Time.Time;
  };

  public type DeliveryOrderInternal = {
    id : OrderId;
    customer : CustomerId;
    pickupAddress : Address;
    deliveryAddress : Address;
    parcelPhoto : ?ParcelPhoto;
    proofPhoto : ?DeliveryProofPhoto;
    status : OrderStatus;
    assignedRider : ?RiderId;
    customerName : Text;
    mobileNumber : Text;
    pickupLocation : Text;
    dropLocation : Text;
    parcelDescription : Text;
    paymentType : PaymentType;
    timestamp : Time.Time;
  };

  public type UpdateOrderStatusArgs = {
    orderId : OrderId;
    status : OrderStatus;
  };

  public type CreateOrderArgs = {
    pickupAddress : Address;
    deliveryAddress : Address;
    parcelPhoto : ?ParcelPhoto;
    paymentType : PaymentType;
    customerName : Text;
    mobileNumber : Text;
    pickupLocation : Text;
    dropLocation : Text;
    parcelDescription : Text;
  };

  public type FullOrder = {
    id : Text;
    pickupAddress : Text;
    deliveryAddress : Text;
    parcelPhoto : ?ParcelPhoto;
    status : OrderStatus;
    assignedRider : Principal;
    paymentType : { #cash; #online };
    customerName : Text;
    mobileNumber : Text;
    pickupLocation : Text;
    dropLocation : Text;
    parcelDescription : Text;
    timestamp : Time.Time;
    customer : Principal;
    proofPhoto : ?Text;
  };

  public type FullOrderWithTimestamp = {
    id : Text;
    pickupAddress : Text;
    deliveryAddress : Text;
    parcelPhoto : ?ParcelPhoto;
    status : OrderStatus;
    assignedRider : Principal;
    paymentType : { #cash; #online };
    customerName : Text;
    mobileNumber : Text;
    pickupLocation : Text;
    dropLocation : Text;
    parcelDescription : Text;
    timestamp : Time.Time;
    customer : Principal;
    proofPhoto : ?DeliveryProofPhoto;
    proofPhotoTimestamp : ?Time.Time;
    proofPhotoTimestampString : ?Text;
    hasProofPhoto : Bool;
  };

  let orders = Map.empty<OrderId, DeliveryOrderInternal>();
  let riders = Map.empty<RiderId, RiderProfile>();
  let proofPhotoTimestamps = Map.empty<OrderId, Time.Time>();
  var nextOrderId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func getCallerRole(caller : Principal) : ?Role {
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile.role };
      case (null) {
        switch (AccessControl.getUserRole(accessControlState, caller)) {
          case (#admin) { ?#admin };
          case (#user) { null };
          case (#guest) { null };
        };
      };
    };
  };

  func isCustomer(caller : Principal) : Bool {
    switch (getCallerRole(caller)) {
      case (?#customer) { true };
      case (_) { false };
    };
  };

  func isRider(caller : Principal) : Bool {
    switch (getCallerRole(caller)) {
      case (?#rider) { true };
      case (_) { false };
    };
  };

  func isAdminRole(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller) or
    (switch (getCallerRole(caller)) {
      case (?#admin) { true };
      case (_) { false };
    });
  };

  public shared ({ caller }) func createOrder(args : CreateOrderArgs) : async OrderId {
    if (not isCustomer(caller)) {
      Runtime.trap("Unauthorized: Only customers can create orders");
    };

    let orderId = nextOrderId.toText();
    nextOrderId += 1;

    let order : DeliveryOrderInternal = {
      id = orderId;
      customer = caller;
      pickupAddress = args.pickupAddress;
      deliveryAddress = args.deliveryAddress;
      parcelPhoto = args.parcelPhoto;
      proofPhoto = null;
      status = #new;
      assignedRider = null;
      customerName = args.customerName;
      mobileNumber = args.mobileNumber;
      pickupLocation = args.pickupLocation;
      dropLocation = args.dropLocation;
      parcelDescription = args.parcelDescription;
      paymentType = args.paymentType;
      timestamp = Time.now();
    };
    orders.add(orderId, order);
    orderId;
  };

  public shared ({ caller }) func assignRider(orderId : OrderId, rider : RiderId) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can assign riders");
    };
    let order = switch (orders.get(orderId)) {
      case (?o) { o };
      case (null) { Runtime.trap("Order not found") };
    };
    if (order.status != #new) {
      Runtime.trap("Order is not in new status");
    };
    orders.add(orderId, {
      order with
      status = #assigned;
      assignedRider = ?rider;
    });
  };

  public shared ({ caller }) func updateStatus(args : UpdateOrderStatusArgs) : async () {
    let order = switch (orders.get(args.orderId)) {
      case (?o) { o };
      case (null) { Runtime.trap("Order not found") };
    };

    let role = getCallerRole(caller);

    switch (role, order.status, args.status) {
      case (?#rider, #assigned, #picked) {
        switch (order.assignedRider) {
          case (?assignedRider) {
            if (caller != assignedRider) {
              Runtime.trap("Unauthorized: Only the assigned rider can pick up this order");
            };
          };
          case (null) {
            Runtime.trap("No rider assigned to this order");
          };
        };
      };
      case (?#rider, #picked, #delivered) {
        switch (order.assignedRider) {
          case (?assignedRider) {
            if (caller != assignedRider) {
              Runtime.trap("Unauthorized: Only the assigned rider can deliver this order");
            };
          };
          case (null) {
            Runtime.trap("No rider assigned to this order");
          };
        };
      };
      case (?#admin, _, _) {};
      case (_) {
        if (isAdminRole(caller)) { } else {
          Runtime.trap("Invalid status transition for role");
        };
      };
    };

    orders.add(args.orderId, { order with status = args.status });
  };

  public shared ({ caller }) func uploadParcelPhoto(orderId : OrderId, photo : ParcelPhoto) : async () {
    let order = switch (orders.get(orderId)) {
      case (?o) { o };
      case (null) { Runtime.trap("Order not found") };
    };
    if (caller != order.customer) {
      Runtime.trap("Unauthorized: Only the customer can upload the parcel photo");
    };
    orders.add(orderId, { order with parcelPhoto = ?photo });
  };

  public shared ({ caller }) func uploadProofPhoto(orderId : OrderId, photo : DeliveryProofPhoto) : async () {
    let order = switch (orders.get(orderId)) {
      case (?o) { o };
      case (null) { Runtime.trap("Order not found") };
    };
    switch (order.assignedRider) {
      case (?rider) {
        if (caller != rider) {
          Runtime.trap("Unauthorized: Only the assigned rider can upload the proof photo");
        };
      };
      case (null) {
        Runtime.trap("No rider assigned; cannot upload proof photo");
      };
    };
    orders.add(orderId, { order with proofPhoto = ?photo });
    proofPhotoTimestamps.add(orderId, Time.now());
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async DeliveryOrderInternal {
    let order = switch (orders.get(orderId)) {
      case (?o) { o };
      case (null) { Runtime.trap("Order not found") };
    };

    let isAuthorized =
      isAdminRole(caller) or
      caller == order.customer or
      (switch (order.assignedRider) {
        case (?rider) { caller == rider };
        case (null) { false };
      });

    if (not isAuthorized) {
      Runtime.trap("Unauthorized: You don't have permission to view this order");
    };

    order;
  };

  public query ({ caller }) func getAllOrders() : async [DeliveryOrderInternal] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByCustomer(customerId : CustomerId) : async [DeliveryOrderInternal] {
    if (not (isAdminRole(caller) or caller == customerId)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.customer == customerId }).toArray();
  };

  public query ({ caller }) func getOrdersByRider(riderId : RiderId) : async [DeliveryOrderInternal] {
    if (not (isAdminRole(caller) or caller == riderId)) {
      Runtime.trap("Unauthorized: Can only view your own assigned orders");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.assignedRider == ?riderId }).toArray();
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [DeliveryOrderInternal] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can filter orders by status");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getMyOrders() : async [DeliveryOrderInternal] {
    let role = getCallerRole(caller);

    switch (role) {
      case (?#customer) {
        orders.values().map(func(o) { o }).filter(func(order) { order.customer == caller }).toArray();
      };
      case (?#rider) {
        orders.values().map(func(o) { o }).filter(func(order) { order.assignedRider == ?caller }).toArray();
      };
      case (?#admin) {
        orders.values().toArray();
      };
      case (null) {
        if (isAdminRole(caller)) {
          orders.values().toArray();
        } else {
          Runtime.trap("Unauthorized: User role not set");
        };
      };
    };
  };

  public shared ({ caller }) func assignRiderToOrder(orderId : ?Text, riderId : ?Principal) : async Bool {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can assign riders to orders");
    };
    switch (orderId, riderId) {
      case (null, _) { false };
      case (_, null) { false };
      case (?orderId, ?riderPrincipalId) {
        switch (orders.get(orderId)) {
          case (null) { false };
          case (?order) {
            orders.add(
              orderId,
              {
                order with
                assignedRider = ?riderPrincipalId : ?Principal;
                status = #assigned;
              },
            );
            true;
          };
        };
      };
    };
  };

  public query ({ caller }) func getAllRiders() : async [RiderProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view riders");
    };
    riders.values().toArray();
  };

  public shared ({ caller }) func addRider(riderId : Principal, name : Text, phoneNumber : Text, vehicleType : Text) : async Bool {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can add riders");
    };
    let rider : RiderProfile = {
      id = riderId;
      name;
      phoneNumber;
      vehicleType;
      locationUrl = null;
    };
    riders.add(riderId, rider);
    true;
  };

  public shared ({ caller }) func updateRiderLocation(riderId : Principal, locationUrl : Text) : async Bool {
    if (not (isAdminRole(caller) or caller == riderId)) {
      Runtime.trap("Unauthorized: Only the rider or admin can update rider location");
    };
    switch (riders.get(riderId)) {
      case (null) { false };
      case (?rider) {
        riders.add(
          riderId,
          { rider with locationUrl = ?locationUrl },
        );
        true;
      };
    };
  };

  public query ({ caller }) func getOrderWithRiderInfo(orderId : Text) : async ?{ order : DeliveryOrderInternal; rider : ?RiderProfile } {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        let isAuthorized =
          isAdminRole(caller) or
          caller == order.customer or
          (switch (order.assignedRider) {
            case (?rider) { caller == rider };
            case (null) { false };
          });

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: You don't have permission to view this order");
        };

        let rider : ?RiderProfile = switch (order.assignedRider) {
          case (null) { null };
          case (?riderId) { riders.get(riderId) };
        };
        ?{ order; rider };
      };
    };
  };

  // Fixed return type - avoids returning an ?
  public shared ({ caller }) func assignRiderToOrderAndReturnRider(orderId : ?Text, riderId : ?Principal) : async ?(DeliveryOrderInternal, ?RiderProfile) {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can assign riders to orders");
    };
    switch (orderId, riderId) {
      case (null, _) { null };
      case (_, null) { null };
      case (?orderId, ?riderPrincipalId) {
        switch (orders.get(orderId)) {
          case (null) { null };
          case (?order) {
            orders.add(
              orderId,
              {
                order with
                assignedRider = ?riderPrincipalId : ?Principal;
                status = #assigned;
              },
            );
            ?(order, riders.get(riderPrincipalId));
          };
        };
      };
    };
  };

  public shared ({ caller }) func createOrderAndReturn(order : ?FullOrder) : async Bool {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can manually create orders");
    };
    switch (order) {
      case (null) { false };
      case (?order) {
        let newOrder : DeliveryOrderInternal = {
          id = order.id;
          pickupAddress = order.pickupAddress;
          deliveryAddress = order.deliveryAddress;
          parcelPhoto = order.parcelPhoto;
          status = order.status;
          assignedRider = ?order.assignedRider : ?Principal;
          paymentType = order.paymentType;
          customerName = order.customerName;
          mobileNumber = order.mobileNumber;
          pickupLocation = order.pickupLocation;
          dropLocation = order.dropLocation;
          parcelDescription = order.parcelDescription;
          timestamp = Time.now();
          customer = order.customer;
          proofPhoto = null;
        };
        orders.add(order.id, newOrder);
        true;
      };
    };
  };

  public query ({ caller }) func getOrderProofPhotoWithTimestamp(orderId : Text) : async ?FullOrderWithTimestamp {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        let isAuthorized =
          isAdminRole(caller) or
          caller == order.customer or
          (switch (order.assignedRider) {
            case (?rider) { caller == rider };
            case (null) { false };
          });

        if (not isAuthorized) {
          Runtime.trap("Unauthorized: You don't have permission to view this order");
        };

        let proofPhotoWithTimestamp : FullOrderWithTimestamp = {
          id = order.id;
          pickupAddress = order.pickupAddress;
          deliveryAddress = order.deliveryAddress;
          parcelPhoto = order.parcelPhoto;
          status = order.status;
          assignedRider = caller;
          paymentType = order.paymentType;
          customerName = order.customerName;
          mobileNumber = order.mobileNumber;
          pickupLocation = order.pickupLocation;
          dropLocation = order.dropLocation;
          parcelDescription = order.parcelDescription;
          timestamp = order.timestamp;
          customer = order.customer;
          proofPhoto = order.proofPhoto;
          proofPhotoTimestamp = proofPhotoTimestamps.get(orderId);
          proofPhotoTimestampString = ?timeToText(Time.now());
          hasProofPhoto = order.proofPhoto.isSome();
        };
        ?proofPhotoWithTimestamp;
      };
    };
  };

  func timeToText(timeInNanos : Time.Time) : Text {
    let timeInSeconds = timeInNanos / 1_000_000_000;
    timeInSeconds.toText();
  };

  public query ({ caller }) func getAllNewOrders() : async [DeliveryOrder] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.status == #new }).toArray().map(func(o) { { o with status = #new } });
  };

  public query ({ caller }) func getAllAssignedOrders() : async [DeliveryOrder] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.status == #assigned }).toArray().map(func(o) { { o with status = #assigned } });
  };

  public query ({ caller }) func getAllPickedOrders() : async [DeliveryOrder] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.status == #picked }).toArray().map(func(o) { { o with status = #picked } });
  };

  public query ({ caller }) func getAllDeliveredOrders() : async [DeliveryOrder] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can view orders by status");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.status == #delivered }).toArray().map(func(o) { { o with status = #delivered } });
  };
};

