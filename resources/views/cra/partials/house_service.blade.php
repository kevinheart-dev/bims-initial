@if ($houseService && count($houseService) > 0)
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
        <thead style="background-color: #f3f3f3; display: table-row-group;">
            <tr>
                <th style="border: 1px solid #000; padding: 4px; width: 300px; text-align: left;">
                    Service
                </th>
                <th style="border: 1px solid #000; padding: 4px; width: 180px; text-align: center;">
                    Number of Households
                </th>
            </tr>
        </thead>
        <tbody style="display: table-row-group;">
            @php
                $grouped = collect($houseService)->groupBy('category');
                $counter = 1;
            @endphp

            @foreach ($grouped as $category => $services)
                {{-- Category header --}}
                <tr style="font-weight: bold; background-color: #f9f9f9;">
                    <td colspan="2" style="border: 1px solid #000; padding: 4px;">
                        {{ $counter++ }}. {{ $category }}
                    </td>
                </tr>

                {{-- Service rows --}}
                @foreach ($services as $index => $service)
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px;">
                            {{ chr(65 + $index) }}. {{ $service['service_name'] ?? $service->service_name }}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                            {{ $service['households_quantity'] ?? $service->households_quantity }}
                        </td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
@else
    <p style="font-style: italic; color: gray;">No household services data available.</p>
@endif
