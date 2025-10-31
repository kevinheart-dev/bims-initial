<!DOCTYPE html>
<html>
<head>
<title>Resident Information Sheet - {{ $barangayName ?? 'N/A' }}</title>
<style>
    @page { margin: 5mm; } /* Significantly reduced page margin */
    body {
        font-family: Arial, sans-serif;
        font-size: 10.5px; /* Slightly reduced base font size */
        margin: 0; /* Removed body margin to prevent pushing content */
        line-height: 1.1; /* Reduced line height for tighter packing */
    }

    /* --- HEADER STYLES --- */
    .header-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 8px; /* Reduced margin */
    }
    .header-table td {
        padding: 0;
    }
    .header-table .center-text {
        text-align: center;
        line-height: 1.2; /* Reduced line height */
        padding-top: 3px; /* Reduced padding */
        font-size: 11.5px; /* Slightly reduced font size */
    }
    .header-table .logo {
        width: 80px; /* Slightly reduced logo size */
        height: auto;
        display: block;
        margin: 0 auto;
    }
    .header-table .logo-cell {
        width: 15%;
        text-align: center;
        vertical-align: middle;
    }
    .header-table .main-header-text {
        width: 70%;
    }
    .header-underline-text {
        text-decoration: underline;
        display: inline-block;
        font-weight: bold;
    }


    /* --- SECTION TITLE STYLES --- */
    .section-title {
        font-weight: bold;
        background: #e6e6e6;
        padding: 3px; /* Reduced padding */
        margin-top: 8px; /* Reduced margin */
        border: 1px solid #333;
        text-transform: uppercase;
        margin-bottom: 0;
        box-sizing: border-box;
        font-size: 10.5px; /* Matched section title font size */
    }


    /* --- INFO TABLE STYLES --- */
    .info-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 5px; /* Reduced margin */
    }
    .info-table th {
        width: 130px; /* Reduced width for the label column */
        background: #f7f7f7;
        border: 1px solid #333;
        padding: 2px 3px; /* Reduced padding */
        text-align: left;
        font-size: 10px; /* Slightly reduced font size for table headers */
    }
    .info-table td {
        border: 1px solid #333;
        padding: 2px 3px; /* Reduced padding */
        word-wrap: break-word;
        font-size: 10px; /* Slightly reduced font size for table data */
    }


    /* --- PHOTO CONTAINER STYLES --- */
    .photo-container {
        width: 130px; /* Slightly reduced width */
        height: 160px; /* Reduced height */
        text-align: center;
        font-size: 9px; /* Reduced font size */
        line-height: 1.1;
        margin-left: auto;
        margin-right: 0;
        overflow: hidden;
        position: relative;
    }
    .photo-container img {
        max-width: 100%;
        height: calc(100% - 18px); /* Adjusted height, dedicate ~18px for label */
        display: block;
        object-fit: contain;
        margin: 0 auto;
        vertical-align: middle;
    }
    .photo-text {
        padding-top: 40px; /* Adjusted padding-top for placeholder */
        display: block;
    }
    .resident-image-label {
        font-size: 9px; /* Reduced font size */
        text-align: center;
        margin-top: 3px; /* Reduced space */
        display: block;
    }


    /* --- SIGNATURE AREA STYLES --- */
    .signature-area {
        margin-top: 25px; /* Reduced margin-top */
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        font-size: 9.5px; /* Reduced font size */
    }
    .signature-area td {
        padding-top: 10px; /* Reduced padding */
        vertical-align: top;
    }
    .signature-line-container {
        border-top: 1px solid #000;
        width: 250px; /* Slightly reduced width */
        margin: 0 auto;
        padding-bottom: 3px; /* Reduced padding */
        display: block;
    }
    .printed-on {
        font-size: 8.5px; /* Reduced font size */
        margin-top: 8px; /* Reduced margin */
        text-align: left;
    }

        /* --- NEW PRIVACY POLICY SECTION --- */
    .privacy-policy-section {
        margin-top: 25px; /* Adjust as needed for spacing */
        font-size: 9.5px;
        text-align: justify;
        padding: 0 10px; /* Add some padding to the sides */
    }
    .privacy-policy-section h4 {
        text-align: center;
        margin-bottom: 5px;
        font-size: 10.5px;
    }
    .privacy-policy-section p {
        margin-bottom: 5px;
        line-height: 1.3;
    }

    .printed-on {
        font-size: 8.5px;
        margin-top: 8px;
        text-align: left;
        padding: 0 10px; /* Match privacy policy padding */
    }
</style>
</head>

<body>

<!-- HEADER TABLE -->
<table class="header-table">
<tr>
    <td class="logo-cell">
        @if(file_exists(public_path('images/city-of-ilagan.png')))
            <img src="{{ public_path('images/city-of-ilagan.png') }}" class="logo">
        @else
            <div style="width:80px; height:80px; border:1px solid #000; margin:0 auto; display:flex; align-items:center; justify-content:center; font-size:7px;">City Logo Missing</div>
        @endif
    </td>
    <td class="main-header-text center-text">
        <strong>Republic of the Philippines</strong><br>
        <strong>City of Ilagan</strong><br>
        <strong>Province of Isabela</strong><br>
        <strong>Barangay {{ $barangayName ?? ($resident->barangay->name ?? 'N/A') }}</strong><br>
        <span class="header-underline-text">Resident Information Sheet</span>
    </td>
    <td class="logo-cell">
        @if($barangayLogo && file_exists(public_path('storage/'.$barangayLogo)))
            <img src="{{ public_path('storage/'.$barangayLogo) }}" class="logo">
        @else
            <div style="width:80px; height:80px; border:1px solid #000; margin:0 auto; display:flex; align-items:center; justify-content:center; font-size:7px;">Brgy Logo Missing</div>
        @endif
    </td>
</tr>
</table>

<!-- MAIN CONTENT AREA (Information Tables and Photo) -->
<table width="100%" style="border-collapse: collapse;">
    <tr>
        <td style="width: 70%; vertical-align: top; padding-right: 8px;"> <!-- Reduced padding-right -->
            <div class="section-title">Personal Information</div>
            <table class="info-table">
            <tr><th>Full Name</th><td>{{ $resident->lastname }}, {{ $resident->firstname }} {{ $resident->middlename }} {{ $resident->suffix ?? '' }}</td></tr>
            <tr><th>Birthdate</th><td>{{ $resident->birthdate ? \Carbon\Carbon::parse($resident->birthdate)->format('F d, Y') : 'N/A' }}</td></tr>
            <tr><th>Age</th><td>{{ $resident->birthdate ? \Carbon\Carbon::parse($resident->birthdate)->age : 'N/A' }}</td></tr>
            <tr><th>Birthplace</th><td>{{ $resident->birthplace ?? 'N/A' }}</td></tr>
            <tr><th>Sex</th><td>{{ ucfirst($resident->gender) ?? 'N/A' }}</td></tr>
            <tr><th>Civil Status</th><td>{{ ucfirst($resident->civil_status) ?? 'N/A' }}</td></tr>
            <tr><th>Religion</th><td>{{ $resident->religion ?? 'N/A' }}</td></tr>
            <tr><th>Citizenship</th><td>{{ $resident->citizenship ?? 'N/A' }}</td></tr>
            <tr><th>Ethnicity</th><td>{{ $resident->ethnicity ?? 'N/A' }}</td></tr>
            </table>

            <div class="section-title">Address</div>
            <table class="info-table">
            <tr><th>Household No.</th><td>{{ optional($resident->latestHousehold)->house_number ?? 'N/A' }}</td></tr>
            <tr><th>Purok No.</th><td>{{ $resident->purok_number ?? 'N/A' }}</td></tr>
            <tr><th>Street</th><td>{{ optional($resident->street)->street_name ?? 'N/A' }}</td></tr>
            <tr><th>Residency Since</th><td>{{ $resident->residency_date ?? 'N/A' }}</td></tr>
            </table>

            <div class="section-title">Contact Information</div>
            <table class="info-table">
            <tr><th>Contact Number</th><td>{{ $resident->contact_number ?? 'N/A' }}</td></tr>
            <tr><th>Email</th><td>{{ $resident->email ?? 'N/A' }}</td></tr>
            <tr><th>Emergency Contact Name</th><td>{{ optional($resident->medicalInformation)->emergency_contact_name ?? 'N/A' }}</td></tr>
            <tr><th>Emergency Contact Number</th><td>{{ optional($resident->medicalInformation)->emergency_contact_number ?? 'N/A' }}</td></tr>
            <tr><th>Emergency Contact Relationship</th><td>{{ optional($resident->medicalInformation)->emergency_contact_relationship ?? 'N/A' }}</td></tr>
            </table>

            <div class="section-title">Employment / Education</div>
            <table class="info-table">
            <tr><th>Employment Status</th><td>{{ ucfirst($resident->employment_status) ?? 'N/A' }}</td></tr>
            <tr><th>Occupation</th><td>{{ optional($resident->latestOccupation)->occupation ?? 'N/A' }}</td></tr>
            <tr><th>Employer</th><td>{{ optional($resident->latestOccupation)->employer ?? 'N/A' }}</td></tr>
            <tr><th>Highest Education</th><td>{{ optional($resident->latestEducation)->level ?? 'N/A' }}</td></tr>
            </table>

            <div class="section-title">Health Information</div>
            <table class="info-table">
            <tr><th>Blood Type</th><td>{{ optional($resident->medicalInformation)->blood_type ?? 'N/A' }}</td></tr>
            <tr><th>Weight (kg)</th><td>{{ optional($resident->medicalInformation)->weight_kg ?? 'N/A' }}</td></tr>
            <tr><th>Height (cm)</th><td>{{ optional($resident->medicalInformation)->height_cm ?? 'N/A' }}</td></tr>
            <tr><th>BMI</th><td>{{ optional($resident->medicalInformation)->bmi ?? 'N/A' }}</td></tr>
            <tr><th>Nutrition Status</th><td>{{ ucfirst(optional($resident->medicalInformation)->nutrition_status) ?? 'N/A' }}</td></tr>
            <tr><th>Smoker</th><td>{{ optional($resident->medicalInformation)->is_smoker ? 'Yes' : 'No' }}</td></tr>
            <tr><th>Alcohol User</th><td>{{ optional($resident->medicalInformation)->is_alcohol_user ? 'Yes' : 'No' }}</td></tr>
            </table>

            <div class="section-title">Government & Social Services</div>
            <table class="info-table">
            <tr><th>Registered Voter</th><td>{{ $resident->registered_voter ? 'Yes' : 'No' }}</td></tr>
            <tr><th>4Ps Beneficiary</th><td>{{ optional($resident->socialwelfareprofile)->is_4ps_beneficiary ? 'Yes' : 'No' }}</td></tr>
            <tr><th>PWD</th><td>{{ $resident->is_pwd ? 'Yes' : 'No' }}</td></tr>
            <tr><th>Senior Citizen</th><td>{{ $resident->seniorcitizen ? 'Yes' : 'No' }}</td></tr>
            <tr><th>Has PhilHealth</th><td>{{ optional($resident->medicalInformation)->has_philhealth ? 'Yes' : 'No' }}</td></tr>
            @if(optional($resident->medicalInformation)->has_philhealth)
            <tr><th>PhilHealth ID No.</th><td>{{ optional($resident->medicalInformation)->philhealth_id_number ?? 'N/A' }}</td></tr>
            @endif
            </table>
        </td>
        <td style="width: 30%; vertical-align: top; text-align: right;">
            <!-- Photo Box -->
            <div class="photo-container">
                @if($resident->resident_picture_path && file_exists(public_path('storage/'.$resident->resident_picture_path)))
                    <img src="{{ public_path('storage/'.$resident->resident_picture_path) }}">
                @else
                    <div class="photo-text">Photo Not Available</div>
                @endif
                <div class="resident-image-label">Resident Image</div>
            </div>
        </td>
    </tr>
</table>

<!-- DATA PRIVACY / BARANGAY POLICY SECTION (Replaces Signature Area) -->
<div class="privacy-policy-section">
    <h4>DATA PRIVACY STATEMENT AND BARANGAY POLICY</h4>
    <p>
        The Barangay Government of {{ $barangayName ?? ($resident->barangay->name ?? 'N/A') }} is committed to protecting your personal information in compliance with the Data Privacy Act of 2012 (RA 10173). The information collected in this Resident Information Sheet is for official use only, specifically for barangay record-keeping, community development programs, emergency response, and delivery of social services.
    </p>
    <p>
        All data provided herein is treated with utmost confidentiality and is secured against unauthorized access, disclosure, alteration, or destruction. It will not be shared with third parties without your explicit consent, unless required by law. By signing/submitting this form, you acknowledge and consent to the processing of your personal data as described above.
    </p>
</div>


<!-- SIGNATURE AREA -->
{{-- <table class="signature-area">
<tr>
    <td>
        <div class="signature-line-container"></div>
        Resident's Signature
    </td>
    <td>
        <div class="signature-line-container"></div>
        Barangay Captain
    </td>
</tr>
</table> --}}

<p class="printed-on">
Printed on: {{ now()->format('F d, Y — h:i A') }}
</p>

</body>
</html>
