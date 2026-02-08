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

actor {
  type OrderId = Text;
  type PhotoId = Text;
  type ParcelPhoto = Storage.ExternalBlob;
  type DeliveryProofPhoto = Storage.ExternalBlob;
  type RiderId = Principal;
  type CustomerId = Principal;
  type Address = Text;

  public type OrderStatus = {
    #pending;
    #assigned;
    #pickedUp;
    #delivered;
  };

  public type Role = {
    #customer;
    #rider;
    #admin;
  };

  public type UserProfile = {
    name : Text;
    role : Role;
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
  };

  module DeliveryOrderInternal {
    public func compare(a : DeliveryOrderInternal, b : DeliveryOrderInternal) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type UpdateOrderStatusArgs = {
    orderId : OrderId;
    status : OrderStatus;
  };

  public type CreateOrderArgs = {
    pickupAddress : Address;
    deliveryAddress : Address;
    parcelPhoto : ?ParcelPhoto;
  };

  let orders = Map.empty<OrderId, DeliveryOrderInternal>();
  var nextOrderId = 0;

  // Prefab authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
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
        // Fallback to access control system
        switch (AccessControl.getUserRole(accessControlState, caller)) {
          case (#admin) { ?#admin };
          case (#user) { null }; // User must set profile with role
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
      status = #pending;
      assignedRider = null;
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
    if (order.status != #pending) {
      Runtime.trap("Order is not in pending status");
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
      // Rider picks up - must be assigned rider
      case (?#rider, #assigned, #pickedUp) {
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
      // Rider delivers - must be assigned rider
      case (?#rider, #pickedUp, #delivered) {
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
      // Admin can update any status
      case (?#admin, _, _) {};
      case (_) { 
        if (isAdminRole(caller)) {
          // Allow admin via access control system
        } else {
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
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async DeliveryOrderInternal {
    let order = switch (orders.get(orderId)) {
      case (?o) { o };
      case (null) { Runtime.trap("Order not found") };
    };

    // Authorization: customer can view their own orders, rider can view assigned orders, admin can view all
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
    orders.values().toArray().sort();
  };

  public query ({ caller }) func getOrdersByCustomer(customerId : CustomerId) : async [DeliveryOrderInternal] {
    // Only admin or the customer themselves can view customer orders
    if (not (isAdminRole(caller) or caller == customerId)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.customer == customerId }).toArray();
  };

  public query ({ caller }) func getOrdersByRider(riderId : RiderId) : async [DeliveryOrderInternal] {
    // Only admin or the rider themselves can view rider orders
    if (not (isAdminRole(caller) or caller == riderId)) {
      Runtime.trap("Unauthorized: Can only view your own assigned orders");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.assignedRider == ?riderId }).toArray();
  };

  public query ({ caller }) func getOrdersByStatus(status : OrderStatus) : async [DeliveryOrderInternal] {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can filter orders by status");
    };
    orders.values().map(func(o) { o }).filter(func(order) { order.status == status }).toArray();
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
        orders.values().toArray().sort();
      };
      case (null) {
        if (isAdminRole(caller)) {
          orders.values().toArray().sort();
        } else {
          Runtime.trap("Unauthorized: User role not set");
        };
      };
    };
  };
};
