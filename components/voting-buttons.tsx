'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CommunityService, type CommunityVote } from '@/lib/services/community.service';
import { cn } from '@/lib/utils';

interface VotingButtonsProps {
  type: 'post' | 'comment';
  itemId: number;
  voteCount: number;
  userVote?: CommunityVote;
  onVoteChange?: (newVoteCount: number, newUserVote?: CommunityVote) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'vertical' | 'horizontal';
  showCount?: boolean;
  className?: string;
}

export function VotingButtons({
  type,
  itemId,
  voteCount,
  userVote,
  onVoteChange,
  disabled = false,
  size = 'md',
  orientation = 'vertical',
  showCount = true,
  className
}: VotingButtonsProps) {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 1 | -1) => {
    if (disabled || isVoting) return;

    setIsVoting(true);
    try {
      await CommunityService.vote({
        voteable_type: type,
        voteable_id: itemId,
        vote_type: voteType
      });

      // Calculate new vote count and user vote
      const currentUserVote = userVote;
      let newVoteCount = voteCount;
      
      // Remove previous vote effect
      if (currentUserVote) {
        newVoteCount -= currentUserVote.vote_type;
      }
      
      // Add new vote effect or remove if same vote
      let newUserVote: CommunityVote | undefined;
      if (!currentUserVote || currentUserVote.vote_type !== voteType) {
        newVoteCount += voteType;
        newUserVote = {
          ...currentUserVote,
          vote_type: voteType
        } as CommunityVote;
      } else {
        // Same vote - remove it
        newUserVote = undefined;
      }

      if (onVoteChange) {
        onVoteChange(newVoteCount, newUserVote);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'h-6 w-6 p-0',
          icon: 'w-3 h-3',
          text: 'text-xs'
        };
      case 'lg':
        return {
          button: 'h-10 w-10 p-0',
          icon: 'w-5 h-5',
          text: 'text-base'
        };
      default:
        return {
          button: 'h-8 w-8 p-0',
          icon: 'w-4 h-4',
          text: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  
  const isUpvoted = userVote?.vote_type === 1;
  const isDownvoted = userVote?.vote_type === -1;

  const containerClasses = cn(
    "flex items-center gap-1",
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
    className
  );

  return (
    <div className={containerClasses}>
      <Button
        variant={isUpvoted ? "default" : "ghost"}
        size="sm"
        onClick={() => handleVote(1)}
        disabled={disabled || isVoting}
        className={cn(
          sizeClasses.button,
          isUpvoted && "bg-green-600 hover:bg-green-700 text-white"
        )}
        title="Upvote"
      >
        <ChevronUp className={sizeClasses.icon} />
      </Button>
      
      {showCount && (
        <span className={cn(
          "font-semibold select-none",
          sizeClasses.text,
          voteCount > 0 && "text-green-600",
          voteCount < 0 && "text-red-600"
        )}>
          {voteCount}
        </span>
      )}
      
      <Button
        variant={isDownvoted ? "default" : "ghost"}
        size="sm"
        onClick={() => handleVote(-1)}
        disabled={disabled || isVoting}
        className={cn(
          sizeClasses.button,
          isDownvoted && "bg-red-600 hover:bg-red-700 text-white"
        )}
        title="Downvote"
      >
        <ChevronDown className={sizeClasses.icon} />
      </Button>
    </div>
  );
} 