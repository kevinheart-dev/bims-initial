<?php

namespace App\Exports;

use App\Models\Family;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class FamilyMembersExport implements FromArray, WithHeadings, ShouldAutoSize, WithEvents
{
    protected $barangay;
    protected $totalRecords;
    protected $rows = [];

    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);
    }

    public function array(): array
    {
        $families = Family::with(['members', 'household.purok'])
            ->join('households', 'families.household_id', '=', 'households.id')
            ->join('puroks', 'households.purok_id', '=', 'puroks.id')
            ->where('families.barangay_id', auth()->user()->barangay_id)
            ->orderBy('puroks.purok_number', 'asc')
            ->select('families.*')
            ->get();

        $this->totalRecords = $families->count();

        foreach ($families as $family) {
            // Family row
            $this->rows[] = [
                $family->family_name,
                '', '', '',
                ($family->household?->purok?->purok_number ?? 'N/A'),
            ];

            // Member rows
            foreach ($family->members as $member) {
                $this->rows[] = [
                    '', // empty family name for member rows
                    $member->fullname,
                    $member->gender,
                    $member->birthdate,
                    '', // Purok only on family row
                ];
            }
        }

        return $this->rows;
    }

    public function headings(): array
    {
        return [
            'Family Name',
            'Full Name',
            'Gender',
            'Birthdate',
            'Purok',
        ];
    }

public function registerEvents(): array
{
    return [
        AfterSheet::class => function (AfterSheet $event) {
            $sheet = $event->sheet->getDelegate();
            $lastColumn = $sheet->getHighestColumn();

            // Insert rows for logos + titles (6 rows)
            $sheet->insertNewRowBefore(1, 6);

            // === Logos ===
            $barangayLogo = $this->barangay->logo_path
                ? storage_path('app/public/' . $this->barangay->logo_path)
                : public_path('images/csa-logo.png');
            $cityLogo = public_path('images/city-of-ilagan.png');

            $logoLeft = new Drawing();
            $logoLeft->setPath($barangayLogo);
            $logoLeft->setHeight(80);
            $logoLeft->setCoordinates('A1');
            $logoLeft->setOffsetX(10);
            $logoLeft->setOffsetY(5);
            $logoLeft->setWorksheet($sheet);

            $logoRight = new Drawing();
            $logoRight->setPath($cityLogo);
            $logoRight->setHeight(80);
            $logoRight->setCoordinates($lastColumn . '1');
            $logoRight->setOffsetX(-20);
            $logoRight->setOffsetY(5);
            $logoRight->setWorksheet($sheet);

            // === Titles ===
            $sheet->setCellValue('A1', 'FAMILIES LIST WITH MEMBERS ' . now()->year);
            $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
            $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);
            $sheet->setCellValue('A4', "Total Families: {$this->totalRecords}");

            // Merge across sheet width
            $sheet->mergeCells("A1:{$lastColumn}1");
            $sheet->mergeCells("A2:{$lastColumn}2");
            $sheet->mergeCells("A3:{$lastColumn}3");
            $sheet->mergeCells("A4:{$lastColumn}4");

            // Row heights for spacing
            $sheet->getRowDimension(1)->setRowHeight(40);
            $sheet->getRowDimension(2)->setRowHeight(20);
            $sheet->getRowDimension(3)->setRowHeight(20);
            $sheet->getRowDimension(4)->setRowHeight(20);

            // Style main title
            $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
            $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

            // Style subheaders
            $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
            $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center');

            // Style total families row
            $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
            $sheet->getStyle('A4')->getAlignment()->setHorizontal('left');

            // === Header row ===
            $headerRow = 7;
            $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
            ]);

            // === Merge Family Name + Purok cells ===
            $rowCount = $sheet->getHighestRow();
            $currentFamily = null;
            $startRow = null;

            for ($row = $headerRow + 1; $row <= $rowCount; $row++) {
                $familyValue = $sheet->getCell("A{$row}")->getValue();

        if (!empty($familyValue)) {
            // If a new family starts, merge the previous one (if any)
            if ($currentFamily !== null && $startRow !== null && $row - 1 > $startRow) {
                // Merge Family column
                $sheet->mergeCells("A{$startRow}:A" . ($row - 1));
                $sheet->getStyle("A{$startRow}")->getAlignment()
                    ->setVertical('center')
                    ->setHorizontal('center');
                $sheet->getStyle("A{$startRow}")->getFont()->setBold(true);

                // Merge Purok column
                $sheet->mergeCells("{$lastColumn}{$startRow}:{$lastColumn}" . ($row - 1));
                $sheet->getStyle("{$lastColumn}{$startRow}")->getAlignment()
                    ->setVertical('center')
                    ->setHorizontal('center');
                $sheet->getStyle("{$lastColumn}{$startRow}")->getFont()->setBold(true);
            }

            // Track new family
            $currentFamily = $familyValue;
            $startRow = $row;
        }
            }

            // Merge last family group at the end
            if ($currentFamily !== null && $startRow !== null && $rowCount > $startRow) {
                $sheet->mergeCells("A{$startRow}:A{$rowCount}");
                $sheet->getStyle("A{$startRow}")->getAlignment()->setVertical('center');
                $sheet->getStyle("A{$startRow}")->getFont()->setBold(true);

                $sheet->mergeCells("{$lastColumn}{$startRow}:{$lastColumn}{$rowCount}");
                $sheet->getStyle("{$lastColumn}{$startRow}")->getAlignment()->setVertical('center');
                $sheet->getStyle("{$lastColumn}{$startRow}")->getFont()->setBold(true);
            }

            // Apply borders
            $lastRow = $sheet->getHighestRow();
            $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                ->getBorders()
                ->getAllBorders()
                ->setBorderStyle(Border::BORDER_THIN);

            // Freeze pane
            $sheet->freezePane("A" . ($headerRow + 1));
        }
    ];
}


}
