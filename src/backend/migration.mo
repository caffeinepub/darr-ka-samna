import Map "mo:core/Map";
import Time "mo:core/Time";
import Blob "mo:core/Blob";

module {
  public type OldStoryCategory = {
    #indianHorror;
    #hauntedPlaces;
    #trueStories;
    #psychologicalHorror;
  };

  public type OldStory = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : OldStoryCategory;
    timestamp : Time.Time;
  };

  public type NewLogo = {
    data : Blob;
    contentType : Text;
  };

  public type NewStoryCategory = {
    #indianHorror;
    #hauntedPlaces;
    #trueStories;
    #psychologicalHorror;
  };

  public type NewStory = {
    id : Nat;
    title : Text;
    excerpt : Text;
    content : Text;
    category : NewStoryCategory;
    timestamp : Time.Time;
    youtubeUrl : ?Text;
    thumbnail : ?NewLogo;
  };

  public func run(old : { stories : Map.Map<Nat, OldStory> }) : { stories : Map.Map<Nat, NewStory> } {
    let newStories = old.stories.map<Nat, OldStory, NewStory>(
      func(_id, oldStory) {
        {
          oldStory with
          youtubeUrl = null; // Old stories start without a YouTube URL
          thumbnail = null; // Old stories start without a thumbnail
        };
      }
    );
    { stories = newStories };
  };
};
