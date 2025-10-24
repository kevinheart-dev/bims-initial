@php
    $institutionInventory = $institutionInventory ?? ($instutionInventory ?? collect());
@endphp

@if ($institutionInventory->isNotEmpty())
    <table
        style="width: 100%; border-collapse: collapse; font-size: 9px; margin-top: 10px; table-layout: fixed; word-wrap: break-word;">
        <thead>
            <tr style="background-color: #f3f3f3;">
                <th style="border: 1px solid #000; padding: 4px; width: 16%;">NAME OF INSTITUTION / SECTOR / GROUP</th>
                <th style="border: 1px solid #000; padding: 4px; text-align: center;" colspan="3">NUMBER OF MEMBERS
                </th>
                <th style="border: 1px solid #000; padding: 4px; width: 12%;">NAME OF HEAD</th>
                <th style="border: 1px solid #000; padding: 4px; width: 10%;">CONTACT NO.</th>
                <th style="border: 1px solid #000; padding: 4px; width: 10%;">STATUS</th>
                <th style="border: 1px solid #000; padding: 4px; width: 18%;">PROGRAMS / SERVICES</th>
            </tr>
            <tr style="background-color: #f9f9f9;">
                <th style="border: 1px solid #000; padding: 3px;"></th>
                <th style="border: 1px solid #000; padding: 3px; width: 5%; text-align: center;">M</th>
                <th style="border: 1px solid #000; padding: 3px; width: 5%; text-align: center;">F</th>
                <th style="border: 1px solid #000; padding: 3px; width: 5%; text-align: center;">LGBTQ</th>
                <th colspan="4" style="border: 1px solid #000; padding: 3px;"></th>
            </tr>
        </thead>
        <tbody>
            @foreach ($institutionInventory as $institution)
                <tr>
                    <td style="border: 1px solid #000; padding: 3px;">{{ $institution->name }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $institution->male_members }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $institution->female_members }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $institution->lgbtq_members }}</td>
                    <td style="border: 1px solid #000; padding: 3px;">{{ $institution->head_name }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $institution->contact_no }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $institution->registered }}</td>
                    <td style="border: 1px solid #000; padding: 3px;">{{ $institution->programs_services }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray; font-size: 9px;">No institution or sector data available.</p>
@endif
