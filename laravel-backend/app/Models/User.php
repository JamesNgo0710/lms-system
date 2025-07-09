<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'profile_image',
        'joined_date',
        'completed_topics',
        'total_topics',
        'weekly_hours',
        'this_week_hours',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'joined_date' => 'date',
        ];
    }

    protected $appends = ['name', 'role'];

    public function getNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getRoleAttribute()
    {
        return $this->roles->first()?->name ?? 'student';
    }

    // LMS Relationships
    public function lessonCompletions()
    {
        return $this->hasMany(LessonCompletion::class);
    }

    public function lessonViews()
    {
        return $this->hasMany(LessonView::class);
    }

    public function assessmentAttempts()
    {
        return $this->hasMany(AssessmentAttempt::class);
    }

    public function communityPosts()
    {
        return $this->hasMany(CommunityPost::class, 'author_id');
    }

    public function communityReplies()
    {
        return $this->hasMany(CommunityReply::class, 'author_id');
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    // Helper methods
    public function hasCompletedLesson($lessonId)
    {
        return $this->lessonCompletions()->where('lesson_id', $lessonId)->exists();
    }

    public function hasViewedLesson($lessonId)
    {
        return $this->lessonViews()->where('lesson_id', $lessonId)->exists();
    }

    public function getTopicProgress($topicId)
    {
        $totalLessons = Lesson::where('topic_id', $topicId)->count();
        $completedLessons = $this->lessonCompletions()->where('topic_id', $topicId)->count();

        return [
            'completed' => $completedLessons,
            'total' => $totalLessons,
            'percentage' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0
        ];
    }

    public function canTakeAssessment($assessmentId)
    {
        $assessment = Assessment::find($assessmentId);
        return $assessment ? $assessment->canUserTake($this->id) : ['can_take' => false];
    }
}
