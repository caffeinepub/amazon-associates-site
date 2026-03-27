import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type ProductId = Nat;
  type CategoryId = Nat;

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module Category {
    public func compare(c1 : Category, c2 : Category) : Order.Order {
      Nat.compare(c1.id, c2.id);
    };

    public func compareByName(c1 : Category, c2 : Category) : Order.Order {
      Text.compare(c1.name, c2.name);
    };
  };

  type SiteSettings = {
    siteName : Text;
    heroTitle : Text;
    heroSubtitle : Text;
    heroImageUrl : Text;
  };

  type Product = {
    id : ProductId;
    title : Text;
    description : Text;
    imageUrl : Text;
    price : Nat;
    originalPrice : Nat;
    rating : Float;
    reviewCount : Nat;
    amazonUrl : Text;
    category : CategoryId;
    featured : Bool;
    recommended : Bool;
    createdAt : Int;
  };

  type Category = {
    id : CategoryId;
    name : Text;
    icon : Text;
    color : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  let products = Map.empty<ProductId, Product>();
  let categories = Map.empty<CategoryId, Category>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 1;
  var nextCategoryId = 1;

  var siteSettings : SiteSettings = {
    siteName = "Amazon Affiliates";
    heroTitle = "Amazon Affiliates";
    heroSubtitle = "Find the best deals on Amazon products!";
    heroImageUrl = "/images/hero-banner.jpg";
  };

  // Authentication system with role-based access control
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // User Profile Management
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

  // Product Management
  public shared ({ caller }) func createProduct(product : Product) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let productId = nextProductId;
    let newProduct : Product = {
      product with
      id = productId;
      createdAt = Time.now();
    };

    products.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not products.containsKey(product.id)) {
      Runtime.trap("Product not found");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  // Category Management
  public shared ({ caller }) func createCategory(category : Category) : async CategoryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let categoryId = nextCategoryId;
    let newCategory : Category = {
      category with id = categoryId;
    };
    categories.add(categoryId, newCategory);
    nextCategoryId += 1;
    categoryId;
  };

  public shared ({ caller }) func updateCategory(category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not categories.containsKey(category.id)) {
      Runtime.trap("Category not found");
    };
    categories.add(category.id, category);
  };

  public shared ({ caller }) func deleteCategory(categoryId : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not categories.containsKey(categoryId)) {
      Runtime.trap("Category not found");
    };
    categories.remove(categoryId);
  };

  // Site Settings
  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    siteSettings := settings;
  };

  // Public Queries
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(categoryId : CategoryId) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == categoryId });
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.featured });
  };

  public query ({ caller }) func getRecommendedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.recommended });
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    categories.values().toArray().sort(Category.compareByName);
  };

  public query ({ caller }) func getProductById(productId : ProductId) : async Product {
    switch (products.get(productId)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller }) func getCategoryById(categoryId : CategoryId) : async Category {
    switch (categories.get(categoryId)) {
      case (?category) { category };
      case (null) { Runtime.trap("Category not found") };
    };
  };

  // Seed Sample Data
  public shared ({ caller }) func seedSampleData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    seedCategories();
    seedProducts();
  };

  func seedCategories() {
    categories.add(
      1,
      {
        id = 1;
        name = "Electronics";
        icon = "devices";
        color = "#2196f3";
      },
    );
    categories.add(
      2,
      {
        id = 2;
        name = "Home & Kitchen";
        icon = "kitchen";
        color = "#4caf50";
      },
    );
    categories.add(
      3,
      {
        id = 3;
        name = "Outdoor & Sports";
        icon = "sports";
        color = "#ff9800";
      },
    );
    categories.add(
      4,
      {
        id = 4;
        name = "Fashion";
        icon = "shopping_bag";
        color = "#e91e63";
      },
    );
  };

  func seedProducts() {
    products.add(
      1,
      {
        id = 1;
        title = "Wireless Earbuds";
        description = "High-quality wireless earbuds with noise cancellation.";
        imageUrl = "/images/earbuds.jpg";
        price = 4999;
        originalPrice = 6999;
        rating = 4.5;
        reviewCount = 1200;
        amazonUrl = "https://amazon.com/product1";
        category = 1;
        featured = true;
        recommended = true;
        createdAt = Time.now();
      },
    );

    products.add(
      2,
      {
        id = 2;
        title = "Smart LED TV";
        description = "42-inch 4K Ultra HD Smart LED TV with streaming apps.";
        imageUrl = "/images/tv.jpg";
        price = 29999;
        originalPrice = 34999;
        rating = 4.7;
        reviewCount = 800;
        amazonUrl = "https://amazon.com/product2";
        category = 1;
        featured = true;
        recommended = false;
        createdAt = Time.now();
      },
    );

    products.add(
      3,
      {
        id = 3;
        title = "Cookware Set";
        description = "10-piece non-stick cookware set for all your kitchen needs.";
        imageUrl = "/images/cookware.jpg";
        price = 8999;
        originalPrice = 11999;
        rating = 4.3;
        reviewCount = 450;
        amazonUrl = "https://amazon.com/product3";
        category = 2;
        featured = false;
        recommended = true;
        createdAt = Time.now();
      },
    );

    products.add(
      4,
      {
        id = 4;
        title = "Camping Tent";
        description = "Waterproof camping tent for 4 people, easy setup.";
        imageUrl = "/images/tent.jpg";
        price = 14999;
        originalPrice = 17999;
        rating = 4.6;
        reviewCount = 600;
        amazonUrl = "https://amazon.com/product4";
        category = 3;
        featured = true;
        recommended = false;
        createdAt = Time.now();
      },
    );

    products.add(
      5,
      {
        id = 5;
        title = "Running Shoes";
        description = "Lightweight and comfortable running shoes for men and women.";
        imageUrl = "/images/shoes.jpg";
        price = 3999;
        originalPrice = 4999;
        rating = 4.4;
        reviewCount = 900;
        amazonUrl = "https://amazon.com/product5";
        category = 4;
        featured = false;
        recommended = true;
        createdAt = Time.now();
      },
    );

    products.add(
      6,
      {
        id = 6;
        title = "Blender";
        description = "High-power blender for smoothies, shakes, and more.";
        imageUrl = "/images/blender.jpg";
        price = 5999;
        originalPrice = 7999;
        rating = 4.5;
        reviewCount = 300;
        amazonUrl = "https://amazon.com/product6";
        category = 2;
        featured = true;
        recommended = false;
        createdAt = Time.now();
      },
    );
  };
};
