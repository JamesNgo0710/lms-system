<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'author_id',
        'content',
        'likes',
        'is_accepted_answer',
        'parent_reply_id',
    ];

    protected $casts = [
        'post_id' => 'integer',
        'author_id' => 'integer',
        'likes' => 'integer',
        'is_accepted_answer' => 'boolean',
        'parent_reply_id' => 'integer',
    ];

    // Relationships
    public function post()
    {
        return $this->belongsTo(CommunityPost::class, 'post_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function parentReply()
    {
        return $this->belongsTo(CommunityReply::class, 'parent_reply_id');
    }

    public function childReplies()
    {
        return $this->hasMany(CommunityReply::class, 'parent_reply_id');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    // Check if user has liked this reply
    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    // Toggle like for a user
    public function toggleLike($userId)
    {
        $existingLike = $this->likes()->where('user_id', $userId)->first();

        if ($existingLike) {
            $existingLike->delete();
            $this->decrement('likes');
            return false; // unliked
        } else {
            $this->likes()->create(['user_id' => $userId]);
            $this->increment('likes');
            return true; // liked
        }
    }

    // Mark as accepted answer
    public function markAsAccepted()
    {
        // Unmark other replies in the same post
        $this->post->replies()->update(['is_accepted_answer' => false]);

        // Mark this reply as accepted
        $this->update(['is_accepted_answer' => true]);

        // Mark post as answered
        $this->post->update(['is_answered' => true]);
    }
}
