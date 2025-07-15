<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'topic_id',
        'total_questions',
        'time_limit',
        'retake_period',
        'cooldown_period',
    ];

    protected $casts = [
        'topic_id' => 'integer',
        'total_questions' => 'integer',
        'cooldown_period' => 'integer',
    ];

    // Relationships
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function attempts()
    {
        return $this->hasMany(AssessmentAttempt::class);
    }

    // Check if user can take assessment (cooldown logic)
    public function canUserTake($userId)
    {
        $lastAttempt = $this->attempts()
            ->where('user_id', $userId)
            ->latest('completed_at')
            ->first();

        if (!$lastAttempt) {
            return ['can_take' => true];
        }

        $cooldownEnd = $lastAttempt->completed_at->addHours($this->cooldown_period);
        $now = now();

        if ($now >= $cooldownEnd) {
            return ['can_take' => true];
        }

        return [
            'can_take' => false,
            'time_remaining' => $cooldownEnd->diffInSeconds($now),
            'message' => 'Cooldown period active'
        ];
    }
}
