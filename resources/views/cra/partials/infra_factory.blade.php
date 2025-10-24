@if ($infraFacility && count($infraFacility) > 0)
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
        <thead style="background-color: #f3f3f3; display: table-row-group;">
            <tr>
                <th style="border: 1px solid #000; padding: 4px; width: 300px; text-align: left;">
                    TYPE OF INFRASTRUCTURE
                </th>
                <th style="border: 1px solid #000; padding: 4px; width: 180px; text-align: center;">
                    QUANTITY
                </th>
            </tr>
        </thead>
        <tbody style="display: table-row-group;">
            @php
                $grouped = collect($infraFacility)->groupBy('category');
                $counter = 1;
            @endphp

            @foreach ($grouped as $category => $items)
                {{-- Category header --}}
                <tr style="font-weight: bold; background-color: #f9f9f9;">
                    <td colspan="2" style="border: 1px solid #000; padding: 4px;">
                        {{ $counter++ }}. {{ $category }}
                    </td>
                </tr>

                {{-- Infrastructure rows --}}
                @foreach ($items as $index => $item)
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px;">
                            {{ chr(65 + $index) }}. {{ $item['infrastructure_name'] ?? $item->infrastructure_name }}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                            {{ $item['quantity'] ?? $item->quantity }}
                        </td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray;">No infrastructure or facility data available.</p>
@endif
