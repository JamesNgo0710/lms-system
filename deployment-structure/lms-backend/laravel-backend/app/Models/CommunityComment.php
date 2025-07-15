<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class CommunityComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'author_id',
        'post_id',
        'parent_id',
        'is_hidden',
        'vote_count',
        'depth',
    ];

    protected $casts = [
        'is_hidden' => 'boolean',
    ];

    protected $with = ['author'];

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(CommunityPost::class, 'post_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(CommunityComment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(CommunityComment::class, 'parent_id')
                    ->orderBy('created_at', 'asc');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(CommunityVote::class, 'voteable');
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

    public function setDepth()
    {
        if ($this->parent_id) {
            $parent = $this->parent;
            $this->depth = $parent->depth + 1;
        } else {
            $this->depth = 0;
        }
        $this->save();
    }

    // Update post activity when comment is created
    protected static function boot()
    {
        parent::boot();

        static::created(function ($comment) {
            $comment->post->updateCommentCount();
            $comment->post->updateLastActivity();
            $comment->setDepth();
        });

        static::deleted(function ($comment) {
            $comment->post->updateCommentCount();
        });
    }

    // Scopes
    public function scopeVisible($query)
    {
        return $query->where('is_hidden', false);
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }
}
