<table style="width: 100%; border-collapse: collapse; font-size: 12px; page-break-inside: auto;">
    <thead style="background-color: #f3f3f3; display: table-row-group;">
        <tr>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Hazard/Risk</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Probability</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Effect</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Management</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Basis</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Average = (P + E + M) / 3</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: center;">Ranking</th>
        </tr>
    </thead>
    <tbody>
        @php
            $sortedHazards = $hazardRisk->sortByDesc('average_score')->values();
            $rank = 1;
            $prevScore = null;
            $sameRankCount = 0;
        @endphp

        @foreach ($sortedHazards as $index => $risk)
            @php
                $average = round(
                    (($risk->probability_no ?? 0) + ($risk->effect_no ?? 0) + ($risk->management_no ?? 0)) / 3,
                    2,
                );

                // Ranking logic with ties
                if ($prevScore !== null && $average == $prevScore) {
                    $riskRank = $rank;
                    $sameRankCount++;
                } else {
                    $rank += $sameRankCount;
                    $riskRank = $rank;
                    $sameRankCount = 1;
                }
                $prevScore = $average;
            @endphp
            <tr style="page-break-inside: avoid;">
                <td style="border: 1px solid #000; padding: 4px;">{{ $risk->hazard->hazard_name ?? 'N/A' }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $risk->probability_no ?? '0' }}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $risk->effect_no ?? '0' }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $risk->management_no ?? '0' }}
                </td>
                <td style="border: 1px solid #000; padding: 4px;">{{ $risk->basis ?? '-' }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $average }}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">{{ $riskRank }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
