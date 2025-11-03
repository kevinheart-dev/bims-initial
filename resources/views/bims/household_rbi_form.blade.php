<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>RBI Form A</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
    .header-title {
        text-align: center; /* Keep main title centered */
        font-weight: bold;
        font-size: 16px; /* Adjust overall size */
        margin-bottom: 10px;
        position: relative;
    }

    .header-title .form-title {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 10px; /* smaller */
        font-weight: normal;
        font-style: italic;
    }
        .info-table td {
            padding: 3px; font-size: 12px;
        }
        .label { width: 200px; font-weight: bold; }
        .table-header {
            background: #d8e4bc; text-align: center; font-weight: bold; font-size: 11px;
            border: 1px solid #000;
        }
        .table-cell {
            border:1px solid #000; height: 18px; font-size: 11px; padding: 2px;
        }
        .signature-line { border-top: 1px solid #000; padding-top: 3px; text-align: center; }
        .section-title { font-weight: bold; font-size: 12px; margin-top: 20px; }
        p.privacy { font-size: 10px; text-align: justify; line-height: 1.2; margin-top: 5px; }
    </style>
</head>
<body>

<div class="header-title">
    <span class="form-title">RBI FORM A (Revised 2024)</span><br>
    RECORDS OF BARANGAY INHABITANTS BY HOUSEHOLD
</div>

<table class="info-table">
    <tr><td class="label">REGION :</td><td>{{ $region ?? '' }}</td></tr>
    <tr><td class="label">PROVINCE:</td><td>{{ $province ?? '' }}</td></tr>
    <tr><td class="label">CITY/MUNICIPALITY:</td><td>{{ $city ?? '' }}</td></tr>
    <tr><td class="label">BARANGAY :</td><td>{{ $barangay ?? '' }}</td></tr>
    <tr><td class="label">HOUSEHOLD ADDRESS :</td><td>{{ $household_address ?? '' }}</td></tr>
    <tr><td class="label">NO. OF HOUSEHOLD MEMBERS:</td><td>{{ count($household_members ?? []) }}</td></tr>
</table>

<br>

<table>
    <tr>
        <td colspan="4" class="table-header">NAME</td>
        <td rowspan="2" class="table-header">PLACE OF BIRTH</td>
        <td rowspan="2" class="table-header">DATE OF BIRTH</td>
        <td rowspan="2" class="table-header">AGE</td>
        <td rowspan="2" class="table-header">SEX</td>
        <td rowspan="2" class="table-header">CIVIL STATUS</td>
        <td rowspan="2" class="table-header">CITIZENSHIP</td>
        <td rowspan="2" class="table-header">OCCUPATION</td>
        <td rowspan="2" class="table-header" style="width:120px;">
            Indicate if Labor/employed, Unemployed, PWD, OFW, Solo Parent, OSY, OSC and/or IP
        </td>
    </tr>
    <tr>
        <td class="table-header">LAST NAME</td>
        <td class="table-header">FIRST NAME</td>
        <td class="table-header">MIDDLE NAME</td>
        <td class="table-header">EXT</td>
    </tr>

    {{-- Loop members --}}
    @foreach($household_members as $member)
        <tr>
            <td class="table-cell">{{ $member->last_name }}</td>
            <td class="table-cell">{{ $member->first_name }}</td>
            <td class="table-cell">{{ $member->middle_name }}</td>
            <td class="table-cell">{{ $member->suffix }}</td>
            <td class="table-cell">{{ $member->place_of_birth }}</td>
            <td class="table-cell">{{ $member->date_of_birth }}</td>
            <td class="table-cell">{{ $member->age }}</td>
            <td class="table-cell">{{ $member->sex }}</td>
            <td class="table-cell">{{ $member->civil_status }}</td>
            <td class="table-cell">{{ $member->citizenship }}</td>
            <td class="table-cell">{{ $member->occupation }}</td>
            <td class="table-cell">{{ $member->special_category }}</td>
        </tr>
    @endforeach

    {{-- Blank rows to fill form look --}}
    @for($i = count($household_members); $i < count($household_members) + 2; $i++)
        <tr>
            @for($c=0; $c<12; $c++)
                <td class="table-cell">&nbsp;</td>
            @endfor
        </tr>
    @endfor
</table>

<br><br>

<table width="100%" style="text-align:center; border-collapse:collapse;">
    <tr>
        <td style="text-align: left;">
            <strong>Prepared by:</strong>
        </td>
        <td style="text-align: left;">
            <strong>Certified Correct:</strong>
        </td>
        <td style="text-align: left;">
            <strong>Validated by:</strong>
        </td>
    </tr>

    <tr>
        <td>
            <div class="sig-wrapper">
                <div class="sig-line"></div>
                <strong>{{ $head_of_household ?? 'Name of Household/Head Member' }}</strong><br>
                <span>(Signature over Printed Name)</span>
            </div>
        </td>

        <td>
            <div class="sig-wrapper">
                <div class="sig-line"></div>
                <strong>{{ $barangay_secretary ?? 'Barangay Secretary' }}</strong><br>
                <span>(Signature over Printed Name)</span>
            </div>
        </td>

        <td>
            <div class="sig-wrapper">
                <div class="sig-line"></div>
                <strong>{{ $punong_barangay ?? 'Punong Barangay' }}</strong><br>
                <span>(Signature over Printed Name)</span>
            </div>
        </td>
    </tr>
</table>

<p class="privacy">
    I hereby certify that the above information are true and correct to the best of my knowledge...
    Therefore, I grant my consent and recognize the authority of the Barangay to process my personal
    information, subject to the provision of the Philippine Data Privacy Act of 2012.
</p>

</body>
</html>
