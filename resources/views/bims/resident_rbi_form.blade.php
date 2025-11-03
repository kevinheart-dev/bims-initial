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
            display: block;
            border: 1.3px solid #000;
            width: 100%;
            height: 25px;
            box-sizing: border-box;
        }

        .label-under {
            font-size: 10px;
            text-align: center;
            margin-top: 3px;
        }

        /* Education section styles */
        .education-section {
            margin-top: 15px;
            font-size: 10px;
        }

        .education-row {
            display: flex;
            align-items: center;
            white-space: nowrap;
            /* prevents wrapping */
            gap: 6px;
            font-size: 10px;
        }

        .checkbox-box {
            width: 11px;
            height: 11px;
            border: 1px solid #000;
            display: inline-block;
            margin: 0 4px;
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

        .small-box {
            width: 11px;
            height: 11px;
            border: 1px solid #000;
            display: inline-block;
            margin: 0 4px;
        }

        /* cetification */
        .certification {
            margin-top: 20px;
            font-size: 9px;
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
            <td><span class="line"></span></td>
            <td class="right label">City/Mun:</td>
            <td><span class="line"></span></td>
        </tr>
        <tr>
            <td class="label">Province:</td>
            <td><span class="line"></span></td>
            <td class="right label">Barangay:</td>
            <td><span class="line"></span></td>
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
        <table class="inner-table name-section">
            <tr>
                <td><span class="input-box"></span></td>
                <td style="width: 20%;"><span class="input-box"></span></td>
                <td><span class="input-box"></span></td>
                <td><span class="input-box"></span></td>
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
                <td style="width: 20%;"><span class="input-box"></span></td>
                <td><span class="input-box"></span></td>
                <td style="width: 10%;"><span class="input-box"></span></td>
                <td style="width: 15%;"><span class="input-box"></span></td>
                <td><span class="input-box"></span></td>
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
                <td style="width: 70%;"><span class="input-box"></span></td>
                <td style="width: 30%;"><span class="input-box"></span></td>
            </tr>
            <tr>
                <td class="label-under">(Residence Address)</td>
                <td class="label-under">(Citizenship)</td>
            </tr>
        </table>

        <!-- Profession, Contact, Email -->
        <table class="inner-table profession-section">
            <tr>
                <td><span class="input-box"></span></td>
                <td><span class="input-box"></span></td>
                <td><span class="input-box"></span></td>
            </tr>
            <tr>
                <td class="label-under">(Profession / Occupation)</td>
                <td class="label-under">(Contact Number)</td>
                <td class="label-under">(E-mail Address)</td>
            </tr>
        </table>

        <!-- Educational Attainment -->
        <div class="education-section">
            <div class="education-row">
                <span class="education-label">HIGHEST EDUCATIONAL ATTAINMENT:</span>
                <span class="checkbox-box"></span> ELEMENTARY
                <span class="checkbox-box"></span> HIGH SCHOOL
                <span class="checkbox-box"></span> COLLEGE
                <span class="checkbox-box"></span> POST GRAD
                <span class="checkbox-box"></span> VOCATIONAL
            </div>

            <div class="education-sub">
                Please specify:
                <span class="small-box"></span> Graduate
                <span class="small-box"></span> Under Graduate
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


        <!-- Existing Assignatory Table -->
        <table class="assignatory-table" style="margin-top: 20px; width: 100%;">
            <tr>
                <td style="width: 48%; padding-right: 4%;"><span class="line left-line"></span></td>
                <td style="width: 48%; padding-left: 4%;"><span class="line right-line"></span></td>
            </tr>
            <tr>
                <td class="assignatory-label">Date Accomplished</td>
                <td class="assignatory-label">Name/Signature of Person Accomplishing the Form</td>
            </tr>

            <!-- Attested by & Thumbmarks row -->
            <tr>
                <!-- Left Column: Attested by -->
                <td style="padding-top: 25px; vertical-align: top;">
                    <div style="font-size: 10px; margin-bottom: 5px; padding-left: 20px;">Attested by:</div>
                    <!-- Attested by line -->
                    <span class="line left-line" style="width: 200px; display: block; margin: 0 auto;"></span>
                    <div style="font-size: 10px; font-weight: bold; text-align: center; margin-top: 5px;">
                        Barangay Secretary
                    </div>
                </td>


                <!-- Right Column: Thumbmarks -->
                <td style="padding-top: 25px; vertical-align: top; width: 48%; padding-left: 4%;">
                    <div style="display: flex; gap: 20px; justify-content: flex-start; align-items: flex-start;">
                        <!-- Left Thumb Box -->
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100px; height: 100px; border: 1.3px solid #000;"></div>
                            <div class="label-under">(Left Thumb)</div>
                        </div>
                        <!-- Right Thumb Box -->
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 100px; height: 100px; border: 1.3px solid #000;"></div>
                            <div class="label-under">(Right Thumb)</div>
                        </div>
                    </div>
                </td>
            </tr>

        </table>


    </div>
</body>

</html>
