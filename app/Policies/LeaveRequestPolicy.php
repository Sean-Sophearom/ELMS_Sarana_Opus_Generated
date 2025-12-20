<?php

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->id === $leaveRequest->user_id
            || $user->isAdmin()
            || ($user->isManager() && $leaveRequest->user->manager_id === $user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->id === $leaveRequest->user_id && $leaveRequest->isPending();
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->id === $leaveRequest->user_id && $leaveRequest->canBeCancelled();
    }

    /**
     * Determine whether the user can approve the model.
     */
    public function approve(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->canApprove($leaveRequest);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->isAdmin();
    }
}
