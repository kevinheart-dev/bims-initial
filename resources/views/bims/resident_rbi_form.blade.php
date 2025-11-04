<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>RBI Form B (Revised 2024)</title>
    <style>
        @page {
            size: A4;
            margin: 0.7cm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #000;
            margin: 0.7cm;
        }

        header {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
        }

        .rbi-label {
            font-weight: bold;
            font-size: 12px;
            text-align: left;
        }

        .rbi-label small {
            font-weight: normal;
            font-size: 11px;
        }

        .form-title {
            text-align: center;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-top: 3px;
        }

        .info-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
            font-size: 11px;
        }

        .info-table td {
            padding: 2px 8px;
            vertical-align: middle;
        }

        .label {
            text-transform: uppercase;
            white-space: nowrap;
            width: 10%;
        }

        .line {
            display: inline-block;
            border-bottom: 1.3px solid #000;
            width: 95%;
            height: 9px;
        }

        .right {
            text-align: right;
        }

        /* BIG BORDER BOX */
        .border-box {
            border: 1.5px solid #000;
            padding: 25px 20px;
            margin-top: 25px;
            position: relative;
        }

        .section-title {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            font-weight: bold;
            padding: 0 8px;
        }

        /* Inner tables */
        .inner-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 11px;
        }

        .inner-table td {
            vertical-align: bottom;
            padding: 4px 6px;
        }

        .name-section,
        .birth-section,
        .address-section,
        .profession-section,
        .education-section {
            margin-top: 15px;
        }

        /* Box input fields */
        .input-box {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #000;
            width: 95%;
            height: 22px;
            font-size: 11px;
            text-align: center;
            box-sizing: border-box;
        }

        .label-under {
            text-align: center;
            font-size: 9px;
            padding-top: 2px;
        }


        /* Education section styles */
        .education-section {
            margin-top: 15px;
            font-size: 10px;
        }

        .checkbox-box,
        .small-box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1.3px solid #000;
            text-align: center;
            line-height: 10px;
            font-size: 10px;
            margin-right: 5px;
        }


        .education-sub {
            margin-top: 6px;
            margin-left: 160px;
            font-style: italic;
            font-size: 11px;
            display: flex;
            align-items: center;
            gap: 10px;
            white-space: nowrap;
            /* keep inline */
        }

        /* cetification */
        .certification {
            margin-top: 20px;
            font-size: 11px;
            text-align: justify;
            line-height: 1.3;
        }

        /* assignatory */

        .assignatory-table .line {
            display: block;
            border-bottom: 1.3px solid #000;
            height: 9px;
        }

        .assignatory-table .left-line {
            width: 70%;
            margin: 0 auto;
        }

        .assignatory-table .right-line {
            width: 90%;
            margin: 0 auto;
        }

        .assignatory-table .assignatory-label {
            font-size: 10px;
            text-transform: none;
            text-align: center;
            margin-top: 2px;
        }

        /* attested */
        /* --- Attested by + Thumbmarks Section --- */
        .attested-table {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
        }

        .attested-row td {
            vertical-align: top;
        }

        .attested-cell {
            width: 50%;
            padding-top: 20px;
        }

        .thumbmarks-cell {
            width: 50%;
            padding-top: 20px;
        }

        /* Left side: Attested by section */
        .attested-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .attested-label {
            font-size: 10px;
            margin-bottom: 10px;
            align-self: flex-start;
            padding-left: 20px;
        }

        .attested-line {
            border-bottom: 1.0px solid #000;
            width: 200px;
            margin: 0 auto;
        }

        .attested-name {
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
        }

        /* Right side: Thumbmarks */
        .thumbmarks-container {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            gap: 5px;
            /* space between boxes */
        }

        .thumb {
            text-align: center;
        }

        .thumb-box {
            width: 80px;
            height: 80px;
            border: 1.3px solid #000;
        }

        .thumb-label {
            font-size: 10px;
            margin-top: 4px;
        }

        /* Household number section */
        .household-section {
            margin-top: 20px;
            text-align: left;
        }

        .household-label {
            font-size: 11px;
            font-weight: bold;
        }

        .household-box {
            display: inline-block;
            border: 1.3px solid #000;
            width: 200px;
            height: 25px;
            margin-left: 8px;
        }

        .household-note {
            font-size: 9px;
            font-style: italic;
            margin-top: 4px;
            margin-left: 2px;
        }
    </style>
</head>

<body>
    <header>
        <div class="rbi-label">RBI Form B <small>(Revised 2024)</small></div>
    </header>

    <div class="form-title">INDIVIDUAL RECORDS OF BARANGAY INHABITANT</div>

    <table class="info-table">
        <tr>
            <td class="label">Region:</td>
            <td>
                <span class="line" style="position: relative; display: inline-block; width: 95%;">
                    <span style="position: absolute; top: -2px; left: 5px;">2</span>
                </span>
            </td>
            <td class="right label">City/Mun:</td>
            <td>
                <span class="line" style="position: relative; display: inline-block; width: 95%;">
                    <span style="position: absolute; top: -2px; left: 5px;">CITY OF ILAGAN</span>
                </span>
            </td>
        </tr>
        <tr>
            <td class="label">Province:</td>
            <td>
                <span class="line" style="position: relative; display: inline-block; width: 95%;">
                    <span style="position: absolute; top: -2px; left: 5px;">ISABELA</span>
                </span>
            </td>
            <td class="right label">Barangay:</td>
            <td>
                <span class="line"
                    style="position: relative; display: inline-block; width: 95%; text-transform: uppercase;">
                    {{ $barangayName ?? ($resident->barangay->name ?? 'N/A') }}
                </span>
            </td>

        </tr>
    </table>


    <!-- PERSONAL INFORMATION BOX -->
    <div class="border-box">
        <div class="section-title">PERSONAL INFORMATION</div>

        <!-- PhilSys Card No. -->
        <table class="inner-table">
            <tr>
                <td style="width: 20%;"><span class="input-box"></span></td>
                <td colspan="3"></td>
            </tr>
            <tr>
                <td class="label-under" style="width: 20%;">(PhilSys Card No.)</td>
                <td colspan="3"></td>
            </tr>
        </table>

        <!-- Name Fields -->
        <table class="inner-table name-section" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td><span class="input-box">{{ ucwords(strtolower($resident->lastname ?? '')) }}</span></td>
                <td style="width: 15%;"><span
                        class="input-box">{{ ucwords(strtolower($resident->suffix ?? '')) }}</span></td>
                <td><span class="input-box">{{ ucwords(strtolower($resident->firstname ?? '')) }}</span></td>
                <td><span class="input-box">{{ ucwords(strtolower($resident->middlename ?? '')) }}</span></td>
            </tr>
            <tr>
                <td class="label-under">(Last Name)</td>
                <td class="label-under">(Suffix, e.g., Jr., I, II, III)</td>
                <td class="label-under">(First Name)</td>
                <td class="label-under">(Middle Name)</td>
            </tr>
        </table>

        <!-- Birth Info -->
        <table class="inner-table birth-section">
            <tr>
                <td style="width: 20%;"><span
                        class="input-box">{{ $resident->birthdate ? \Carbon\Carbon::parse($resident->birthdate)->format('F d, Y') : 'N/A' }}</span>
                </td>
                <td><span class="input-box">{{ $resident->birth_place ?? 'N/A' }}</span></td>
                <td style="width: 10%;">
                    <span class="input-box">{{ ucwords(strtolower($resident->sex ?? 'N/A')) }}</span>
                </td>
                <td style="width: 15%;">
                    <span class="input-box">{{ ucwords(strtolower($resident->civil_status ?? 'N/A')) }}</span>
                </td>

                <td><span class="input-box">{{ $resident->religion ?? 'N/A' }}</span></td>
            </tr>
            <tr>
                <td class="label-under">(Birth Date: mm/dd/yyyy)</td>
                <td class="label-under">(Birth Place)</td>
                <td class="label-under">(Sex)</td>
                <td class="label-under">(Civil Status)</td>
                <td class="label-under">(Religion)</td>
            </tr>
        </table>

        <!-- Residence Address & Citizenship -->
        <table class="inner-table address-section">
            <tr>
                <td style="width: 70%;"><span class="input-box">
                        Purok
                        {{ $resident->purok_number ?? ' ' }},{{ optional($resident->street)->street_name ?? 'N/A' }},
                        {{ $barangayName ?? ($resident->barangay->name ?? 'N/A') }},
                    </span></td>
                <td style="width: 30%;"><span class="input-box">{{ $resident->citizenship ?? 'N/A' }}</span></td>
            </tr>
            <tr>
                <td class="label-under">(Residence Address)</td>
                <td class="label-under">(Citizenship)</td>
            </tr>
        </table>

        <!-- Profession, Contact, Email -->
        <table class="inner-table profession-section">
            <tr>
                <td><span class="input-box">{{ optional($resident->latestOccupation)->occupation ?? 'N/A' }}</span>
                </td>
                <td><span class="input-box">{{ $resident->contact_number ?? 'N/A' }}</span></td>
                <td><span class="input-box">{{ $resident->email ?? 'N/A' }}</span></td>
            </tr>
            <tr>
                <td class="label-under">(Profession / Occupation)</td>
                <td class="label-under">(Contact Number)</td>
                <td class="label-under">(E-mail Address)</td>
            </tr>
        </table>

        <div class="education-section">
            <div class="education-row" style="font-size: 10px;">
                <span class="education-label">HIGHEST EDUCATIONAL ATTAINMENT:</span>

                <span class="checkbox-box">
                    @if (optional($resident->latestEducation)->educational_attainment == 'elementary')
                        /
                    @endif
                </span> ELEMENTARY

                <span class="checkbox-box">
                    @if (in_array(optional($resident->latestEducation)->educational_attainment, ['high_school','senior_high_school']))
                        /
                    @endif
                </span> HIGH SCHOOL

                <span class="checkbox-box">
                    @if (optional($resident->latestEducation)->educational_attainment == 'college')
                        /
                    @endif
                </span> COLLEGE

                <span class="checkbox-box">
                    @if (optional($resident->latestEducation)->educational_attainment == 'post_graduate')
                        /
                    @endif
                </span> POST GRAD

                <span class="checkbox-box">
                    @if (optional($resident->latestEducation)->educational_attainment == 'vocational')
                        /
                    @endif
                </span> VOCATIONAL
            </div>

            <div class="education-sub" style="font-size: 12px; margin-top: 6px;">
                Please specify:
                <span class="small-box">
                    @if (optional($resident->latestEducation)->education_status == 'graduated')
                        /
                    @endif
                </span> Graduate

                <span class="small-box">
                    @if (in_array(optional($resident->latestEducation)->education_status, ['dropped_out','incomplete','enrolled']))
                        /
                    @endif
                </span> Under Graduate
            </div>
        </div>



        <div class="certification">
            I hereby certify that the above information is true and correct to the best of my knowledge.
            I understand that for the Barangay to carry out its mandate pursuant to Section 394 (d)(6) of
            the Local Government Code of 1991, they must necessarily process my personal information for
            easy identification of inhabitants, as a tool in planning, and as an updated reference in the
            number of inhabitants of the Barangay. Therefore, I grant my consent and recognize the authority
            of the Barangay to process my personal information, subject to the provision of the Philippine
            Data Privacy Act of 2012.
        </div>

        <table class="assignatory-table" style="width: 100%; margin-top: 30px; border-collapse: collapse;">
            <tr>
                <td style="width: 48%; padding-left: 4%; text-align: center; vertical-align: bottom;">
                    <span class="line right-line"
                        style="display: inline-block; border-bottom: 1.3px solid #000; height: 25px; width: 90%;
        text-align: center; padding-bottom: 3px; line-height: 25px;">
                        {{ optional(optional($resident->latestHousehold)->created_at)->format('m/d/Y') ?? 'N/A' }}
                    </span>
                </td>

                <td style="width: 48%; padding-left: 4%; text-align: center; vertical-align: bottom;">
                    <span class="line right-line"
                        style="display: inline-block; border-bottom: 1.3px solid #000; height: 25px; width: 90%;
               text-align: center; padding-bottom: 3px; line-height: 25px;">
                        {{ ucwords(strtolower($resident->lastname)) }},
                        {{ ucwords(strtolower($resident->firstname)) }}
                        {{ ucwords(strtolower($resident->middlename)) }}
                        {{ ucwords(strtolower($resident->suffix ?? '')) }}
                    </span>
                </td>

            </tr>

            <tr>
                <td class="assignatory-label" style="font-size: 10px; text-align: center;">
                    Date Accomplished
                </td>
                <td class="assignatory-label" style="font-size: 10px; text-align: center;">
                    Name/Signature of Person Accomplishing the Form
                </td>
            </tr>
        </table>

        <table style="width: 100%; margin-top: 45px; border-collapse: collapse;">
            <tr>
                <!-- Left: Attested by -->
                <td style="width: 48%; padding-right: 4%; vertical-align: bottom; position: relative;">
                    <div style="font-size: 11px; margin-bottom: 60px; text-align: left; padding-left: 30px;">
                        Attested by:
                    </div>
                    <div style="border-bottom: 1.3px solid #000; width: 70%; height: 20px; margin: 0 auto;">
                        <span style="font-size: 11px; display: block; text-align: center;">
                            {{ $barangaySecretary }}
                        </span>
                    </div>
                    <div style="font-size: 10px; margin-top: 4px; text-align: center;">
                        <b>Barangay Secretary</b>
                    </div>
                </td>


                <!-- Right: Thumbmarks side by side -->
                <td style="width: 48%; padding-left: 4%; text-align: center; vertical-align: bottom;">
                    <table style="margin: 0 auto; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 0 15px; text-align: center;">
                                <div style="width: 100px; height: 100px; border: 1.3px solid #000; margin: 0 auto;">
                                </div>
                                <div style="font-size: 10px; margin-top: 3px;">(Left Thumbmark)</div>
                            </td>
                            <td style="padding: 0 15px; text-align: center;">
                                <div style="width: 100px; height: 100px; border: 1.3px solid #000; margin: 0 auto;">
                                </div>
                                <div style="font-size: 10px; margin-top: 3px;">(Right Thumbmark)</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>




        <!-- Household Number Section -->
        <div style="margin-top: 45px; margin-bottom: 35px; text-align: left;">
            <span style="font-size: 11px; font-weight: bold;">Household Number:</span>
            <span
                style="display: inline-flex;
           justify-content: center;
           align-items: center;
           border: 1.3px solid #000;
           width: 200px;
           height: 25px;
           margin-left: 8px;
           text-align: center;">
                {{ optional($resident->latestHousehold)->house_number ?? 'N/A' }}
            </span>

            <div style="font-size: 9px; font-style: italic; margin-top: 4px; margin-left: 2px;">
                Note: The household number shall be filled up by the Barangay Secretary.
            </div>
        </div>


    </div>
</body>

</html>
