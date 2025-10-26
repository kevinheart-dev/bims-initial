@if (isset($evacuationCenter) && $evacuationCenter->isNotEmpty())
    <table style="width:100%; border-collapse:collapse; font-size:12px;" border="1">
        <tbody>
            {{-- Header as normal rows to prevent <thead> repeat --}}
            <tr style="background-color:#f3f3f3;">
                <th rowspan="2" style="border:1px solid #000; padding:4px;">
                    Name of Evacuation Center / Isolation Facility
                </th>
                <th colspan="2" style="border:1px solid #000; padding:4px;">Capacity</th>
                <th colspan="2" style="border:1px solid #000; padding:4px;">Owner</th>
                <th colspan="2" style="border:1px solid #000; padding:4px;">Inspected by an Engineer</th>
                <th colspan="2" style="border:1px solid #000; padding:4px;">Presence of Memorandum of Understanding
                </th>
            </tr>
            <tr style="background-color:#f3f3f3;">
                <th style="border:1px solid #000; padding:4px;">Families</th>
                <th style="border:1px solid #000; padding:4px;">Individuals</th>
                <th style="border:1px solid #000; padding:4px;">Gov’t</th>
                <th style="border:1px solid #000; padding:4px;">Private</th>
                <th style="border:1px solid #000; padding:4px;">Yes</th>
                <th style="border:1px solid #000; padding:4px;">No</th>
                <th style="border:1px solid #000; padding:4px;">Yes</th>
                <th style="border:1px solid #000; padding:4px;">No</th>
            </tr>

            {{-- Data rows --}}
            @foreach ($evacuationCenter as $center)
                <tr>
                    <td style="border:1px solid #000; padding:4px;">{{ $center->name }}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">{{ $center->capacity_families }}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        {{ $center->capacity_individuals }}</td>

                    {{-- Owner type --}}
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        <input type="checkbox" disabled {{ $center->owner_type === 'government' ? 'checked' : '' }}>
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        <input type="checkbox" disabled {{ $center->owner_type === 'private' ? 'checked' : '' }}>
                    </td>

                    {{-- Inspected by engineer --}}
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        <input type="checkbox" disabled {{ $center->inspected_by_engineer ? 'checked' : '' }}>
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        <input type="checkbox" disabled {{ !$center->inspected_by_engineer ? 'checked' : '' }}>
                    </td>

                    {{-- Has MOU --}}
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        <input type="checkbox" disabled {{ $center->has_mou ? 'checked' : '' }}>
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">
                        <input type="checkbox" disabled {{ !$center->has_mou ? 'checked' : '' }}>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">
        No evacuation center data available.
    </p>
@endif
