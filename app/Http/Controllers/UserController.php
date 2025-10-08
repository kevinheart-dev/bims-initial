<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAccountRequest;
use App\Http\Requests\UpdateUserAccountRequest;
use App\Models\Resident;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $brgy_id = auth()->user()->barangay_id;

        $query = User::with([
                'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
            ])
            ->whereHas('resident', function ($q) use ($brgy_id) {
                $q->where('barangay_id', $brgy_id);
            })
            ->where('role', 'resident')
            ->select('id', 'resident_id', 'username', 'email', 'status', 'is_disabled', 'created_at', 'updated_at');

        // ✅ Apply filters if present
        if ($request->filled('session_status') && $request->session_status !== 'All') {
            $query->where('status', $request->session_status);
        }

        if ($request->filled('account_status') && $request->account_status !== 'All') {
            $query->where('is_disabled', $request->account_status); // 1 = enabled, 0 = disabled
        }

        if ($request->filled('name')) {
            $name = $request->name;
            $query->whereHas('resident', function ($q) use ($name) {
                $q->where('firstname', 'like', "%{$name}%")
                ->orWhere('lastname', 'like', "%{$name}%")
                ->orWhere('middlename', 'like', "%{$name}%");
            });
        }

        $users = $query->paginate(10)->withQueryString();

        $residents = Resident::where('barangay_id', $brgy_id)
            ->whereDoesntHave('user')
            ->select(
                'id',
                'firstname',
                'lastname',
                'middlename',
                'suffix',
                'resident_picture_path',
                'purok_number',
                'birthdate',
                'sex'
            )
            ->get();

        return Inertia::render('BarangayOfficer/Account/Index', [
            'accounts' => $users,
            'queryParams' => $request->query() ?: null,
            'residents' => $residents,
        ]);
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
    public function store(StoreUserAccountRequest $request)
    {
        $data = $request->validated();
        try {
            $user = User::create([
                'resident_id' => $data['resident_id'],
                'barangay_id' => auth()->user()->barangay_id, // optional: assign current user's barangay
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
                'role' => 'resident', // default role
                'status' => 'inactive',
                'is_disabled' => false,
            ]);
            $residentRole = Role::firstOrCreate(['name' => 'resident']);
            $user->assignRole($residentRole);

            return redirect()
                ->route('user.index')
                ->with('success', 'User account created successfully!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'User account could not be created: ' . $e->getMessage());
        }
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
    public function update(UpdateUserAccountRequest $request, User $user)
    {
        $data = $request->validated();
        try {
            $user->update([
                'username' => $data['username'],
                'email' => $data['email'],
            ]);

            return redirect()->route('user.index')->with('success', 'User account updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'User account could not be updated: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete(); // use soft delete if applicable

            return back()->with('success', 'User account deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete user account.');
        }
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
    public function accountDetails($id)
    {
        try {
            // Load user with resident relation
            $user = User::with('resident:id,firstname,lastname,middlename,resident_picture_path,sex,birthdate,purok_number')->findOrFail($id);

            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User account not found or could not be retrieved.',
                'message' => $e->getMessage()
            ], 404);
        }
    }
    public function toggleAccount(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'is_disabled' => 'required|boolean',
            ]);

            $user->is_disabled = $validated['is_disabled'];
            $user->save();

            return response()->json([
                'success' => true,
                'message' => $user->is_disabled
                    ? 'Account has been disabled.'
                    : 'Account has been enabled.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle account.',
                'error'   => $e->getMessage(), // optional: remove in production
            ], 500);
        }
    }
}
