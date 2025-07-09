<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'type',
        'question',
        'options',
        'correct_answer',
        'image',
        'order',
    ];

    protected $casts = [
        'assessment_id' => 'integer',
        'options' => 'array',
        'order' => 'integer',
    ];

    // Relationships
    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
