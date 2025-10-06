
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";

export type Comment = {
  author: string;
  text: string;
};

type CommentSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comments: Comment[];
  commentCount: number;
  onPostComment: (commentText: string) => void;
};

export function CommentSheet({
  isOpen,
  onOpenChange,
  comments,
  commentCount,
  onPostComment,
}: CommentSheetProps) {
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (newComment.trim()) {
      onPostComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] flex flex-col rounded-t-2xl"
      >
        <SheetHeader className="text-center pb-4">
          <SheetTitle>{commentCount} Comments</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-6 p-4">
          {comments.map((comment, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://github.com/${comment.author.toLowerCase()}.png`}
                />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{comment.author}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 border-t bg-background p-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/user.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Input
            placeholder="Add a comment..."
            className="flex-1 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
          />
          <Button onClick={handlePostComment} disabled={!newComment.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
