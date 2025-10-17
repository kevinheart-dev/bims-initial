<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function welcomeEmail(){
        Mail::to('johnxedricalejo07@gmail.com')->send(new WelcomeEmail());

        return 'email sent successfull';
    }
}
