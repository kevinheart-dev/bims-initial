<?php

namespace App\Exports;

use App\Models\BarangayOfficial;
use App\Models\Family;
use App\Models\Barangay;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Illuminate\Support\Facades\Storage;

class FamilyExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{

    protected $barangay;
    protected $totalRecords;
    private const INCOME_CATEGORY_TEXT = [
        'below_5000' => 'Survival',
        '5001_10000' => 'Poor',
        '10001_20000' => 'Low Income',
        '20001_40000' => 'Lower Middle Income',
        '40001_70000' => 'Middle Income',
        '70001_120000' => 'Upper Middle Income',
        'above_120001' => 'High Income',
    ];

    private const INCOME_BRACKET_TEXT = [
        'below_5000' => 'Below ₱5,000',
        '5001_10000' => '₱5,001 - ₱10,000',
        '10001_20000' => '₱10,001 - ₱20,000',
        '20001_40000' => '₱20,001 - ₱40,000',
        '40001_70000' => '₱40,001 - ₱70,000',
        '70001_120000' => '₱70,001 - ₱120,000',
        'above_120001' => '₱120,001 and above',
    ];
    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);

    }

    public function collection()
    {
        $families = Family::with(['latestHead', 'members', 'household.purok'])
            ->join('households', 'families.household_id', '=', 'households.id')
            ->join('puroks', 'households.purok_id', '=', 'puroks.id')
            ->where('families.barangay_id', auth()->user()->barangay_id) // 👈 disambiguated
            ->orderBy('puroks.purok_number', 'asc')
            ->select('families.*')
            ->get();

        $this->totalRecords = $families->count();

        $FAMILY_TYPE_TEXT = [
            'nuclear'              => 'Nuclear',
            'single_parent'        => 'Single-parent',
            'extended'             => 'Extended',
            'stepfamilies'         => 'Stepfamilies',
            'grandparent'          => 'Grandparent',
            'childless'            => 'Childless',
            'cohabiting_partners'  => 'Cohabiting Partners',
            'one_person_household' => 'One-person Household',
            'roommates'            => 'Roommates',
            'other'                => 'Other',
        ];

        return $families->map(function ($family) use ($FAMILY_TYPE_TEXT) {
            return [
                'ID'              => $family->id,
                'Family Name'     => $family->family_name ?? 'N/A',
                'Family Type'     => $FAMILY_TYPE_TEXT[$family->family_type] ?? 'N/A',
                'Income Bracket'  => self::INCOME_BRACKET_TEXT[$family->income_bracket] ?? 'N/A',
                'Income Category' => self::INCOME_CATEGORY_TEXT[$family->income_bracket] ?? 'N/A',
                'Head'            => $family->latestHead?->fullname ?? 'N/A',
                'Members Count'   => $family->members?->count() ?? 0,
                'Purok'           => $family->household?->purok?->purok_number ?? 'N/A',
            ];
        });
    }


    public function headings(): array
    {
        return [
            'ID',
            'Family Name',
            'Family Type',
            'Income Bracket',
            'Income Category',
            'Family Head',
            'Members Count',
            'Purok',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();

                // Insert 4 rows (titles + total)
                $sheet->insertNewRowBefore(1, 4);

                // === Get barangay logos dynamically ===
                $barangayLogo = $this->barangay->logo_path
                    ? storage_path('app/public/' . $this->barangay->logo_path)
                    : public_path('images/csa-logo.png');
                $cityLogo = public_path('images/city-of-ilagan.png'); // keep city logo static or you can also store dynamically

                $barangayId = auth()->user()->barangay_id;
                // Get officials for this barangay
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', function ($q) use ($barangayId) {
                        $q->where('barangay_id', $barangayId);
                    })
                    ->get();

                $captain = $officials->firstWhere('position', 'barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position', 'barangay_secretary')?->resident?->fullname ?? 'N/A';

                // === Insert Logos ===
                $logoLeft = new Drawing();
                $logoLeft->setName('Barangay Logo');
                $logoLeft->setDescription('Barangay Logo');
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1');
                $logoLeft->setOffsetX(15);
                $logoLeft->setOffsetY(15);
                $logoLeft->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setName('City Logo');
                $logoRight->setDescription('City Logo');
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($lastColumn . '1');
                $logoRight->setOffsetX(-25);
                $logoRight->setOffsetY(15);
                $logoRight->setWorksheet($sheet);

                // === Titles ===
                $sheet->setCellValue('A1', 'FAMILIES LIST FOR ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                // === Set small row heights for logos and titles ===
                $sheet->getRowDimension(1)->setRowHeight(60); // for logos
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);

                $sheet->setCellValue('A4', "Total Families: {$this->totalRecords}");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left');

                // Style titles
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center');

                // === Adjust column widths for legal paper printing ===
                $columnWidths = [
                    'A' => 5,   // ID
                    'B' => 25,  // Family Name
                    'C' => 20,  // Family Type
                    'D' => 18,  // Income Bracket
                    'E' => 18,  // Income Category
                    'F' => 25,  // Head
                    'G' => 12,  // Members Count
                    'H' => 10,  // Purok
                ];
                foreach ($columnWidths as $col => $width) {
                    $sheet->getColumnDimension($col)->setWidth($width);
                }

                // === Wrap text for some columns ===
                $sheet->getStyle('B2:B' . $sheet->getHighestRow())->getAlignment()->setWrapText(true);
                $sheet->getStyle('F2:F' . $sheet->getHighestRow())->getAlignment()->setWrapText(true);

                // Header row styling
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);

                // Set smaller row heights for data
                for ($r = $headerRow; $r <= $sheet->getHighestRow(); $r++) {
                    $sheet->getRowDimension($r)->setRowHeight(20);
                }

                // Borders for data rows
                $lastRow = $sheet->getHighestRow();
                if ($lastRow > $headerRow) {
                    $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                        ->getBorders()
                        ->getAllBorders()
                        ->setBorderStyle(Border::BORDER_THIN);
                }

                // === Income Colors and Head color ===
                $categoryColors = [
                    'survival'            => 'EF4444',
                    'poor'                => 'F97316',
                    'low income'          => 'F59E0B',
                    'lower middle income' => '10B981',
                    'middle income'       => '3B82F6',
                    'upper middle income' => '6366F1',
                    'high income'         => '8B5CF6',
                ];
                $bracketColors = [
                    'below_5000'      => 'EF4444',
                    '5001_10000'      => 'F97316',
                    '10001_20000'     => 'F59E0B',
                    '20001_40000'     => '10B981',
                    '40001_70000'     => '22C55E',
                    '70001_120000'    => '3B82F6',
                    'above_120001'    => '8B5CF6',
                ];

                for ($row = $headerRow + 1; $row <= $lastRow; $row++) {
                    // === Income Category (E) ===
                    $incomeCategory = strtolower(trim((string)$sheet->getCell("E{$row}")->getValue()));
                    if ($incomeCategory === '' || $incomeCategory === 'n/a') {
                        $sheet->setCellValue("E{$row}", 'N/A');
                        $sheet->getStyle("E{$row}")->getFont()->setItalic(true)->getColor()->setARGB('FF9CA3AF');
                    } elseif (isset($categoryColors[$incomeCategory])) {
                        $sheet->getStyle("E{$row}")->getFont()->getColor()->setARGB('FF' . $categoryColors[$incomeCategory]);
                    }

                    // === Income Bracket (D) ===
                    $incomeBracketCell = strtolower(trim((string)$sheet->getCell("D{$row}")->getValue()));
                    if ($incomeBracketCell === '' || $incomeBracketCell === 'n/a') {
                        $sheet->setCellValue("D{$row}", 'N/A');
                        $sheet->getStyle("D{$row}")->getFont()->setItalic(true)->getColor()->setARGB('FF9CA3AF');
                    } else {
                        $bracketKey = array_search($incomeBracketCell, array_map('strtolower', self::INCOME_BRACKET_TEXT));
                        if ($bracketKey !== false && isset($bracketColors[$bracketKey])) {
                            $sheet->getStyle("D{$row}")->getFont()->getColor()->setARGB('FF' . $bracketColors[$bracketKey]);
                        }
                    }

                    // Head gray
                    $sheet->getStyle("F{$row}")->getFont()->getColor()->setARGB('FF374151');
                }

                // === Signatories ===
                $signatureStartRow = $sheet->getHighestRow() + 3;
                $halfColumn = floor((Coordinate::columnIndexFromString($lastColumn) + 1) / 2);

                // Captain - left
                $sheet->mergeCells("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . $signatureStartRow);
                $sheet->setCellValue("A{$signatureStartRow}", "______________________________");
                $sheet->mergeCells("A" . ($signatureStartRow + 1) . ":" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1));
                $sheet->setCellValue("A" . ($signatureStartRow + 1), "Hon. ".$captain);
                $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Secretary - right
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}{$signatureStartRow}");
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}", "______________________________");
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1) . ":{$lastColumn}" . ($signatureStartRow + 1));
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1), "Hon. ".$secretary);
                $sheet->getStyle(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}" . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Freeze pane below header
                $sheet->freezePane("A" . ($headerRow + 1));
            }
        ];
    }
}
