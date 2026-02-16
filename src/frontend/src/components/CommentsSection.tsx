import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { MessageSquare, Send, User } from 'lucide-react';
import { useComments, useAddComment } from '../hooks/useComments';
import type { Comment } from '../backend';

interface CommentsSectionProps {
  storyId: bigint;
}

export function CommentsSection({ storyId }: CommentsSectionProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { data: comments = [], isLoading } = useComments(storyId);
  const addCommentMutation = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) return;

    try {
      await addCommentMutation.mutateAsync({
        storyId,
        name: trimmedName,
        message: trimmedMessage,
      });
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive font-creepster text-xl md:text-2xl">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Your Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background/50 border-destructive/20 focus:border-destructive"
              disabled={addCommentMutation.isPending}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Your Comment <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Share your thoughts on this horror story..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] bg-background/50 border-destructive/20 focus:border-destructive resize-none"
              disabled={addCommentMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || !message.trim() || addCommentMutation.isPending}
            className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
          >
            <Send className="h-4 w-4 mr-2" />
            {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>

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
  const userInitial = comment.name.charAt(0).toUpperCase();

  return (
    <div className="flex gap-3 sm:gap-4">
      <Avatar className="h-10 w-10 border-2 border-destructive/30 flex-shrink-0">
        <AvatarFallback className="bg-destructive/10 text-destructive text-sm">
          {userInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="text-sm font-medium text-foreground/90 truncate">
            {comment.name}
          </span>
          <span className="text-xs text-muted-foreground">{date.toLocaleString()}</span>
        </div>
        <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{comment.message}</p>
      </div>
    </div>
  );
}
