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
            $mail->Body = "
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #222; line-height: 1.6;'>
                <h2 style='color: #1a73e8; margin-bottom: 5px;'>iBarangay Information Management System</h2>
                <p style='margin-top: 0; font-size: 14px; color:#555;'>Official Acknowledgment of Certificate Request</p>

                <p>Dear <strong>{$residentName}</strong>,</p>

                <p>We are writing to confirm that your certificate request has been successfully received by the Barangay Office. Please find the request details below for your reference:</p>

                <table style='border-collapse: collapse; margin-top: 12px; font-size: 14px;'>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Certificate Type:</td>
                        <td style='padding: 8px 12px;'>{$certificate->document->name}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Purpose:</td>
                        <td style='padding: 8px 12px;'>{$certificate->purpose}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Submission Date:</td>
                        <td style='padding: 8px 12px;'>".date('F j, Y g:i A', strtotime($certificate->created_at))."</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Current Status:</td>
                        <td style='padding: 8px 12px; text-transform: capitalize;'>{$certificate->request_status}</td>
                    </tr>
                </table>

                <br>

                <p><strong>Next Steps</strong></p>
                <p>Your request is now under evaluation by our Barangay processing team. You will receive a follow-up notification once your certificate has been reviewed and approved.</p>

                <p>Should you require immediate assistance or clarification regarding your request, you may personally visit the Barangay Office during business hours.</p>

                <br>

                <p>Thank you for using our digital services. We appreciate your cooperation in supporting a more efficient and paperless barangay process.</p>

                <br>

                <p>Sincerely,<br>
                <strong>iBarangay Information Management System</strong></p>

                <hr style='margin: 25px 0; border: 0; border-top: 1px solid #ccc;'>

                <p style='font-size: 12px; color: #777;'>
                    This is an automated system-generated email. <strong>Please do not reply to this message.</strong><br>
                    If you did not initiate this request, please contact your Barangay Office immediately for assistance.
                </p>
            </div>
            ";

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
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #222; line-height: 1.6;'>
                <h2 style='color: #1a73e8; margin-bottom: 5px;'>iBarangay Information Management System</h2>
                <p style='margin-top: 0; font-size: 14px; color:#555;'>Internal Certificate Request Notification</p>

                <p>Good day Barangay Staff,</p>

                <p>A new certificate request has been submitted through the iBarangay Information Management System. The details are provided below:</p>

                <table style='border-collapse: collapse; margin-top: 12px; font-size: 14px;'>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Request ID:</td>
                        <td style='padding: 8px 12px;'>{$certificate->id}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Resident Name:</td>
                        <td style='padding: 8px 12px;'>{$resident->firstname} {$resident->lastname}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Certificate Type:</td>
                        <td style='padding: 8px 12px;'>{$certificate->document->name}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Purpose:</td>
                        <td style='padding: 8px 12px;'>{$certificate->purpose}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Request Date:</td>
                        <td style='padding: 8px 12px;'>".date('F j, Y g:i A', strtotime($certificate->created_at))."</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Status:</td>
                        <td style='padding: 8px 12px; text-transform: capitalize;'>{$certificate->request_status}</td>
                    </tr>
                </table>

                <br>

                <p><strong>Action Required</strong></p>
                <p>Please access the Barangay Management System dashboard to review, verify, and take necessary action regarding this request.</p>

                <br>

                <p>Thank you for your prompt attention to this matter.</p>

                <br>

                <p>Regards,<br>
                <strong>iBarangay Information Management System</strong></p>

                <hr style='margin: 25px 0; border: 0; border-top: 1px solid #ccc;'>

                <p style='font-size: 12px; color: #777;'>
                    This is an automated message intended for authorized barangay personnel only.
                    <strong>Please do not reply to this email.</strong><br>
                    For system concerns, contact your system administrator.
                </p>
            </div>
            ";

            $mail->send();
            return true;

        } catch (\Exception $e) {
            \Log::error("Barangay notification email failed: " . $e->getMessage());
            return false;
        }
    }

    public function sendCertificateReadyEmail($residentEmail, $residentName, $certificate)
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

            // Optional: For local development
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
            $mail->Subject = "Your Certificate is Ready for Pickup";

            $mail->Body = "
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #222; line-height: 1.6;'>
                <h2 style='color: #1a73e8; margin-bottom: 5px;'>iBarangay Information Management System</h2>
                <p style='margin-top: 0; font-size: 14px; color:#555;'>Certificate Pickup Notification</p>

                <p>Dear <strong>{$residentName}</strong>,</p>

                <p>We are pleased to inform you that your certificate request has been successfully processed and is now ready for pickup at the Barangay Office. Below are the details of your request:</p>

                <table style='border-collapse: collapse; margin-top: 12px; font-size: 14px;'>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Certificate Type:</td>
                        <td style='padding: 8px 12px;'>{$certificate->document->name}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Purpose:</td>
                        <td style='padding: 8px 12px;'>{$certificate->purpose}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Request Date:</td>
                        <td style='padding: 8px 12px;'>".date('F j, Y g:i A', strtotime($certificate->created_at))."</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Status:</td>
                        <td style='padding: 8px 12px; text-transform: capitalize;'>Ready for Pickup</td>
                    </tr>
                </table>

                <br>

                <p><strong>Pickup Instructions</strong></p>
                <p>Please visit the Barangay Office during business hours to collect your certificate. Kindly bring a valid ID for verification.</p>

                <p>If you authorized someone to claim your certificate, ensure they bring an authorization letter and a copy of your valid ID.</p>

                <br>

                <p>Thank you for using our digital services. We are committed to ensuring a faster and more convenient barangay transaction experience.</p>

                <br>

                <p>Sincerely,<br>
                <strong>iBarangay Information Management System</strong></p>

                <hr style='margin: 25px 0; border: 0; border-top: 1px solid #ccc;'>

                <p style='font-size: 12px; color: #777;'>
                    This is an automated system-generated email. <strong>Please do not reply to this message.</strong><br>
                    For concerns, please contact your Barangay Office directly.
                </p>
            </div>
            ";

            $mail->send();
            return true;

        } catch (\Exception $e) {
            \Log::error("Certificate ready email failed: " . $e->getMessage());
            return false;
        }
    }

    public function sendCertificateDeniedEmail($residentEmail, $residentName, $certificate, $remarks = null)
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

            // Optional: For local development
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
            $mail->Subject = "Certificate Request Status: Denied";

            $reason = $remarks
            ? nl2br(htmlspecialchars($remarks))
            : "Your request could not be processed due to verification issues or incomplete information. Please visit the Barangay Office for further assistance.";

            $mail->Body = "
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #222; line-height: 1.6;'>
                <h2 style='color: #d93025; margin-bottom: 5px;'>iBarangay Information Management System</h2>
                <p style='margin-top: 0; font-size: 14px; color:#555;'>Certificate Request Update</p>

                <p>Dear <strong>{$residentName}</strong>,</p>

                <p>We regret to inform you that your certificate request has been <strong style='color:#d93025;'>denied</strong> by the Barangay Office. Below are the request details:</p>

                <table style='border-collapse: collapse; margin-top: 12px; font-size: 14px;'>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Certificate Type:</td>
                        <td style='padding: 8px 12px;'>{$certificate->document->name}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Purpose:</td>
                        <td style='padding: 8px 12px;'>{$certificate->purpose}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Request Date:</td>
                        <td style='padding: 8px 12px;'>".date('F j, Y g:i A', strtotime($certificate->created_at))."</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 12px; font-weight: bold;'>Status:</td>
                        <td style='padding: 8px 12px; text-transform: capitalize; color:#d93025;'>Denied</td>
                    </tr>
                </table>

                <br>

                <p><strong>Reason for Denial:</strong></p>
                <p style='background:#f8d7da; padding:10px; border-left:4px solid #d93025; color:#7c1616;'>
                    {$reason}
                </p>

                <p>If you believe this was a mistake or you need further clarification, you may contact the Barangay Office or visit in person during office hours.</p>

                <br>

                <p>Thank you for your understanding.</p>

                <br>

                <p>Sincerely,<br>
                <strong>iBarangay Information Management System</strong></p>

                <hr style='margin: 25px 0; border: 0; border-top: 1px solid #ccc;'>

                <p style='font-size: 12px; color: #777;'>
                    This is an automated message. <strong>Please do not reply.</strong><br>
                    For concerns regarding this request, contact your Barangay Office.
                </p>
            </div>
            ";

            $mail->send();
            return true;

        } catch (\Exception $e) {
            \Log::error("Certificate denied email failed: " . $e->getMessage());
            return false;
        }
    }
}
