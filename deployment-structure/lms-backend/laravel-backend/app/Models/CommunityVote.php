<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CommunityVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'voteable_type',
        'voteable_id',
        'vote_type',
    ];

    const UPVOTE = 1;
    const DOWNVOTE = -1;

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function voteable(): MorphTo
    {
        return $this->morphTo();
    }

    // Helper methods
    public function isUpvote(): bool
    {
        return $this->vote_type === self::UPVOTE;
    }

    public function isDownvote(): bool
    {
        return $this->vote_type === self::DOWNVOTE;
    }

    // Update vote counts when vote is created/updated/deleted
    protected static function boot()
    {
        parent::boot();

        static::created(function ($vote) {
            $vote->voteable->updateVoteCount();
        });

        static::updated(function ($vote) {
            $vote->voteable->updateVoteCount();
        });

        static::deleted(function ($vote) {
            $vote->voteable->updateVoteCount();
        });
    }
}
