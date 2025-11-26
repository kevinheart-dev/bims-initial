<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        // 🔒 Check if the user account is disabled
        if ($user->isDisabled()) {
            Auth::logout();
            return redirect()->route('login')->withErrors([
                'email' => 'Your account has been disabled. Please contact the administrator.',
            ]);
        }

        // ✅ Mark user as active on login
        $user->update(['status' => 'active']);

        // 🧾 Log the login activity
        ActivityLog::create([
            'user_id' => $user->id,
            'barangay_id' => $user->barangay_id ?? null,
            'role' => $user->getRoleNames()->first(),
            'module' => 'authentication',
            'action_type' => 'login',
            'description' => "{$user->username} logged in to the system.",
        ]);

        // 🧭 Role-based redirect
        if ($user->isSuperAdmin()) {
            return redirect()->intended(route('super_admin.dashboard', [], false));
        }

        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', [], false));
        }

        if ($user->isCdrrmo()) {
            return redirect()->intended(route('cdrrmo_admin.dashboard', [], false));
        }

        if ($user->isBarangayOfficer()) {
            return redirect()->intended(route('barangay_officer.dashboard', [], false));
        }
        if ($user->isResident()) {
            return redirect()->intended(route('resident_account.certificates', [], false));
        }

        return redirect()->intended(route('login', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if ($user) {
            // ✅ Mark user as inactive on logout
            $user->update(['status' => 'inactive']);

            // ✅ Log user logout activity
            ActivityLog::create([
                'user_id' => $user->id,
                'barangay_id' => $user->barangay_id ?? null,
                'role' => $user->getRoleNames()->first(),
                'module' => 'authentication',
                'action_type' => 'logout',
                'description' => "{$user->username} logged out of the system.",
            ]);

            // ✅ Clear CRA year if user is cdrrmo_admin
            if ($user->hasRole('cdrrmo_admin')) {
                // If you are using session storage in Laravel:
                $request->session()->forget('cra_year');

                // If you want to also clear browser sessionStorage, you need JS on logout page
                // e.g., in your logout redirect view or JS snippet:
                // <script>sessionStorage.removeItem('cra_year');</script>
            }
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
