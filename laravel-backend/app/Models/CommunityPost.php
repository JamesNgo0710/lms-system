<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author_id',
        'category',
        'tags',
        'views',
        'likes',
        'is_answered',
        'is_pinned',
        'status',
        'reply_count',
    ];

    protected $casts = [
        'author_id' => 'integer',
        'tags' => 'array',
        'views' => 'integer',
        'likes' => 'integer',
        'is_answered' => 'boolean',
        'is_pinned' => 'boolean',
        'reply_count' => 'integer',
    ];

    // Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function replies()
    {
        return $this->hasMany(CommunityReply::class, 'post_id');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    // Check if user has liked this post
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

    // Update reply count
    public function updateReplyCount()
    {
        $this->update(['reply_count' => $this->replies()->count()]);
    }
}
