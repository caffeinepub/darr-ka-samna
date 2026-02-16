import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

actor {
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

  public shared ({ caller }) func addStory(title : Text, excerpt : Text, content : Text, category : StoryCategory) : async Nat {
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

  public query ({ caller }) func getStory(id : Nat) : async Story {
    switch (stories.get(id)) {
      case (null) { Runtime.trap("Story not found") };
      case (?story) { story };
    };
  };

  public query ({ caller }) func getStoriesByCategory(category : StoryCategory) : async [Story] {
    stories.values().toArray().filter(
      func(s) {
        s.category == category;
      }
    );
  };

  public query ({ caller }) func searchStories(queryText : Text) : async [Story] {
    let lowerQuery = queryText.toLower();
    stories.values().toArray().filter(
      func(s) {
        s.title.toLower().contains(#text lowerQuery) or s.excerpt.toLower().contains(#text lowerQuery);
      }
    );
  };

  public query ({ caller }) func getLatestStories(limit : Nat) : async [Story] {
    let allStories = stories.values().toArray().sort();
    let len = allStories.size();
    let sliceEnd = if (len > limit) { limit } else { len };
    allStories.sliceToArray(0, sliceEnd);
  };

  public shared ({ caller }) func addComment(storyId : Nat, userId : Text, content : Text) : async () {
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

  public query ({ caller }) func getComments(storyId : Nat) : async [Comment] {
    switch (comments.get(storyId)) {
      case (null) { [] };
      case (?storyComments) { storyComments };
    };
  };

  public shared ({ caller }) func toggleNightMode(_userId : Text, nightModeEnabled : Bool) : async Bool {
    nightModeEnabled;
  };
};
