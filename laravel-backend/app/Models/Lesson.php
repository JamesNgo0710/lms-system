<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'title',
        'description',
        'duration',
        'difficulty',
        'video_url',
        'prerequisites',
        'content',
        'social_links',
        'downloads',
        'order',
        'status',
        'image',
    ];

    protected $casts = [
        'prerequisites' => 'array',
        'social_links' => 'array',
        'downloads' => 'array',
        'order' => 'integer',
        'topic_id' => 'integer',
    ];

    // Relationships
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function completions()
    {
        return $this->hasMany(LessonCompletion::class);
    }

    public function views()
    {
        return $this->hasMany(LessonView::class);
    }

    // Check if lesson is completed by a specific user
    public function isCompletedBy($userId)
    {
        return $this->completions()->where('user_id', $userId)->exists();
    }

    // Get completion for a specific user
    public function getCompletionFor($userId)
    {
        return $this->completions()->where('user_id', $userId)->first();
    }
}
