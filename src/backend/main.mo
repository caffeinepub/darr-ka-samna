import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
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

  // Logo Storage Types
  type Logo = {
    data : Blob;
    contentType : Text;
  };

  var siteLogo : ?Logo = null;

  // Logo Management Functions
  public shared ({ caller }) func uploadLogo(logoData : Blob, contentType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload the site logo");
    };
    siteLogo := ?{
      data = logoData;
      contentType = contentType;
    };
  };

  public query func getLogo() : async ?Logo {
    // Public access - anyone can view the site logo
    siteLogo;
  };

  public shared ({ caller }) func deleteLogo() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete the site logo");
    };
    siteLogo := null;
  };

  // Story Types
  type StoryCategory = {
    #indianHorror;
    #hauntedPlaces;
    #trueStories;
    #psychologicalHorror;
  };

  type Story = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : StoryCategory;
    timestamp : Time.Time;
  };

  type Comment = {
    userId : Text;
    content : Text;
    storyId : Nat;
    timestamp : Time.Time;
  };

  module Story {
    public func compare(story1 : Story, story2 : Story) : Order.Order {
      Int.compare(story2.timestamp, story1.timestamp);
    };
  };

  var nextStoryId = 0;
  let stories = Map.empty<Nat, Story>();
  let comments = Map.empty<Nat, [Comment]>();

  // Story Management Functions
  public shared ({ caller }) func addStory(title : Text, excerpt : Text, content : Text, category : StoryCategory) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add stories");
    };
    let storyId = nextStoryId;
    let story : Story = {
      id = storyId;
      title;
      excerpt;
      content;
      category;
      timestamp = Time.now();
    };
    stories.add(storyId, story);

    nextStoryId += 1;
    storyId;
  };

  public query func getStory(id : Nat) : async Story {
    // Public access - anyone can read stories
    switch (stories.get(id)) {
      case (null) { Runtime.trap("Story not found") };
      case (?story) { story };
    };
  };

  public query func getStoriesByCategory(category : StoryCategory) : async [Story] {
    // Public access - anyone can browse stories by category
    stories.values().toArray().filter(
      func(s) {
        s.category == category;
      }
    );
  };

  public query func searchStories(queryText : Text) : async [Story] {
    // Public access - anyone can search stories
    let lowerQuery = queryText.toLower();
    stories.values().toArray().filter(
      func(s) {
        s.title.toLower().contains(#text lowerQuery) or s.excerpt.toLower().contains(#text lowerQuery);
      }
    );
  };

  public query func getLatestStories(limit : Nat) : async [Story] {
    // Public access - anyone can view latest stories
    let allStories = stories.values().toArray().sort();
    let len = allStories.size();
    let sliceEnd = if (len > limit) { limit } else { len };
    allStories.sliceToArray(0, sliceEnd);
  };

  // Comment Functions
  public shared ({ caller }) func addComment(storyId : Nat, userId : Text, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    switch (stories.get(storyId)) {
      case (null) { Runtime.trap("Cannot comment on non-existent story") };
      case (?_) {
        let comment : Comment = {
          userId;
          content;
          storyId;
          timestamp = Time.now();
        };
        let storyComments = switch (comments.get(storyId)) {
          case (null) { [comment] };
          case (?existing) { existing.concat([comment]) };
        };
        comments.add(storyId, storyComments);
      };
    };
  };

  public query func getComments(storyId : Nat) : async [Comment] {
    // Public access - anyone can read comments
    switch (comments.get(storyId)) {
      case (null) { [] };
      case (?storyComments) { storyComments };
    };
  };

  // User Preferences
  public shared ({ caller }) func toggleNightMode(_userId : Text, nightModeEnabled : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle night mode");
    };
    nightModeEnabled;
  };
};
