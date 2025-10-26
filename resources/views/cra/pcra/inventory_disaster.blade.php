@if (isset($disasterInventory) && $disasterInventory->isNotEmpty())
    @php
        // Group inventory items by hazard
        $hazardGroups = $disasterInventory->groupBy('hazard_id');
    @endphp

    @foreach ($hazardGroups as $hazardId => $items)
        @php
            $hazardName = strtoupper(optional($items->first()->hazard)->hazard_name ?? 'UNKNOWN HAZARD');
            // Group items by category within this hazard
            $categoryGroups = $items->groupBy('category');
        @endphp

        {{-- Hazard Header --}}
        <h3 style="text-align:left; font-weight:bold; text-decoration:underline; margin:0 0 5px 0;">
            {{ $hazardName }}
        </h3>

        <table style="width:100%; border-collapse:collapse; font-size:12px; margin-bottom:10px;" border="1">
            <tbody>
                {{-- Table Header as rows to avoid repeating on PDF page break --}}
                <tr style="background-color:#f3f3f3;">
                    <th style="border:1px solid #000; padding:4px; text-align:left;">Item</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Total No. within Barangay</th>
                    <th style="border:1px solid #000; padding:4px; text-align:center;">Percentage or No. at Risk</th>
                    <th style="border:1px solid #000; padding:4px; text-align:left;">Location</th>
                </tr>

                @foreach ($categoryGroups as $category => $catItems)
                    {{-- Category Row --}}
                    <tr>
                        <th colspan="4"
                            style="text-align:center; text-transform:uppercase; font-weight:bold; border:1px solid #000; padding:4px;">
                            {{ $category }}
                        </th>
                    </tr>

                    {{-- Items under this category --}}
                    @foreach ($catItems as $item)
                        <tr>
                            <td style="border:1px solid #000; padding:4px;">{{ $item->item_name }}</td>
                            <td style="border:1px solid #000; padding:4px; text-align:center;">
                                {{ $item->total_in_barangay }}</td>
                            <td style="border:1px solid #000; padding:4px; text-align:center;">
                                {{ $item->percentage_at_risk }}</td>
                            <td style="border:1px solid #000; padding:4px;">{{ $item->location }}</td>
                        </tr>
                    @endforeach
                @endforeach
            </tbody>
        </table>
    @endforeach
@else
    <p style="text-align:center; font-size:12px; margin-top:10px;">
        No disaster inventory data available.
    </p>
@endif
