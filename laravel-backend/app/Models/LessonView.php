<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonView extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'topic_id',
        'duration',
        'viewed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'lesson_id' => 'integer',
        'topic_id' => 'integer',
        'duration' => 'integer',
        'viewed_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}
