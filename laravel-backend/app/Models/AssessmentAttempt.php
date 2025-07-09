<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assessment_id',
        'topic_id',
        'score',
        'correct_answers',
        'total_questions',
        'time_spent',
        'answers',
        'completed_at',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'assessment_id' => 'integer',
        'topic_id' => 'integer',
        'score' => 'decimal:2',
        'correct_answers' => 'integer',
        'total_questions' => 'integer',
        'time_spent' => 'integer',
        'answers' => 'array',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }
}
