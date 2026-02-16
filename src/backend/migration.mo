import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  type StoryCategory = {
    #indianHorror;
    #hauntedPlaces;
    #trueStories;
    #psychologicalHorror;
  };

  type Logo = {
    data : Blob;
    contentType : Text;
  };

  type OldStory = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : StoryCategory;
    timestamp : Time.Time;
    youtubeUrl : ?Text;
    thumbnail : ?Logo;
  };

  type OldComment = {
    userId : Text;
    content : Text;
    storyId : Nat;
    timestamp : Time.Time;
  };

  type OldActor = {
    nextStoryId : Nat;
    stories : Map.Map<Nat, OldStory>;
    comments : Map.Map<Nat, [OldComment]>;
  };

  type NewStory = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : StoryCategory;
    timestamp : Time.Time;
    youtubeUrl : ?Text;
    thumbnail : ?Logo;
    viewCount : Nat;
  };

  type NewComment = {
    name : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type NewActor = {
    nextStoryId : Nat;
    stories : Map.Map<Nat, NewStory>;
    comments : Map.Map<Nat, [NewComment]>;
    followerCount : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newStories = old.stories.map<Nat, OldStory, NewStory>(
      func(_id, oldStory) {
        { oldStory with viewCount = 0 };
      }
    );

    let newComments = old.comments.map<Nat, [OldComment], [NewComment]>(
      func(_id, oldComments) {
        oldComments.map(
          func(oldComment) {
            {
              name = oldComment.userId;
              message = oldComment.content;
              timestamp = oldComment.timestamp;
            };
          }
        );
      }
    );

    {
      old with
      stories = newStories;
      comments = newComments;
      followerCount = 0;
    };
  };
};
