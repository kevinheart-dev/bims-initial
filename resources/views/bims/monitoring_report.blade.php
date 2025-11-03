<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>RBI Form C - Monitoring Report</title>
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
        .info-table td { padding: 3px; font-size: 12px; }
        .label { width: 200px; font-weight: bold; }
        .table-header {
            background: #d8e4bc;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            border: 1px solid #000;
        }
        .table-cell {
            border:1px solid #000;
            height: 18px;
            font-size: 11px;
            padding: 2px;
            text-align: center;
        }
        .signature-line { border-top: 1px solid #000; padding-top: 3px; text-align: center; }
        .section-title { font-weight: bold; font-size: 12px; margin-top: 20px; }
        p.note { font-size: 10px; text-align: justify; line-height: 1.2; margin-top: 5px; }
        .sig-line {
    display: inline-block;
    border-bottom: 1px solid #000;
    width: 250px; /* adjust as needed */
    padding-bottom: 2px;
    text-align: center;
}
    </style>
</head>
<body>

<div class="header-title">
    <span class="form-title">RBI FORM C (Revised 2024)</span><br>
        MONITORING REPORT<br>
    for {{ $semester ?? '___' }} Semester of CY {{ $year ?? '____' }}
</div>

<table class="info-table">
    <tr><td class="label">REGION :</td><td>{{ $region ?? '' }}</td></tr>
    <tr><td class="label">PROVINCE:</td><td>{{ $province ?? '' }}</td></tr>
    <tr><td class="label">CITY/MUNICIPALITY:</td><td>{{ $city ?? '' }}</td></tr>
    <tr><td class="label">BARANGAY :</td><td>{{ $barangay ?? '' }}</td></tr>
    <tr><td class="label">Total No. of Barangay Inhabitants:</td><td>{{ $totalResidents ?? 0 }}</td></tr>
    <tr><td class="label">Total No. of Households:</td><td>{{ $totalHouseholds ?? 0 }}</td></tr>
    <tr><td class="label">Total No. of Families:</td><td>{{ $totalFamilies ?? 0 }}</td></tr>
</table>

<br>

<table>
    <tr>
        <td class="table-header">INDICATORS</td>
        <td class="table-header">MALE</td>
        <td class="table-header">FEMALE</td>
        <td class="table-header">TOTAL</td>
        <td class="table-header">REMARKS</td>
    </tr>

    {{-- Population by Age Bracket --}}
    @foreach($populationByAge as $label => $counts)
    <tr>
        <td class="table-cell">{{ $label }}</td>
        <td class="table-cell">{{ $counts['male'] ?? 0 }}</td>
        <td class="table-cell">{{ $counts['female'] ?? 0 }}</td>
        <td class="table-cell">{{ ($counts['male'] ?? 0) + ($counts['female'] ?? 0) }}</td>
        <td class="table-cell">&nbsp;</td>
    </tr>
    @endforeach

    {{-- Population by Sector --}}
    @foreach($populationBySector as $label => $counts)
    <tr>
        <td class="table-cell">{{ $label }}</td>
        <td class="table-cell">{{ $counts['male'] ?? 0 }}</td>
        <td class="table-cell">{{ $counts['female'] ?? 0 }}</td>
        <td class="table-cell">{{ ($counts['male'] ?? 0) + ($counts['female'] ?? 0) }}</td>
        <td class="table-cell">&nbsp;</td>
    </tr>
    @endforeach
</table>

<br><br>

<table width="100%" style="text-align:center; border-collapse:collapse;">
    <tr>
        <td style="text-align:left;">
            <strong>Prepared by:</strong>
        </td>
        <td style="text-align:left;">
            <strong>Submitted by:</strong>
        </td>
    </tr>
    <tr>
        <td>
            <div class="sig-line">{{ $barangay_secretary ?? 'Barangay Secretary' }}</div>
            <br>
            <span>(Signature over Printed Name)</span>
        </td>
        <td>
            <div class="sig-line">{{ $punong_barangay ?? 'Punong Barangay' }}</div>
            <br>
            <span>(Signature over Printed Name)</span>
        </td>
    </tr>
    <tr>
        <td colspan="1" style="text-align:left;">
            <br><br>Date Accomplished: {{ $date_accomplished ?? '________' }}
        </td>
    </tr>
</table>

<p class="note">
    Note: This RBI Form C (Semestral Monitoring Report) is to be submitted to DILG C/MLGOO as a reference for encoding to BIS-BPS.
</p>

</body>
</html>
