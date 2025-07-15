<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'status',
        'students',
        'lessons',
        'has_assessment',
        'difficulty',
        'description',
        'image',
    ];

    protected $casts = [
        'has_assessment' => 'boolean',
        'students' => 'integer',
        'lessons' => 'integer',
    ];

    // Relationships
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

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

    // Calculated attributes
    public function getStudentCountAttribute()
    {
        return $this->lessonViews()->distinct('user_id')->count();
    }

    public function getLessonCountAttribute()
    {
        return $this->lessons()->count();
    }
}
