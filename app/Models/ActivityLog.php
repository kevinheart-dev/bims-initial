<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'barangay_id',
        'role',
        'module',
        'action_type',
        'description',
    ];

    /**
     * The user who performed the action.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The barangay associated with the activity.
     */
    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }
}
