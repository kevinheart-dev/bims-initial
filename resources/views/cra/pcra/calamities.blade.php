<table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: center;">

    {{-- Main Header --}}
    <tr>
        <th style="border: 1px solid #000; padding: 5px;">Calamity/Disaster</th>
        @foreach ($disasterOccurance as $disaster)
            <th style="border: 1px solid #000; padding: 5px;">{{ $disaster->disaster_name }}</th>
            <th style="border: 1px solid #000; padding: 5px;">Source of Information</th>
        @endforeach
    </tr>

    {{-- Year Row --}}
    <tr>
        <th style="border: 1px solid #000; padding: 5px;">Year</th>
        @foreach ($disasterOccurance as $disaster)
            <td style="border: 1px solid #000; padding: 5px;">{{ $disaster->year }}</td>
            <td style="border: 1px solid #000; padding: 5px;">Barangay</td>
        @endforeach
    </tr>

    {{-- Population Impact Header --}}
    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #f3f3f3; font-weight: bold; text-align: center;">
            POPULATION IMPACT
        </th>
    </tr>
    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #fff; font-weight: bold; text-align: left;">
            Affected Population
        </th>
    </tr>


    {{-- ============================= POPULATION IMPACT ============================= --}}
    <tbody>
        @php
            $populationCategories = $populationImpact->groupBy('category');
        @endphp

        @foreach ($populationCategories as $category => $records)
            <tr>
                <td style="border: 1px solid #000; text-align: left; padding: 5px;">{{ $category }}</td>

                @foreach ($disasterOccurance as $disaster)
                    @php
                        $data = $records->firstWhere('disaster_id', $disaster->id);
                    @endphp
                    <td style="border: 1px solid #000; padding: 5px;">{{ $data->value ?? '-' }}</td>
                    <td style="border: 1px solid #000; padding: 5px;">{{ $data->source ?? '-' }}</td>
                @endforeach
            </tr>
        @endforeach
    </tbody>

    {{-- ============================= EFFECT IMPACT ============================= --}}

    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #f3f3f3; font-weight: bold; text-align: center;">
            EFFECTS/IMPACT OF DISASTER
        </th>
    </tr>


    <tbody>
        @php
            $effectCategories = $effectImpact->groupBy('effect_type');
        @endphp

        @foreach ($effectCategories as $effectType => $records)
            <tr>
                <td style="border: 1px solid #000; text-align: left; padding: 5px;">{{ $effectType }}</td>

                @foreach ($disasterOccurance as $disaster)
                    @php
                        $data = $records->firstWhere('disaster_id', $disaster->id);
                    @endphp
                    <td style="border: 1px solid #000; padding: 5px;">{{ $data->value ?? '-' }}</td>
                    <td style="border: 1px solid #000; padding: 5px;">{{ $data->source ?? '-' }}</td>
                @endforeach
            </tr>
        @endforeach
    </tbody>

    {{-- ============================= DAMAGE TO PROPERTY ============================= --}}

    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #f3f3f3; font-weight: bold; text-align: center;">
            DAMAGE TO PROPERTY
        </th>
    </tr>


    <tbody>
        @php
            // Filter for "property" type and group first by category
            $propertyGrouped = $disasterDamage->where('damage_type', 'property')->groupBy('category');
        @endphp

        @foreach ($propertyGrouped as $category => $items)
            {{-- Category Row --}}
            <tr>
                <td colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
                    style="border: 1px solid #000; background-color: #fff; font-weight: bold; text-align: left; padding: 5px;">
                    {{ strtoupper($category) }}
                </td>
            </tr>

            @php
                // Inside each category, group by description
                $descriptions = $items->groupBy('description');
            @endphp

            {{-- Description rows --}}
            @foreach ($descriptions as $description => $records)
                <tr>
                    <td style="border: 1px solid #000; text-align: left; padding: 5px;">
                        {{ $description }}
                    </td>

                    @foreach ($disasterOccurance as $disaster)
                        @php $data = $records->firstWhere('disaster_id', $disaster->id); @endphp
                        <td style="border: 1px solid #000; padding: 5px;">
                            {{ $data->value ?? '-' }}
                        </td>
                        <td style="border: 1px solid #000; padding: 5px;">
                            {{ $data->source ?? '-' }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
        @endforeach
    </tbody>

    {{-- ============================= AGRICULTURE ============================= --}}

    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #f3f3f3; font-weight: bold; text-align: center;">
            AGRICULTURE
        </th>
    </tr>

    <tbody>
        @php
            $agriCategories = $agriDamage->groupBy('description');
        @endphp

        @foreach ($agriCategories as $agriType => $records)
            <tr>
                <td style="border: 1px solid #000; text-align: left; padding: 5px;">{{ $agriType }}</td>

                @foreach ($disasterOccurance as $disaster)
                    @php
                        $data = $records->firstWhere('disaster_id', $disaster->id);
                    @endphp
                    <td style="border: 1px solid #000; padding: 5px;">{{ $data->value ?? '-' }}</td>
                    <td style="border: 1px solid #000; padding: 5px;">{{ $data->source ?? '-' }}</td>
                @endforeach
            </tr>
        @endforeach
    </tbody>



    {{-- ============================= DAMAGE TO STRUCTURES ============================= --}}

    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #f3f3f3; font-weight: bold; text-align: center;">
            DAMAGE TO STRUCTURES
        </th>
    </tr>


    <tbody>
        @php
            // Filter for "structure" type and group first by category
            $structureGrouped = $disasterDamage->where('damage_type', 'structure')->groupBy('category');
        @endphp

        @foreach ($structureGrouped as $category => $items)
            {{-- Category Row --}}
            <tr>
                <td colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
                    style="border: 1px solid #000; background-color: #fff; font-weight: bold; text-align: left; padding: 5px;">
                    {{ strtoupper($category) }}
                </td>
            </tr>

            @php
                // Inside each category, group by description
                $descriptions = $items->groupBy('description');
            @endphp

            {{-- Description rows --}}
            @foreach ($descriptions as $description => $records)
                <tr>
                    <td style="border: 1px solid #000; text-align: left; padding: 5px;">
                        {{ $description }}
                    </td>

                    @foreach ($disasterOccurance as $disaster)
                        @php $data = $records->firstWhere('disaster_id', $disaster->id); @endphp
                        <td style="border: 1px solid #000; padding: 5px;">
                            {{ $data->value ?? '-' }}
                        </td>
                        <td style="border: 1px solid #000; padding: 5px;">
                            {{ $data->source ?? '-' }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
        @endforeach
    </tbody>

    {{-- ============================= LIFELINES ============================= --}}

    <tr>
        <th colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
            style="border: 1px solid #000; background-color: #f3f3f3; font-weight: bold; text-align: center;">
            LIFELINES
        </th>
    </tr>


    <tbody>
        @php
            // Group lifelines data by category
            $lifelineGrouped = $lifelines->groupBy('category');
        @endphp

        @foreach ($lifelineGrouped as $category => $items)
            {{-- Category Header Row --}}
            <tr>
                <td colspan="{{ 1 + $disasterOccurance->count() * 2 }}"
                    style="border: 1px solid #000; background-color: #fff; font-weight: bold; text-align: left; padding: 5px;">
                    {{ strtoupper($category) }}
                </td>
            </tr>

            @php
                // Inside each category, group by description
                $descriptions = $items->groupBy('description');
            @endphp

            {{-- Description Rows --}}
            @foreach ($descriptions as $description => $records)
                <tr>
                    <td style="border: 1px solid #000; text-align: left; padding: 5px;">
                        {{ $description }}
                    </td>

                    @foreach ($disasterOccurance as $disaster)
                        @php $data = $records->firstWhere('disaster_id', $disaster->id); @endphp
                        <td style="border: 1px solid #000; padding: 5px;">
                            {{ $data->value ?? '-' }}
                        </td>
                        <td style="border: 1px solid #000; padding: 5px;">
                            {{ $data->source ?? '-' }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
        @endforeach
    </tbody>

</table>
