<?php

namespace App\Http\Controllers;

use Exception;
use PHPMailer\PHPMailer\PHPMailer;

class EmailController extends Controller
{
    public function sendPHPMailerEmail()
    {
        try {
            // === 1️⃣ First: Try SSL (Port 465) ===
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
            $mail->Port       = 465;

            // Disable peer verification for local dev (important!)
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ];

            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
            $mail->addAddress('johnxedricalejo07@gmail.com', 'John Alejo');

            $mail->isHTML(true);
            $mail->Subject = 'Test Email via PHPMailer (SSL)';
            $mail->Body    = '<h3>Hello!</h3><p>This email was sent using <b>PHPMailer</b> with Gmail SMTP (SSL).</p>';

            $mail->send();
            return '✅ Email sent successfully via PHPMailer (SSL)!';

        } catch (Exception $e1) {
            try {
                // === 2️⃣ Fallback: Try STARTTLS (Port 587) ===
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
                $mail->SMTPAuth   = true;
                $mail->Username   = env('MAIL_USERNAME');
                $mail->Password   = env('MAIL_PASSWORD');
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // TLS
                $mail->Port       = 587;

                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true,
                    ],
                ];

                $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'));
                $mail->addAddress('johnxedricalejo07@gmail.com', 'John Alejo');

                $mail->isHTML(true);
                $mail->Subject = 'Test Email via PHPMailer (TLS Fallback)';
                $mail->Body    = '<h3>Hello again!</h3><p>This email was sent using <b>PHPMailer</b> fallback via STARTTLS (587).</p>';

                $mail->send();
                return '✅ Email sent successfully via PHPMailer (TLS Fallback)!';

            } catch (Exception $e2) {
                return "❌ Email could not be sent.<br>SSL Error: {$e1->getMessage()}<br><br>TLS Error: {$e2->getMessage()}";
            }
        }
    }

    // In EmailController.php
    public function sendCertificateRequestEmail($residentEmail, $residentName, $certificate)
    {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Optional: For local dev
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ];

            $mail->setFrom(config('mail.from.address'), config('mail.from.name'));
            $mail->addAddress($residentEmail, $residentName);

            $mail->isHTML(true);
            $mail->Subject = "Certificate Request Submitted";
            $mail->Body    = "<h3>Hello {$residentName},</h3>
                            <p>Your request for the certificate (ID: {$certificate->id}) has been submitted successfully.</p>
                            <p>Status: {$certificate->request_status}</p>
                            <p>We will notify you once it is processed.</p>";

            $mail->send();
            return true;

        } catch (\Exception $e) {
            \Log::error("Certificate request email failed: " . $e->getMessage());
            return false;
        }
    }

    public function sendBarangayCertificateNotification($barangayEmail, $resident, $certificate)
    {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Optional: For local dev
            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ],
            ];

            $mail->setFrom(config('mail.from.address'), config('mail.from.name'));
            $mail->addAddress($barangayEmail, 'Barangay Office');

            $mail->isHTML(true);
            $mail->Subject = "New Certificate Request Submitted";
            $mail->Body = "
                <h3>New Certificate Request</h3>
                <p>Resident: {$resident->firstname} {$resident->lastname}</p>
                <p>Certificate ID: {$certificate->id}</p>
                <p>Purpose: {$certificate->purpose}</p>
                <p>Status: {$certificate->request_status}</p>
                <p>Please process this request accordingly.</p>
            ";

            $mail->send();
            return true;

        } catch (\Exception $e) {
            \Log::error("Barangay notification email failed: " . $e->getMessage());
            return false;
        }
    }



}
