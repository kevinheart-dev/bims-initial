<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
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

        // Check if the user account is disabled
        if ($user->isDisabled()) {
            Auth::logout(); // log them out just in case
            return redirect()->route('login')->withErrors([
                'email' => 'Your account has been disabled. Please contact the administrator.',
            ]);
        }

        if ($user->isSuperAdmin()) {
            return redirect()->intended(route('super_admin.dashboard', [], false));
        }

        if ($user->isCdrrmo()) {
            return redirect()->intended(route('cdrrmo_admin.dashboard', [], false));
        }

        if ($user->isBarangayOfficer()) {
            return redirect()->intended(route('barangay_officer.dashboard', [], false));
        }

        // Check if the user is a resident
        if ($user->isResident()) {
            return redirect()->intended(route('resident_account.dashboard', [], false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
