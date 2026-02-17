<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Notifications\TwoFactorCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{
    /**
     * Show the two-factor challenge view.
     */
    public function create(): Response|RedirectResponse
    {
        if (!session('2fa:user:id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge', [
            'email' => session('2fa:user:email'),
        ]);
    }

    /**
     * Verify the two-factor authentication code.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $userId = session('2fa:user:id');
        
        if (!$userId) {
            return redirect()->route('login')->withErrors([
                'code' => 'Session expired. Please log in again.',
            ]);
        }

        $user = \App\Models\User::find($userId);

        if (!$user || !$user->validateTwoFactorCode($request->code)) {
            return back()->withErrors([
                'code' => 'The provided code is invalid or has expired.',
            ]);
        }

        // Reset the two-factor code
        $user->resetTwoFactorCode();

        // Clear the 2FA session data
        session()->forget(['2fa:user:id', '2fa:user:email']);

        // Log the user in
        Auth::login($user, session('2fa:remember', false));
        session()->forget('2fa:remember');

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Resend the two-factor authentication code.
     */
    public function resend(Request $request): RedirectResponse
    {
        $userId = session('2fa:user:id');
        
        if (!$userId) {
            return redirect()->route('login')->withErrors([
                'code' => 'Session expired. Please log in again.',
            ]);
        }

        $user = \App\Models\User::find($userId);

        if (!$user) {
            return redirect()->route('login');
        }

        // Generate a new code and send it
        $code = $user->generateTwoFactorCode();
        $user->notify(new TwoFactorCode($code));

        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}
