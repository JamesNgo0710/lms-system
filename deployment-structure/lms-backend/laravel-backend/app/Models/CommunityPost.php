<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class CommunityPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author_id',
        'is_pinned',
        'is_locked',
        'is_hidden',
        'vote_count',
        'comment_count',
        'last_activity_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
        'is_hidden' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    protected $with = ['author'];

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(CommunityComment::class, 'post_id');
    }

    public function topLevelComments(): HasMany
    {
        return $this->hasMany(CommunityComment::class, 'post_id')
                    ->whereNull('parent_id')
                    ->orderBy('created_at', 'asc');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(CommunityVote::class, 'voteable');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(CommunityBookmark::class, 'post_id');
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(CommunityReport::class, 'reportable');
    }

    // Helper methods
    public function updateVoteCount()
    {
        $this->vote_count = $this->votes()->sum('vote_type');
        $this->save();
    }

    public function updateCommentCount()
    {
        $this->comment_count = $this->comments()->count();
        $this->save();
    }

    public function updateLastActivity()
    {
        $this->last_activity_at = now();
        $this->save();
    }

    public function getUserVote($userId)
    {
        return $this->votes()->where('user_id', $userId)->first();
    }

    public function canUserEdit($userId)
    {
        $user = User::find($userId);
        return $this->author_id === $userId || $user?->hasRole('admin');
    }

    public function canUserDelete($userId)
    {
        $user = User::find($userId);
        return $this->author_id === $userId || $user?->hasRole('admin');
    }

    // Scopes
    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('last_activity_at', 'desc');
    }
}
