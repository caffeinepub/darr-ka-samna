import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { MessageSquare, Send, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useComments, useAddComment } from '../hooks/useComments';
import type { Comment } from '../backend';

interface CommentsSectionProps {
  storyId: bigint;
}

export function CommentsSection({ storyId }: CommentsSectionProps) {
  const [commentText, setCommentText] = useState('');
  const { identity, login } = useInternetIdentity();
  const { data: comments = [], isLoading } = useComments(storyId);
  const addCommentMutation = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !commentText.trim()) return;

    const userId = identity.getPrincipal().toString();
    await addCommentMutation.mutateAsync({
      storyId,
      userId,
      content: commentText.trim(),
    });
    setCommentText('');
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive font-creepster">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {identity ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Share your thoughts on this horror story..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[100px] bg-background/50 border-destructive/20 focus:border-destructive resize-none"
            />
            <Button
              type="submit"
              disabled={!commentText.trim() || addCommentMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              <Send className="h-4 w-4 mr-2" />
              {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4">
            <p className="text-muted-foreground">Sign in to share your thoughts</p>
            <Button onClick={login} variant="outline" className="border-destructive/30 hover:bg-destructive/10">
              Sign In to Comment
            </Button>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            <Separator className="bg-border/50" />
            {comments.map((comment, index) => (
              <CommentItem key={index} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const date = new Date(Number(comment.timestamp) / 1000000);
  const userInitial = comment.userId.charAt(0).toUpperCase();

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10 border-2 border-destructive/30">
        <AvatarFallback className="bg-destructive/10 text-destructive">
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground/80">
            {comment.userId.slice(0, 8)}...
          </span>
          <span className="text-xs text-muted-foreground">{date.toLocaleString()}</span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
}
