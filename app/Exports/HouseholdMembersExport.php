<?php

namespace App\Exports;

use App\Models\Household;
use App\Models\Barangay;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class HouseholdMembersExport implements FromArray, WithHeadings, ShouldAutoSize, WithEvents
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
        $brgy_id = auth()->user()->barangay_id;

        $query = Household::with(['householdResidents.resident', 'purok'])
            ->where('barangay_id', $brgy_id)
            ->orderBy('purok_id', 'asc');

        // Head name search
        if ($name = request('name')) {
            $name = trim($name);
            $parts = collect(explode(' ', $name))->filter(fn($p) => $p !== '')->values();

            $query->whereHas('householdResidents', function ($q) use ($parts, $name) {
                $q->where('relationship_to_head', 'self')
                ->whereHas('resident', function ($r) use ($parts, $name) {
                    $r->where(function ($w) use ($parts, $name) {
                        foreach ($parts as $part) {
                            $w->orWhere('firstname', 'like', "%{$part}%")
                                ->orWhere('lastname', 'like', "%{$part}%")
                                ->orWhere('middlename', 'like', "%{$part}%")
                                ->orWhere('suffix', 'like', "%{$part}%");
                        }
                        $w->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$name}%"])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$name}%"])
                            ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$name}%"]);
                    });
                });
            });
        }

        // Purok filter
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('purok', function ($q) {
                $q->where('purok_number', request('purok'));
            });
        }

        // Street filter
        if (request()->filled('street') && request('street') !== 'All') {
            $query->whereHas('street', function ($q) {
                $q->where('street_name', request('street'));
            });
        }

        // Ownership type filter
        if (request()->filled('own_type') && request('own_type') !== 'All') {
            $query->where('ownership_type', request('own_type'));
        }

        // Housing condition filter
        if (request()->filled('condition') && request('condition') !== 'All') {
            $query->where('housing_condition', request('condition'));
        }

        // Structure filter
        if (request()->filled('structure') && request('structure') !== 'All') {
            $query->where('house_structure', request('structure'));
        }

        $households = $query->get();
        $this->totalRecords = $households->count();

        foreach ($households as $household) {
            // Determine household head
            $head = $household->householdResidents
                        ->firstWhere('relationship_to_head', 'self')?->resident?->fullname ?? 'N/A';

            // Household row
            $this->rows[] = [
                "Household #{$household->house_number}",
                $head,
                '', // Full Name empty for main row
                '',
                '',
                ($household->purok?->purok_number ?? 'N/A'),
            ];

            // Member rows
            foreach ($household->householdResidents as $member) {
                $this->rows[] = [
                    '',
                    '',
                    $member->resident?->fullname ?? 'N/A',
                    $member->resident?->gender ?? 'N/A',
                    $member->resident?->birthdate ?? 'N/A',
                    '',
                ];
            }
        }

        return $this->rows;
    }

    public function headings(): array
    {
        return [
            'Household',
            'Household Head',
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
                $logoLeft->setName('Barangay Logo');
                $logoLeft->setDescription('Barangay Logo');
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1');
                $logoLeft->setOffsetX(10);
                $logoLeft->setOffsetY(5);
                $logoLeft->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setName('City Logo');
                $logoRight->setDescription('City Logo');
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($lastColumn . '1');
                $logoRight->setOffsetX(-20);
                $logoRight->setOffsetY(5);
                $logoRight->setWorksheet($sheet);

                // === Titles ===
                $sheet->setCellValue('A1', 'HOUSEHOLD LIST WITH MEMBERS ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);
                $sheet->setCellValue('A6', "Total Households: {$this->totalRecords}");

                // Merge across sheet width
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");
                $sheet->mergeCells("A6:{$lastColumn}6");

                // Row heights for spacing
                $sheet->getRowDimension(1)->setRowHeight(40);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);
                $sheet->getRowDimension(4)->setRowHeight(20);

                // Style main title
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center')->setVertical('center');

                // Style subheaders
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center')->setVertical('center');

                // Style total households row
                $sheet->getStyle('A6')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A6')->getAlignment()->setHorizontal('left')->setVertical('center');

                // === Header row ===
                $headerRow = 7;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);

                // === Merge Household + Household Head + Purok cells ===
                $rowCount = $sheet->getHighestRow();
                $currentHousehold = null;
                $startRow = null;

                for ($row = $headerRow + 1; $row <= $rowCount; $row++) {
                    $householdValue = $sheet->getCell("A{$row}")->getValue();

                    if (!empty($householdValue)) {
                        if ($currentHousehold !== null && $startRow !== null && $row - 1 > $startRow) {
                            // Merge Household column
                            $sheet->mergeCells("A{$startRow}:A" . ($row - 1));
                            $sheet->getStyle("A{$startRow}")->getAlignment()->setVertical('center')->setHorizontal('center');
                            $sheet->getStyle("A{$startRow}")->getFont()->setBold(true);

                            // Merge Household Head column
                            $sheet->mergeCells("B{$startRow}:B" . ($row - 1));
                            $sheet->getStyle("B{$startRow}")->getAlignment()->setVertical('center')->setHorizontal('center');
                            $sheet->getStyle("B{$startRow}")->getFont()->setBold(true);

                            // Merge Purok column
                            $sheet->mergeCells("{$lastColumn}{$startRow}:{$lastColumn}" . ($row - 1));
                            $sheet->getStyle("{$lastColumn}{$startRow}")->getAlignment()->setVertical('center')->setHorizontal('center');
                            $sheet->getStyle("{$lastColumn}{$startRow}")->getFont()->setBold(true);
                        }

                        $currentHousehold = $householdValue;
                        $startRow = $row;
                    }
                }

                // Merge last household group
                if ($currentHousehold !== null && $startRow !== null && $rowCount > $startRow) {
                    $sheet->mergeCells("A{$startRow}:A{$rowCount}");
                    $sheet->getStyle("A{$startRow}")->getAlignment()->setVertical('center');
                    $sheet->getStyle("A{$startRow}")->getFont()->setBold(true);

                    $sheet->mergeCells("B{$startRow}:B{$rowCount}");
                    $sheet->getStyle("B{$startRow}")->getAlignment()->setVertical('center');
                    $sheet->getStyle("B{$startRow}")->getFont()->setBold(true);

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
