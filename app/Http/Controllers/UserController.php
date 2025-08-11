<?php

namespace App\Http\Controllers;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }

    public function confirmPassword(Request $request)
    {
        $data = $request->validate([
            'id' => ['required'],
            'password' => ['required', 'min:5']
        ]);

        if (!Hash::check($data['password'], Auth::user()->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password is incorrect!'
            ], 422);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Password confirmed!'
        ]);
    }
}
