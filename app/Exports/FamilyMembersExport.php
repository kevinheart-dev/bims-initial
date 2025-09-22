<?php

namespace App\Exports;

use App\Models\Family;
use App\Models\Barangay;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

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
        $families = Family::with('members')
            ->where('barangay_id', auth()->user()->barangay_id)
            ->get();

        $this->totalRecords = $families->count();

        foreach ($families as $family) {
            // Add family row (will be merged later)
            $this->rows[] = [
                'Family: ' . $family->family_name,
                '', '', '', ''
            ];

            // Add each member
            foreach ($family->members as $member) {
                $this->rows[] = [
                    '', // leave family column empty
                    $member->id,
                    $member->fullname,
                    $member->gender,
                    $member->birthdate,
                ];
            }
        }

        return $this->rows;
    }

    public function headings(): array
    {
        return [
            'Family Name',
            'Member ID',
            'Full Name',
            'Gender',
            'Birthdate',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();

                // Insert 4 rows (titles + total row)
                $sheet->insertNewRowBefore(1, 4);

                // Titles
                $sheet->setCellValue('A1', 'FAMILIES LIST WITH MEMBERS ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);

                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                $sheet->setCellValue('A4', "Total Families: {$this->totalRecords}");

                // Header row
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => 'thin']],
                ]);

                // Merge family name cells
                $rowCount = $sheet->getHighestRow();
                for ($row = $headerRow + 1; $row <= $rowCount; $row++) {
                    $value = $sheet->getCell("A{$row}")->getValue();
                    if ($value && str_starts_with($value, 'Family:')) {
                        $startRow = $row;
                        $endRow = $row;

                        // Find how many members belong to this family
                        while ($endRow + 1 <= $rowCount && $sheet->getCell("A" . ($endRow + 1))->getValue() === '') {
                            $endRow++;
                        }

                        // Merge only if family has members
                        if ($endRow > $startRow) {
                            $sheet->mergeCells("A{$startRow}:A{$endRow}");
                            $sheet->getStyle("A{$startRow}")->getAlignment()->setVertical('center');
                            $sheet->getStyle("A{$startRow}")->getFont()->setBold(true);
                        }

                        $row = $endRow; // skip processed rows
                    }
                }

                // Apply borders to all rows
                $lastRow = $sheet->getHighestRow();
                $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Freeze pane
                $sheet->freezePane("A" . ($headerRow + 1));
            }
        ];
    }
}
