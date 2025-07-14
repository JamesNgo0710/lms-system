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
        'bio',
        'phone',
        'location',
        'skills',
        'interests',
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

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->joined_date)) {
                $user->joined_date = now();
            }
        });
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

    public function communityComments()
    {
        return $this->hasMany(CommunityComment::class, 'author_id');
    }

    public function communityVotes()
    {
        return $this->hasMany(CommunityVote::class);
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('earned_at')
            ->withTimestamps();
    }

    public function userAchievements()
    {
        return $this->hasMany(UserAchievement::class);
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
