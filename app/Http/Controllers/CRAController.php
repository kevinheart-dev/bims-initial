<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CRAController extends Controller
{
    public function index()
    {
        dd('yes');
    }
    public function create()
    {
        // here to code kvin ramos
        return Inertia::render("BarangayOfficer/CRA/Create");
    }
}
